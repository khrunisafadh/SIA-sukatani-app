<?php

namespace App\Support;

class MutasiType
{
    public const DATANG = 'datang';

    public const PINDAH = 'pindah';

    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [
            self::DATANG,
            self::PINDAH,
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            self::DATANG => 'Warga Datang',
            self::PINDAH => 'Warga Pindah',
        ];
    }

    public static function label(string $type): string
    {
        return self::labels()[$type] ?? $type;
    }
}
