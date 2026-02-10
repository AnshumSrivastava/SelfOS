import { LocalStore } from './localStore.svelte';

export type JournalEntry = {
    id: string;
    title: string;
    date: string;
    mood: string;
    preview: string;
    content?: string;
};

const DEFAULT_ENTRIES: JournalEntry[] = [
    {
        id: '1',
        date: "Today",
        mood: "Great",
        title: "Productive Start",
        preview: "Managed to get the auth system working perfectly...",
        content: "Detailed content here..."
    },
    {
        id: '2',
        date: "Yesterday",
        mood: "Okay",
        title: "A bit slow",
        preview: "Had trouble focusing in the afternoon...",
        content: "Detailed content here..."
    },
];

class JournalStore {
    store = new LocalStore<JournalEntry[]>('selfos_journal', DEFAULT_ENTRIES);

    get entries() {
        return this.store.value;
    }

    addEntry(entry: Omit<JournalEntry, 'id'>) {
        this.store.value = [...this.store.value, { ...entry, id: crypto.randomUUID() }];
    }
}

export const journalStore = new JournalStore();
