import { SupabaseStore } from './supabaseStore.svelte';
import type { Connection } from '$lib/types/connections';

class ConnectionsStore extends SupabaseStore<Connection> {
    constructor() {
        super('connections', { orderBy: 'name' });
    }

    // Identify connections that haven't been contacted in a while
    get neglectedConnections() {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() - 14); // 14 days default threshold

        return this.value.filter(c => {
            if (!c.lastContactedAt) return true; // Never contacted is neglected
            return new Date(c.lastContactedAt) < threshold;
        });
    }

    async logContact(id: string) {
        return this.update(id, {
            lastContactedAt: new Date().toISOString()
        });
    }
}

export const connections = new ConnectionsStore();
