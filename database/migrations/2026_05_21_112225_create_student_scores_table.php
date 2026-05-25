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
        Schema::create('student_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->nullable()->references('id')->on('students')->onDelete('cascade');
            $table->foreignId('mapel_id')->nullable()->references('id')->on('mapels')->onDelete('cascade');
            $table->foreignId('target_id')->nullable()->references('id')->on('targets')->onDelete('cascade');
            
            // Nilai inputan
            $table->integer('sumatif_harian')->nullable();
            $table->integer('sumatif_akhir')->nullable();
            
            // Nilai hasil perhitungan (opsional, bisa disimpan atau dihitung dinamis)
            $table->decimal('nilai_rapor_tp', 5, 2)->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_scores');
    }
};
