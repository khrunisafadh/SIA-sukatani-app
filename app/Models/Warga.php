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
        'nama',
        'nama_lengkap',
        'gender',
        'jenis_kelamin',
        'tempat_lahir',
        'tgl_lahir',
        'tanggal_lahir',
        'agama',
        'goldar',
        'shdk',
        'nama_jalan',
        'blok_rumah',
        'nomor_rumah',
        'detail_alamat',
        'alamat_lengkap',
        'alamat_ktp',
        'status_domisili',
        'status_warga',
        'unit_rumah_id',
        'is_kepala_keluarga',
        'hubungan_keluarga',
        'status_perkawinan',
        'telepon',
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

    public function getMaskedNikAttribute(): string
    {
        if (strlen($this->nik) >= 8) {
            return substr($this->nik, 0, 4) . '••••' . substr($this->nik, -4);
        }
        return $this->nik;
    }

    public function getMaskedNoKkAttribute(): string
    {
        if (strlen($this->no_kk) >= 8) {
            return 'KK ' . substr($this->no_kk, 0, 4) . '••••' . substr($this->no_kk, -4);
        }
        return $this->no_kk;
    }

    public function getNamaLengkapAttribute(?string $value): string
    {
        return $value ?? $this->attributes['nama'] ?? '';
    }

    public function getNamaAttribute(?string $value): string
    {
        return $value ?? $this->attributes['nama_lengkap'] ?? '';
    }

    public function getGenderAttribute(?string $value): string
    {
        return $value ?? $this->attributes['jenis_kelamin'] ?? 'L';
    }

    public function getJenisKelaminAttribute(?string $value): string
    {
        return $value ?? $this->attributes['gender'] ?? 'L';
    }

    public function getStatusDomisiliAttribute(?string $value): string
    {
        return $value ?? ($this->attributes['status_warga'] ?? 'Warga Tetap (Pemilik Rumah)');
    }

    public function getStatusWargaAttribute(?string $value): string
    {
        return $value ?? ($this->attributes['status_domisili'] ?? 'tetap');
    }

    protected static function booted(): void
    {
        static::saved(function (Warga $warga) {
            if (\Illuminate\Support\Facades\Schema::hasTable('wargas')) {
                \Illuminate\Support\Facades\DB::table('wargas')->updateOrInsert(
                    ['id' => $warga->id],
                    [
                        'user_id' => $warga->user_id,
                        'nik' => $warga->nik,
                        'no_kk' => $warga->no_kk,
                        'nama_lengkap' => $warga->nama_lengkap ?: ($warga->nama ?: 'Warga'),
                        'gender' => $warga->gender ?: ($warga->jenis_kelamin ?: 'L'),
                        'tempat_lahir' => $warga->tempat_lahir ?: 'Depok',
                        'tgl_lahir' => $warga->tgl_lahir ?: ($warga->tanggal_lahir ?: now()),
                        'agama' => $warga->agama ?: 'Islam',
                        'goldar' => $warga->goldar,
                        'shdk' => $warga->shdk ?: 'Kepala Keluarga',
                        'nama_jalan' => $warga->nama_jalan ?: 'Jl. Mawar',
                        'blok_rumah' => $warga->blok_rumah,
                        'nomor_rumah' => $warga->nomor_rumah ?: '1',
                        'detail_alamat' => $warga->detail_alamat,
                        'alamat_lengkap' => $warga->alamat_lengkap,
                        'status_domisili' => $warga->status_domisili ?: 'Warga Tetap (Pemilik Rumah)',
                        'no_wa' => $warga->no_wa ?: $warga->telepon,
                        'pekerjaan' => $warga->pekerjaan,
                        'status_administrasi' => $warga->status_administrasi ?: 'Aktif',
                        'foto_ktp' => $warga->foto_ktp,
                        'foto_kk' => $warga->foto_kk,
                        'created_at' => $warga->created_at ?: now(),
                        'updated_at' => $warga->updated_at ?: now(),
                    ]
                );
            }
        });

        static::deleted(function (Warga $warga) {
            if (\Illuminate\Support\Facades\Schema::hasTable('wargas')) {
                \Illuminate\Support\Facades\DB::table('wargas')->where('id', $warga->id)->delete();
            }
        });
    }
}
