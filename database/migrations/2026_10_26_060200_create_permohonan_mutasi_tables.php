<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permohonan_mutasi', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_tiket')->unique(); // e.g. PD-2025-0616-01
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('warga_id')->nullable()->constrained('warga')->nullOnDelete();
            $table->string('jenis_mutasi'); // datang, pindah
            $table->string('nama_pemohon');
            $table->string('nik_pemohon', 16);
            $table->string('no_kk', 16);
            $table->string('telepon')->nullable();
            $table->date('tanggal_rencana');
            $table->text('alamat_asal');
            $table->text('alamat_tujuan')->nullable();
            $table->foreignId('unit_rumah_id')->nullable()->constrained('unit_rumah')->nullOnDelete();
            $table->string('unit_rumah_custom')->nullable();
            $table->string('status_tinggal')->nullable(); // Kontrak / Sewa Tahunan, Milik Sendiri, dll
            $table->string('nama_pemilik_rumah')->nullable();
            $table->json('rincian_pengikut')->nullable();
            $table->string('status')->default('menunggu_pemeriksaan'); // menunggu_pemeriksaan, sedang_diperiksa, perlu_revisi, selesai
            $table->boolean('checklist_alamat')->default(false);
            $table->boolean('checklist_nik')->default(false);
            $table->boolean('checklist_dokumen')->default(false);
            $table->text('catatan_pemeriksaan')->nullable();
            $table->text('alasan_revisi')->nullable();
            $table->foreignId('diverifikasi_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('diverifikasi_pada')->nullable();
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'jenis_mutasi']);
            $table->index('created_at');
        });

        Schema::create('dokumen_mutasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permohonan_mutasi_id')->constrained('permohonan_mutasi')->cascadeOnDelete();
            $table->string('jenis_dokumen'); // ktp, kk, skpwni, lainnya
            $table->string('nama_dokumen');
            $table->string('file_path');
            $table->string('file_name');
            $table->unsignedInteger('file_size')->nullable();
            $table->string('file_size_label')->nullable();
            $table->string('mime_type')->nullable();
            $table->string('status_pemeriksaan')->default('belum_diperiksa'); // belum_diperiksa, valid, buram
            $table->string('keterangan_tambahan')->nullable();
            $table->timestamps();

            $table->index(['permohonan_mutasi_id', 'jenis_dokumen']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dokumen_mutasi');
        Schema::dropIfExists('permohonan_mutasi');
    }
};
