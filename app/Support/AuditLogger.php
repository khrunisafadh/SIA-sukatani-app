<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Throwable;

class AuditLogger
{
    /**
     * Best-effort audit write for Ghita's module (Module 6: Audit Trail).
     * Gracefully records structured events without crashing if table is absent.
     *
     * @param  array<string, mixed>  $meta
     */
    public static function record(?User $actor, string $action, string $subjectType, int|string|null $subjectId, array $meta = []): void
    {
        Log::info("Audit event [{$action}]", [
            'actor_id' => $actor?->id,
            'actor_name' => $actor?->name,
            'actor_role' => $actor?->role,
            'action' => $action,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'meta' => $meta,
            'timestamp' => now()->toIso8601String(),
        ]);

        if (! Schema::hasTable('audit_logs')) {
            return;
        }

        try {
            DB::table('audit_logs')->insert([
                'user_id' => $actor?->id,
                'action' => $action,
                'subject_type' => $subjectType,
                'subject_id' => $subjectId,
                'meta' => json_encode($meta),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (Throwable $e) {
            Log::warning("AuditLogger failed to persist to audit_logs: {$e->getMessage()}", [
                'action' => $action,
                'subject_id' => $subjectId,
            ]);
        }
    }
}
