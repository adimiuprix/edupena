<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('learning_achievement_criteria', function (Blueprint $table) {
            if (! Schema::hasColumn('learning_achievement_criteria', 'semester')) {
                $table->enum('semester', ['ganjil', 'genap'])->default('ganjil')->after('mapel_id');
            }
        });

        Schema::table('learning_achievement_criteria', function (Blueprint $table) {
            $table->unique(
                ['student_id', 'mapel_id', 'semester'],
                'learning_achievement_criteria_student_mapel_semester_unique'
            );
        });

        try {
            Schema::table('learning_achievement_criteria', function (Blueprint $table) {
                $table->dropUnique('learning_achievement_criteria_student_mapel_unique');
            });
        } catch (\Throwable) {
            //
        }
    }

    public function down(): void
    {
        Schema::table('learning_achievement_criteria', function (Blueprint $table) {
            try {
                $table->dropUnique('learning_achievement_criteria_student_mapel_semester_unique');
            } catch (\Throwable) {
                //
            }

            $table->unique(['student_id', 'mapel_id'], 'learning_achievement_criteria_student_mapel_unique');
            $table->dropColumn('semester');
        });
    }
};
