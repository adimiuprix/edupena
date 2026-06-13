<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MapelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mapels = [
            ['category_mapels_id' => 1, 'mata_pelajaran' => 'Pendidikan Agama'],
            ['category_mapels_id' => 1, 'mata_pelajaran' => 'Pendidikan Pancasila'],
            ['category_mapels_id' => 1, 'mata_pelajaran' => 'Bahasa Indonesia'],
            ['category_mapels_id' => 1, 'mata_pelajaran' => 'Matematika'],
            ['category_mapels_id' => 1, 'mata_pelajaran' => 'Seni Rupa'],
            ['category_mapels_id' => 1, 'mata_pelajaran' => 'PJOK'],
            ['category_mapels_id' => 2, 'mata_pelajaran' => 'Bahasa Inggris'],
            ['category_mapels_id' => 2, 'mata_pelajaran' => 'Bahasa Daerah'],
            ['category_mapels_id' => 3, 'mata_pelajaran' => 'Ngaji'],
            ['category_mapels_id' => 3, 'mata_pelajaran' => 'Seni Tari'],
            ['category_mapels_id' => 3, 'mata_pelajaran' => 'Pramuka'],
        ];

        DB::table('mapels')->insert($mapels);
    }
}
