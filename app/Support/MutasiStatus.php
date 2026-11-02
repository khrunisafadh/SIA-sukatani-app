<?php

namespace App\Support;

class MutasiStatus
{
    public const MENUNGGU_PEMERIKSAAN = 'menunggu_pemeriksaan';

    public const SEDANG_DIPERIKSA = 'sedang_diperiksa';

    public const PERLU_REVISI = 'perlu_revisi';

    public const SELESAI = 'selesai';

    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [
            self::MENUNGGU_PEMERIKSAAN,
            self::SEDANG_DIPERIKSA,
            self::PERLU_REVISI,
            self::SELESAI,
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            self::MENUNGGU_PEMERIKSAAN => 'Menunggu Pemeriksaan',
            self::SEDANG_DIPERIKSA => 'Dokumen Diperiksa',
            self::PERLU_REVISI => 'Perlu Revisi',
            self::SELESAI => 'Selesai / Terdaftar',
        ];
    }

    public static function label(string $status): string
    {
        return self::labels()[$status] ?? $status;
    }
}
