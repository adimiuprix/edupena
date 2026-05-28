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
        Schema::create('exam_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignId('mapel_id')->constrained('mapels')->cascadeOnDelete();
            $table->enum('semester', ['ganjil', 'genap']);
            $table->integer('bulan')->comment('1 sampai 6');
            $table->integer('minggu_1')->nullable();
            $table->integer('minggu_2')->nullable();
            $table->integer('minggu_3')->nullable();
            $table->integer('minggu_4')->nullable();
            $table->timestamps();

            $table->unique(['student_id', 'mapel_id', 'semester', 'bulan'], 'exam_scores_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_scores');
    }
};
