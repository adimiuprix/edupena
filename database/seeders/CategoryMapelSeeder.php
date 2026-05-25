<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryMapelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['kategori' => 'Pendidikan Umum'],
            ['kategori' => 'Muatan Lokal'],
            ['kategori' => 'Ekstrakurikuler'],
        ];

        DB::table('category_mapels')->insert($categories);
    }
}
