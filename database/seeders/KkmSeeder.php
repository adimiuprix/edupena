<?php

namespace Database\Seeders;

use App\Models\Kkm;
use App\Models\Mapel;
use App\Models\Rombel;
use Illuminate\Database\Seeder;

class KkmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rombels = Rombel::all();
        $mapels = Mapel::all();

        if ($rombels->isEmpty() || $mapels->isEmpty()) {
            $this->command->warn('Pastikan tabel rombels dan mapels sudah terisi terlebih dahulu.');
            return;
        }

        // KKM default per semester
        $semesters = ['ganjil', 'genap'];
        
        foreach ($rombels as $rombel) {
            foreach ($mapels as $mapel) {
                foreach ($semesters as $semester) {
                    // Generate KKM random antara 70-80
                    $nilaiKkm = rand(70, 80);

                    Kkm::create([
                        'mapel_id' => $mapel->id,
                        'rombel_id' => $rombel->id,
                        'nilai_kkm' => $nilaiKkm,
                        'semester' => $semester,
                    ]);
                }
            }
        }

        $this->command->info('KKM seeder berhasil dijalankan.');
    }
}
