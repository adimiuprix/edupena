<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('kktps') && Schema::hasTable('learning_achievement_criteria')) {
            Schema::drop('kktps');

            return;
        }

        if (Schema::hasTable('kktps')) {
            Schema::rename('kktps', 'learning_achievement_criteria');
        }

        if (Schema::hasTable('learning_achievement_criteria')) {
            try {
                Schema::table('learning_achievement_criteria', function (Blueprint $table) {
                    $table->unique(['student_id', 'mapel_id'], 'learning_achievement_criteria_student_mapel_unique');
                });
            } catch (\Throwable) {
                //
            }
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('learning_achievement_criteria')) {
            return;
        }

        if (! Schema::hasTable('kktps')) {
            Schema::rename('learning_achievement_criteria', 'kktps');
        }
    }
};
