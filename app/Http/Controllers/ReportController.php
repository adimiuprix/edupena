<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\Rombel;
use App\Models\Setting;
use App\Models\Student;
use App\Models\StudentScore;
use App\Models\LearningAchievementThreshold;
use App\Models\Kkm;
use App\Services\ScoreCalculator;
use App\Services\LearningAchievementCriterionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $rombels = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel', 'tahun_ajaran']);
        $defaultSemester = $this->normalizeSemester(Setting::where('key', 'semester_aktif')->value('value')) ?? 'ganjil';
        
        $rombelId = $request->integer('rombel_id') ?: ($rombels->first()?->id);
        $semester = $this->normalizeSemester($request->get('semester')) ?: $defaultSemester;

        $payload = [
            'rombels' => $rombels,
            'semesters' => [
                ['value' => 'ganjil', 'label' => 'Ganjil'],
                ['value' => 'genap', 'label' => 'Genap'],
            ],
            'filters' => [
                'rombel_id' => $rombelId,
                'semester' => $semester,
            ],
            'students' => [],
        ];

        if (!$rombelId || !$semester) {
            return Inertia::render('Reports/Index', $payload);
        }

        $students = Student::where('rombel_id', $rombelId)->orderBy('nama_lengkap')->get(['id', 'nama_lengkap', 'nisn']);
        $payload['students'] = $students;

        return Inertia::render('Reports/Index', $payload);
    }

    public function show(Request $request, Student $student): Response
    {
        $rombel = $student->rombel()->with('waliKelas.teacher')->first();
        if (!$rombel) {
            abort(404, 'Student does not belong to any rombel.');
        }
        
        $semester = $this->normalizeSemester($request->get('semester')) ?: $this->normalizeSemester(Setting::where('key', 'semester_aktif')->value('value'));
        
        // Pisahkan mapel akademik (bukan Ekstrakurikuler) dan mapel ekskul
        $mapelsAkademik = Mapel::whereHas('category', fn($q) => $q->where('kategori', '!=', 'Ekstrakurikuler'))
            ->orderBy('mata_pelajaran')->get();

        $mapelsEkskul = Mapel::whereHas('category', fn($q) => $q->where('kategori', 'Ekstrakurikuler'))
            ->orderBy('mata_pelajaran')->get();

        $scores = StudentScore::where('student_id', $student->id)
            ->with('target')
            ->whereHas('target', function ($q) use ($semester, $rombel) {
                $q->where('semester', $semester)->where('kelas', (string)$rombel->tingkat);
            })
            ->get();

        $thresholds = LearningAchievementThreshold::where('rombel_id', $rombel->id)
            ->where('semester', $semester)
            ->get()
            ->keyBy('mapel_id');

        // Ambil data KKM untuk kenaikan kelas
        $kkmList = Kkm::where('rombel_id', $rombel->id)
            ->where('semester', $semester)
            ->get()
            ->keyBy('mapel_id');

        $reportData = [];
        $kkmData = [];

        // ── Mapel Akademik (Pendidikan Umum + Muatan Lokal) ──────────────────
        foreach ($mapelsAkademik as $mapel) {
            $mapelScores = $scores->where('mapel_id', $mapel->id);
            if ($mapelScores->isEmpty()) {
                continue;
            }

            // Hitung nilai akhir mapel
            $tpValues = $mapelScores->pluck('nilai_rapor_tp')->toArray();
            $nilaiAkhir = ScoreCalculator::nilaiRaporMapel($tpValues);

            // Generate Deskripsi
            $threshold = $thresholds->get($mapel->id);
            $min = $threshold ? (float)$threshold->min : 60;
            $max = $threshold ? (float)$threshold->max : 70;

            $deskripsiSangatBaik = [];
            $deskripsiBaik = [];
            $deskripsiPerluBimbingan = [];

            foreach ($mapelScores as $score) {
                $nilaiTp = (float)$score->nilai_rapor_tp;
                $deskripsiTp = strtolower($score->target->deskripsi_target_pencapaian);

                if ($nilaiTp < $min) {
                    $deskripsiPerluBimbingan[] = $deskripsiTp;
                } elseif ($nilaiTp <= $max) {
                    $deskripsiBaik[] = $deskripsiTp;
                } else {
                    $deskripsiSangatBaik[] = $deskripsiTp;
                }
            }

            $capaian = [];
            if (count($deskripsiSangatBaik) > 0) {
                $capaian[] = "Sangat baik dalam " . implode(", ", $deskripsiSangatBaik);
            }
            if (count($deskripsiBaik) > 0) {
                $capaian[] = "Baik dalam " . implode(", ", $deskripsiBaik);
            }
            if (count($deskripsiPerluBimbingan) > 0) {
                $capaian[] = "Perlu bimbingan dalam " . implode(", ", $deskripsiPerluBimbingan);
            }

            $kkm = $kkmList->get($mapel->id);
            $nilaiKkm = $kkm?->nilai_kkm ?? 75;

            $reportData[] = [
                'mapel'              => $mapel->mata_pelajaran,
                'nilai_akhir'        => $nilaiAkhir,
                'nilai_kkm'          => $nilaiKkm,
                'tipe'               => 'akademik',
                'capaian_kompetensi' => count($capaian) > 0
                    ? implode(". ", $capaian) . "."
                    : '-',
            ];

            $kkmData[] = [
                'mapel_id' => $mapel->id,
                'nilai_kkm' => $nilaiKkm,
            ];
        }

        // ── Mapel Ekstrakurikuler — nilai dari predikat absensi ekskul ────────
        // Ambil semua record ekskul siswa untuk semester ini
        $ekskulRecords = $student->extracurricularAttendances()
            ->with('category')
            ->where('semester', $semester)
            ->get();

        // Map: extracurricular_category.mapel_id → record (relasi eksplisit, bukan nama string)
        $predikatMap = ['Sangat Baik' => 'A', 'Baik' => 'B', 'Cukup' => 'C', 'Kurang' => 'D'];

        foreach ($mapelsEkskul as $mapel) {
            // Cocokkan via mapel_id — aman, tidak bergantung kesamaan nama
            $record = $ekskulRecords->first(function ($rec) use ($mapel) {
                return $rec->category && (int) $rec->category->mapel_id === (int) $mapel->id;
            });

            if (!$record) {
                continue; // tidak ada data ekskul untuk mapel ini, skip
            }

            $predikat = $record->predikat ?? null;
            $nilaiHuruf = $predikat ? ($predikatMap[$predikat] ?? $predikat) : '-';

            $reportData[] = [
                'mapel'              => $mapel->mata_pelajaran,
                'nilai_akhir'        => $nilaiHuruf,
                'nilai_kkm'          => null,
                'tipe'               => 'ekskul',
                'capaian_kompetensi' => $predikat ?? '-',
            ];
        }

        $kehadiran = $student->extracurricularAttendances()
            ->with('category')
            ->where('semester', $semester)
            ->first();
            
        $absen = $student->attendances()->where('semester', $semester)->first();

        // Data Sekolah
        $settings = Setting::pluck('value', 'key')->toArray();

        // Wali kelas NIP — ambil dari relasi teacher
        $waliKelasNip = $rombel->waliKelas?->teacher?->nip ?? null;

        return Inertia::render('Reports/Show', [
            'student' => [
                'id'             => $student->id,
                'nama_lengkap'   => $student->nama_lengkap,
                'nama_panggilan' => $student->nama_panggilan,
                'nisn'           => $student->nisn,
                'nipd'           => $student->nipd,
                'agama'          => $student->agama,
                'jenis_kelamin'  => $student->jenis_kelamin,
                'tempat_lahir'   => $student->tempat_lahir,
                'tanggal_lahir'  => $student->tanggal_lahir,
                'nama_wali'      => $student->nama_wali_murid ?? $student->nama_wali ?? null,
            ],
            'rombel'      => $rombel,
            'semester'    => $semester,
            'reportData'  => $reportData,
            'kehadiran'   => $kehadiran,
            'absensi'     => [
                'sakit' => $absen?->sakit ?? 0,
                'ijin'  => $absen?->ijin ?? 0,
                'alpa'  => $absen?->alpa ?? 0,
            ],
            'settings'    => $settings,
            'waliKelasNip' => $waliKelasNip,
            'kkmData'     => $kkmData,
        ]);
    }

    private function normalizeSemester(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        $lower = strtolower(trim($value));

        return match (true) {
            str_contains($lower, 'genap') => 'genap',
            str_contains($lower, 'ganjil') => 'ganjil',
            default => in_array($lower, ['ganjil', 'genap'], true) ? $lower : null,
        };
    }
}
