<?php

namespace Database\Seeders;

use App\Models\ExtracurricularCategory;
use App\Models\Mapel;
use Illuminate\Database\Seeder;

class ExtracurricularCategorySeeder extends Seeder
{
    /**
     * Setiap kategori ekskul dikaitkan langsung ke mapel via mapel_id.
     * Data diambil otomatis dari mapels berkategori 'Ekstrakurikuler',
     * sehingga tidak perlu hardcode nama — tidak ada risiko mismatch.
     *
     * jenis:
     *   wajib   = semua siswa wajib mengikuti
     *   pilihan = siswa memilih salah satu
     */
    private array $jenisMap = [
        'Pramuka'       => 'wajib',
        'Bahasa Inggris'=> 'pilihan',
        'Ngaji'         => 'pilihan',
        'Seni Tari'     => 'pilihan',
    ];

    public function run(): void
    {
        // Ambil semua mapel berkategori Ekstrakurikuler
        $mapelsEkskul = Mapel::whereHas('category', fn ($q) => $q->where('kategori', 'Ekstrakurikuler'))
            ->get();

        foreach ($mapelsEkskul as $mapel) {
            $jenis = $this->jenisMap[$mapel->mata_pelajaran] ?? 'pilihan';

            ExtracurricularCategory::updateOrCreate(
                ['mapel_id' => $mapel->id],   // cari berdasarkan mapel_id (unik & stabil)
                [
                    'nama_ekskul' => $mapel->mata_pelajaran,
                    'jenis'       => $jenis,
                ]
            );
        }
    }
}
