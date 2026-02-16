import { SupabaseStore } from './supabaseStore.svelte';

export type JournalEntry = {
    id: string;
    title: string;
    date: string;
    mood: 'Great' | 'Good' | 'Neutral' | 'Sad' | 'Angry';
    content: string;
    weather?: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' | 'Snowy';
    createdAt?: string;
};

class JournalStore {
    private store = new SupabaseStore<JournalEntry>('journal_entries');

    async init() {
        await this.store.init();
    }

    get entries() {
        return this.store.value;
    }

    get loading() {
        return this.store.loading;
    }

    get status() {
        return this.store.status;
    }

    get errorMsg() {
        return this.store.errorMsg;
    }

    async addEntry(entry: Omit<JournalEntry, 'id'>) {
        await this.store.insert(entry);
    }

    async updateEntry(id: string, updates: Partial<JournalEntry>) {
        await this.store.update(id, updates);
    }

    async removeEntry(id: string) {
        await this.store.delete(id);
    }

    getEntryById(id: string) {
        return this.store.value.find(e => e.id === id);
    }
}

export const journalStore = new JournalStore();
