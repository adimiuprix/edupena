<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Rombel;
use App\Models\Setting;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $rombels = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel']);
        
        $defaultSemester = Setting::where('key', 'semester_aktif')->value('value') ?? 'ganjil';
        $semester = $request->get('semester') ?: $defaultSemester;
        $rombelId = $request->integer('rombel_id') ?: null;

        $students = $rombelId
            ? Student::where('rombel_id', $rombelId)->orderBy('nama_lengkap')->get(['id', 'nama_lengkap', 'nisn'])
            : collect();

        $records = [];
        if ($rombelId && $semester) {
            $existing = Attendance::where('semester', $semester)
                ->whereIn('student_id', $students->pluck('id'))
                ->get();
                
            foreach ($existing as $rec) {
                $records[$rec->student_id] = [
                    'sakit' => $rec->sakit,
                    'ijin' => $rec->ijin,
                    'alpa' => $rec->alpa,
                ];
            }
        }

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
            'students' => $students,
            'records' => $records,
            'canEdit' => $students->isNotEmpty(),
        ];

        return Inertia::render('Attendances/Index', $payload);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rombel_id' => 'required|exists:rombels,id',
            'semester' => 'required|in:ganjil,genap',
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
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

                $hasData = ($row['sakit'] ?? 0) > 0 || ($row['ijin'] ?? 0) > 0 || ($row['alpa'] ?? 0) > 0;

                if (!$hasData) {
                    Attendance::where('student_id', $row['student_id'])
                        ->where('semester', $semester)
                        ->delete();
                    continue;
                }

                Attendance::updateOrCreate(
                    [
                        'student_id' => $row['student_id'],
                        'semester' => $semester,
                    ],
                    [
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
            ->with('message', 'Data absensi berhasil disimpan.');
    }
}
