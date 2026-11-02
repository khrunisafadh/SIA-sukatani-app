<?php

namespace Database\Seeders;

use App\Models\TransaksiKas;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransaksiKasSeeder extends Seeder
{
    public function run(): void
    {
        $bendahara = User::where('role', 'bendahara')->first();

        $data = [
            // Januari 2025
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-01-10',
                'keterangan' => 'Iuran kas bulanan warga (Januari)',
                'kategori' => 'Iuran Warga',
                'jenis' => 'pemasukan',
                'nominal' => 1500000,
                'created_by' => $bendahara?->id,
            ],
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-01-16',
                'keterangan' => 'Pengadaan sapu lidi, tempat sampah, dan serokan',
                'kategori' => 'Operasional & Kebersihan',
                'jenis' => 'pengeluaran',
                'nominal' => 350000,
                'created_by' => $bendahara?->id,
            ],

            // Februari 2025
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-02-10',
                'keterangan' => 'Iuran kas bulanan warga (Februari)',
                'kategori' => 'Iuran Warga',
                'jenis' => 'pemasukan',
                'nominal' => 1900000,
                'created_by' => $bendahara?->id,
            ],
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-02-20',
                'keterangan' => 'Penggantian lampu penerangan pos ronda & gang',
                'kategori' => 'Perawatan Fasilitas',
                'jenis' => 'pengeluaran',
                'nominal' => 450000,
                'created_by' => $bendahara?->id,
            ],

            // Maret 2025
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-03-10',
                'keterangan' => 'Iuran kas bulanan warga (Maret)',
                'kategori' => 'Iuran Warga',
                'jenis' => 'pemasukan',
                'nominal' => 2100000,
                'created_by' => $bendahara?->id,
            ],
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-03-23',
                'keterangan' => 'Snack dan konsumsi kerja bakti saluran air',
                'kategori' => 'Kegiatan Warga',
                'jenis' => 'pengeluaran',
                'nominal' => 500000,
                'created_by' => $bendahara?->id,
            ],

            // April 2025
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-04-10',
                'keterangan' => 'Iuran kas bulanan warga (April)',
                'kategori' => 'Iuran Warga',
                'jenis' => 'pemasukan',
                'nominal' => 1950000,
                'created_by' => $bendahara?->id,
            ],
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-04-18',
                'keterangan' => 'Perbaikan engsel gerbang portal & cat pembatas',
                'kategori' => 'Perawatan Fasilitas',
                'jenis' => 'pengeluaran',
                'nominal' => 550000,
                'created_by' => $bendahara?->id,
            ],

            // Mei 2025
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-05-10',
                'keterangan' => 'Iuran kas bulanan warga (Mei)',
                'kategori' => 'Iuran Warga',
                'jenis' => 'pemasukan',
                'nominal' => 2300000,
                'created_by' => $bendahara?->id,
            ],
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-05-22',
                'keterangan' => 'Upah petugas pembersihan drainase sedimen tanah',
                'kategori' => 'Operasional & Kebersihan',
                'jenis' => 'pengeluaran',
                'nominal' => 480000,
                'created_by' => $bendahara?->id,
            ],

            // Juni 2025
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-06-05',
                'keterangan' => 'Donasi sukarela kegiatan sosial warga',
                'kategori' => 'Sosial & Dana Darurat',
                'jenis' => 'pemasukan',
                'nominal' => 250000,
                'created_by' => $bendahara?->id,
            ],
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-06-18',
                'keterangan' => 'Perawatan fasilitas lingkungan',
                'kategori' => 'Perawatan Fasilitas',
                'jenis' => 'pengeluaran',
                'nominal' => 350000,
                'created_by' => $bendahara?->id,
            ],
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-06-24',
                'keterangan' => 'Kebutuhan kebersihan lingkungan',
                'kategori' => 'Operasional & Kebersihan',
                'jenis' => 'pengeluaran',
                'nominal' => 450000,
                'created_by' => $bendahara?->id,
            ],
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-06-25',
                'keterangan' => 'Pengadaan cermin tikungan gang RT 01',
                'kategori' => 'Perawatan Fasilitas',
                'jenis' => 'pengeluaran',
                'nominal' => 620000,
                'created_by' => $bendahara?->id,
            ],
            [
                'periode' => 'Januari–Juni 2025',
                'tanggal' => '2025-06-28',
                'keterangan' => 'Iuran warga bulan Juni',
                'kategori' => 'Iuran Warga',
                'jenis' => 'pemasukan',
                'nominal' => 2500000,
                'created_by' => $bendahara?->id,
            ],
        ];

        foreach ($data as $item) {
            TransaksiKas::updateOrCreate(
                [
                    'periode' => $item['periode'],
                    'tanggal' => $item['tanggal'],
                    'keterangan' => $item['keterangan'],
                ],
                $item
            );
        }
    }
}
