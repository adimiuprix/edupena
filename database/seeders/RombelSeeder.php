<?php

namespace Database\Seeders;

use App\Models\Rombel;
use Illuminate\Database\Seeder;

class RombelSeeder extends Seeder
{
    public function run(): void
    {
        $tahunAjaran = '2025/2026';

        // Buat kelas 1 sampai 6, masing-masing ada 2 rombel (A dan B)
        for ($tingkat = 1; $tingkat <= 6; $tingkat++) {
            foreach (['A', 'B'] as $nama) {
                Rombel::firstOrCreate(
                    [
                        'tingkat' => $tingkat,
                        'nama_rombel' => $nama,
                    ],
                    [
                        'tahun_ajaran' => $tahunAjaran
                    ]
                );
            }
        }
    }
}
