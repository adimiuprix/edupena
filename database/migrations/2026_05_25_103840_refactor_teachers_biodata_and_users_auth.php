<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('mapel_id')->nullable()->after('role_id')->constrained('mapels')->nullOnDelete();
            $table->foreignId('rombel_id')->nullable()->after('mapel_id')->constrained('rombels')->nullOnDelete();
        });

        Schema::table('teachers', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('id')->unique()->constrained()->cascadeOnDelete();
        });

        $roleIds = DB::table('roles')->pluck('id', 'slug');
        $guruRoleId = $roleIds['guru'] ?? null;
        $waliRoleId = $roleIds['walikelas'] ?? null;

        $teachers = DB::table('teachers')->get();

        foreach ($teachers as $teacher) {
            $isWaliKelas = ($teacher->jenis_guru ?? '') === 'Wali Kelas';
            $roleId = $isWaliKelas ? $waliRoleId : $guruRoleId;

            $userId = DB::table('users')->insertGetId([
                'name' => $teacher->name,
                'email' => 'guru' . $teacher->id . '@edupena.local',
                'password' => Hash::make('password'),
                'role_id' => $roleId,
                'mapel_id' => $isWaliKelas ? null : $teacher->mapel_id,
                'rombel_id' => $isWaliKelas ? $teacher->rombel_id : null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('teachers')->where('id', $teacher->id)->update(['user_id' => $userId]);
        }

        Schema::table('teachers', function (Blueprint $table) {
            $table->dropForeign(['mapel_id']);
            $table->dropForeign(['rombel_id']);
            $table->dropColumn(['name', 'jenis_guru', 'mapel_id', 'rombel_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->string('name')->after('id');
            $table->enum('jenis_guru', ['Guru Mapel', 'Wali Kelas'])->default('Guru Mapel')->after('nip');
            $table->foreignId('mapel_id')->nullable()->after('jenis_guru')->constrained('mapels')->nullOnDelete();
            $table->foreignId('rombel_id')->nullable()->after('mapel_id')->constrained('rombels')->nullOnDelete();
        });

        $teachers = DB::table('teachers')->whereNotNull('user_id')->get();
        $roleSlugs = DB::table('roles')->pluck('slug', 'id');

        foreach ($teachers as $teacher) {
            $user = DB::table('users')->where('id', $teacher->user_id)->first();

            if (! $user) {
                continue;
            }

            $jenisGuru = ($roleSlugs[$user->role_id] ?? '') === 'walikelas' ? 'Wali Kelas' : 'Guru Mapel';

            DB::table('teachers')->where('id', $teacher->id)->update([
                'name' => $user->name,
                'jenis_guru' => $jenisGuru,
                'mapel_id' => $user->mapel_id,
                'rombel_id' => $user->rombel_id,
            ]);

            DB::table('users')->where('id', $user->id)->delete();
        }

        Schema::table('teachers', function (Blueprint $table) {
            $table->dropConstrainedForeignId('user_id');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('rombel_id');
            $table->dropConstrainedForeignId('mapel_id');
        });
    }
};
