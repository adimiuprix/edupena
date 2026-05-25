<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('extracurricular_attendances', function (Blueprint $table) {
            $table->unique(['student_id', 'semester'], 'extracurricular_attendances_student_semester_unique');
        });
    }

    public function down(): void
    {
        Schema::table('extracurricular_attendances', function (Blueprint $table) {
            $table->dropUnique('extracurricular_attendances_student_semester_unique');
        });
    }
};
