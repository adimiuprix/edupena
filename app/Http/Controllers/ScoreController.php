<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\Rombel;
use App\Models\Setting;
use App\Models\Student;
use App\Models\StudentScore;
use App\Models\Target;
use App\Services\ScoreCalculator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ScoreController extends Controller
{
    public function index(Request $request): Response
    {
        $rombels = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel', 'tahun_ajaran']);
        $mapels = Mapel::whereHas('category', fn($q) => $q->where('kategori', '!=', 'Ekstrakurikuler'))
            ->orderBy('mata_pelajaran')->get(['id', 'mata_pelajaran']);

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
            'targets' => [],
            'students' => [],
            'scores' => [],
            'mapelRapor' => [],
            'canEdit' => false,
        ];

        if (! $rombelId || ! $mapelId || ! $semester) {
            return Inertia::render('Scores/Index', $payload);
        }

        $rombel = Rombel::find($rombelId);
        if (! $rombel) {
            return Inertia::render('Scores/Index', $payload);
        }

        $kelas = (string) $rombel->tingkat;

        $targets = Target::where('mapel_id', $mapelId)
            ->where('kelas', $kelas)
            ->where('semester', $semester)
            ->orderBy('nomor_tp')
            ->get();

        $students = Student::where('rombel_id', $rombelId)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nisn']);

        $targetIds = $targets->pluck('id');
        $studentIds = $students->pluck('id');

        $existingScores = StudentScore::where('mapel_id', $mapelId)
            ->whereIn('target_id', $targetIds)
            ->whereIn('student_id', $studentIds)
            ->get();

        $scores = [];
        $mapelRapor = [];

        foreach ($students as $student) {
            $tpValues = [];

            foreach ($targets as $target) {
                $score = $existingScores->first(
                    fn ($s) => $s->student_id === $student->id && $s->target_id === $target->id
                );

                $key = "{$student->id}_{$target->id}";
                $scores[$key] = [
                    'id' => $score?->id,
                    'sumatif_harian' => $score?->sumatif_harian,
                    'sumatif_akhir' => $score?->sumatif_akhir,
                    'nilai_rapor_tp' => $score?->nilai_rapor_tp,
                ];

                if ($score?->nilai_rapor_tp !== null) {
                    $tpValues[] = (float) $score->nilai_rapor_tp;
                }
            }

            $mapelRapor[$student->id] = ScoreCalculator::nilaiRaporMapel($tpValues);
        }

        $payload['targets'] = $targets;
        $payload['students'] = $students;
        $payload['scores'] = $scores;
        $payload['mapelRapor'] = $mapelRapor;
        $payload['canEdit'] = $targets->isNotEmpty() && $students->isNotEmpty();
        $payload['kelas'] = $kelas;
        $payload['mapel'] = $mapels->firstWhere('id', $mapelId);

        return Inertia::render('Scores/Index', $payload);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rombel_id' => 'required|exists:rombels,id',
            'mapel_id' => 'required|exists:mapels,id',
            'semester' => 'required|in:ganjil,genap',
            'scores' => 'required|array',
            'scores.*.student_id' => 'required|exists:students,id',
            'scores.*.target_id' => 'required|exists:targets,id',
            'scores.*.sumatif_harian' => 'nullable|integer|min:0|max:100',
            'scores.*.sumatif_akhir' => 'nullable|integer|min:0|max:100',
        ]);

        $rombel = Rombel::findOrFail($validated['rombel_id']);
        $kelas = (string) $rombel->tingkat;
        $mapelId = (int) $validated['mapel_id'];
        $semester = $validated['semester'];

        $validTargetIds = Target::where('mapel_id', $mapelId)
            ->where('kelas', $kelas)
            ->where('semester', $semester)
            ->pluck('id')
            ->all();

        $validStudentIds = Student::where('rombel_id', $rombel->id)->pluck('id')->all();

        DB::transaction(function () use ($validated, $mapelId, $validTargetIds, $validStudentIds) {
            foreach ($validated['scores'] as $row) {
                if (! in_array((int) $row['target_id'], $validTargetIds, true)) {
                    continue;
                }

                if (! in_array((int) $row['student_id'], $validStudentIds, true)) {
                    continue;
                }

                $harian = $row['sumatif_harian'] ?? null;
                $akhir = $row['sumatif_akhir'] ?? null;

                if ($harian === null && $akhir === null) {
                    StudentScore::where('student_id', $row['student_id'])
                        ->where('target_id', $row['target_id'])
                        ->delete();

                    continue;
                }

                StudentScore::updateOrCreate(
                    [
                        'student_id' => $row['student_id'],
                        'target_id' => $row['target_id'],
                    ],
                    [
                        'mapel_id' => $mapelId,
                        'sumatif_harian' => $harian,
                        'sumatif_akhir' => $akhir,
                    ]
                );
            }
        });

        return redirect()
            ->route('scores.index', [
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
