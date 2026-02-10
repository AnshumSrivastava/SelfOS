import { LocalStore } from './localStore.svelte';

export type Note = {
    id: string;
    title: string;
    folder: string;
    date: string;
    content?: string;
};

const DEFAULT_NOTES: Note[] = [
    { id: '1', title: "Project Ideas 2026", folder: "Work", date: "2h ago", content: "Implement search, redesign dashboard..." },
    { id: '2', title: "Book Summary: Atomic Habits", folder: "Learning", date: "Yesterday", content: "1% better every day..." },
];

class NotesStore {
    store = new LocalStore<Note[]>('selfos_notes', DEFAULT_NOTES);

    get notes() {
        return this.store.value;
    }

    addNote(note: Omit<Note, 'id'>) {
        this.store.value = [...this.store.value, { ...note, id: crypto.randomUUID() }];
    }
}

export const notesStore = new NotesStore();
