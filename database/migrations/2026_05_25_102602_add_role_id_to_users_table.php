<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $roles = [
            ['name' => 'Administrator', 'slug' => 'admin', 'description' => 'Akses penuh ke seluruh sistem'],
            ['name' => 'Guru', 'slug' => 'guru', 'description' => 'Menginput nilai dan data pembelajaran'],
            ['name' => 'Wali Kelas', 'slug' => 'walikelas', 'description' => 'Mengelola data kelas dan rapor siswa'],
            ['name' => 'Kepala Sekolah', 'slug' => 'kepsek', 'description' => 'Menyetujui dan memantau laporan sekolah'],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['slug' => $role['slug']],
                [
                    'name' => $role['name'],
                    'description' => $role['description'],
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        $roleIdsBySlug = DB::table('roles')->pluck('id', 'slug');

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('password')->constrained('roles')->nullOnDelete();
        });

        if (Schema::hasColumn('users', 'role')) {
            $users = DB::table('users')->whereNotNull('role')->get(['id', 'role']);

            foreach ($users as $user) {
                $roleId = $roleIdsBySlug[$user->role] ?? $roleIdsBySlug['guru'];

                DB::table('users')->where('id', $user->id)->update(['role_id' => $roleId]);
            }

            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'guru', 'walikelas', 'kepsek'])
                ->default('guru')
                ->after('password');
        });

        $roleSlugsById = DB::table('roles')->pluck('slug', 'id');
        $users = DB::table('users')->whereNotNull('role_id')->get(['id', 'role_id']);

        foreach ($users as $user) {
            DB::table('users')
                ->where('id', $user->id)
                ->update(['role' => $roleSlugsById[$user->role_id] ?? 'guru']);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('role_id');
        });
    }
};
