<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Audit Trail - SIA Sukatani</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #1e293b; margin: 20px; }
        .header { border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 20px; }
        .title { font-size: 18px; font-weight: bold; color: #0f766e; margin: 0; }
        .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
        .meta-table { width: 100%; margin-bottom: 16px; font-size: 10px; }
        table.data { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.data th { background: #f1f5f9; padding: 8px 6px; border: 1px solid #cbd5e1; text-align: left; font-size: 10px; }
        table.data td { padding: 6px; border: 1px solid #e2e8f0; font-size: 10px; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; background: #e0f2fe; color: #0369a1; }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 15px;">
        <button onclick="window.print()" style="padding: 6px 14px; background: #0f766e; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Cetak / Simpan PDF</button>
    </div>

    <div class="header">
        <h1 class="title">LAPORAN AUDIT TRAIL SISTEM</h1>
        <div class="subtitle">SIA RT 01/08 Sukatani, Kec. Tapos, Kota Depok | Dokumen Resmi Bersifat Rahasia (Confidential)</div>
    </div>

    <table class="meta-table">
        <tr>
            <td style="width: 20%;"><strong>Periode Data:</strong></td>
            <td style="width: 30%;">{{ $startDate && $endDate ? "$startDate s/d $endDate" : 'Semua Rekaman' }}</td>
            <td style="width: 20%;"><strong>Dicetak Pada:</strong></td>
            <td style="width: 30%;">{{ $generatedAt }}</td>
        </tr>
        <tr>
            <td><strong>Status Enkripsi:</strong></td>
            <td>SHA-256 Validated</td>
            <td><strong>Masking Data:</strong></td>
            <td>{{ $maskData ? 'Aktif (Privasi Terjaga)' : 'Non-aktif' }}</td>
        </tr>
    </table>

    <table class="data">
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 17%;">Waktu Kejadian</th>
                <th style="width: 18%;">Pengguna</th>
                <th style="width: 18%;">Jenis Tindakan</th>
                <th style="width: 27%;">Objek / Modul</th>
                <th style="width: 15%;">Alamat IP</th>
            </tr>
        </thead>
        <tbody>
            @forelse($logs as $idx => $log)
            <tr>
                <td style="text-align: center;">{{ $idx + 1 }}</td>
                <td>{{ $log['waktu'] }}</td>
                <td><strong>{{ $log['user']['name'] }}</strong><br><small style="color: #64748b;">{{ $log['user']['role_label'] }}</small></td>
                <td><span class="badge">{{ $log['action_label'] }}</span></td>
                <td>{{ $log['object_name'] }}</td>
                <td style="font-family: monospace;">{{ $maskData ? $log['ip_address_masked'] : ($log['ip_address'] ?? '127.0.0.1') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: #94a3b8;">Tidak ada data log aktivitas pada periode ini.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
