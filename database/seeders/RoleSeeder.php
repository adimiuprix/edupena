<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrator',
                'slug' => 'admin',
                'description' => 'Akses penuh ke seluruh sistem',
            ],
            [
                'name' => 'Guru',
                'slug' => 'guru',
                'description' => 'Menginput nilai dan data pembelajaran',
            ],
            [
                'name' => 'Wali Kelas',
                'slug' => 'walikelas',
                'description' => 'Mengelola data kelas dan rapor siswa',
            ],
            [
                'name' => 'Kepala Sekolah',
                'slug' => 'kepsek',
                'description' => 'Menyetujui dan memantau laporan sekolah',
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['slug' => $role['slug']],
                [
                    'name' => $role['name'],
                    'description' => $role['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}
