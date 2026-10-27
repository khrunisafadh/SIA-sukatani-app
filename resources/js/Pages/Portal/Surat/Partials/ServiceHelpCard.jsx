import { MessageSquare, PhoneCall } from 'lucide-react';

export default function ServiceHelpCard({
    leadName = 'Pak Kiming Yuliadi',
    phone = '6281298765432',
    displayPhone = '+62 812-9876-5432',
    hours = '19.00 - 21.00 WIB',
    location = 'Balai Warga Sukatani',
}) {
    return (
        <div className="rounded-2xl border border-[#E6EAF2] bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#0F685D]">
                    <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-[#17233C] font-heading">Bantuan Layanan RT 01</h4>
                    <p className="text-[11px] text-[#68748A]">{location}</p>
                </div>
            </div>

            <div className="space-y-2 text-xs border-t border-[#EDF2F7] pt-3">
                <div className="flex justify-between items-center py-1">
                    <span className="text-[#68748A]">Ketua RT 01</span>
                    <span className="font-semibold text-[#17233C]">{leadName}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                    <span className="text-[#68748A]">WhatsApp Resmi</span>
                    <span className="font-semibold text-[#0F685D]">{displayPhone}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                    <span className="text-[#68748A]">Jam Pelayanan</span>
                    <span className="font-semibold text-[#17233C]">{hours}</span>
                </div>
            </div>

            <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EEF5FF] px-4 py-2.5 text-xs font-semibold text-[#2764D8] hover:bg-[#DCEBFF] transition"
            >
                <MessageSquare className="h-4 w-4" />
                <span>Hubungi Pengurus via WA</span>
            </a>
        </div>
    );
}
