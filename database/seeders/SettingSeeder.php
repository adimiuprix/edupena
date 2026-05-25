<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Identitas Sekolah
            ['key' => 'nama_sekolah', 'value' => 'SDN Karang Mulya 01'],
            ['key' => 'npsn', 'value' => '20123456'],
            ['key' => 'alamat_sekolah', 'value' => 'Jl. Pendidikan No. 12'],
            ['key' => 'desa_kelurahan', 'value' => 'Karang Mulya'],
            ['key' => 'kecamatan', 'value' => 'Karang Bahagia'],
            ['key' => 'kabupaten_kota', 'value' => 'Bekasi'],
            ['key' => 'provinsi', 'value' => 'Jawa Barat'],
            ['key' => 'kode_pos', 'value' => '17530'],
            ['key' => 'email_sekolah', 'value' => 'info@sdnkarangmulya01.sch.id'],
            ['key' => 'website_sekolah', 'value' => 'www.sdnkarangmulya01.sch.id'],

            // Kepala Sekolah
            ['key' => 'nama_kepala_sekolah', 'value' => 'Budi Santoso, S.Pd., M.Pd.'],
            ['key' => 'nip_kepala_sekolah', 'value' => '198001012005011001'],

            // Akademik
            ['key' => 'tahun_ajaran_aktif', 'value' => '2025/2026'],
            ['key' => 'semester_aktif', 'value' => 'Genap'],
        ];

        foreach ($settings as $setting) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }
    }
}
