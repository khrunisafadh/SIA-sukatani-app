<?php

namespace App\Support;

class Roles
{
    public const KETUA_RT = 'ketua_rt';

    public const SEKRETARIS = 'sekretaris';

    public const BENDAHARA = 'bendahara';

    public const WARGA = 'warga';

    /**
     * @return array<int, string>
     */
    public static function all(): array
    {
        return [
            self::KETUA_RT,
            self::SEKRETARIS,
            self::BENDAHARA,
            self::WARGA,
        ];
    }

    /**
     * @return array<string, string>
     */
    public static function labels(): array
    {
        return [
            self::KETUA_RT => 'Ketua RT (Admin)',
            self::SEKRETARIS => 'Sekretaris',
            self::BENDAHARA => 'Bendahara',
            self::WARGA => 'Warga',
        ];
    }

    public static function label(string $role): string
    {
        return self::labels()[$role] ?? $role;
    }

    public static function isAdmin(string $role): bool
    {
        return $role === self::KETUA_RT;
    }

    public static function canManageLetters(string $role): bool
    {
        return in_array($role, [self::KETUA_RT, self::SEKRETARIS], true);
    }
}
