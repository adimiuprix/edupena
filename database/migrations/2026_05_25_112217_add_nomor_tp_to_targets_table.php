<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('targets', function (Blueprint $table) {
            $table->unsignedTinyInteger('nomor_tp')->default(1)->after('semester');
            $table->unique(['mapel_id', 'kelas', 'semester', 'nomor_tp'], 'targets_mapel_kelas_semester_tp_unique');
        });
    }

    public function down(): void
    {
        Schema::table('targets', function (Blueprint $table) {
            $table->dropUnique('targets_mapel_kelas_semester_tp_unique');
            $table->dropColumn('nomor_tp');
        });
    }
};
