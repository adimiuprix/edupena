<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Kriteria Ketercapaian Tujuan Pembelajaran (KKTP).
     */
    public function up(): void
    {
        Schema::create('learning_achievement_criteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('mapel_id')->nullable()->constrained('mapels')->nullOnDelete();
            $table->enum('semester', ['ganjil', 'genap'])->default('ganjil');
            $table->integer('nilai')->nullable();
            $table->timestamps();

            $table->unique(
                ['student_id', 'mapel_id', 'semester'],
                'learning_achievement_criteria_student_mapel_semester_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_achievement_criteria');
    }
};
