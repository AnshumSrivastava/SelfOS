import { LocalStore } from './localStore.svelte';
import { notesStore } from './notes.svelte';

export type ScratchpadEntry = {
    id: string;
    content: string;
    timestamp: string;
    promotedToNoteId?: string;
};

export type Book = {
    id: string;
    title: string;
    author: string;
    why: string; // The "Reason for adding"
    status: 'Want to Read' | 'Reading' | 'Paused' | 'Done';
    cover?: string;
    subjects: string[]; // Custom labels
    scratchpad: ScratchpadEntry[];
    rating?: number;
    addedDate: string;
    lastActivityDate: string;
};

const DEFAULT_BOOKS: Book[] = [
    {
        id: '1',
        title: "Atomic Habits",
        author: "James Clear",
        why: "To build better systems.",
        status: "Reading",
        cover: "bg-blue-500",
        subjects: ["Self-Improvement"],
        scratchpad: [
            { id: '1', content: "1% better every day is the core idea.", timestamp: new Date().toISOString() }
        ],
        addedDate: new Date().toISOString(),
        lastActivityDate: new Date().toISOString(),
        rating: 0
    }
];

class LibraryStore {
    store = new LocalStore<Book[]>('selfos_library_v2', DEFAULT_BOOKS);

    get books() {
        return this.store.value.sort((a, b) =>
            new Date(b.lastActivityDate).getTime() - new Date(a.lastActivityDate).getTime()
        );
    }

    get reading() {
        return this.books.filter(b => b.status === "Reading");
    }

    get subjects() {
        const allSubjects = this.books.flatMap(b => b.subjects);
        return [...new Set(allSubjects)].sort();
    }

    addBook(book: Pick<Book, 'title' | 'author' | 'why' | 'cover'>) {
        const newBook: Book = {
            ...book,
            id: crypto.randomUUID(),
            status: 'Want to Read',
            subjects: [],
            scratchpad: [],
            rating: 0,
            addedDate: new Date().toISOString(),
            lastActivityDate: new Date().toISOString()
        };
        this.store.value = [newBook, ...this.store.value];
    }

    updateBook(id: string, updates: Partial<Book>) {
        this.store.value = this.store.value.map(book =>
            book.id === id ? { ...book, ...updates, lastActivityDate: new Date().toISOString() } : book
        );
    }

    deleteBook(id: string) {
        this.store.value = this.store.value.filter(book => book.id !== id);
    }

    addToScratchpad(bookId: string, content: string) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        const entry: ScratchpadEntry = {
            id: crypto.randomUUID(),
            content,
            timestamp: new Date().toISOString()
        };

        this.updateBook(bookId, {
            scratchpad: [entry, ...book.scratchpad]
        });
    }

    promoteToNote(bookId: string, entryId: string) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        const entry = book.scratchpad.find(e => e.id === entryId);
        if (!entry || entry.promotedToNoteId) return;

        // Create the note
        const newNote = notesStore.addNote({
            title: `Thought from: ${book.title}`,
            content: `${entry.content}\n\n---\nRef: ${book.title}`,
            tags: ["Book Thought", ...book.subjects]
        });

        // Update entry to mark as promoted
        const updatedScratchpad = book.scratchpad.map(e =>
            e.id === entryId ? { ...e, promotedToNoteId: newNote.id } : e
        );

        this.updateBook(bookId, { scratchpad: updatedScratchpad });
    }

    deleteFromScratchpad(bookId: string, entryId: string) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) return;

        this.updateBook(bookId, {
            scratchpad: book.scratchpad.filter(e => e.id !== entryId)
        });
    }
}

export const libraryStore = new LibraryStore();
