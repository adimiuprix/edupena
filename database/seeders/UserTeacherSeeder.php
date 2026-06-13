<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserTeacherSeeder extends Seeder
{
    /**
     * Data gabungan dari users.sql + teachers.sql (production dump).
     * Password sudah dalam bentuk bcrypt hash — tidak perlu di-hash ulang.
     *
     * role_slug : 'walikelas' | 'guru' | 'admin'
     * mapel_id / rombel_id mengacu pada ID yang di-seed oleh MapelSeeder & RombelSeeder.
     */
    private array $users = [
        [
            'id'        => 1,
            'name'      => 'Manis Ari Wahyuni, S.pd',
            'email'     => 'manistlbs@gmail.com',
            'password'  => '$2y$12$HUS1RrQPjvZs0psJFI0lBedNWglXCEMp2oY8X.JbuqOHaAj7yau0i',
            'role_slug' => 'walikelas',
            'mapel_id'  => null,
            'rombel_id' => 1,
        ],
        [
            'id'        => 2,
            'name'      => 'Irma Safitri S.E.',
            'email'     => 'wali2@edupena.local',
            'password'  => '$2y$12$PpbMqftGFq6C6.z2lf2BzONC2CtHQE4d6LRsn4ZyS91qsCiAK/02a',
            'role_slug' => 'walikelas',
            'mapel_id'  => null,
            'rombel_id' => 2,
        ],
        [
            'id'        => 3,
            'name'      => 'Timbul Artawan Waluyo',
            'email'     => 'wali3@edupena.local',
            'password'  => '$2y$12$yFxq5LGh2ssREnzSJV5ya.v2rL2PW2zI9rUniWPUVFpktsYPPYu3.',
            'role_slug' => 'walikelas',
            'mapel_id'  => null,
            'rombel_id' => 3,
        ],
        [
            'id'        => 4,
            'name'      => 'Jamal Gunawan M.Pd',
            'email'     => 'wali4@edupena.local',
            'password'  => '$2y$12$/xzwcb4Noqo3sFchl9P.AO.vVyG4qQ/853XfAY/xmAZlmfT3P4h7u',
            'role_slug' => 'walikelas',
            'mapel_id'  => null,
            'rombel_id' => 4,
        ],
        [
            'id'        => 5,
            'name'      => 'Widya Dinda Melani S.E.I',
            'email'     => 'wali5@edupena.local',
            'password'  => '$2y$12$Zk4U3jDny0QRFd2dse3wgODPpZsA2nwf81zyU.x97SGQEiuz5dbXm',
            'role_slug' => 'walikelas',
            'mapel_id'  => null,
            'rombel_id' => 5,
        ],
        [
            'id'        => 6,
            'name'      => 'Eka Wulandari M.TI.',
            'email'     => 'wali6@edupena.local',
            'password'  => '$2y$12$4B7KOj1HjsM1uXkKllpcFeQfAS9yfNXEmEtb9XgZudS5Pcwt.6eXi',
            'role_slug' => 'walikelas',
            'mapel_id'  => null,
            'rombel_id' => 6,
        ],
        [
            'id'        => 7,
            'name'      => 'Teddy Kunthara Tampubolon M.M.',
            'email'     => 'guru_matematika@edupena.local',
            'password'  => '$2y$12$ZCc5fPZ9LpOpxKoM6iXbVengsD0qmPD0sKAi8yLza33dBEgf2RuVO',
            'role_slug' => 'guru',
            'mapel_id'  => 4,
            'rombel_id' => null,
        ],
        [
            'id'        => 8,
            'name'      => 'Talia Farida',
            'email'     => 'guru_bahasa-inggris@edupena.local',
            'password'  => '$2y$12$m.429VyxW9o42yr9dvoda.yPWEjp60mtpNabKqk0qxJ7p3jGyN/8S',
            'role_slug' => 'guru',
            'mapel_id'  => 8,
            'rombel_id' => null,
        ],
    ];

    /**
     * Data dari teachers.sql — diindeks berdasarkan id user (posisi dalam array $users).
     * Kolom jabatan sesuai enum: 'Guru Mapel' | 'Wali Kelas' | 'Guru BK' | 'Kepala Sekolah' | 'Staff'
     */
    private array $teachers = [
        1 => ['nip' => '197210092025212003', 'jabatan' => 'Wali Kelas'],
        2 => ['nip' => '4294458781',         'jabatan' => 'Wali Kelas'],
        3 => ['nip' => '9238773963',         'jabatan' => 'Wali Kelas'],
        4 => ['nip' => '0756238240',         'jabatan' => 'Wali Kelas'],
        5 => ['nip' => '7008351432',         'jabatan' => 'Wali Kelas'],
        6 => ['nip' => '7548095621',         'jabatan' => 'Wali Kelas'],
        7 => ['nip' => '3696127524',         'jabatan' => 'Guru Mapel'],
        8 => ['nip' => '4497020427',         'jabatan' => 'Guru Mapel'],
    ];

    public function run(): void
    {
        // Resolve role IDs by slug — aman meski auto-increment berbeda antar environment
        $roles = Role::whereIn('slug', ['admin', 'guru', 'walikelas'])
            ->pluck('id', 'slug');

        foreach ($this->users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                [
                    'name'      => $userData['name'],
                    'password'  => $userData['password'],
                    'role_id'   => $roles[$userData['role_slug']] ?? null,
                    'mapel_id'  => $userData['mapel_id'],
                    'rombel_id' => $userData['rombel_id'],
                ]
            );

            if (isset($this->teachers[$userData['id']])) {
                $teacherData = $this->teachers[$userData['id']];

                Teacher::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'nip'     => $teacherData['nip'],
                        'jabatan' => $teacherData['jabatan'],
                    ]
                );
            }
        }

        // Admin — tidak punya record di tabel teachers
        User::firstOrCreate(
            ['email' => 'admin@edupena.fun'],
            [
                'name'     => 'Admin Sekolah',
                'password' => '$2y$12$p81Lkpwc65zy/qYLODePdOX98Y0st/Vh3trNWJluw.p3JouqJP9T6',
                'role_id'  => $roles['admin'] ?? null,
            ]
        );
    }
}
