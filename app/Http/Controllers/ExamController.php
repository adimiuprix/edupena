<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\Rombel;
use App\Models\Setting;
use App\Models\Student;
use App\Models\ExamScore;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ExamController extends Controller
{
    public function index(Request $request): Response
    {
        $rombels = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel', 'tahun_ajaran']);
        $mapels = Mapel::orderBy('mata_pelajaran')->get(['id', 'mata_pelajaran']);

        $user = $request->user()?->load('role');
        if ($user && $user->role?->slug === 'guru' && $user->mapel_id) {
            $mapels = $mapels->where('id', $user->mapel_id)->values();
        }

        $defaultSemester = $this->normalizeSemester(Setting::where('key', 'semester_aktif')->value('value'));

        $rombelId = $request->integer('rombel_id') ?: null;
        $mapelId = $request->integer('mapel_id') ?: ($mapels->first()?->id);
        $semester = $this->normalizeSemester($request->get('semester')) ?: $defaultSemester;

        $payload = [
            'rombels' => $rombels,
            'mapels' => $mapels,
            'semesters' => [
                ['value' => 'ganjil', 'label' => 'Ganjil'],
                ['value' => 'genap', 'label' => 'Genap'],
            ],
            'filters' => [
                'rombel_id' => $rombelId,
                'mapel_id' => $mapelId,
                'semester' => $semester,
            ],
            'students' => [],
            'scores' => [],
            'canEdit' => false,
            'kelas' => null,
            'mapel' => null,
        ];

        if (! $rombelId || ! $mapelId || ! $semester) {
            return Inertia::render('Exams/index', $payload);
        }

        $rombel = Rombel::find($rombelId);
        if (! $rombel) {
            return Inertia::render('Exams/index', $payload);
        }

        $kelas = (string) $rombel->tingkat;

        $students = Student::where('rombel_id', $rombelId)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nisn']);

        $studentIds = $students->pluck('id');

        $existingScores = ExamScore::where('mapel_id', $mapelId)
            ->where('semester', $semester)
            ->whereIn('student_id', $studentIds)
            ->get();

        $scores = [];

        foreach ($students as $student) {
            for ($bulan = 1; $bulan <= 6; $bulan++) {
                $score = $existingScores->first(
                    fn ($s) => $s->student_id === $student->id && $s->bulan === $bulan
                );

                $key = "{$student->id}_{$bulan}";
                $scores[$key] = [
                    'id' => $score?->id,
                    'minggu_1' => $score?->minggu_1,
                    'minggu_2' => $score?->minggu_2,
                    'minggu_3' => $score?->minggu_3,
                    'minggu_4' => $score?->minggu_4,
                ];
            }
        }

        $payload['students'] = $students;
        $payload['scores'] = $scores;
        $payload['canEdit'] = $students->isNotEmpty();
        $payload['kelas'] = $kelas;
        $payload['mapel'] = $mapels->firstWhere('id', $mapelId);

        return Inertia::render('Exams/index', $payload);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rombel_id' => 'required|exists:rombels,id',
            'mapel_id' => 'required|exists:mapels,id',
            'semester' => 'required|in:ganjil,genap',
            'scores' => 'required|array',
            'scores.*.student_id' => 'required|exists:students,id',
            'scores.*.bulan' => 'required|integer|min:1|max:6',
            'scores.*.minggu_1' => 'nullable|integer|min:0|max:100',
            'scores.*.minggu_2' => 'nullable|integer|min:0|max:100',
            'scores.*.minggu_3' => 'nullable|integer|min:0|max:100',
            'scores.*.minggu_4' => 'nullable|integer|min:0|max:100',
        ]);

        $rombel = Rombel::findOrFail($validated['rombel_id']);
        $mapelId = (int) $validated['mapel_id'];
        $semester = $validated['semester'];

        $validStudentIds = Student::where('rombel_id', $rombel->id)->pluck('id')->all();

        DB::transaction(function () use ($validated, $mapelId, $semester, $validStudentIds) {
            foreach ($validated['scores'] as $row) {
                if (! in_array((int) $row['student_id'], $validStudentIds, true)) {
                    continue;
                }

                $bulan = (int) $row['bulan'];
                
                $m1 = $row['minggu_1'] ?? null;
                $m2 = $row['minggu_2'] ?? null;
                $m3 = $row['minggu_3'] ?? null;
                $m4 = $row['minggu_4'] ?? null;

                if ($m1 === null && $m2 === null && $m3 === null && $m4 === null) {
                    ExamScore::where('student_id', $row['student_id'])
                        ->where('mapel_id', $mapelId)
                        ->where('semester', $semester)
                        ->where('bulan', $bulan)
                        ->delete();
                    continue;
                }

                ExamScore::updateOrCreate(
                    [
                        'student_id' => $row['student_id'],
                        'mapel_id' => $mapelId,
                        'semester' => $semester,
                        'bulan' => $bulan,
                    ],
                    [
                        'minggu_1' => $m1,
                        'minggu_2' => $m2,
                        'minggu_3' => $m3,
                        'minggu_4' => $m4,
                    ]
                );
            }
        });

        return redirect()
            ->route('exams.index', [
                'rombel_id' => $validated['rombel_id'],
                'mapel_id' => $mapelId,
                'semester' => $semester,
            ])
            ->with('message', 'Nilai berhasil disimpan.');
    }

    private function normalizeSemester(?string $value): ?string
    {
        if (! $value) {
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
