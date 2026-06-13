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
            ['key' => 'nama_sekolah',          'value' => 'SDN 2 Tulusbesar'],
            ['key' => 'npsn',                  'value' => '20517698'],
            ['key' => 'alamat_sekolah',        'value' => 'Jl. Mangundarmo, no. 85'],
            ['key' => 'desa_kelurahan',        'value' => 'Tulusbesar'],
            ['key' => 'kecamatan',             'value' => 'Tulusbesar'],
            ['key' => 'kabupaten_kota',        'value' => 'Malang'],
            ['key' => 'provinsi',              'value' => 'Jawa Timur'],
            ['key' => 'kode_pos',              'value' => '65156'],
            ['key' => 'email_sekolah',         'value' => 'sdn2tulusbesar@gmail.com'],
            ['key' => 'website_sekolah',       'value' => '-'],
            // Kepala Sekolah
            ['key' => 'nama_kepala_sekolah',  'value' => 'Amik Marludah, S.Pd.SD'],
            ['key' => 'nip_kepala_sekolah',   'value' => '198105122009042002'],
            // Akademik (e‑Rapor)
            ['key' => 'tahun_ajaran_aktif',    'value' => '2025/2026'],
            ['key' => 'semester_aktif',        'value' => 'Genap'],
            // Professional extensions
            ['key' => 'tempat_cetak_rapor',    'value' => 'Malang'],
            ['key' => 'logo_path',             'value' => '/images/logo.png'],
            ['key' => 'header_image',          'value' => '/images/header.jpg'],
            ['key' => 'footer_text',           'value' => '© 2026 SDN 2 Tulusbesar.'],
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
