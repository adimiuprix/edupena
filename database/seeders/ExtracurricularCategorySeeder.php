<?php

namespace Database\Seeders;

use App\Models\ExtracurricularCategory;
use Illuminate\Database\Seeder;

class ExtracurricularCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['nama_ekskul' => 'Pramuka', 'jenis' => 'wajib'],
            ['nama_ekskul' => 'PMR', 'jenis' => 'pilihan'],
            ['nama_ekskul' => 'Paskibra', 'jenis' => 'pilihan'],
            ['nama_ekskul' => 'Rohis', 'jenis' => 'pilihan'],
            ['nama_ekskul' => 'Seni Tari', 'jenis' => 'pilihan'],
            ['nama_ekskul' => 'Futsal', 'jenis' => 'pilihan'],
        ];

        foreach ($categories as $category) {
            ExtracurricularCategory::updateOrCreate(
                ['nama_ekskul' => $category['nama_ekskul']],
                ['jenis' => $category['jenis']]
            );
        }
    }
}
