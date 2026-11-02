const styles = {
    diajukan: 'bg-amber-50 text-amber-700 border-amber-200',
    terbit: 'bg-sky-50 text-sky-700 border-sky-200',
    selesai: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function StatusBadge({ status, label }) {
    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                styles[status] ?? 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
        >
            {label}
        </span>
    );
}
