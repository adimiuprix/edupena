<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Mapel;
use App\Models\Target;
use Illuminate\Support\Facades\File;

class TargetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('seeders/targets_data.json');
        
        if (!File::exists($jsonPath)) {
            $this->command->warn('File targets_data.json tidak ditemukan.');
            return;
        }

        $json = File::get($jsonPath);
        $data = json_decode($json, true);

        // Ubah keys menjadi lowercase untuk menghindari masalah case-sensitive
        $mapels = Mapel::all();
        $mapelMap = [];
        foreach ($mapels as $mapel) {
            $mapelMap[strtolower(trim($mapel->mata_pelajaran))] = $mapel->id;
        }

        $count = 0;
        foreach ($data as $tp) {
            $mapelName = strtolower(trim($tp['mapel_name']));
            
            if (!isset($mapelMap[$mapelName])) {
                // Jika mapel tidak ada di database, kita lewati
                continue;
            }

            Target::updateOrCreate([
                'mapel_id' => $mapelMap[$mapelName],
                'kelas' => $tp['kelas'],
                'semester' => $tp['semester'],
                'nomor_tp' => $tp['nomor_tp'],
            ], [
                'deskripsi_target_pencapaian' => substr(trim($tp['deskripsi']), 0, 5000),
            ]);
            
            $count++;
        }

        $this->command->info("Berhasil mengimpor {$count} Tujuan Pembelajaran (TP) dari Excel.");
    }
}
