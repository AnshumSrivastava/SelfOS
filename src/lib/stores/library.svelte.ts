import { SupabaseStore } from './supabaseStore.svelte';
import { notesStore } from './notes.svelte';
import { auth } from './auth.svelte';

export type ScratchpadEntry = {
    id: string;
    itemId: string;
    content: string;
    createdAt: string;
    promotedToNoteId?: string;
};

export type Book = {
    id: string;
    title: string;
    author: string;
    why: string;
    status: 'Want to Read' | 'Reading' | 'Paused' | 'Done';
    coverUrl?: string;
    subjects: string[];
    rating: number;
    lastActivityDate: string;
    createdAt?: string;
};

class LibraryStore {
    private itemsStore = new SupabaseStore<Book>('library_items', { migrationKey: 'selfos_library_v2' });
    private scratchpadStore = new SupabaseStore<ScratchpadEntry>('library_scratchpad');

    constructor() {
        this.initMigration();
    }

    private async initMigration() {
        if (typeof window === 'undefined') return;

        $effect.root(() => {
            $effect(() => {
                if (!auth.loading && auth.isAuthenticated) {
                    this.migrateNestedScratchpad();
                }
            });
        });
    }

    private async migrateNestedScratchpad() {
        const stored = localStorage.getItem('selfos_library_v2');
        if (!stored) return;

        try {
            const books = JSON.parse(stored);
            if (Array.isArray(books) && books.length > 0) {
                // Check if migration is needed for scratchpad specifically
                if (this.scratchpadStore.value.length === 0 && this.itemsStore.value.length > 0) {
                    console.log("Migrating library scratchpad entries from localStorage...");
                    for (const book of books) {
                        if (Array.isArray(book.scratchpad)) {
                            // Find the corresponding book in Supabase by title/author
                            const sbBook = this.itemsStore.value.find(b => b.title === book.title && b.author === book.author);
                            if (sbBook) {
                                for (const entry of book.scratchpad) {
                                    await this.scratchpadStore.insert({
                                        itemId: sbBook.id,
                                        content: entry.content,
                                        promotedToNoteId: entry.promotedToNoteId
                                    } as any);
                                }
                            }
                        }
                    }
                    console.log("Library scratchpad migration complete.");
                }
            }
        } catch (e) {
            console.error("Migration error for library scratchpad:", e);
        }
    }

    get books() {
        return this.itemsStore.value.sort((a, b) =>
            new Date(b.lastActivityDate).getTime() - new Date(a.lastActivityDate).getTime()
        );
    }

    get loading() {
        return this.itemsStore.loading || this.scratchpadStore.loading;
    }

    get reading() {
        return this.books.filter(b => b.status === "Reading");
    }

    get subjects() {
        const allSubjects = this.books.flatMap(b => b.subjects);
        return [...new Set(allSubjects)].sort();
    }

    getScratchpad(bookId: string) {
        return this.scratchpadStore.value.filter(e => e.itemId === bookId);
    }

    async addBook(book: Pick<Book, 'title' | 'author' | 'why' | 'coverUrl'>) {
        await this.itemsStore.insert({
            ...book,
            status: 'Want to Read',
            subjects: [],
            rating: 0,
            lastActivityDate: new Date().toISOString()
        } as any);
    }

    async updateBook(id: string, updates: Partial<Book>) {
        await this.itemsStore.update(id, {
            ...updates,
            lastActivityDate: new Date().toISOString()
        });
    }

    async deleteBook(id: string) {
        await this.itemsStore.delete(id);
    }

    async addToScratchpad(bookId: string, content: string) {
        await this.scratchpadStore.insert({
            itemId: bookId,
            content
        } as any);
        await this.updateBook(bookId, {}); // Update lastActivityDate
    }

    async promoteToNote(bookId: string, entryId: string) {
        const book = this.books.find(b => b.id === bookId);
        const entry = this.scratchpadStore.value.find(e => e.id === entryId);
        if (!book || !entry || entry.promotedToNoteId) return;

        const newNote = await notesStore.addNote({
            title: `Thought from: ${book.title}`,
            content: `${entry.content}\n\n---\nRef: ${book.title}`,
            folder: 'Library',
            tags: ["Book Thought", ...book.subjects],
            isFavorite: false
        });

        if (newNote) {
            await this.scratchpadStore.update(entryId, { promotedToNoteId: newNote.id });
            await this.updateBook(bookId, {});
        }
    }

    async deleteFromScratchpad(bookId: string, entryId: string) {
        await this.scratchpadStore.delete(entryId);
        await this.updateBook(bookId, {});
    }
}

export const libraryStore = new LibraryStore();
