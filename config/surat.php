<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Kontak WhatsApp Pengurus RT / RW
    |--------------------------------------------------------------------------
    |
    | Nomor kontak dummy sementara sesuai spesifikasi PRD & Design:
    | Ketua RT: 081311112222 -> 6281311112222
    | Ketua RW: 082133334444 -> 6282133334444
    | Layanan Bantuan RT 01: +62 812-9876-5432
    |
    */
    'whatsapp_rt' => env('SURAT_WA_RT', '6281311112222'),
    'whatsapp_rw' => env('SURAT_WA_RW', '6282133334444'),
    'whatsapp_help' => env('SURAT_WA_HELP', '6281298765432'),
    'whatsapp_help_display' => env('SURAT_WA_HELP_DISPLAY', '+62 812-9876-5432'),

    'rt_lead_name' => env('SURAT_RT_LEAD_NAME', 'Pak Kiming Yuliadi'),
    'jam_pelayanan' => env('SURAT_JAM_PELAYANAN', '19.00 - 21.00 WIB'),
    'balai_warga' => env('SURAT_BALAI_WARGA', 'Balai Warga Sukatani'),

    /*
    |--------------------------------------------------------------------------
    | Nama Pejabat Pengesahan Fisik (Sesuai 6 PDF Template)
    |--------------------------------------------------------------------------
    */
    'pejabat_rw' => env('SURAT_PEJABAT_RW', 'NAMIN'),
    'pejabat_rt' => env('SURAT_PEJABAT_RT', 'JAYADI'),

    /*
    |--------------------------------------------------------------------------
    | Path Gambar KOP Surat RT 01
    |--------------------------------------------------------------------------
    */
    'kop_path' => env('SURAT_KOP_PATH', public_path('images/kop-surat-rt01.png')),
];
