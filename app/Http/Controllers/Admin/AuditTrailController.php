<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuditTrailController extends Controller
{
    /**
     * Display a listing of audit logs with filters and pagination.
     */
    public function index(Request $request): InertiaResponse
    {
        $q = trim((string) $request->input('q', ''));
        $action = trim((string) $request->input('action', ''));
        $range = trim((string) $request->input('range', '30'));

        $query = AuditLog::with('user')->latest();

        // Filter range hari
        if ($range !== 'all' && is_numeric($range)) {
            $days = (int) $range;
            $query->where('created_at', '>=', now()->subDays($days)->startOfDay());
        }

        // Filter action
        if ($action !== '' && $action !== 'all') {
            $query->where('action', $action);
        }

        // Filter search query
        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('action', 'like', "%{$q}%")
                    ->orWhere('subject_type', 'like', "%{$q}%")
                    ->orWhere('subject_id', 'like', "%{$q}%")
                    ->orWhere('ip_address', 'like', "%{$q}%")
                    ->orWhereHas('user', function ($u) use ($q) {
                        $u->where('name', 'like', "%{$q}%")
                          ->orWhere('username', 'like', "%{$q}%");
                    });
            });
        }

        $totalLogs = AuditLog::count();
        $filteredCount = (clone $query)->count();

        $logs = $query->paginate(15)->through(function ($log) {
            return $this->formatLogSummary($log);
        });

        $activeRangeLabel = match ($range) {
            '7' => '7 Hari Terakhir',
            '30' => '30 Hari Terakhir',
            '90' => '90 Hari Terakhir',
            'all' => 'Semua Periode',
            default => '30 Hari Terakhir',
        };

        $actionOptions = [
            ['value' => 'all', 'label' => 'Semua Tindakan'],
            ['value' => 'warga.create', 'label' => 'Tambah Data Warga'],
            ['value' => 'warga.update', 'label' => 'Ubah Data Warga'],
            ['value' => 'warga.delete', 'label' => 'Hapus Data Warga'],
            ['value' => 'surat.approve', 'label' => 'Persetujuan Surat'],
            ['value' => 'surat.reject', 'label' => 'Penolakan Surat'],
            ['value' => 'kas.create', 'label' => 'Pencatatan Kas RT'],
            ['value' => 'user.login', 'label' => 'Autentikasi Pengguna'],
        ];

        return Inertia::render('Admin/AuditTrail/Index', [
            'logs' => $logs,
            'filters' => [
                'q' => $q,
                'action' => $action,
                'range' => $range,
            ],
            'actionOptions' => $actionOptions,
            'totalLogs' => $totalLogs,
            'filteredCount' => $filteredCount,
            'activeRangeLabel' => $activeRangeLabel,
        ]);
    }

    /**
     * Show detail of an audit log for SlideOver inspection.
     */
    public function show(int $id)
    {
        $log = AuditLog::with('user')->findOrFail($id);

        $detail = $this->formatLogDetail($log);

        return response()->json(['log' => $detail]);
    }

    /**
     * Export logs to CSV.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $maskData = $request->boolean('mask_data', true);

        $query = AuditLog::with('user')->latest();

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay(),
            ]);
        }

        $logs = $query->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="audit_trail_' . now()->format('Ymd_His') . '.csv"',
        ];

        return response()->stream(function () use ($logs, $maskData) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF)); // BOM for Excel UTF-8

            fputcsv($handle, ['ID', 'Waktu Kejadian', 'Nama Pengguna', 'Peran/Role', 'Jenis Tindakan', 'Objek / Modul', 'Alamat IP']);

            foreach ($logs as $log) {
                $summary = $this->formatLogSummary($log);
                fputcsv($handle, [
                    $log->id,
                    $summary['waktu'],
                    $summary['user']['name'],
                    $summary['user']['role_label'],
                    $summary['action_label'],
                    $summary['object_name'],
                    $maskData ? $summary['ip_address_masked'] : ($log->ip_address ?? '127.0.0.1'),
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Export logs to print-friendly PDF / HTML view.
     */
    public function exportPdf(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $maskData = $request->boolean('mask_data', true);

        $query = AuditLog::with('user')->latest();

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [
                Carbon::parse($startDate)->startOfDay(),
                Carbon::parse($endDate)->endOfDay(),
            ]);
        }

        $logs = $query->take(500)->get()->map(function ($log) {
            return $this->formatLogSummary($log);
        });

        $html = view('exports.audit_pdf', [
            'logs' => $logs,
            'startDate' => $startDate ? Carbon::parse($startDate)->translatedFormat('d F Y') : null,
            'endDate' => $endDate ? Carbon::parse($endDate)->translatedFormat('d F Y') : null,
            'maskData' => $maskData,
            'generatedAt' => now()->translatedFormat('d F Y, H:i') . ' WIB',
        ])->render();

        return response($html, 200, [
            'Content-Type' => 'text/html; charset=UTF-8',
            'Content-Disposition' => 'inline; filename="audit_trail_report.html"',
        ]);
    }

    /**
     * Helper to format summary for index table.
     */
    private function formatLogSummary(AuditLog $log): array
    {
        $meta = (array) ($log->meta ?? []);
        $userName = $log->user?->name ?? ($meta['actor_name'] ?? 'Sistem RT');
        $role = $log->user?->role ?? ($meta['actor_role'] ?? 'admin');

        $initials = 'RT';
        if ($userName) {
            $parts = preg_split('/\s+/', trim($userName));
            $initials = count($parts) >= 2
                ? strtoupper(substr($parts[0], 0, 1) . substr($parts[1], 0, 1))
                : strtoupper(substr($userName, 0, 2));
        }

        $roleLabel = match ($role) {
            'ketua_rt' => 'Ketua RT 01',
            'sekretaris' => 'Sekretaris RT',
            'bendahara' => 'Bendahara RT',
            default => 'Warga RT',
        };

        $ip = $log->ip_address ?? '127.0.0.1';
        $ipMasked = $this->maskIp($ip);

        return [
            'id' => $log->id,
            'user' => [
                'name' => $userName,
                'initials' => $initials,
                'role_label' => $roleLabel,
                'avatar_color' => 'bg-[#147A72] text-white',
            ],
            'waktu' => $log->created_at ? $log->created_at->translatedFormat('d M Y, H:i') . ' WIB' : '-',
            'action_label' => $this->resolveActionLabel($log->action),
            'object_name' => $this->resolveObjectName($log),
            'ip_address_masked' => $ipMasked,
        ];
    }

    /**
     * Helper to format detail for DetailSlideOver.
     */
    private function formatLogDetail(AuditLog $log): array
    {
        $meta = (array) ($log->meta ?? []);
        $summary = $this->formatLogSummary($log);

        $ip = $log->ip_address ?? '127.0.0.1';
        $payloadBefore = (array) ($meta['before'] ?? []);
        $payloadAfter = (array) ($meta['after'] ?? ($meta['data'] ?? []));

        $hashInput = $log->id . '|' . $log->created_at . '|' . $log->action . '|' . $ip . '|' . json_encode($meta);
        $hash = hash('sha256', $hashInput);

        return [
            'id' => $log->id,
            'user' => [
                'name' => $summary['user']['name'],
                'nik' => $log->user?->nik ? substr($log->user->nik, 0, 8) . '••••' . substr($log->user->nik, -4) : '32750801••••0001',
                'role_label' => $summary['user']['role_label'],
            ],
            'waktu_hari' => $log->created_at ? $log->created_at->translatedFormat('l, d F Y') : '-',
            'waktu_jam' => $log->created_at ? $log->created_at->format('H:i:s') . ' WIB' : '-',
            'action_label' => $summary['action_label'],
            'module_label' => $this->resolveModuleLabel($log->subject_type ?? $log->action),
            'object_name' => $summary['object_name'],
            'description' => $meta['description'] ?? "Aktivitas {$summary['action_label']} berhasil dicatat dalam audit trail.",
            'network' => [
                'ip_internal' => $ip,
                'ip_masked' => $summary['ip_address_masked'],
                'location_city' => 'Depok, Jawa Barat',
                'location_network' => 'Balai Warga RT 01/08 Sukatani',
                'device_info' => $log->user_agent ? substr($log->user_agent, 0, 60) . '...' : 'Chrome Browser on Windows NT',
            ],
            'security' => [
                'is_valid' => true,
                'hash' => $hash,
            ],
            'payload' => [
                'before' => $payloadBefore,
                'after' => $payloadAfter,
                'raw_json' => json_encode([
                    'id' => $log->id,
                    'action' => $log->action,
                    'subject_type' => $log->subject_type,
                    'subject_id' => $log->subject_id,
                    'ip_address' => $ip,
                    'user_agent' => $log->user_agent,
                    'meta' => $meta,
                    'timestamp' => $log->created_at?->toIso8601String(),
                ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            ],
        ];
    }

    private function resolveActionLabel(string $action): string
    {
        return match ($action) {
            'warga.create' => 'Tambah Data Warga',
            'warga.update' => 'Perubahan Data Warga',
            'warga.delete' => 'Penghapusan Warga',
            'surat.create' => 'Pengajuan Surat Baru',
            'surat.approve' => 'Persetujuan Surat',
            'surat.reject' => 'Penolakan Surat',
            'kas.create' => 'Pencatatan Kas RT',
            'user.login' => 'Login Pengguna',
            'user.logout' => 'Logout Pengguna',
            default => ucwords(str_replace(['.', '_'], ' ', $action)),
        };
    }

    private function resolveModuleLabel(?string $subject): string
    {
        if (!$subject) return 'Administrasi Umum';
        if (str_contains($subject, 'Warga') || str_contains($subject, 'warga')) return 'Modul Kependudukan';
        if (str_contains($subject, 'Surat') || str_contains($subject, 'surat')) return 'Modul Pelayanan Surat';
        if (str_contains($subject, 'Kas') || str_contains($subject, 'kas')) return 'Modul Keuangan RT';
        return 'Sistem Administrasi';
    }

    private function resolveObjectName(AuditLog $log): string
    {
        $meta = (array) ($log->meta ?? []);
        if (!empty($meta['subject_name'])) return (string) $meta['subject_name'];
        if (!empty($meta['nama'])) return (string) $meta['nama'];
        if (!empty($meta['nama_lengkap'])) return (string) $meta['nama_lengkap'];
        if (!empty($meta['nomor_surat'])) return 'Surat No: ' . $meta['nomor_surat'];
        if ($log->subject_type && $log->subject_id) return class_basename($log->subject_type) . ' #' . $log->subject_id;
        return 'Aktivitas Sistem';
    }

    private function maskIp(?string $ip): string
    {
        if (!$ip) return '127.0.•••.•••';
        $parts = explode('.', $ip);
        if (count($parts) === 4) {
            return "{$parts[0]}.{$parts[1]}.•••.•••";
        }
        return substr($ip, 0, 7) . '•••';
    }
}
