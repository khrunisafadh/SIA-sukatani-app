<?php

namespace App\Support;

class LetterType
{
    // 6 Jenis Surat Final (POV Warga)
    public const KEMATIAN = 'kematian';
    public const TEMPAT_TINGGAL = 'tempat_tinggal';
    public const KETERANGAN = 'keterangan';
    public const BELUM_MENIKAH = 'belum_menikah';
    public const TIDAK_BEKERJA = 'tidak_bekerja';
    public const TIDAK_MAMPU = 'tidak_mampu';

    // Legacy types untuk kompatibilitas data / test lama
    public const PENGANTAR = 'pengantar';
    public const DOMISILI = 'domisili';

    /**
     * 6 jenis surat resmi yang dapat diajukan oleh Warga.
     *
     * @return array<int, string>
     */
    public static function wargaTypes(): array
    {
        return [
            self::KEMATIAN,
            self::TEMPAT_TINGGAL,
            self::KETERANGAN,
            self::BELUM_MENIKAH,
            self::TIDAK_BEKERJA,
            self::TIDAK_MAMPU,
        ];
    }

    /**
     * Seluruh tipe surat (termasuk legacy).
     *
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [
            self::KEMATIAN,
            self::TEMPAT_TINGGAL,
            self::KETERANGAN,
            self::BELUM_MENIKAH,
            self::TIDAK_BEKERJA,
            self::TIDAK_MAMPU,
            self::PENGANTAR,
            self::DOMISILI,
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            self::KEMATIAN => 'Surat Keterangan Kematian',
            self::TEMPAT_TINGGAL => 'Surat Keterangan Tempat Tinggal',
            self::KETERANGAN => 'Surat Keterangan',
            self::BELUM_MENIKAH => 'Surat Pernyataan Belum Menikah',
            self::TIDAK_BEKERJA => 'Surat Pernyataan Tidak Bekerja',
            self::TIDAK_MAMPU => 'Surat Pernyataan Tidak Mampu',
            self::PENGANTAR => 'Surat Pengantar',
            self::DOMISILI => 'Surat Keterangan Domisili',
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function wargaLabels(): array
    {
        return [
            self::KEMATIAN => 'Surat Keterangan Kematian',
            self::TEMPAT_TINGGAL => 'Surat Keterangan Tempat Tinggal',
            self::KETERANGAN => 'Surat Keterangan',
            self::BELUM_MENIKAH => 'Surat Pernyataan Belum Menikah',
            self::TIDAK_BEKERJA => 'Surat Pernyataan Tidak Bekerja',
            self::TIDAK_MAMPU => 'Surat Pernyataan Tidak Mampu',
        ];
    }

    public static function label(string $type): string
    {
        return self::labels()[$type] ?? $type;
    }

    /**
     * 3 Surat Keterangan yang menggunakan KOP surat dan nomor surat resmi.
     */
    public static function isKeterangan(string $type): bool
    {
        return in_array($type, [
            self::KEMATIAN,
            self::TEMPAT_TINGGAL,
            self::KETERANGAN,
            self::PENGANTAR,
            self::DOMISILI,
        ], true);
    }

    /**
     * 3 Surat Pernyataan yang TIDAK menggunakan KOP surat dan TIDAK menggunakan nomor surat resmi.
     */
    public static function isPernyataan(string $type): bool
    {
        return in_array($type, [
            self::BELUM_MENIKAH,
            self::TIDAK_BEKERJA,
            self::TIDAK_MAMPU,
        ], true);
    }

    /**
     * Apakah jenis surat memerlukan KOP surat dalam PDF.
     */
    public static function hasKop(string $type): bool
    {
        return self::isKeterangan($type);
    }

    /**
     * Apakah jenis surat mendapatkan nomor surat resmi saat Terbit.
     */
    public static function needsOfficialNumber(string $type): bool
    {
        return self::isKeterangan($type);
    }

    public static function filenamePrefix(string $type): string
    {
        return match ($type) {
            self::KEMATIAN => 'Surat_Keterangan_Kematian',
            self::TEMPAT_TINGGAL => 'Surat_Keterangan_Tempat_Tinggal',
            self::KETERANGAN => 'Surat_Keterangan',
            self::BELUM_MENIKAH => 'Surat_Pernyataan_Belum_Menikah',
            self::TIDAK_BEKERJA => 'Surat_Pernyataan_Tidak_Bekerja',
            self::TIDAK_MAMPU => 'Surat_Pernyataan_Tidak_Mampu',
            self::PENGANTAR => 'Surat_Pengantar',
            self::DOMISILI => 'Surat_Keterangan_Domisili',
            default => 'Surat',
        };
    }
}
