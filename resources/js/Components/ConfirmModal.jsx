import Modal from '@/Components/Modal';

export default function ConfirmModal({
    show,
    title,
    description,
    confirmLabel = 'Konfirmasi',
    cancelLabel = 'Batal',
    processing = false,
    onConfirm,
    onClose,
    children,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <h3 className="text-base font-semibold text-[#202833]">{title}</h3>
                {description && <p className="mt-2 text-sm text-[#667085]">{description}</p>}
                {children}
                <div className="mt-6 flex justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-xl border border-[#CBD5E1] px-4 py-2 text-xs font-semibold text-[#4A5568] hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="rounded-xl bg-[#0F685D] hover:bg-[#0B5249] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors disabled:opacity-60 cursor-pointer"
                    >
                        {processing ? 'Menyimpan...' : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
