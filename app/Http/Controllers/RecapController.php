<?php

namespace App\Http\Controllers;

use App\Models\Rombel;
use App\Models\Setting;
use App\Models\Student;
use App\Models\Mapel;
use App\Models\StudentScore;
use App\Services\ScoreCalculator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecapController extends Controller
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
            'mapels' => [],
            'students' => [],
        ];

        if (!$rombelId || !$semester) {
            return Inertia::render('Recaps/Index', $payload);
        }

        $rombel = Rombel::find($rombelId);
        if (!$rombel) {
            return Inertia::render('Recaps/Index', $payload);
        }

        $mapels = Mapel::orderBy('mata_pelajaran')->get(['id', 'mata_pelajaran']);
        $students = Student::with([
            'extracurricularAttendances' => function($query) use ($semester) {
                $query->where('semester', $semester)->with('category');
            },
            'dailyAttendances' => function($query) use ($semester) {
                $query->where('semester', $semester);
            }
        ])->where('rombel_id', $rombelId)->orderBy('nama_lengkap')->get();

        $studentIds = $students->pluck('id');

        $scores = StudentScore::whereIn('student_id', $studentIds)
            ->whereHas('target', function ($query) use ($semester, $rombel) {
                $query->where('semester', $semester)->where('kelas', (string)$rombel->tingkat);
            })
            ->get();

        $studentsData = [];
        foreach ($students as $student) {
            $studentScores = $scores->where('student_id', $student->id);
            $mapelGrades = [];
            $totalNilai = 0;
            $countMapel = 0;

            foreach ($mapels as $mapel) {
                // Get all TP scores for this mapel for this student
                $tpScores = $studentScores->where('mapel_id', $mapel->id)->pluck('nilai_rapor_tp')->toArray();
                $nilaiMapel = ScoreCalculator::nilaiRaporMapel($tpScores);
                $mapelGrades[$mapel->id] = $nilaiMapel;
                if ($nilaiMapel !== null) {
                    $totalNilai += $nilaiMapel;
                    $countMapel++;
                }
            }

            $kehadiran = $student->extracurricularAttendances->first();
            $sakit = $student->dailyAttendances->where('status', 'Sakit')->count();
            $ijin = $student->dailyAttendances->where('status', 'Izin')->count();
            $alpa = $student->dailyAttendances->where('status', 'Alpa')->count();

            $studentsData[] = [
                'id' => $student->id,
                'nama' => $student->nama_lengkap,
                'nisn' => $student->nisn,
                'mapel_grades' => $mapelGrades,
                'total_nilai' => round($totalNilai, 2),
                'rata_rata' => $countMapel > 0 ? round($totalNilai / $countMapel, 2) : 0,
                'sakit' => $sakit,
                'ijin' => $ijin,
                'alpa' => $alpa,
                'ekskul' => $kehadiran?->category?->name ?? '-',
                'predikat_ekskul' => $kehadiran?->predikat ?? '-',
            ];
        }

        // Calculate Ranking
        usort($studentsData, fn($a, $b) => $b['total_nilai'] <=> $a['total_nilai']);
        
        $rank = 1;
        foreach ($studentsData as &$sd) {
            $sd['ranking'] = $sd['total_nilai'] > 0 ? $rank++ : '-';
        }
        
        // Re-sort by name
        usort($studentsData, fn($a, $b) => strcmp($a['nama'], $b['nama']));

        $payload['mapels'] = $mapels;
        $payload['students'] = $studentsData;

        return Inertia::render('Recaps/Index', $payload);
    }
}
