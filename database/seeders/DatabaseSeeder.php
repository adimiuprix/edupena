<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
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
            StudentSeeder::class
        ]);

        $adminRole = Role::where('slug', 'admin')->first();

        User::firstOrCreate(
            ['email' => 'admin@edupena.fun'],
            [
                'name' => 'Admin Sekolah',
                'password' => bcrypt('password'),
                'role_id' => $adminRole?->id,
            ]
        );
    }
}
