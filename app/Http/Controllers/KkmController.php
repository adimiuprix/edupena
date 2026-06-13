<?php

namespace App\Http\Controllers;

use App\Models\Kkm;
use App\Models\Mapel;
use App\Models\Rombel;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class KkmController extends Controller
{
    public function index(Request $request): Response
    {
        $rombels = Rombel::orderBy('tingkat')->orderBy('nama_rombel')->get(['id', 'tingkat', 'nama_rombel', 'tahun_ajaran']);
        $mapels = Mapel::orderBy('mata_pelajaran')->get(['id', 'mata_pelajaran']);

        $defaultSemester = $this->normalizeSemester(Setting::where('key', 'semester_aktif')->value('value')) ?? 'ganjil';

        $rombelId = $request->integer('rombel_id') ?: ($rombels->first()?->id);
        $semester = $this->normalizeSemester($request->get('semester')) ?: $defaultSemester;

        $payload = [
            'rombels' => $rombels,
            'mapels' => $mapels,
            'semesters' => [
                ['value' => 'ganjil', 'label' => 'Ganjil'],
                ['value' => 'genap', 'label' => 'Genap'],
            ],
            'filters' => [
                'rombel_id' => $rombelId,
                'semester' => $semester,
            ],
            'kkmData' => [],
        ];

        if (!$rombelId || !$semester) {
            return Inertia::render('Kkm/Index', $payload);
        }

        $existingKkm = Kkm::where('rombel_id', $rombelId)
            ->where('semester', $semester)
            ->get()
            ->keyBy('mapel_id');

        $kkmData = [];
        foreach ($mapels as $mapel) {
            $kkm = $existingKkm->get($mapel->id);
            $kkmData[] = [
                'mapel_id' => $mapel->id,
                'mata_pelajaran' => $mapel->mata_pelajaran,
                'nilai_kkm' => $kkm?->nilai_kkm,
                'kkm_id' => $kkm?->id,
            ];
        }

        $payload['kkmData'] = $kkmData;
        $payload['selectedRombel'] = $rombels->firstWhere('id', $rombelId);

        return Inertia::render('Kkm/Index', $payload);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'rombel_id' => 'required|exists:rombels,id',
            'semester' => 'required|in:ganjil,genap',
            'kkm_data' => 'required|array',
            'kkm_data.*.mapel_id' => 'required|exists:mapels,id',
            'kkm_data.*.nilai_kkm' => 'nullable|integer|min:0|max:100',
        ]);

        foreach ($validated['kkm_data'] as $row) {
            $nilaiKkm = $row['nilai_kkm'] ?? null;

            if ($nilaiKkm === null || $nilaiKkm === '') {
                Kkm::where('mapel_id', $row['mapel_id'])
                    ->where('rombel_id', $validated['rombel_id'])
                    ->where('semester', $validated['semester'])
                    ->delete();
                continue;
            }

            Kkm::updateOrCreate(
                [
                    'mapel_id' => $row['mapel_id'],
                    'rombel_id' => $validated['rombel_id'],
                    'semester' => $validated['semester'],
                ],
                [
                    'nilai_kkm' => $nilaiKkm,
                ]
            );
        }

        return redirect()
            ->route('kkm.index', [
                'rombel_id' => $validated['rombel_id'],
                'semester' => $validated['semester'],
            ])
            ->with('message', 'KKM berhasil disimpan.');
    }

    private function normalizeSemester(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        $lower = strtolower(trim($value));

        return match (true) {
            str_contains($lower, 'genap') => 'genap',
            str_contains($lower, 'ganjil') => 'ganjil',
            default => in_array($lower, ['ganjil', 'genap'], true) ? $lower : null,
        };
    }
}
