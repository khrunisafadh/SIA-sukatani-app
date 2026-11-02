<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unit_rumah', function (Blueprint $table) {
            $table->id();
            $table->string('blok'); // e.g. 'Blok B3'
            $table->string('nomor'); // e.g. 'No. 12'
            $table->string('nama_unit')->index(); // e.g. 'Blok B3 No. 12'
            $table->string('status_hunian')->default('kosong'); // milik_sendiri, kontrak, kosong
            $table->string('nama_pemilik')->nullable(); // e.g. 'Bpk. Hendro Sujarwo'
            $table->string('telepon_pemilik')->nullable();
            $table->unsignedInteger('kapasitas_kk')->default(1);
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->unique(['blok', 'nomor']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unit_rumah');
    }
};
