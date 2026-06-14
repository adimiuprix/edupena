<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('extracurricular_attendances', function (Blueprint $table) {
            // MySQL: unique index yang dipakai sebagai backing index FK tidak bisa langsung di-drop.
            // Harus drop FK dulu, baru drop unique, lalu recreate FK + unique baru.
            $table->dropForeign(['student_id']);

            $table->dropUnique('extracurricular_attendances_student_semester_unique');

            // Tambah index biasa untuk student_id agar FK bisa kembali dibuat
            $table->index('student_id', 'extracurricular_attendances_student_id_index');

            // Recreate FK student_id
            $table->foreign('student_id')
                ->references('id')->on('students')
                ->onDelete('cascade');

            // Unique baru: satu siswa tidak boleh punya 2 record ekskul yang sama di semester yang sama
            $table->unique(
                ['student_id', 'semester', 'extracurricular_category_id'],
                'extracurricular_attendances_student_semester_category_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('extracurricular_attendances', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->dropIndex('extracurricular_attendances_student_id_index');
            $table->dropUnique('extracurricular_attendances_student_semester_category_unique');

            // Kembalikan ke unique lama
            $table->unique(
                ['student_id', 'semester'],
                'extracurricular_attendances_student_semester_unique'
            );

            $table->foreign('student_id')
                ->references('id')->on('students')
                ->onDelete('cascade');
        });
    }
};
