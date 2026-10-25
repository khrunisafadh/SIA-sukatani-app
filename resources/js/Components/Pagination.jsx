import { Link } from '@inertiajs/react';

export default function Pagination({ meta, links }) {
    if (!meta || meta.last_page <= 1) {
        return (
            <p className="text-sm text-[#667085]">
                Menampilkan {meta?.total ?? 0} data
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#667085]">
                Menampilkan {meta.from}-{meta.to} dari {meta.total} data
            </p>
            <div className="flex flex-wrap gap-1">
                {links
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
