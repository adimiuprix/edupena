<?php

namespace App\Http\Controllers;

use App\Models\DailyAttendance;
use App\Models\Rombel;
use App\Models\Student;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

class DailyAttendanceController extends Controller
{
    public function index(Request $request): Response
    {
        $rombels = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel']);
        
        $rombelId = $request->integer('rombel_id') ?: null;
        $tanggal = $request->get('tanggal') ?: Carbon::today()->format('Y-m-d');
        $semester = Setting::where('key', 'semester_aktif')->value('value') ?? 'ganjil';

        $students = $rombelId
            ? Student::where('rombel_id', $rombelId)->orderBy('nama_lengkap')->get(['id', 'nama_lengkap', 'nisn'])
            : collect();

        $records = [];
        if ($rombelId && $tanggal) {
            $existing = DailyAttendance::where('tanggal', $tanggal)
                ->whereIn('student_id', $students->pluck('id'))
                ->get();
                
            foreach ($existing as $rec) {
                $records[$rec->student_id] = [
                    'status' => $rec->status,
                    'keterangan' => $rec->keterangan,
                ];
            }
        }

        $payload = [
            'rombels' => $rombels,
            'filters' => [
                'rombel_id' => $rombelId,
                'tanggal' => $tanggal,
            ],
            'semester' => $semester,
            'students' => $students,
            'records' => $records,
            'canEdit' => $students->isNotEmpty(),
            'statusOptions' => ['Hadir', 'Sakit', 'Izin', 'Alpa'],
        ];

        return Inertia::render('DailyAttendances/Index', $payload);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rombel_id' => 'required|exists:rombels,id',
            'tanggal' => 'required|date',
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.status' => ['required', Rule::in(['Hadir', 'Sakit', 'Izin', 'Alpa'])],
            'records.*.keterangan' => 'nullable|string|max:255',
        ]);

        $validStudentIds = Student::where('rombel_id', $validated['rombel_id'])->pluck('id')->all();
        $tanggal = $validated['tanggal'];
        $semester = Setting::where('key', 'semester_aktif')->value('value') ?? 'ganjil';

        DB::transaction(function () use ($validated, $validStudentIds, $tanggal, $semester) {
            foreach ($validated['records'] as $row) {
                if (! in_array((int) $row['student_id'], $validStudentIds, true)) {
                    continue;
                }

                DailyAttendance::updateOrCreate(
                    [
                        'student_id' => $row['student_id'],
                        'tanggal' => $tanggal,
                    ],
                    [
                        'semester' => $semester,
                        'status' => $row['status'],
                        'keterangan' => $row['keterangan'] ?? null,
                    ]
                );
            }
        });

        return redirect()
            ->route('daily-attendances.index', [
                'rombel_id' => $validated['rombel_id'],
                'tanggal' => $tanggal,
            ])
            ->with('message', 'Data absensi harian berhasil disimpan.');
    }
}
