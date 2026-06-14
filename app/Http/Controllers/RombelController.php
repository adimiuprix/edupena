<?php

namespace App\Http\Controllers;

use App\Models\Rombel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RombelController extends Controller
{
    public function index(Request $request)
    {
        $query = Rombel::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_rombel', 'like', "%{$search}%")
                  ->orWhere('tingkat', 'like', "%{$search}%")
                  ->orWhere('tahun_ajaran', 'like', "%{$search}%");
            });
        }

        $rombels = $query->with('waliKelas')->latest()->paginate(10)->withQueryString();

        return Inertia::render('Rombels/Index', [
            'rombels' => $rombels,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Rombels/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tingkat' => 'required|integer|min:1|max:12',
            'nama_rombel' => 'required|string|max:255',
            'tahun_ajaran' => 'nullable|string|max:50',
        ]);

        Rombel::create($validated);

        return redirect()->route('rombels.index')->with('message', 'Rombel berhasil ditambahkan');
    }

    public function edit(Rombel $rombel)
    {
        return Inertia::render('Rombels/Edit', [
            'rombel' => $rombel
        ]);
    }

    public function update(Request $request, Rombel $rombel)
    {
        $validated = $request->validate([
            'tingkat' => 'required|integer|min:1|max:12',
            'nama_rombel' => 'required|string|max:255',
            'tahun_ajaran' => 'nullable|string|max:50',
        ]);

        $rombel->update($validated);

        return redirect()->route('rombels.index')->with('message', 'Rombel berhasil diperbarui');
    }

    public function destroy(Rombel $rombel)
    {
        $rombel->delete();

        return redirect()->route('rombels.index')->with('message', 'Rombel berhasil dihapus');
    }
}
