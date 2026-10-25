<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\Schema;

class AuditLogger
{
    /**
     * Best-effort audit write for Ghita's module. No-ops until audit_logs exists.
     *
     * @param  array<string, mixed>  $meta
     */
    public static function record(?User $actor, string $action, string $subjectType, int|string|null $subjectId, array $meta = []): void
    {
        if (! Schema::hasTable('audit_logs')) {
            return;
        }

        \Illuminate\Support\Facades\DB::table('audit_logs')->insert([
            'user_id' => $actor?->id,
            'action' => $action,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'meta' => json_encode($meta),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
