import { Link } from '@inertiajs/react';

export default function Pagination({ meta, links }) {
    const p = meta?.last_page !== undefined ? meta : (meta?.meta || {});
    const total = p.total ?? meta?.total ?? 0;
    const lastPage = p.last_page ?? meta?.last_page ?? 1;
    const from = p.from ?? (total > 0 ? 1 : 0);
    const to = p.to ?? total;
    const paginationLinks = links || p.links || [];

    if (lastPage <= 1) {
        return (
            <p className="text-sm text-[#667085]">
                Menampilkan {total} data
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#667085]">
                Menampilkan {from}-{to} dari {total} data
            </p>
            <div className="flex flex-wrap gap-1">
                {paginationLinks
                    .filter((link) => link.url !== null || link.active)
                    .map((link, index) => (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url || '#'}
                            preserveScroll
                            preserveState
                            className={`min-w-8 rounded-xl border px-2.5 py-1 text-center text-xs font-medium transition-colors ${
                                link.active
                                    ? 'border-[#0F685D] bg-[#0F685D] text-white font-semibold shadow-xs'
                                    : 'border-[#E2E8F0] bg-white text-[#1A253C] hover:border-[#0F685D] hover:text-[#0F685D]'
                            } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
            </div>
        </div>
    );
}
