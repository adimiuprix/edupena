<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\Target;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TargetController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Target::with('mapel')->orderBy('mapel_id')->orderBy('kelas')->orderBy('semester')->orderBy('nomor_tp');

        if ($request->filled('mapel_id')) {
            $query->where('mapel_id', $request->mapel_id);
        }

        if ($request->filled('kelas')) {
            $query->where('kelas', $request->kelas);
        }

        if ($request->filled('semester')) {
            $query->where('semester', $request->semester);
        }

        return Inertia::render('Targets/Index', [
            'targets' => $query->get(),
            'mapels' => Mapel::orderBy('mata_pelajaran')->get(['id', 'mata_pelajaran']),
            'filters' => $request->only(['mapel_id', 'kelas', 'semester']),
            'kelasOptions' => ['1', '2', '3', '4', '5', '6'],
            'semesters' => [
                ['value' => 'ganjil', 'label' => 'Ganjil'],
                ['value' => 'genap', 'label' => 'Genap'],
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Targets/Create', [
            'mapels' => Mapel::orderBy('mata_pelajaran')->get(['id', 'mata_pelajaran']),
            'kelasOptions' => ['1', '2', '3', '4', '5', '6'],
            'semesters' => [
                ['value' => 'ganjil', 'label' => 'Ganjil'],
                ['value' => 'genap', 'label' => 'Genap'],
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->rules());

        Target::create($validated);

        return redirect()->route('targets.index', [
            'mapel_id' => $validated['mapel_id'],
            'kelas' => $validated['kelas'],
            'semester' => $validated['semester'],
        ])->with('message', 'Tujuan Pembelajaran berhasil ditambahkan.');
    }

    public function edit(Target $target): Response
    {
        return Inertia::render('Targets/Edit', [
            'target' => $target->load('mapel'),
            'mapels' => Mapel::orderBy('mata_pelajaran')->get(['id', 'mata_pelajaran']),
            'kelasOptions' => ['1', '2', '3', '4', '5', '6'],
            'semesters' => [
                ['value' => 'ganjil', 'label' => 'Ganjil'],
                ['value' => 'genap', 'label' => 'Genap'],
            ],
        ]);
    }

    public function update(Request $request, Target $target): RedirectResponse
    {
        $validated = $request->validate($this->rules($target->id));

        $target->update($validated);

        return redirect()->route('targets.index', [
            'mapel_id' => $validated['mapel_id'],
            'kelas' => $validated['kelas'],
            'semester' => $validated['semester'],
        ])->with('message', 'Tujuan Pembelajaran berhasil diperbarui.');
    }

    public function destroy(Target $target): RedirectResponse
    {
        $mapelId = $target->mapel_id;
        $kelas = $target->kelas;
        $semester = $target->semester;

        $target->delete();

        return redirect()->route('targets.index', [
            'mapel_id' => $mapelId,
            'kelas' => $kelas,
            'semester' => $semester,
        ])
            ->with('message', 'Tujuan Pembelajaran berhasil dihapus.');
    }

    private function rules(?int $targetId = null): array
    {
        return [
            'mapel_id' => 'required|exists:mapels,id',
            'kelas' => 'required|in:1,2,3,4,5,6',
            'semester' => 'required|in:ganjil,genap',
            'nomor_tp' => [
                'required',
                'integer',
                'min:1',
                'max:20',
                Rule::unique('targets')
                    ->where(fn ($q) => $q->where('mapel_id', request('mapel_id'))
                        ->where('kelas', request('kelas'))
                        ->where('semester', request('semester')))
                    ->ignore($targetId),
            ],
            'deskripsi_target_pencapaian' => 'required|string|max:5000',
        ];
    }
}
