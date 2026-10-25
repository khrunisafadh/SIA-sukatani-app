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
                            className={`min-w-8 rounded-md border px-2 py-1 text-center text-xs ${
                                link.active
                                    ? 'border-[#267F83] bg-[#267F83] text-white'
                                    : 'border-[#E3E8EC] bg-white text-[#202833] hover:border-[#267F83]'
                            } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
            </div>
        </div>
    );
}
