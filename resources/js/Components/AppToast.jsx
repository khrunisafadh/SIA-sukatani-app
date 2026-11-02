import { usePage } from '@inertiajs/react';
import { CheckCircle2, CircleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function notify(type, message) {
    if (!message) {
        return;
    }

    window.dispatchEvent(new CustomEvent('app-toast', { detail: { type, message } }));
}

export function useToast() {
    return { notify };
}

export default function AppToast() {
    const { flash } = usePage().props;
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success, id: Date.now() });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error, id: Date.now() });
        }
    }, [flash]);

    useEffect(() => {
        const handler = (event) => {
            setToast({ ...event.detail, id: Date.now() });
        };

        window.addEventListener('app-toast', handler);

        return () => window.removeEventListener('app-toast', handler);
    }, []);

    useEffect(() => {
        if (!toast || toast.type !== 'success') {
            return undefined;
        }

        const timer = setTimeout(() => setToast(null), 4000);

        return () => clearTimeout(timer);
    }, [toast]);

    if (!toast) {
        return null;
    }

    return (
        <div
            className={`pointer-events-auto absolute left-60 right-6 top-[4.75rem] z-40 max-w-xl rounded-lg border px-4 py-3 shadow-sm ${
                toast.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-800'
            }`}
            role="status"
            aria-live="polite"
        >
            <div className="flex items-start gap-3">
                {toast.type === 'success' ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <p className="flex-1 text-sm font-medium">{toast.message}</p>
                <button
                    type="button"
                    onClick={() => setToast(null)}
                    className="rounded p-0.5 hover:bg-black/5"
                    aria-label="Tutup notifikasi"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
