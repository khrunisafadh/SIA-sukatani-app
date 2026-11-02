<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class DokumenMutasi extends Model
{
    protected $table = 'dokumen_mutasi';

    protected $fillable = [
        'permohonan_mutasi_id',
        'jenis_dokumen',
        'nama_dokumen',
        'file_path',
        'file_name',
        'file_size',
        'file_size_label',
        'mime_type',
        'status_pemeriksaan',
        'keterangan_tambahan',
    ];

    public function permohonan(): BelongsTo
    {
        return $this->belongsTo(PermohonanMutasi::class, 'permohonan_mutasi_id');
    }

    public function isPhysicalValid(): bool
    {
        return $this->status_pemeriksaan === 'valid';
    }

    public function isPhysicalBlurred(): bool
    {
        return $this->status_pemeriksaan === 'buram';
    }

    public function absolutePath(): ?string
    {
        if (! $this->file_path) {
            return null;
        }

        if (Storage::disk('local')->exists($this->file_path)) {
            return Storage::disk('local')->path($this->file_path);
        }

        $publicPath = public_path($this->file_path);
        if (file_exists($publicPath)) {
            return $publicPath;
        }

        return null;
    }
}
