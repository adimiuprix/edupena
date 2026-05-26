<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Identitas Sekolah (e‑Rapor)
            ['key' => 'nama_sekolah',          'value' => 'SDN Karang Mulya 01'],
            ['key' => 'npsn',                  'value' => '20123456'],
            ['key' => 'alamat_sekolah',        'value' => 'Jl. Pendidikan No. 12'],
            ['key' => 'desa_kelurahan',        'value' => 'Karang Mulya'],
            ['key' => 'kecamatan',             'value' => 'Karang Bahagia'],
            ['key' => 'kabupaten_kota',        'value' => 'Bekasi'],
            ['key' => 'provinsi',              'value' => 'Jawa Barat'],
            ['key' => 'kode_pos',              'value' => '17530'],
            ['key' => 'email_sekolah',         'value' => 'info@sdnkarangmulya01.sch.id'],
            ['key' => 'website_sekolah',       'value' => 'www.sdnkarangmulya01.sch.id'],
            // Kepala Sekolah
            ['key' => 'nama_kepala_sekolah',  'value' => 'Budi Santoso, S.Pd., M.Pd.'],
            ['key' => 'nip_kepala_sekolah',   'value' => '198001012005011001'],
            // Akademik (e‑Rapor)
            ['key' => 'tahun_ajaran_aktif',    'value' => '2025/2026'],
            ['key' => 'semester_aktif',        'value' => 'Genap'],
            // Professional extensions
            ['key' => 'tempat_cetak_rapor',    'value' => 'Bekasi'],
            ['key' => 'logo_path',             'value' => '/images/logo.png'],
            ['key' => 'header_image',          'value' => '/images/header.jpg'],
            ['key' => 'footer_text',           'value' => '© 2026 SDN Karang Mulya 01. All rights reserved.'],
            ['key' => 'default_language',      'value' => 'id'],
            ['key' => 'theme_color',           'value' => '#1e90ff'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }
    }
}
?>
