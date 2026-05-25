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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap')->nullable();
            $table->string('nama_panggilan')->nullable();
            $table->string('nipd')->nullable();
            $table->string('nisn')->nullable()->unique();
            $table->enum('agama', ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu'])->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('alamat')->nullable();
            $table->integer('rt')->nullable();
            $table->integer('rw')->nullable();
            $table->string('desa_kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kabupaten')->nullable();
            $table->string('provinsi')->nullable();
            $table->string('kode_pos')->nullable();
            $table->string('no_telepon')->nullable();
            $table->string('email')->nullable();
            $table->string('nama_wali')->nullable();
            $table->string('no_telepon_wali')->nullable();
            $table->string('alamat_wali')->nullable();
            $table->string('pekerjaan_wali')->nullable();
            $table->string('nama_ibu')->nullable();
            $table->string('no_telepon_ibu')->nullable();
            $table->string('alamat_ibu')->nullable();
            $table->string('pekerjaan_ibu')->nullable();
            $table->string('nama_ayah')->nullable();
            $table->string('no_telepon_ayah')->nullable();
            $table->string('alamat_ayah')->nullable();
            $table->string('pekerjaan_ayah')->nullable();
            $table->string('nama_wali_murid')->nullable();
            $table->string('no_telepon_wali_murid')->nullable();
            $table->string('alamat_wali_murid')->nullable();
            $table->string('pekerjaan_wali_murid')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
