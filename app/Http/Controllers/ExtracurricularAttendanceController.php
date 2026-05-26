<?php

namespace App\Http\Controllers;

use App\Models\ExtracurricularAttendance;
use App\Models\ExtracurricularCategory;
use App\Models\Rombel;
use App\Models\Setting;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ExtracurricularAttendanceController extends Controller
{
    private const PREDIKAT_OPTIONS = ['Sangat Baik', 'Baik', 'Cukup', 'Kurang'];

    public function index(Request $request): Response
    {
        $rombels = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel']);
        $categories = ExtracurricularCategory::orderBy('jenis')->orderBy('nama_ekskul')->get();

        $defaultSemester = $this->normalizeSemester(Setting::where('key', 'semester_aktif')->value('value'));

        $rombelId = $request->integer('rombel_id') ?: null;
        $semester = $this->normalizeSemester($request->get('semester')) ?: $defaultSemester;

        $payload = [
            'rombels' => $rombels,
            'categories' => $categories,
            'predikatOptions' => self::PREDIKAT_OPTIONS,
            'semesters' => [
                ['value' => 'ganjil', 'label' => 'Ganjil'],
                ['value' => 'genap', 'label' => 'Genap'],
            ],
            'filters' => [
                'rombel_id' => $rombelId,
                'semester' => $semester,
            ],
            'students' => [],
            'records' => [],
            'canEdit' => false,
        ];

        if (! $rombelId || ! $semester) {
            return Inertia::render('Attendances/Index', $payload);
        }

        $students = Student::where('rombel_id', $rombelId)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nisn']);

        $existing = ExtracurricularAttendance::with('category')
            ->where('semester', $semester)
            ->whereIn('student_id', $students->pluck('id'))
            ->get();

        $records = [];
        foreach ($students as $student) {
            $row = $existing->firstWhere('student_id', $student->id);
            $records[$student->id] = [
                'id' => $row?->id,
                'extracurricular_category_id' => $row?->extracurricular_category_id ?? '',
                'predikat' => $row?->predikat ?? '',
                'sakit' => $row?->sakit ?? 0,
                'ijin' => $row?->ijin ?? 0,
                'alpa' => $row?->alpa ?? 0,
                'nama_ekskul' => $row?->category?->nama_ekskul,
            ];
        }

        $payload['students'] = $students;
        $payload['records'] = $records;
        $payload['canEdit'] = $students->isNotEmpty();

        return Inertia::render('Attendances/Index', $payload);
    }

    public function create(Request $request): Response
    {
        $rombels = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel']);
        $categories = ExtracurricularCategory::orderBy('jenis')->orderBy('nama_ekskul')->get();
        $defaultSemester = $this->normalizeSemester(Setting::where('key', 'semester_aktif')->value('value'));
        $semester = $this->normalizeSemester($request->get('semester')) ?: $defaultSemester;
        $rombelId = $request->integer('rombel_id') ?: null;
        $payload = [
            'rombels' => $rombels,
            'categories' => $categories,
            'predikatOptions' => self::PREDIKAT_OPTIONS,
            'semesters' => [
                ['value' => 'ganjil', 'label' => 'Ganjil'],
                ['value' => 'genap', 'label' => 'Genap'],
            ],
            'filters' => [
                'rombel_id' => $rombelId,
                'semester' => $semester,
            ],
            'students' => [],
            'records' => [],
            'canEdit' => true,
        ];
        return Inertia::render('Attendances/Create', $payload);
    }


    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rombel_id' => 'required|exists:rombels,id',
            'semester' => 'required|in:ganjil,genap',
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.extracurricular_category_id' => 'nullable|exists:extracurricular_categories,id',
            'records.*.predikat' => ['nullable', Rule::in(self::PREDIKAT_OPTIONS)],
            'records.*.sakit' => 'nullable|integer|min:0',
            'records.*.ijin' => 'nullable|integer|min:0',
            'records.*.alpa' => 'nullable|integer|min:0',
        ]);

        $validStudentIds = Student::where('rombel_id', $validated['rombel_id'])->pluck('id')->all();
        $semester = $validated['semester'];

        DB::transaction(function () use ($validated, $validStudentIds, $semester) {
            foreach ($validated['records'] as $row) {
                if (! in_array((int) $row['student_id'], $validStudentIds, true)) {
                    continue;
                }

                $hasEkskul = ! empty($row['extracurricular_category_id']);
                $hasAbsensi = ($row['sakit'] ?? 0) > 0 || ($row['ijin'] ?? 0) > 0 || ($row['alpa'] ?? 0) > 0;
                $hasPredikat = ! empty($row['predikat']);

                if (! $hasEkskul && ! $hasAbsensi && ! $hasPredikat) {
                    ExtracurricularAttendance::where('student_id', $row['student_id'])
                        ->where('semester', $semester)
                        ->delete();

                    continue;
                }

                ExtracurricularAttendance::updateOrCreate(
                    [
                        'student_id' => $row['student_id'],
                        'semester' => $semester,
                    ],
                    [
                        'extracurricular_category_id' => $row['extracurricular_category_id'] ?? null,
                        'predikat' => $row['predikat'] ?? null,
                        'sakit' => $row['sakit'] ?? 0,
                        'ijin' => $row['ijin'] ?? 0,
                        'alpa' => $row['alpa'] ?? 0,
                    ]
                );
            }
        });

        return redirect()
            ->route('attendances.index', [
                'rombel_id' => $validated['rombel_id'],
                'semester' => $semester,
            ])
            ->with('message', 'Data ekskul dan absensi berhasil disimpan.');
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
