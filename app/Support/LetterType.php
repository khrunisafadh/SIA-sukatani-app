<?php

namespace App\Support;

class LetterType
{
    public const PENGANTAR = 'pengantar';

    public const DOMISILI = 'domisili';

    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [
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
            self::PENGANTAR => 'Surat Pengantar',
            self::DOMISILI => 'Surat Keterangan Domisili',
        ];
    }

    public static function label(string $type): string
    {
        return self::labels()[$type] ?? $type;
    }

    public static function filenamePrefix(string $type): string
    {
        return match ($type) {
            self::PENGANTAR => 'Surat_Pengantar',
            self::DOMISILI => 'Surat_Keterangan_Domisili',
            default => 'Surat',
        };
    }
}
