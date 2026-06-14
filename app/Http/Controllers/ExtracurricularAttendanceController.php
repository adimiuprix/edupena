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
        $rombels    = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel']);
        $categories = ExtracurricularCategory::with('mapel')
            ->orderBy('jenis')->orderBy('nama_ekskul')->get();

        $defaultSemester = $this->normalizeSemester(Setting::where('key', 'semester_aktif')->value('value'));

        $rombelId = $request->integer('rombel_id') ?: null;
        $semester  = $this->normalizeSemester($request->get('semester')) ?: $defaultSemester;

        $payload = [
            'rombels'        => $rombels,
            'categories'     => $categories,
            'predikatOptions'=> self::PREDIKAT_OPTIONS,
            'semesters'      => [
                ['value' => 'ganjil', 'label' => 'Ganjil'],
                ['value' => 'genap',  'label' => 'Genap'],
            ],
            'filters'  => ['rombel_id' => $rombelId, 'semester' => $semester],
            'students' => [],
            'records'  => [],   // { student_id: [ {category_id, predikat}, ... ] }
            'canEdit'  => false,
        ];

        if (! $rombelId || ! $semester) {
            return Inertia::render('Extracurriculars/Index', $payload);
        }

        $students = Student::where('rombel_id', $rombelId)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nisn']);

        $existing = ExtracurricularAttendance::with('category')
            ->where('semester', $semester)
            ->whereIn('student_id', $students->pluck('id'))
            ->get();

        // Kelompokkan per student_id → array ekskul
        $records = [];
        foreach ($students as $student) {
            $rows = $existing->where('student_id', $student->id)->values();
            $records[$student->id] = $rows->map(fn ($r) => [
                'id'                          => $r->id,
                'extracurricular_category_id' => $r->extracurricular_category_id,
                'predikat'                    => $r->predikat,
                'nama_ekskul'                 => $r->category?->nama_ekskul,
            ])->toArray();
        }

        $payload['students'] = $students;
        $payload['records']  = $records;
        $payload['canEdit']  = $students->isNotEmpty();

        return Inertia::render('Extracurriculars/Index', $payload);
    }

    public function create(Request $request): Response
    {
        $rombels    = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel']);
        $categories = ExtracurricularCategory::with('mapel')
            ->orderBy('jenis')->orderBy('nama_ekskul')->get();
        $defaultSemester = $this->normalizeSemester(Setting::where('key', 'semester_aktif')->value('value'));
        $semester  = $this->normalizeSemester($request->get('semester')) ?: $defaultSemester;
        $rombelId  = $request->integer('rombel_id') ?: null;

        $students = $rombelId
            ? Student::where('rombel_id', $rombelId)->orderBy('nama_lengkap')->get(['id', 'nama_lengkap'])
            : collect();

        // records: { student_id: { category_id: predikat, ... } }
        $records = [];
        if ($rombelId && $semester) {
            $existing = ExtracurricularAttendance::where('semester', $semester)
                ->whereIn('student_id', $students->pluck('id'))
                ->get();

            foreach ($students as $student) {
                $studentRows = $existing->where('student_id', $student->id);
                $records[$student->id] = [];
                foreach ($studentRows as $rec) {
                    $records[$student->id][(string)$rec->extracurricular_category_id] = $rec->predikat ?? '';
                }
            }
        }

        return Inertia::render('Extracurriculars/Create', [
            'rombels'        => $rombels,
            'categories'     => $categories,
            'predikatOptions'=> self::PREDIKAT_OPTIONS,
            'semesters'      => [
                ['value' => 'ganjil', 'label' => 'Ganjil'],
                ['value' => 'genap',  'label' => 'Genap'],
            ],
            'filters'  => ['rombel_id' => $rombelId, 'semester' => $semester],
            'students' => $students,
            'records'  => $records,
            'canEdit'  => true,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rombel_id'                           => 'required|exists:rombels,id',
            'semester'                            => 'required|in:ganjil,genap',
            'records'                             => 'required|array',
            // records: array of { student_id, extracurricular_category_id, predikat }
            'records.*.student_id'                => 'required|exists:students,id',
            'records.*.extracurricular_category_id' => 'required|exists:extracurricular_categories,id',
            'records.*.predikat'                  => ['nullable', Rule::in(self::PREDIKAT_OPTIONS)],
        ]);

        $validStudentIds   = Student::where('rombel_id', $validated['rombel_id'])->pluck('id')->all();
        $validCategoryIds  = ExtracurricularCategory::pluck('id')->all();
        $semester          = $validated['semester'];

        DB::transaction(function () use ($validated, $validStudentIds, $validCategoryIds, $semester) {
            // Kumpulkan kombinasi (student_id, category_id) yang dikirim
            $submitted = [];

            foreach ($validated['records'] as $row) {
                $studentId  = (int) $row['student_id'];
                $categoryId = (int) $row['extracurricular_category_id'];

                if (! in_array($studentId, $validStudentIds, true)) continue;
                if (! in_array($categoryId, $validCategoryIds, true)) continue;

                $predikat = $row['predikat'] ?? null;

                ExtracurricularAttendance::updateOrCreate(
                    [
                        'student_id'                  => $studentId,
                        'semester'                    => $semester,
                        'extracurricular_category_id' => $categoryId,
                    ],
                    ['predikat' => $predikat]
                );

                $submitted[] = ['student_id' => $studentId, 'category_id' => $categoryId];
            }

            // Hapus record lama untuk siswa yang dikirim tapi tidak ada di payload (ekskul dihapus)
            $submittedStudentIds = array_unique(array_column($submitted, 'student_id'));
            if (empty($submittedStudentIds)) return;

            $existing = ExtracurricularAttendance::where('semester', $semester)
                ->whereIn('student_id', $submittedStudentIds)
                ->get();

            foreach ($existing as $rec) {
                $isInPayload = collect($submitted)->contains(
                    fn ($s) => $s['student_id'] === $rec->student_id
                        && $s['category_id'] === (int) $rec->extracurricular_category_id
                );
                if (! $isInPayload) {
                    $rec->delete();
                }
            }
        });

        return redirect()
            ->route('extracurriculars.index', [
                'rombel_id' => $validated['rombel_id'],
                'semester'  => $semester,
            ])
            ->with('message', 'Data ekskul berhasil disimpan.');
    }

    private function normalizeSemester(?string $value): ?string
    {
        if (! $value) return null;
        $lower = strtolower(trim($value));
        return match (true) {
            str_contains($lower, 'genap')  => 'genap',
            str_contains($lower, 'ganjil') => 'ganjil',
            default => in_array($lower, ['ganjil', 'genap'], true) ? $lower : null,
        };
    }
}
