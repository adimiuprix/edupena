<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\Rombel;
use App\Models\Setting;
use App\Models\Student;
use App\Models\StudentScore;
use App\Models\LearningAchievementThreshold;
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
        $defaultSemester = Setting::where('key', 'semester_aktif')->value('value') ?? 'ganjil';
        
        $rombelId = $request->integer('rombel_id') ?: ($rombels->first()?->id);
        $semester = $request->get('semester') ?: $defaultSemester;

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
        $rombel = $student->rombel()->with('waliKelas')->first();
        if (!$rombel) {
            abort(404, 'Student does not belong to any rombel.');
        }
        
        $semester = $request->get('semester') ?: Setting::where('key', 'semester_aktif')->value('value');
        
        $mapels = Mapel::orderBy('mata_pelajaran')->get();
        
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

        $reportData = [];

        foreach ($mapels as $mapel) {
            $mapelScores = $scores->where('mapel_id', $mapel->id);
            if ($mapelScores->isEmpty()) {
                continue;
            }

            // Hitung nilai akhir mapel
            $tpValues = $mapelScores->pluck('nilai_rapor_tp')->toArray();
            $nilaiAkhir = ScoreCalculator::nilaiRaporMapel($tpValues);

            // Generate Deskripsi
            $threshold = $thresholds->get($mapel->id);
            $min = $threshold ? (float)$threshold->min : 60; // default jika belum diset
            $max = $threshold ? (float)$threshold->max : 70; // default

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

            $reportData[] = [
                'mapel' => $mapel->mata_pelajaran,
                'nilai_akhir' => $nilaiAkhir,
                'capaian_kompetensi' => implode(". ", $capaian) . ".",
            ];
        }

        $kehadiran = $student->extracurricularAttendances()
            ->with('category')
            ->where('semester', $semester)
            ->first();
            
        $absen = $student->attendances()->where('semester', $semester)->first();
        $sakit = $absen?->sakit ?? 0;
        $ijin = $absen?->ijin ?? 0;
        $alpa = $absen?->alpa ?? 0;

        // Data Sekolah
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Reports/Show', [
            'student' => $student,
            'rombel' => $rombel,
            'semester' => $semester,
            'reportData' => $reportData,
            'kehadiran' => $kehadiran,
            'absensi' => [
                'sakit' => $sakit,
                'ijin' => $ijin,
                'alpa' => $alpa,
            ],
            'settings' => $settings,
        ]);
    }
}
