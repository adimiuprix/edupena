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
        Schema::create('extracurricular_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->nullable()->references('id')->on('students')->onDelete('cascade');
            $table->enum('semester', ['ganjil', 'genap'])->nullable();
            
            // Ekstrakurikuler (Relasi ke tabel extracurricular_categories)
            $table->foreignId('extracurricular_category_id')->nullable()->references('id')->on('extracurricular_categories')->onDelete('set null');
            $table->enum('predikat', ['Sangat Baik', 'Baik', 'Cukup', 'Kurang'])->nullable();
            
            // Absensi
            $table->integer('sakit')->nullable()->default(0);
            $table->integer('ijin')->nullable()->default(0);
            $table->integer('alpa')->nullable()->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('extracurricular_attendances');
    }
};
