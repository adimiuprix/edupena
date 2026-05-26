<?php

namespace App\Http\Controllers;

use App\Models\LearningAchievementCriterion;
use App\Models\LearningAchievementThreshold;
use App\Models\Mapel;
use App\Models\Rombel;
use App\Models\Setting;
use App\Models\Student;
use App\Services\LearningAchievementCriterionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LearningAchievementCriterionController extends Controller
{
    public function index(Request $request): Response
    {
        $rombels = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel']);
        $mapels = Mapel::orderBy('mata_pelajaran')->get(['id', 'mata_pelajaran']);

        $defaultSemester = $this->normalizeSemester(Setting::where('key', 'semester_aktif')->value('value'));

        $rombelId = $request->integer('rombel_id') ?: null;
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
                'semester' => $semester,
            ],
            'students' => [],
            'criteria' => [],
            'threshold' => null,
            'averagesPerMapel' => [],
            'canEdit' => false,
        ];

        if (! $rombelId || ! $semester) {
            return Inertia::render('LearningAchievementCriteria/Index', $payload);
        }

        $students = Student::where('rombel_id', $rombelId)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nisn']);

        $mapelIds = $mapels->pluck('id')->all();

        $existing = LearningAchievementCriterion::where('semester', $semester)
            ->whereIn('student_id', $students->pluck('id'))
            ->whereIn('mapel_id', $mapelIds)
            ->get();

        $criteria = [];
        $nilaiByStudentMapel = [];

        foreach ($students as $student) {
            foreach ($mapels as $mapel) {
                $record = $existing->first(
                    fn ($criterion) => $criterion->student_id === $student->id && $criterion->mapel_id === $mapel->id
                );

                $key = "{$student->id}_{$mapel->id}";
                $nilai = $record?->nilai;

                $criteria[$key] = [
                    'id' => $record?->id,
                    'nilai' => $nilai,
                ];

                $nilaiByStudentMapel[$student->id][$mapel->id] = $nilai;
            }
        }

        $computed = LearningAchievementCriterionService::classThresholds(
            LearningAchievementCriterionService::averagesPerMapel($nilaiByStudentMapel, $mapelIds)
        );

        $stored = LearningAchievementThreshold::where('rombel_id', $rombelId)
            ->where('semester', $semester)
            ->first();

        $payload['students'] = $students;
        $payload['criteria'] = $criteria;
        $payload['averagesPerMapel'] = $computed['averages_per_mapel'];
        $payload['threshold'] = [
            'computed' => [
                'min_nilai' => $computed['min'],
                'max_nilai' => $computed['max'],
                'mid_nilai' => $computed['mid'],
            ],
            'stored' => $stored ? [
                'min_nilai' => (float) $stored->min_nilai,
                'max_nilai' => (float) $stored->max_nilai,
                'mid_nilai' => (float) $stored->mid_nilai,
            ] : null,
            'active' => $stored ? [
                'min_nilai' => (float) $stored->min_nilai,
                'max_nilai' => (float) $stored->max_nilai,
                'mid_nilai' => (float) $stored->mid_nilai,
            ] : [
                'min_nilai' => $computed['min'],
                'max_nilai' => $computed['max'],
                'mid_nilai' => $computed['mid'],
            ],
        ];
        $payload['predikatRules'] = [
            ['range' => "Nilai < Min ({$computed['min']})", 'label' => 'perlu bimbingan dalam …'],
            ['range' => "Min ≤ Nilai ≤ Max", 'label' => 'baik dalam …'],
            ['range' => "Nilai > Max ({$computed['max']})", 'label' => 'sangat baik dalam …'],
        ];
        $payload['canEdit'] = $students->isNotEmpty();

        return Inertia::render('LearningAchievementCriteria/Index', $payload);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rombel_id' => 'required|exists:rombels,id',
            'semester' => 'required|in:ganjil,genap',
            'criteria' => 'required|array',
            'criteria.*.student_id' => 'required|exists:students,id',
            'criteria.*.mapel_id' => 'required|exists:mapels,id',
            'criteria.*.nilai' => 'nullable|integer|min:0|max:100',
            'save_threshold' => 'boolean',
            'min_nilai' => 'nullable|numeric|min:0|max:100',
            'max_nilai' => 'nullable|numeric|min:0|max:100',
        ]);

        $validStudentIds = Student::where('rombel_id', $validated['rombel_id'])->pluck('id')->all();
        $semester = $validated['semester'];

        DB::transaction(function () use ($validated, $validStudentIds, $semester) {
            foreach ($validated['criteria'] as $row) {
                if (! in_array((int) $row['student_id'], $validStudentIds, true)) {
                    continue;
                }

                if ($row['nilai'] === null || $row['nilai'] === '') {
                    LearningAchievementCriterion::where('student_id', $row['student_id'])
                        ->where('mapel_id', $row['mapel_id'])
                        ->where('semester', $semester)
                        ->delete();

                    continue;
                }

                LearningAchievementCriterion::updateOrCreate(
                    [
                        'student_id' => $row['student_id'],
                        'mapel_id' => $row['mapel_id'],
                        'semester' => $semester,
                    ],
                    ['nilai' => (int) $row['nilai']]
                );
            }

            if ($validated['save_threshold'] ?? true) {
                $mapels = Mapel::pluck('id')->all();
                $students = Student::where('rombel_id', $validated['rombel_id'])->pluck('id')->all();
                $records = LearningAchievementCriterion::where('semester', $semester)
                    ->whereIn('student_id', $students)
                    ->whereIn('mapel_id', $mapels)
                    ->get();

                $nilaiByStudentMapel = [];
                foreach ($records as $record) {
                    $nilaiByStudentMapel[$record->student_id][$record->mapel_id] = $record->nilai;
                }

                $computed = LearningAchievementCriterionService::classThresholds(
                    LearningAchievementCriterionService::averagesPerMapel($nilaiByStudentMapel, $mapels)
                );

                $min = $validated['min_nilai'] ?? $computed['min'];
                $max = $validated['max_nilai'] ?? $computed['max'];
                $mid = $computed['mid'] ?? ($min && $max ? round(($min + $max) / 2, 2) : null);

                if ($min !== null && $max === null) {
                    $max = round($min + LearningAchievementCriterionService::MAX_OFFSET, 2);
                }

                if ($min !== null) {
                    LearningAchievementThreshold::updateOrCreate(
                        [
                            'rombel_id' => $validated['rombel_id'],
                            'semester' => $semester,
                        ],
                        [
                            'min_nilai' => $min,
                            'max_nilai' => $max,
                            'mid_nilai' => $mid,
                        ]
                    );
                }
            }
        });

        return redirect()
            ->route('learning-achievement-criteria.index', [
                'rombel_id' => $validated['rombel_id'],
                'semester' => $semester,
            ])
            ->with('message', 'Data KKTP berhasil disimpan.');
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
