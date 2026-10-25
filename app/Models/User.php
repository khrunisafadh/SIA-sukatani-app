<?php

namespace App\Models;

use App\Support\Roles;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'username', 'email', 'role', 'password', 'is_active', 'must_change_password', 'last_activity_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'must_change_password' => 'boolean',
            'last_activity_at' => 'datetime',
        ];
    }

    public function letterApplications(): HasMany
    {
        return $this->hasMany(PengajuanSurat::class, 'pemohon_id');
    }

    public function createdLetters(): HasMany
    {
        return $this->hasMany(PengajuanSurat::class, 'created_by');
    }

    public function isKetuaRt(): bool
    {
        return $this->role === Roles::KETUA_RT;
    }

    public function canManageLetters(): bool
    {
        return Roles::canManageLetters((string) $this->role);
    }

    public function canManageUsers(): bool
    {
        return $this->isKetuaRt();
    }

    public function roleLabel(): string
    {
        return Roles::label((string) $this->role);
    }

    public function statusLabel(): string
    {
        if (! $this->is_active) {
            return 'Nonaktif';
        }

        if ($this->must_change_password) {
            return 'Perlu ganti password';
        }

        return 'Aktif';
    }

    public function markActivity(): void
    {
        $this->forceFill(['last_activity_at' => now()])->save();
    }
}
