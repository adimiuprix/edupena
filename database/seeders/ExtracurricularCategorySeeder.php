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
        ];

        foreach ($categories as $category) {
            ExtracurricularCategory::updateOrCreate(
                ['nama_ekskul' => $category['nama_ekskul']],
                ['jenis' => $category['jenis']]
            );
        }
    }
}
