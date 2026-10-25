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
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="rounded-lg border border-[#E3E8EC] px-4 py-2 text-sm font-medium text-[#202833] hover:bg-slate-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="rounded-lg bg-[#267F83] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1F686C] disabled:opacity-60"
                    >
                        {processing ? 'Menyimpan...' : confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
