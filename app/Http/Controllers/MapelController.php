<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\CategoryMapel;
use App\Models\ExtracurricularCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class MapelController extends Controller
{
    public function index(): Response
    {
        $mapels = Mapel::with('category')->latest()->get();
        return Inertia::render('Mapels/Index', [
            'mapels' => $mapels
        ]);
    }

    public function create(): Response
    {
        $categories = CategoryMapel::all();
        return Inertia::render('Mapels/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_mapels_id' => 'required|exists:category_mapels,id',
            'mata_pelajaran' => 'required|string|max:255',
            'jenis_ekskul' => 'nullable|in:wajib,pilihan',
        ]);

        $mapel = Mapel::create([
            'category_mapels_id' => $validated['category_mapels_id'],
            'mata_pelajaran' => $validated['mata_pelajaran'],
        ]);

        // Jika category adalah ekstrakurikuler (id = 3), buat juga entry di extracurricular_categories
        if ($validated['category_mapels_id'] == 3) {
            ExtracurricularCategory::create([
                'mapel_id' => $mapel->id,
                'nama_ekskul' => $validated['mata_pelajaran'],
                'jenis' => $validated['jenis_ekskul'] ?? 'pilihan',
            ]);
        }

        return redirect()->route('mapels.index')->with('message', 'Mata Pelajaran berhasil ditambahkan');
    }

    public function edit(Mapel $mapel): Response
    {
        $categories = CategoryMapel::all();
        
        // Load data ekstrakurikuler jika mapel adalah ekstrakurikuler
        $ekskul = null;
        if ($mapel->category_mapels_id == 3) {
            $ekskul = ExtracurricularCategory::where('mapel_id', $mapel->id)->first();
        }
        
        return Inertia::render('Mapels/Edit', [
            'mapel' => $mapel,
            'categories' => $categories,
            'ekskul' => $ekskul,
        ]);
    }

    public function update(Request $request, Mapel $mapel): RedirectResponse
    {
        $validated = $request->validate([
            'category_mapels_id' => 'required|exists:category_mapels,id',
            'mata_pelajaran' => 'required|string|max:255',
            'jenis_ekskul' => 'nullable|in:wajib,pilihan',
        ]);

        $mapel->update([
            'category_mapels_id' => $validated['category_mapels_id'],
            'mata_pelajaran' => $validated['mata_pelajaran'],
        ]);

        // Jika category adalah ekstrakurikuler (id = 3), update di extracurricular_categories
        if ($validated['category_mapels_id'] == 3) {
            ExtracurricularCategory::updateOrCreate(
                ['mapel_id' => $mapel->id],
                [
                    'nama_ekskul' => $validated['mata_pelajaran'],
                    'jenis' => $validated['jenis_ekskul'] ?? 'pilihan',
                ]
            );
        }

        return redirect()->route('mapels.index')->with('message', 'Mata Pelajaran berhasil diperbarui');
    }

    public function destroy(Mapel $mapel): RedirectResponse
    {
        $mapel->delete();
        return redirect()->route('mapels.index')->with('message', 'Mata Pelajaran berhasil dihapus');
    }
}
