<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Mapel;
use App\Models\StudentScore;
use App\Models\Setting;
use App\Models\ExtracurricularAttendance;
use App\Models\Target;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalSiswa = Student::query()->count();
        $totalGuru = Teacher::query()->count();
        $totalMapel = Mapel::query()->count();
        $totalSiswaL = Student::where('jenis_kelamin', 'L')->count();
        $totalSiswaP = Student::where('jenis_kelamin', 'P')->count();

        // Statistik Kehadiran (Semester Aktif)
        $semesterAktif = Setting::where('key', 'semester_aktif')->value('value') ?? 'ganjil';
        $attendances = ExtracurricularAttendance::where('semester', $semesterAktif)->get();
        $totalSakit = $attendances->sum('sakit');
        $totalIzin = $attendances->sum('ijin');
        $totalAlpa = $attendances->sum('alpa');
        $totalKetidakhadiran = $totalSakit + $totalIzin + $totalAlpa;

        // Peringatan Data Belum Lengkap (Misal: Siswa tanpa nilai sama sekali)
        $studentsWithScores = StudentScore::select('student_id')->distinct()->pluck('student_id');
        $siswaTanpaNilai = Student::whereNotIn('id', $studentsWithScores)->count();

        // Jumlah Mapel tanpa Tujuan Pembelajaran
        $mapelsWithTargets = Target::where('semester', $semesterAktif)->select('mapel_id')->distinct()->pluck('mapel_id');
        $mapelTanpaTP = Mapel::whereNotIn('id', $mapelsWithTargets)->count();

        // Siswa terbaru (5 terakhir)
        $siswaTerbaru = Student::latest()->take(5)->get(['id', 'nama_lengkap', 'nisn', 'jenis_kelamin', 'created_at']);

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalSiswa' => $totalSiswa,
                'totalGuru' => $totalGuru,
                'totalMapel' => $totalMapel,
                'totalSiswaL' => $totalSiswaL,
                'totalSiswaP' => $totalSiswaP,
                'totalSakit' => $totalSakit,
                'totalIzin' => $totalIzin,
                'totalAlpa' => $totalAlpa,
                'totalKetidakhadiran' => $totalKetidakhadiran,
                'siswaTanpaNilai' => $siswaTanpaNilai,
                'mapelTanpaTP' => $mapelTanpaTP,
            ],
            'siswaTerbaru' => $siswaTerbaru,
        ]);
    }
}
