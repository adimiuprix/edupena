<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\Rombel;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        
        // Pastikan ada setidaknya satu Rombel untuk menampung siswa
        $rombel = Rombel::firstOrCreate(
            ['tingkat' => 1, 'nama_rombel' => 'A'],
            ['tahun_ajaran' => '2025/2026']
        );

        for ($i = 0; $i < 10; $i++) {
            Student::create([
                'rombel_id' => $rombel->id,
                'nama_lengkap' => $faker->name,
                'nama_panggilan' => $faker->firstName,
                'nipd' => $faker->unique()->numerify('####'),
                'nisn' => $faker->unique()->numerify('##########'),
                'agama' => $faker->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha']),
                'jenis_kelamin' => $faker->randomElement(['L', 'P']),
                'tempat_lahir' => $faker->city,
                'tanggal_lahir' => $faker->dateTimeBetween('-10 years', '-7 years')->format('Y-m-d'),
                'alamat' => $faker->streetAddress,
                'rt' => $faker->numberBetween(1, 10),
                'rw' => $faker->numberBetween(1, 10),
                'desa_kelurahan' => $faker->streetName,
                'kecamatan' => $faker->citySuffix,
                'kabupaten' => $faker->city,
                'provinsi' => $faker->state,
                'kode_pos' => $faker->postcode,
                'no_telepon' => $faker->phoneNumber,
                'nama_ayah' => $faker->name('male'),
                'pekerjaan_ayah' => $faker->jobTitle,
                'nama_ibu' => $faker->name('female'),
                'pekerjaan_ibu' => $faker->jobTitle,
            ]);
        }
    }
}
