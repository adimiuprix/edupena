<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\CategoryMapel;
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
        ]);

        Mapel::create($validated);
        return redirect()->route('mapels.index')->with('message', 'Mata Pelajaran berhasil ditambahkan');
    }

    public function edit(Mapel $mapel): Response
    {
        $categories = CategoryMapel::all();
        return Inertia::render('Mapels/Edit', [
            'mapel' => $mapel,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Mapel $mapel): RedirectResponse
    {
        $validated = $request->validate([
            'category_mapels_id' => 'required|exists:category_mapels,id',
            'mata_pelajaran' => 'required|string|max:255',
        ]);

        $mapel->update($validated);
        return redirect()->route('mapels.index')->with('message', 'Mata Pelajaran berhasil diperbarui');
    }

    public function destroy(Mapel $mapel): RedirectResponse
    {
        $mapel->delete();
        return redirect()->route('mapels.index')->with('message', 'Mata Pelajaran berhasil dihapus');
    }
}
