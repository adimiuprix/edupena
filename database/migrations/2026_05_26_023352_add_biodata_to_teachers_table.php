<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            // Add biodata columns after the user_id foreign key (which exists after refactor)
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable()->after('user_id');
            $table->string('tempat_lahir')->nullable()->after('jenis_kelamin');
            $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
            $table->string('no_telepon')->nullable()->after('tanggal_lahir');
            $table->text('alamat')->nullable()->after('no_telepon');
            $table->string('pendidikan_terakhir')->nullable()->after('alamat');
            $table->enum('status_pegawai', ['PNS', 'PPPK', 'GTY/PTY', 'Honorer', 'Lainnya'])->nullable()->after('pendidikan_terakhir');
            $table->enum('jabatan', ['Guru Mapel', 'Wali Kelas', 'Guru BK', 'Kepala Sekolah', 'Staff'])->nullable()->after('status_pegawai');
            $table->date('tanggal_bergabung')->nullable()->after('jabatan');
            $table->string('email')->nullable()->unique()->after('tanggal_bergabung');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn([
                'jenis_kelamin',
                'tempat_lahir',
                'tanggal_lahir',
                'no_telepon',
                'alamat',
                'pendidikan_terakhir',
                'status_pegawai',
                'jabatan',
                'tanggal_bergabung',
                'email',
            ]);
        });
    }
};
