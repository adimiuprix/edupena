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
        Schema::create('targets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mapel_id')->nullable()->references('id')->on('mapels')->onDelete('cascade');
            $table->enum('kelas',['1','2','3','4','5','6'])->nullable();
            $table->enum('semester',['ganjil','genap'])->nullable();
            $table->text('deskripsi_target_pencapaian')->nullable();
            $table->integer('jumlah_karakter')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('targets');
    }
};
