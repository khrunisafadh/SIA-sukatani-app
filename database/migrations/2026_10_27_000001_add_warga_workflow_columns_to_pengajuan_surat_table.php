<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengajuan_surat', function (Blueprint $table) {
            $table->string('nomor_surat')->nullable()->unique()->after('nomor');
            $table->string('keperluan')->nullable()->change();
            $table->json('data_surat')->nullable()->after('keterangan');
            $table->foreignId('verified_by')->nullable()->after('pdf_path')->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable()->after('verified_by');
            $table->foreignId('rt_confirmed_by')->nullable()->after('completed_by')->constrained('users')->nullOnDelete();
            $table->timestamp('rt_confirmed_at')->nullable()->after('rt_confirmed_by');
            $table->foreignId('rw_confirmed_by')->nullable()->after('rt_confirmed_at')->constrained('users')->nullOnDelete();
            $table->timestamp('rw_confirmed_at')->nullable()->after('rw_confirmed_by');
        });
    }

    public function down(): void
    {
        Schema::table('pengajuan_surat', function (Blueprint $table) {
            $table->dropForeign(['verified_by']);
            $table->dropForeign(['rt_confirmed_by']);
            $table->dropForeign(['rw_confirmed_by']);
            $table->dropColumn([
                'nomor_surat',
                'data_surat',
                'verified_by',
                'verified_at',
                'rt_confirmed_by',
                'rt_confirmed_at',
                'rw_confirmed_by',
                'rw_confirmed_at',
            ]);
        });
    }
};
