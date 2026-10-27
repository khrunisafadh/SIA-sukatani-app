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
            $table->string('nama')->nullable();
            $table->string('nama_lengkap')->nullable();
            $table->string('jenis_kelamin', 1)->default('L'); // L/P
            $table->string('gender', 1)->default('L');
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->string('agama')->nullable()->default('Islam');
            $table->string('goldar')->nullable();
            $table->string('shdk')->nullable()->default('Kepala Keluarga');
            $table->string('nama_jalan')->nullable()->default('Jl. Mawar');
            $table->string('blok_rumah')->nullable();
            $table->string('nomor_rumah')->nullable();
            $table->string('detail_alamat')->nullable();
            $table->string('alamat_lengkap')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->string('status_perkawinan')->nullable();
            $table->string('telepon')->nullable();
            $table->string('no_wa')->nullable();
            $table->string('status_warga')->default('tetap'); // tetap, kontrak, pindah
            $table->string('status_domisili')->nullable()->default('Warga Tetap (Pemilik Rumah)');
            $table->string('status_administrasi')->default('Aktif');
            $table->foreignId('unit_rumah_id')->nullable()->constrained('unit_rumah')->nullOnDelete();
            $table->text('alamat_ktp')->nullable();
            $table->boolean('is_kepala_keluarga')->default(false);
            $table->string('hubungan_keluarga')->nullable(); // Kepala Keluarga, Istri, Anak, dll
            $table->string('foto_ktp')->nullable();
            $table->string('foto_kk')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status_warga', 'unit_rumah_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warga');
    }
};
