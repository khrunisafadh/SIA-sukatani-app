<?php

namespace Database\Seeders;

use App\Models\DokumenMutasi;
use App\Models\PermohonanMutasi;
use App\Models\UnitRumah;
use App\Models\User;
use App\Models\Warga;
use App\Support\MutasiStatus;
use App\Support\MutasiType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class MutasiSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed 77 Unit Rumah (52 Milik Sendiri, 16 Kontrak, 9 Kosong -> 68 Terisi / 88% Occupancy)
        $bloks = [
            'Blok A1' => 15,
            'Blok A2' => 15,
            'Blok B1' => 15,
            'Blok B2' => 15,
            'Blok B3' => 8,
            'Blok C1' => 5,
            'Blok C2' => 4,
        ]; // Total: 15+15+15+15+8+5+4 = 77 units

        $allUnits = [];
        $totalCreated = 0;

        foreach ($bloks as $blokName => $count) {
            for ($i = 1; $i <= $count; $i++) {
                $nomorStr = sprintf('No. %02d', $i);
                $namaUnit = "{$blokName} {$nomorStr}";

                // Tentukan status: 9 unit kosong di Blok C1 dan C2
                $isKosong = ($blokName === 'Blok C1' && $i >= 3) || ($blokName === 'Blok C2' && $i >= 1);
                $isKontrak = ! $isKosong && ($blokName === 'Blok B3' || ($blokName === 'Blok B2' && $i > 7));

                $statusHunian = 'milik_sendiri';
                $namaPemilik = null;

                if ($isKosong) {
                    $statusHunian = 'kosong';
                } elseif ($isKontrak) {
                    $statusHunian = 'kontrak';
                    $namaPemilik = ($namaUnit === 'Blok B3 No. 12') ? 'Bpk. Hendro Sujarwo' : 'Bpk. Bambang Sutrisno';
                }

                if ($namaUnit === 'Blok B3 No. 12') {
                    $statusHunian = 'kontrak';
                    $namaPemilik = 'Bpk. Hendro Sujarwo';
                }

                $unit = UnitRumah::updateOrCreate(
                    ['blok' => $blokName, 'nomor' => $nomorStr],
                    [
                        'nama_unit' => $namaUnit,
                        'status_hunian' => $statusHunian,
                        'nama_pemilik' => $namaPemilik,
                        'kapasitas_kk' => 1,
                    ]
                );

                $allUnits[$namaUnit] = $unit;
                $totalCreated++;
            }
        }

        // Pastikan Unit Khusus ada
        $unitB312 = UnitRumah::updateOrCreate(
            ['blok' => 'Blok B3', 'nomor' => 'No. 12'],
            [
                'nama_unit' => 'Blok B3 No. 12',
                'status_hunian' => 'kontrak',
                'nama_pemilik' => 'Bpk. Hendro Sujarwo',
                'kapasitas_kk' => 1,
            ]
        );
        $allUnits['Blok B3 No. 12'] = $unitB312;

        $unitA104 = UnitRumah::updateOrCreate(
            ['blok' => 'Blok A1', 'nomor' => 'No. 04'],
            [
                'nama_unit' => 'Blok A1 No. 04',
                'status_hunian' => 'milik_sendiri',
                'nama_pemilik' => 'Agus Kurniawan',
                'kapasitas_kk' => 1,
            ]
        );
        $allUnits['Blok A1 No. 04'] = $unitA104;

        $unitC208 = UnitRumah::updateOrCreate(
            ['blok' => 'Blok C2', 'nomor' => 'No. 08'],
            [
                'nama_unit' => 'Blok C2 No. 08',
                'status_hunian' => 'kontrak',
                'nama_pemilik' => 'Ibu Ratna Juwita',
                'kapasitas_kk' => 1,
            ]
        );
        $allUnits['Blok C2 No. 08'] = $unitC208;

        $unitB102 = UnitRumah::updateOrCreate(
            ['blok' => 'Blok B1', 'nomor' => 'No. 02'],
            [
                'nama_unit' => 'Blok B1 No. 02',
                'status_hunian' => 'milik_sendiri',
                'nama_pemilik' => 'Rina Marlina',
                'kapasitas_kk' => 1,
            ]
        );
        $allUnits['Blok B1 No. 02'] = $unitB102;

        // 2. Seed Warga Referensi
        $wargaAgus = Warga::updateOrCreate(
            ['nik' => '3276812408890003'],
            [
                'no_kk' => '3276810204120008',
                'nama' => 'Agus Kurniawan',
                'jenis_kelamin' => 'L',
                'status_warga' => 'tetap',
                'unit_rumah_id' => $unitA104->id,
                'is_kepala_keluarga' => true,
                'telepon' => '0813-1122-3344',
            ]
        );

        $wargaAhmad = Warga::updateOrCreate(
            ['nik' => '3275840905820001'],
            [
                'no_kk' => '3275840106150004',
                'nama' => 'Ahmad Fauzi',
                'jenis_kelamin' => 'L',
                'status_warga' => 'kontrak',
                'unit_rumah_id' => $unitC208->id,
                'is_kepala_keluarga' => true,
                'telepon' => '0812-4455-6677',
            ]
        );

        $wargaRina = Warga::updateOrCreate(
            ['nik' => '3275894207960002'],
            [
                'no_kk' => '3275890209180006',
                'nama' => 'Rina Marlina',
                'jenis_kelamin' => 'P',
                'status_warga' => 'tetap',
                'unit_rumah_id' => $unitB102->id,
                'is_kepala_keluarga' => true,
                'telepon' => '0856-7890-1234',
            ]
        );

        // Cari user admin
        $adminUser = User::where('role', 'ketua_rt')->first();

        // 3. Permohonan Mutasi Sesuai 4 Data di Screenshot 1 & 2
        // Item 1: Budi Santoso (Menunggu Pemeriksaan) - Persis Screenshot 2
        $m1 = PermohonanMutasi::updateOrCreate(
            ['nomor_tiket' => 'PD-2025-0616-01'],
            [
                'jenis_mutasi' => MutasiType::DATANG,
                'nama_pemohon' => 'Budi Santoso',
                'nik_pemohon' => '3275081204910003',
                'no_kk' => '3275080102140005',
                'telepon' => '0812-9876-5432',
                'tanggal_rencana' => '2025-06-16',
                'alamat_asal' => 'Jl. Margonda Raya No. 45, RT 03 / RW 05, Kel. Pondok Cina, Kec. Beji, Kota Depok, Jawa Barat (16424)',
                'unit_rumah_id' => $unitB312->id,
                'unit_rumah_custom' => 'Blok B3 No. 12',
                'status_tinggal' => 'Kontrak / Sewa Tahunan',
                'nama_pemilik_rumah' => 'Bpk. Hendro Sujarwo',
                'rincian_pengikut' => [
                    [
                        'nama' => 'Siti Rahmawati',
                        'hubungan' => 'Istri',
                        'umur' => 30,
                        'nik' => '3275085409940002',
                    ],
                    [
                        'nama' => 'Rayhan Santoso',
                        'hubungan' => 'Anak',
                        'umur' => 4,
                        'nik' => '3275082103210001',
                    ],
                ],
                'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
                'checklist_alamat' => true,
                'checklist_nik' => true,
                'checklist_dokumen' => false,
                'catatan_pemeriksaan' => 'Rumah Blok B3 No. 12 telah dikonfirmasi kosong & disewakan oleh pemilik rumah (Bpk. Hendro).',
                'created_at' => Carbon::parse('2025-06-16 08:30:00'),
                'last_activity_at' => Carbon::parse('2025-06-16 08:30:00'),
            ]
        );

        // Dokumen untuk Item 1
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $m1->id, 'jenis_dokumen' => 'ktp'],
            [
                'nama_dokumen' => 'Foto e-KTP Pemohon',
                'file_path' => 'dokumen_mutasi/ktp_budi_santoso.svg',
                'file_name' => 'eKTP_BudiSantoso.jpg',
                'file_size' => 1887436,
                'file_size_label' => '1.8 MB',
                'mime_type' => 'image/svg+xml',
                'status_pemeriksaan' => 'valid',
                'keterangan_tambahan' => 'Terenkripsi',
            ]
        );

        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $m1->id, 'jenis_dokumen' => 'kk'],
            [
                'nama_dokumen' => 'Kartu Keluarga (KK)',
                'file_path' => 'dokumen_mutasi/kk_budi_santoso.svg',
                'file_name' => 'KartuKeluarga_Terbaru.pdf',
                'file_size' => 2516582,
                'file_size_label' => '2.4 MB',
                'mime_type' => 'image/svg+xml',
                'status_pemeriksaan' => 'valid',
                'keterangan_tambahan' => 'Resolusi Tinggi',
            ]
        );

        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $m1->id, 'jenis_dokumen' => 'skpwni'],
            [
                'nama_dokumen' => 'Surat Pengantar Pindah Asal (SKPWNI)',
                'file_path' => 'dokumen_mutasi/skpwni_budi_santoso.svg',
                'file_name' => 'SKPWNI_BudiSantoso.pdf',
                'file_size' => 1258291,
                'file_size_label' => '1.2 MB',
                'mime_type' => 'image/svg+xml',
                'status_pemeriksaan' => 'valid',
                'keterangan_tambahan' => 'No: 471.2/108/Kel.PC/2025',
            ]
        );

        // Item 2: Agus Kurniawan (Sedang Diperiksa)
        $m2 = PermohonanMutasi::updateOrCreate(
            ['nomor_tiket' => 'PD-2025-0613-02'],
            [
                'warga_id' => $wargaAgus->id,
                'jenis_mutasi' => MutasiType::PINDAH,
                'nama_pemohon' => 'Agus Kurniawan',
                'nik_pemohon' => '3276812408890003',
                'no_kk' => '3276810204120008',
                'telepon' => '0813-1122-3344',
                'tanggal_rencana' => '2025-06-20',
                'alamat_asal' => 'RT 01 / RW 08 Sukatani, Blok A1 No. 04',
                'alamat_tujuan' => 'Jl. Melati No. 10, RT 02 / RW 03, Kel. Sukamaju, Kec. Cilodong, Kota Depok',
                'unit_rumah_id' => $unitA104->id,
                'unit_rumah_custom' => 'Blok A1 No. 04',
                'status_tinggal' => 'Milik Sendiri',
                'status' => MutasiStatus::SEDANG_DIPERIKSA,
                'checklist_alamat' => true,
                'checklist_nik' => true,
                'checklist_dokumen' => true,
                'created_at' => Carbon::parse('2025-06-13 14:15:00'),
                'last_activity_at' => Carbon::parse('2025-06-13 14:15:00'),
            ]
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $m2->id, 'jenis_dokumen' => 'ktp'],
            [
                'nama_dokumen' => 'Foto e-KTP Pemohon',
                'file_path' => 'dokumen_mutasi/ktp_budi_santoso.svg',
                'file_name' => 'eKTP_Agus.jpg',
                'file_size_label' => '1.5 MB',
                'status_pemeriksaan' => 'valid',
            ]
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $m2->id, 'jenis_dokumen' => 'kk'],
            [
                'nama_dokumen' => 'Kartu Keluarga (KK)',
                'file_path' => 'dokumen_mutasi/kk_budi_santoso.svg',
                'file_name' => 'KK_Agus.pdf',
                'file_size_label' => '2.1 MB',
                'status_pemeriksaan' => 'valid',
            ]
        );

        // Item 3: Ahmad Fauzi (Perlu Revisi)
        $m3 = PermohonanMutasi::updateOrCreate(
            ['nomor_tiket' => 'PD-2025-0528-03'],
            [
                'warga_id' => $wargaAhmad->id,
                'jenis_mutasi' => MutasiType::PINDAH,
                'nama_pemohon' => 'Ahmad Fauzi',
                'nik_pemohon' => '3275840905820001',
                'no_kk' => '3275840106150004',
                'telepon' => '0812-4455-6677',
                'tanggal_rencana' => '2025-06-01',
                'alamat_asal' => 'RT 01 / RW 08 Sukatani, Blok C2 No. 08',
                'alamat_tujuan' => 'Perumahan Grand Depok City, Sektor Melati Blok F4 No. 12',
                'unit_rumah_id' => $unitC208->id,
                'unit_rumah_custom' => 'Blok C2 No. 08',
                'status_tinggal' => 'Kontrak',
                'status' => MutasiStatus::PERLU_REVISI,
                'checklist_alamat' => true,
                'checklist_nik' => false,
                'checklist_dokumen' => false,
                'alasan_revisi' => 'Foto KK Blur / tidak terbaca jelas. Mohon unggah ulang foto Kartu Keluarga asli dengan pencahayaan terang.',
                'catatan_pemeriksaan' => 'Koreksi warga: Menunggu perbaikan berkas foto KK.',
                'created_at' => Carbon::parse('2025-05-28 11:20:00'),
                'last_activity_at' => Carbon::parse('2025-05-28 11:20:00'),
            ]
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $m3->id, 'jenis_dokumen' => 'ktp'],
            [
                'nama_dokumen' => 'Foto e-KTP Pemohon',
                'file_path' => 'dokumen_mutasi/ktp_budi_santoso.svg',
                'file_name' => 'eKTP_Ahmad.jpg',
                'file_size_label' => '1.2 MB',
                'status_pemeriksaan' => 'valid',
            ]
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $m3->id, 'jenis_dokumen' => 'kk'],
            [
                'nama_dokumen' => 'Kartu Keluarga (KK)',
                'file_path' => 'dokumen_mutasi/kk_budi_santoso.svg',
                'file_name' => 'KK_Ahmad_Blur.jpg',
                'file_size_label' => '0.8 MB',
                'status_pemeriksaan' => 'buram',
                'keterangan_tambahan' => 'Foto KK Blur',
            ]
        );

        // Item 4: Rina Marlina (Selesai / Terdaftar)
        $m4 = PermohonanMutasi::updateOrCreate(
            ['nomor_tiket' => 'PD-2025-0614-04'],
            [
                'warga_id' => $wargaRina->id,
                'jenis_mutasi' => MutasiType::DATANG,
                'nama_pemohon' => 'Rina Marlina',
                'nik_pemohon' => '3275894207960002',
                'no_kk' => '3275890209180006',
                'telepon' => '0856-7890-1234',
                'tanggal_rencana' => '2025-06-15',
                'alamat_asal' => 'Jl. Kejayaan No. 12, RT 04 / RW 01, Sukmajaya, Depok',
                'unit_rumah_id' => $unitB102->id,
                'unit_rumah_custom' => 'Blok B1 No. 02',
                'status_tinggal' => 'Milik Sendiri',
                'status' => MutasiStatus::SELESAI,
                'checklist_alamat' => true,
                'checklist_nik' => true,
                'checklist_dokumen' => true,
                'diverifikasi_oleh' => $adminUser?->id,
                'diverifikasi_pada' => Carbon::parse('2025-06-14 17:00:00'),
                'created_at' => Carbon::parse('2025-06-14 16:45:00'),
                'last_activity_at' => Carbon::parse('2025-06-14 17:00:00'),
            ]
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $m4->id, 'jenis_dokumen' => 'ktp'],
            [
                'nama_dokumen' => 'Foto e-KTP Pemohon',
                'file_path' => 'dokumen_mutasi/ktp_budi_santoso.svg',
                'file_name' => 'eKTP_Rina.jpg',
                'file_size_label' => '1.7 MB',
                'status_pemeriksaan' => 'valid',
            ]
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $m4->id, 'jenis_dokumen' => 'kk'],
            [
                'nama_dokumen' => 'Kartu Keluarga (KK)',
                'file_path' => 'dokumen_mutasi/kk_budi_santoso.svg',
                'file_name' => 'KK_Rina.pdf',
                'file_size_label' => '2.0 MB',
                'status_pemeriksaan' => 'valid',
            ]
        );

        // Tambahan data agar total per status sesuai tab & KPI:
        // Menunggu Pemeriksaan: 3 (m1 + 2 lagi)
        $mWaiting2 = PermohonanMutasi::updateOrCreate(
            ['nomor_tiket' => 'PD-2025-0616-05'],
            [
                'jenis_mutasi' => MutasiType::DATANG,
                'nama_pemohon' => 'Dewi Lestari',
                'nik_pemohon' => '3275084501930007',
                'no_kk' => '3275080209150001',
                'telepon' => '0812-3344-5566',
                'tanggal_rencana' => '2025-06-18',
                'alamat_asal' => 'Jl. Kemuning No. 5, Pancoran Mas, Depok',
                'unit_rumah_custom' => 'Blok A2 No. 05',
                'status_tinggal' => 'Kontrak / Sewa Tahunan',
                'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
                'created_at' => Carbon::parse('2025-06-16 09:10:00'),
                'last_activity_at' => Carbon::parse('2025-06-16 09:10:00'),
            ]
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $mWaiting2->id, 'jenis_dokumen' => 'ktp'],
            ['nama_dokumen' => 'Foto e-KTP Pemohon', 'file_path' => 'dokumen_mutasi/ktp_budi_santoso.svg', 'file_name' => 'KTP_Dewi.jpg', 'file_size_label' => '1.4 MB', 'status_pemeriksaan' => 'belum_diperiksa']
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $mWaiting2->id, 'jenis_dokumen' => 'kk'],
            ['nama_dokumen' => 'Kartu Keluarga', 'file_path' => 'dokumen_mutasi/kk_budi_santoso.svg', 'file_name' => 'KK_Dewi.pdf', 'file_size_label' => '2.2 MB', 'status_pemeriksaan' => 'belum_diperiksa']
        );

        $mWaiting3 = PermohonanMutasi::updateOrCreate(
            ['nomor_tiket' => 'PD-2025-0615-06'],
            [
                'jenis_mutasi' => MutasiType::PINDAH,
                'nama_pemohon' => 'Bambang Trihatmodjo',
                'nik_pemohon' => '3275081108850002',
                'no_kk' => '3275080203110009',
                'telepon' => '0813-7788-9900',
                'tanggal_rencana' => '2025-06-25',
                'alamat_asal' => 'RT 01 / RW 08 Sukatani, Blok B2 No. 03',
                'alamat_tujuan' => 'Jl. Raya Bogor KM 31, Cimanggis, Depok',
                'unit_rumah_custom' => 'Blok B2 No. 03',
                'status_tinggal' => 'Milik Sendiri',
                'status' => MutasiStatus::MENUNGGU_PEMERIKSAAN,
                'created_at' => Carbon::parse('2025-06-15 16:00:00'),
                'last_activity_at' => Carbon::parse('2025-06-15 16:00:00'),
            ]
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $mWaiting3->id, 'jenis_dokumen' => 'ktp'],
            ['nama_dokumen' => 'Foto e-KTP', 'file_path' => 'dokumen_mutasi/ktp_budi_santoso.svg', 'file_name' => 'KTP_Bambang.jpg', 'file_size_label' => '1.6 MB', 'status_pemeriksaan' => 'belum_diperiksa']
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $mWaiting3->id, 'jenis_dokumen' => 'kk'],
            ['nama_dokumen' => 'Kartu Keluarga', 'file_path' => 'dokumen_mutasi/kk_budi_santoso.svg', 'file_name' => 'KK_Bambang.pdf', 'file_size_label' => '1.9 MB', 'status_pemeriksaan' => 'belum_diperiksa']
        );

        // Sedang Diperiksa: 2 (m2 + 1 lagi)
        $mReview2 = PermohonanMutasi::updateOrCreate(
            ['nomor_tiket' => 'PD-2025-0612-07'],
            [
                'jenis_mutasi' => MutasiType::DATANG,
                'nama_pemohon' => 'Farhan Alamsyah',
                'nik_pemohon' => '3275081907920004',
                'no_kk' => '3275080108160003',
                'telepon' => '0878-1234-5678',
                'tanggal_rencana' => '2025-06-17',
                'alamat_asal' => 'Jl. Raya Sawangan No. 8, Depok',
                'unit_rumah_custom' => 'Blok A1 No. 09',
                'status_tinggal' => 'Kontrak / Sewa Tahunan',
                'status' => MutasiStatus::SEDANG_DIPERIKSA,
                'checklist_alamat' => true,
                'checklist_nik' => true,
                'checklist_dokumen' => false,
                'created_at' => Carbon::parse('2025-06-12 10:30:00'),
                'last_activity_at' => Carbon::parse('2025-06-12 10:30:00'),
            ]
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $mReview2->id, 'jenis_dokumen' => 'ktp'],
            ['nama_dokumen' => 'Foto e-KTP', 'file_path' => 'dokumen_mutasi/ktp_budi_santoso.svg', 'file_name' => 'KTP_Farhan.jpg', 'file_size_label' => '1.5 MB', 'status_pemeriksaan' => 'valid']
        );
        DokumenMutasi::updateOrCreate(
            ['permohonan_mutasi_id' => $mReview2->id, 'jenis_dokumen' => 'kk'],
            ['nama_dokumen' => 'Kartu Keluarga', 'file_path' => 'dokumen_mutasi/kk_budi_santoso.svg', 'file_name' => 'KK_Farhan.pdf', 'file_size_label' => '2.3 MB', 'status_pemeriksaan' => 'belum_diperiksa']
        );

        // Selesai / Terverifikasi: 18 (m4 + 17 lagi di bulan berjalan)
        for ($k = 5; $k <= 21; $k++) {
            $namaSample = "Warga Sukatani {$k}";
            $nikSample = sprintf('327508%02d%02d%04d', rand(10, 28), rand(1, 12), rand(1000, 9999));
            $noKkSample = sprintf('32750801%02d%04d', rand(1, 12), rand(1000, 9999));
            $tiketSample = sprintf('PD-2025-06%02d-%02d', rand(1, 14), $k + 3);

            $mSelesai = PermohonanMutasi::updateOrCreate(
                ['nomor_tiket' => $tiketSample],
                [
                    'jenis_mutasi' => ($k % 2 === 0) ? MutasiType::DATANG : MutasiType::PINDAH,
                    'nama_pemohon' => $namaSample,
                    'nik_pemohon' => $nikSample,
                    'no_kk' => $noKkSample,
                    'telepon' => '0812-0000-'.sprintf('%04d', $k),
                    'tanggal_rencana' => '2025-06-'.sprintf('%02d', rand(1, 15)),
                    'alamat_asal' => 'Jl. Kenanga No. '.rand(1, 50).', Depok',
                    'unit_rumah_custom' => 'Blok B2 No. '.sprintf('%02d', rand(1, 15)),
                    'status_tinggal' => ($k % 3 === 0) ? 'Kontrak' : 'Milik Sendiri',
                    'status' => MutasiStatus::SELESAI,
                    'checklist_alamat' => true,
                    'checklist_nik' => true,
                    'checklist_dokumen' => true,
                    'diverifikasi_oleh' => $adminUser?->id,
                    'diverifikasi_pada' => Carbon::parse('2025-06-'.rand(10, 14).' '.rand(10, 18).':00:00'),
                    'created_at' => Carbon::parse('2025-06-'.rand(1, 9).' '.rand(8, 16).':00:00'),
                    'last_activity_at' => Carbon::parse('2025-06-14 18:00:00'),
                ]
            );

            DokumenMutasi::updateOrCreate(
                ['permohonan_mutasi_id' => $mSelesai->id, 'jenis_dokumen' => 'ktp'],
                ['nama_dokumen' => 'Foto e-KTP', 'file_path' => 'dokumen_mutasi/ktp_budi_santoso.svg', 'file_name' => "KTP_{$k}.jpg", 'file_size_label' => '1.5 MB', 'status_pemeriksaan' => 'valid']
            );
            DokumenMutasi::updateOrCreate(
                ['permohonan_mutasi_id' => $mSelesai->id, 'jenis_dokumen' => 'kk'],
                ['nama_dokumen' => 'Kartu Keluarga', 'file_path' => 'dokumen_mutasi/kk_budi_santoso.svg', 'file_name' => "KK_{$k}.pdf", 'file_size_label' => '2.1 MB', 'status_pemeriksaan' => 'valid']
            );
        }
    }
}
