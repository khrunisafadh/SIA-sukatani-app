<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengajuanSuratHistory extends Model
{
    protected $table = 'pengajuan_surat_histories';

    protected $fillable = [
        'pengajuan_surat_id',
        'status',
        'actor_id',
        'keterangan',
    ];

    public function letter(): BelongsTo
    {
        return $this->belongsTo(PengajuanSurat::class, 'pengajuan_surat_id');
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
