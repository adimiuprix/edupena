<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\Role;
use App\Models\Rombel;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    private const TEACHER_ROLE_SLUGS = ['guru', 'walikelas'];

    public function index(): Response
    {
        $teachers = Teacher::with(['user.role', 'user.mapel', 'user.rombel'])
            ->latest()
            ->get();

        return Inertia::render('Teachers/Index', [
            'teachers' => $teachers,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Teachers/Create', [
            'mapels' => Mapel::all(),
            'rombels' => Rombel::all(),
            'roles' => Role::whereIn('slug', self::TEACHER_ROLE_SLUGS)->get(['id', 'name', 'slug']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateTeacherForm($request);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role_id' => $validated['role_id'],
                'mapel_id' => $validated['mapel_id'] ?? null,
                'rombel_id' => $validated['rombel_id'] ?? null,
            ]);

            Teacher::create([
                'user_id' => $user->id,
                'nip' => $validated['nip'] ?? null,
            ]);
        });

        return redirect()->route('teachers.index')->with('message', 'Guru berhasil ditambahkan');
    }

    public function edit(Teacher $teacher): Response
    {
        $teacher->load(['user.role', 'user.mapel', 'user.rombel']);

        return Inertia::render('Teachers/Edit', [
            'teacher' => $teacher,
            'mapels' => Mapel::all(),
            'rombels' => Rombel::all(),
            'roles' => Role::whereIn('slug', self::TEACHER_ROLE_SLUGS)->get(['id', 'name', 'slug']),
        ]);
    }

    public function update(Request $request, Teacher $teacher): RedirectResponse
    {
        $teacher->load('user');
        $validated = $this->validateTeacherForm($request, $teacher->user);

        DB::transaction(function () use ($validated, $teacher) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role_id' => $validated['role_id'],
                'mapel_id' => $validated['mapel_id'] ?? null,
                'rombel_id' => $validated['rombel_id'] ?? null,
            ];

            if (! empty($validated['password'])) {
                $userData['password'] = $validated['password'];
            }

            $teacher->user->update($userData);
            $teacher->update(['nip' => $validated['nip'] ?? null]);
        });

        return redirect()->route('teachers.index')->with('message', 'Guru berhasil diperbarui');
    }

    public function destroy(Teacher $teacher): RedirectResponse
    {
        $teacher->load('user');
        $teacher->user?->delete();

        return redirect()->route('teachers.index')->with('message', 'Guru berhasil dihapus');
    }

    private function validateTeacherForm(Request $request, ?User $user = null): array
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user?->id),
            ],
            'password' => [$user ? 'nullable' : 'required', 'string', 'min:8'],
            'role_id' => 'required|exists:roles,id',
            'nip' => 'nullable|string|max:255',
            'mapel_id' => 'nullable|exists:mapels,id',
            'rombel_id' => 'nullable|exists:rombels,id',
        ]);

        $role = Role::findOrFail($validated['role_id']);

        if (! in_array($role->slug, self::TEACHER_ROLE_SLUGS, true)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'role_id' => 'Role harus Guru Mapel atau Wali Kelas.',
            ]);
        }

        if ($role->slug === 'guru') {
            $validated['rombel_id'] = null;

            if (empty($validated['mapel_id'])) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'mapel_id' => 'Mata pelajaran wajib dipilih untuk Guru Mapel.',
                ]);
            }
        } else {
            $validated['mapel_id'] = null;

            if (empty($validated['rombel_id'])) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'rombel_id' => 'Rombel wajib dipilih untuk Wali Kelas.',
                ]);
            }
        }

        return $validated;
    }
}
