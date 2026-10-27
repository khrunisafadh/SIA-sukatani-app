
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Warga extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'warga';

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

    protected function casts(): array
    {
        return [
            'tgl_lahir' => 'date',
        ];
    }

    /**
     * Relasi ke akun pengguna.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke unit rumah warga.
     */
    public function unitRumah(): BelongsTo
    {
        return $this->belongsTo(UnitRumah::class, 'unit_rumah_id');
    }

    /**
     * Relasi ke permohonan mutasi warga.
     */
    public function permohonanMutasi(): HasMany
    {
        return $this->hasMany(PermohonanMutasi::class, 'warga_id');
    }

    /**
     * Masking NIK: menampilkan 4 digit awal dan 4 digit akhir.
     */
    public function getMaskedNikAttribute(): string
    {
        if (strlen((string) $this->nik) !== 16) {
            return (string) $this->nik;
        }

        return substr($this->nik, 0, 4)
            . '••••'
            . substr($this->nik, -4);
    }

    /**
     * Masking nomor KK.
     */
    public function getMaskedNoKkAttribute(): string
    {
        if (strlen((string) $this->no_kk) !== 16) {
            return (string) $this->no_kk;
        }

        return 'KK ' . substr($this->no_kk, 0, 4)
            . '••••'
            . substr($this->no_kk, -4);
    }
}
