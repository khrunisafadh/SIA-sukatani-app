<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warga extends Model
{
    protected $table = 'warga';

    protected $fillable = [
        'user_id',
        'nik',
        'no_kk',
        'nama',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'agama',
        'pekerjaan',
        'status_perkawinan',
        'telepon',
        'status_warga',
        'unit_rumah_id',
        'alamat_ktp',
        'is_kepala_keluarga',
        'hubungan_keluarga',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'is_kepala_keluarga' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function unitRumah(): BelongsTo
    {
        return $this->belongsTo(UnitRumah::class, 'unit_rumah_id');
    }

    public function permohonanMutasi(): HasMany
    {
        return $this->hasMany(PermohonanMutasi::class, 'warga_id');
    }

    public function maskedNik(): string
    {
        if (strlen($this->nik) !== 16) {
            return $this->nik;
        }

        return substr($this->nik, 0, 8).'****'.substr($this->nik, -4);
    }
}
