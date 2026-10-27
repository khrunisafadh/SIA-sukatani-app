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
        Schema::create('wargas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            
            // 1. Identitas Kependudukan
            $table->string('nik', 16)->unique();
            $table->string('no_kk', 16);
            $table->string('nama_lengkap');
            $table->enum('gender', ['L', 'P'])->default('L');
            $table->string('tempat_lahir');
            $table->date('tgl_lahir');
            $table->string('agama')->default('Islam');
            $table->string('goldar')->nullable(); // O, A, B, AB, Tidak Tahu
            $table->string('shdk')->default('Kepala Keluarga'); // Status Hubungan Keluarga

            // 2. Alamat & Status Hunian
            $table->string('nama_jalan')->default('Jl. Mawar'); // Nama Jalan / Gang
            $table->string('blok_rumah')->nullable(); // tetap ada untuk backward compatibility
            $table->string('nomor_rumah'); // contoh: No. 12
            $table->string('detail_alamat')->nullable(); // Detail Alamat (Opsional)
            $table->string('alamat_lengkap')->nullable();
            $table->string('status_domisili')->default('Warga Tetap (Pemilik Rumah)');
            $table->string('no_wa')->nullable();
            $table->string('pekerjaan')->nullable();
            
            // Status Administrasi
            $table->enum('status_administrasi', ['Aktif', 'Verifikasi', 'Nonaktif'])->default('Aktif');

            // 3. Dokumen Pendukung (File Path)
            $table->string('foto_ktp')->nullable();
            $table->string('foto_kk')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wargas');
    }
};
