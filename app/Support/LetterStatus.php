<?php

namespace App\Support;

class LetterStatus
{
    public const DIAJUKAN = 'diajukan';

    public const TERBIT = 'terbit';

    public const SELESAI_RT = 'selesai_rt';

    public const SELESAI = 'selesai';

    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [
            self::DIAJUKAN,
            self::TERBIT,
            self::SELESAI_RT,
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
            self::SELESAI_RT => 'Selesai (oleh Ketua RT)',
            self::SELESAI => 'Selesai/Ditandatangani',
        ];
    }

    public static function label(string $status): string
    {
        return self::labels()[$status] ?? $status;
    }

    public static function canAccessDraftPdf(string $status): bool
    {
        return $status === self::TERBIT;
    }
}
