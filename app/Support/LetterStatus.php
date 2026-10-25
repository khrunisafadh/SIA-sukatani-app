<?php

namespace App\Support;

class LetterStatus
{
    public const DIAJUKAN = 'diajukan';

    public const TERBIT = 'terbit';

    public const SELESAI = 'selesai';

    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [
            self::DIAJUKAN,
            self::TERBIT,
            self::SELESAI,
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            self::DIAJUKAN => 'Diajukan',
            self::TERBIT => 'Terbit',
            self::SELESAI => 'Selesai/Ditandatangani',
        ];
    }

    public static function label(string $status): string
    {
        return self::labels()[$status] ?? $status;
    }
}
