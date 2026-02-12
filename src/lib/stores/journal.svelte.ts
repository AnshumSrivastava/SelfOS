import { LocalStore } from './localStore.svelte';

export type JournalEntry = {
    id: string;
    title: string;
    date: string;
    mood: 'Great' | 'Good' | 'Neutral' | 'Sad' | 'Angry';
    content: string;
    weather?: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy' | 'Snowy';
};

const DEFAULT_ENTRIES: JournalEntry[] = [
    {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        mood: "Great",
        title: "Initial Entry",
        content: "Drafting the new journal system for SelfOS. Excited about the scratchpad! #journal #dev",
        weather: "Sunny"
    }
];

class JournalStore {
    store = new LocalStore<JournalEntry[]>('selfos_journal_v2', DEFAULT_ENTRIES);

    get entries() {
        return this.store.value;
    }

    addEntry(entry: Omit<JournalEntry, 'id'>) {
        this.store.value = [...this.store.value, { ...entry, id: crypto.randomUUID() }];
    }

    updateEntry(id: string, updates: Partial<JournalEntry>) {
        this.store.value = this.store.value.map(e => e.id === id ? { ...e, ...updates } : e);
    }

    removeEntry(id: string) {
        this.store.value = this.store.value.filter(e => e.id !== id);
    }

    getEntryById(id: string) {
        return this.store.value.find(e => e.id === id);
    }
}

export const journalStore = new JournalStore();
