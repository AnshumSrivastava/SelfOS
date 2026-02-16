import { logger } from "$lib/services/logger";

export type SyncStatus = 'stable' | 'syncing' | 'warning' | 'error';

export interface StoreRegistryMeta {
    id: string;
    tableName: string;
    label: string;
    status: 'idle' | 'loading' | 'saving' | 'error' | 'success';
    error: string | null;
    lastSync: string;
}

class SyncStore {
    #registry = $state<Record<string, StoreRegistryMeta>>({});

    register(id: string, label: string) {
        this.#registry[id] = {
            id,
            tableName: id, // Internal table name usually matches ID
            label,
            status: 'idle',
            error: null,
            lastSync: new Date().toISOString()
        };
        logger.info('SYNC', `Registered store: ${label}`, null, id);
    }

    updateStatus(id: string, status: StoreRegistryMeta['status'], error: string | null = null) {
        if (this.#registry[id]) {
            this.#registry[id].status = status;
            this.#registry[id].error = error;
            this.#registry[id].lastSync = new Date().toISOString();

            if (status === 'error') {
                logger.error('DATA', `Store ${this.#registry[id].tableName} reported error: ${error}`, null, id);
            }
        }
    }

    get registry() {
        return this.#registry;
    }

    get globalStatus(): SyncStatus {
        const metas = Object.values(this.#registry);
        if (metas.some(m => m.status === 'error')) return 'error';
        if (metas.some(m => m.status === 'saving' || m.status === 'loading')) return 'syncing';
        // Warning could be for specific non-blocking errors, for now stable
        return 'stable';
    }

    get isSyncing() {
        return this.globalStatus === 'syncing';
    }

    get hasError() {
        return this.globalStatus === 'error';
    }
}

export const syncStore = new SyncStore();
