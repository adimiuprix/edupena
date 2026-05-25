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
        Schema::table('teachers', function (Blueprint $table) {
            $table->enum('jenis_guru', ['Guru Mapel', 'Wali Kelas'])->default('Guru Mapel')->after('nip');
            $table->foreignId('rombel_id')->nullable()->after('mapel_id')->constrained('rombels')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropForeign(['rombel_id']);
            $table->dropColumn(['jenis_guru', 'rombel_id']);
        });
    }
};
