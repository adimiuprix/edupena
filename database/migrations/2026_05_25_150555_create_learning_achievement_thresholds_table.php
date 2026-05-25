<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ambang KKTP per rombel & semester (Min, Max, tengah) — logika eraport KKTP!K3:L3.
     */
    public function up(): void
    {
        Schema::create('learning_achievement_thresholds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rombel_id')->constrained()->cascadeOnDelete();
            $table->enum('semester', ['ganjil', 'genap']);
            $table->decimal('min_nilai', 8, 2)->nullable();
            $table->decimal('max_nilai', 8, 2)->nullable();
            $table->decimal('mid_nilai', 8, 2)->nullable();
            $table->timestamps();

            $table->unique(['rombel_id', 'semester'], 'learning_achievement_thresholds_rombel_semester_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_achievement_thresholds');
    }
};
