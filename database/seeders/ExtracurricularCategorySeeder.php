<?php

namespace Database\Seeders;

use App\Models\ExtracurricularCategory;
use App\Models\Mapel;
use Illuminate\Database\Seeder;

class ExtracurricularCategorySeeder extends Seeder
{
    /**
     * Setiap kategori ekskul dikaitkan langsung ke mapel via mapel_id,
     * bukan matching nama string, agar tidak ada kebocoran data di rapor.
     */
    public function run(): void
    {
        $categories = [
            ['nama_ekskul' => 'Pramuka', 'jenis' => 'wajib', 'mapel_nama' => 'Pramuka'],
        ];

        foreach ($categories as $cat) {
            $mapel = Mapel::where('mata_pelajaran', $cat['mapel_nama'])->first();

            ExtracurricularCategory::updateOrCreate(
                ['nama_ekskul' => $cat['nama_ekskul']],
                [
                    'jenis'     => $cat['jenis'],
                    'mapel_id'  => $mapel?->id,
                ]
            );
        }
    }
}
