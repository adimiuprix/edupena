<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SettingSeeder::class,
            RoleSeeder::class,
            CategoryMapelSeeder::class,
            MapelSeeder::class,
            ExtracurricularCategorySeeder::class,
            RombelSeeder::class,
            TargetSeeder::class,
            UserTeacherSeeder::class,
            StudentSeeder::class,
            KkmSeeder::class,
        ]);

        // Admin di-seed oleh UserTeacherSeeder dengan hash password dari production.
    }
}
