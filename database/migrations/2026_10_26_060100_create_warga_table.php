<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warga', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('nik', 16)->unique();
            $table->string('no_kk', 16)->index();
            $table->string('nama');
            $table->string('jenis_kelamin', 1)->default('L'); // L/P
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('agama')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->string('status_perkawinan')->nullable();
            $table->string('telepon')->nullable();
            $table->string('status_warga')->default('tetap'); // tetap, kontrak, pindah
            $table->foreignId('unit_rumah_id')->nullable()->constrained('unit_rumah')->nullOnDelete();
            $table->text('alamat_ktp')->nullable();
            $table->boolean('is_kepala_keluarga')->default(false);
            $table->string('hubungan_keluarga')->nullable(); // Kepala Keluarga, Istri, Anak, dll
            $table->timestamps();

            $table->index(['status_warga', 'unit_rumah_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warga');
    }
};
