<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Mapel;
use App\Models\StudentScore;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalSiswa = Student::count();
        $totalGuru = Teacher::count();
        $totalMapel = Mapel::count();
        $totalSiswaL = Student::where('jenis_kelamin', 'L')->count();
        $totalSiswaP = Student::where('jenis_kelamin', 'P')->count();

        // Siswa terbaru (5 terakhir)
        $siswaTerbaru = Student::latest()->take(5)->get(['id', 'nama_lengkap', 'nisn', 'jenis_kelamin', 'created_at']);

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalSiswa' => $totalSiswa,
                'totalGuru' => $totalGuru,
                'totalMapel' => $totalMapel,
                'totalSiswaL' => $totalSiswaL,
                'totalSiswaP' => $totalSiswaP,
            ],
            'siswaTerbaru' => $siswaTerbaru,
        ]);
    }
}
