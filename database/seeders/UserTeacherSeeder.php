<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Mapel;
use App\Models\Rombel;
use App\Models\Teacher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserTeacherSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Fetch role IDs
        $roleGuru = Role::where('slug', 'guru')->first();
        $roleWali = Role::where('slug', 'walikelas')->first();

        // Mapel IDs for specific subjects
        $mapelMath = Mapel::where('mata_pelajaran', 'Matematika')->first();
        $mapelEng  = Mapel::where('mata_pelajaran', 'Bahasa Inggris')->first();
        $mapelArts = Mapel::where('mata_pelajaran', 'Seni')->first();

        // ---------- Wali Kelas (kelas 1-6) ----------
        for ($kelas = 1; $kelas <= 6; $kelas++) {
            $rombel = Rombel::where('tingkat', $kelas)->first();
            if (! $rombel) continue;

            $user = User::create([
                'name'      => $faker->name,
                'email'     => "wali{$kelas}@edupena.local",
                'password'  => Hash::make('password'),
                'role_id'   => $roleWali->id,
                'rombel_id' => $rombel->id,
            ]);

            Teacher::create([
                'nip'      => $faker->unique()->numerify('##########'),
                'user_id'  => $user->id,
                'jabatan'  => 'Wali Kelas',
                // Biodata fields can stay null; they are optional.
            ]);
        }

        // ---------- Guru Mapel ----------
        $subjectData = [
            ['mapel' => $mapelMath, 'slug' => 'matematika'],
            ['mapel' => $mapelEng,  'slug' => 'bahasa-inggris'],
            ['mapel' => $mapelArts, 'slug' => 'seni'],
        ];

        foreach ($subjectData as $data) {
            $mapel = $data['mapel'];
            $slug = $data['slug'];
            if (! $mapel) continue;

            $user = User::create([
                'name'      => $faker->name,
                'email'     => "guru_{$slug}@edupena.local",
                'password'  => Hash::make('password'),
                'role_id'   => $roleGuru->id,
                'mapel_id'  => $mapel->id,
            ]);

            Teacher::create([
                'nip'      => $faker->unique()->numerify('##########'),
                'user_id'  => $user->id,
                'jabatan'  => 'Guru Mapel',
            ]);
        }
    }
}
