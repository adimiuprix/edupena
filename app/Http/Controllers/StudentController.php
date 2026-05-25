<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Student;
use App\Models\Rombel;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class StudentController extends Controller
{
    public function index(): Response
    {
        $students = Student::with('rombel')->latest()->get();
        return Inertia::render('Students/Index', [
            'students' => $students
        ]);
    }

    public function create(): Response
    {
        $rombels = Rombel::all();
        return Inertia::render('Students/Create', [
            'rombels' => $rombels
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());
        Student::create($validated);
        return redirect()->route('students.index')->with('message', 'Siswa berhasil ditambahkan');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(Student $student): Response
    {
        $rombels = Rombel::all();
        return Inertia::render('Students/Edit', [
            'student' => $student,
            'rombels' => $rombels
        ]);
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate($this->rules($student->id));
        $student->update($validated);
        return redirect()->route('students.index')->with('message', 'Siswa berhasil diperbarui');
    }

    private function rules($studentId = null): array
    {
        return [
            'nama_lengkap' => 'required|string|max:255',
            'nama_panggilan' => 'nullable|string|max:255',
            'nipd' => 'nullable|string|max:255',
            'nisn' => 'required|string|unique:students,nisn' . ($studentId ? ',' . $studentId : ''),
            'rombel_id' => 'nullable|exists:rombels,id',
            'agama' => 'nullable|in:Islam,Kristen,Katolik,Hindu,Buddha,Khonghucu',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'rt' => 'nullable|integer',
            'rw' => 'nullable|integer',
            'desa_kelurahan' => 'nullable|string|max:255',
            'kecamatan' => 'nullable|string|max:255',
            'kabupaten' => 'nullable|string|max:255',
            'provinsi' => 'nullable|string|max:255',
            'kode_pos' => 'nullable|string|max:255',
            'no_telepon' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'nama_ayah' => 'nullable|string|max:255',
            'pekerjaan_ayah' => 'nullable|string|max:255',
            'no_telepon_ayah' => 'nullable|string|max:255',
            'alamat_ayah' => 'nullable|string',
            'nama_ibu' => 'nullable|string|max:255',
            'pekerjaan_ibu' => 'nullable|string|max:255',
            'no_telepon_ibu' => 'nullable|string|max:255',
            'alamat_ibu' => 'nullable|string',
            'nama_wali' => 'nullable|string|max:255',
            'pekerjaan_wali' => 'nullable|string|max:255',
            'no_telepon_wali' => 'nullable|string|max:255',
            'alamat_wali' => 'nullable|string',
            'nama_wali_murid' => 'nullable|string|max:255',
            'pekerjaan_wali_murid' => 'nullable|string|max:255',
            'no_telepon_wali_murid' => 'nullable|string|max:255',
            'alamat_wali_murid' => 'nullable|string',
        ];
    }

    public function destroy(Student $student): RedirectResponse
    {
        $student->delete();
        return redirect()->route('students.index')->with('message', 'Siswa berhasil dihapus');
    }
}
