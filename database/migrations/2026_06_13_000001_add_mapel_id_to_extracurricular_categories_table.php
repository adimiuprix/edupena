<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('extracurricular_categories', function (Blueprint $table) {
            // Relasi eksplisit ke mapel — menggantikan matching berbasis nama string
            $table->foreignId('mapel_id')
                ->nullable()
                ->after('jenis')
                ->constrained('mapels')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('extracurricular_categories', function (Blueprint $table) {
            $table->dropConstrainedForeignId('mapel_id');
        });
    }
};
