<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UnitRumah extends Model
{
    protected $table = 'unit_rumah';

    protected $fillable = [
        'blok',
        'nomor',
        'nama_unit',
        'status_hunian',
        'nama_pemilik',
        'telepon_pemilik',
        'kapasitas_kk',
        'catatan',
    ];

    public function residents(): HasMany
    {
        return $this->hasMany(Warga::class, 'unit_rumah_id');
    }

    public function mutations(): HasMany
    {
        return $this->hasMany(PermohonanMutasi::class, 'unit_rumah_id');
    }

    public function isOccupied(): bool
    {
        return $this->status_hunian !== 'kosong';
    }
}
