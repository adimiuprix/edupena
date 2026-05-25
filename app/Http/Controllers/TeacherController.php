<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TeacherController extends Controller
{
    public function index(): Response
    {
        $teachers = Teacher::with(['mapel', 'rombel'])->latest()->get();
        return Inertia::render('Teachers/Index', [
            'teachers' => $teachers
        ]);
    }

    public function create(): Response
    {
        $mapels = Mapel::all();
        $rombels = \App\Models\Rombel::all();
        return Inertia::render('Teachers/Create', [
            'mapels' => $mapels,
            'rombels' => $rombels
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nip' => 'nullable|string|max:255',
            'jenis_guru' => 'required|in:Guru Mapel,Wali Kelas',
            'mapel_id' => 'nullable|exists:mapels,id',
            'rombel_id' => 'nullable|exists:rombels,id',
        ]);

        if ($validated['jenis_guru'] === 'Guru Mapel') {
            $validated['rombel_id'] = null;
        } else {
            $validated['mapel_id'] = null;
        }

        Teacher::create($validated);
        return redirect()->route('teachers.index')->with('message', 'Guru berhasil ditambahkan');
    }

    public function edit(Teacher $teacher): Response
    {
        $mapels = Mapel::all();
        $rombels = \App\Models\Rombel::all();
        return Inertia::render('Teachers/Edit', [
            'teacher' => $teacher,
            'mapels' => $mapels,
            'rombels' => $rombels
        ]);
    }

    public function update(Request $request, Teacher $teacher): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nip' => 'nullable|string|max:255',
            'jenis_guru' => 'required|in:Guru Mapel,Wali Kelas',
            'mapel_id' => 'nullable|exists:mapels,id',
            'rombel_id' => 'nullable|exists:rombels,id',
        ]);

        if ($validated['jenis_guru'] === 'Guru Mapel') {
            $validated['rombel_id'] = null;
        } else {
            $validated['mapel_id'] = null;
        }

        $teacher->update($validated);
        return redirect()->route('teachers.index')->with('message', 'Guru berhasil diperbarui');
    }

    public function destroy(Teacher $teacher): RedirectResponse
    {
        $teacher->delete();
        return redirect()->route('teachers.index')->with('message', 'Guru berhasil dihapus');
    }
}
