<?php

namespace Database\Seeders;

use App\Models\Rombel;
use Illuminate\Database\Seeder;

class RombelSeeder extends Seeder
{
    public function run(): void
    {
        $tahunAjaran = '2025/2026';

        // Buat kelas 1 sampai 6, masing-masing satu rombel dengan nama buah
        $fruits = ['Apel', 'Jeruk', 'Mangga', 'Pisang', 'Anggur', 'Melon'];
        foreach (range(1, 6) as $tingkat) {
            $nama = $fruits[$tingkat - 1];
            Rombel::firstOrCreate(
                [
                    'tingkat' => $tingkat,
                    'nama_rombel' => $nama,
                ],
                [
                    'tahun_ajaran' => $tahunAjaran,
                ]
            );
        }
    }
}
