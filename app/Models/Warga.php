<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Warga extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'nik',
        'no_kk',
        'nama_lengkap',
        'gender',
        'tempat_lahir',
        'tgl_lahir',
        'agama',
        'goldar',
        'shdk',
        'nama_jalan',
        'blok_rumah',
        'nomor_rumah',
        'detail_alamat',
        'alamat_lengkap',
        'status_domisili',
        'no_wa',
        'pekerjaan',
        'status_administrasi',
        'foto_ktp',
        'foto_kk',
    ];

    /**
     * Relasi ke akun user jika warga memiliki akun login
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Helper untuk masking NIK: 3276••••0142
     */
    public function getMaskedNikAttribute(): string
    {
        if (strlen($this->nik) >= 8) {
            return substr($this->nik, 0, 4) . '••••' . substr($this->nik, -4);
        }
        return $this->nik;
    }

    /**
     * Helper untuk masking No KK: KK 3276••••0008
     */
    public function getMaskedNoKkAttribute(): string
    {
        if (strlen($this->no_kk) >= 8) {
            return 'KK ' . substr($this->no_kk, 0, 4) . '••••' . substr($this->no_kk, -4);
        }
        return $this->no_kk;
    }
}
