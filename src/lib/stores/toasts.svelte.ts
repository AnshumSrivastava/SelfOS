import { generateUUID } from '../utils/uuid';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

class ToastStore {
    #toasts = $state<Toast[]>([]);

    get toasts() { return this.#toasts; }

    add(message: string, type: ToastType = 'info', duration: number = 5000) {
        const id = generateUUID();
        const toast = { id, message, type, duration };
        this.#toasts = [...this.#toasts, toast];

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }

        return id;
    }

    remove(id: string) {
        this.#toasts = this.#toasts.filter(t => t.id !== id);
    }

    success(message: string) { return this.add(message, 'success'); }
    error(message: string) { return this.add(message, 'error', 8000); }
    warn(message: string) { return this.add(message, 'warning'); }
    info(message: string) { return this.add(message, 'info'); }
}

export const toasts = new ToastStore();
