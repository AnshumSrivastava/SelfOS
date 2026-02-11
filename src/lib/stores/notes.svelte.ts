import { LocalStore } from './localStore.svelte';

export type Note = {
    id: string;
    title: string;
    tags: string[];
    date: string;
    content: string;
};

const DEFAULT_NOTES: Note[] = [
    { id: '1', title: "Project Ideas 2026", tags: ["Work", "planning", "ideas"], date: "2h ago", content: "Implement search, redesign dashboard..." },
    { id: '2', title: "Book Summary: Atomic Habits", tags: ["Learning", "books", "self-improvement"], date: "Yesterday", content: "1% better every day..." },
    { id: '3', title: "Grocery List", tags: ["Personal"], date: "Today", content: "Milk, Eggs, Bread..." },
];

class NotesStore {
    #store = new LocalStore<Note[]>('selfos_notes', DEFAULT_NOTES);

    get notes() {
        return this.#store.value;
    }

    get allTags() {
        const tags = new Set(this.notes.flatMap(n => n.tags || []));
        return ['All', ...Array.from(tags)];
    }

    addNote(note: Omit<Note, 'id' | 'date'>) {
        const newNote: Note = {
            ...note,
            tags: note.tags || [],
            id: crypto.randomUUID(),
            date: 'Just now'
        };
        this.#store.value = [newNote, ...this.#store.value];
        return newNote;
    }

    updateNote(id: string, updates: Partial<Note>) {
        this.#store.value = this.#store.value.map(n =>
            n.id === id ? { ...n, ...updates } : n
        );
    }

    deleteNote(id: string) {
        this.#store.value = this.#store.value.filter(n => n.id !== id);
    }
}

export const notesStore = new NotesStore();



