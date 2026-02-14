import { SupabaseStore } from './supabaseStore.svelte';

export type Note = {
    id: string;
    title: string;
    content: string;
    folder: string;
    tags: string[];
    isFavorite: boolean;
    createdAt?: string;
    updatedAt?: string;
};

class NotesStore {
    private store = new SupabaseStore<Note>('notes');

    get notes() {
        return this.store.value;
    }

    get loading() {
        return this.store.loading;
    }

    get allTags() {
        const tags = new Set(this.notes.flatMap(n => n.tags || []));
        return ['All', ...Array.from(tags)];
    }

    async addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
        return await this.store.insert({
            ...note,
            folder: note.folder || 'General',
            tags: note.tags || [],
            isFavorite: note.isFavorite || false
        });
    }

    async updateNote(id: string, updates: Partial<Note>) {
        await this.store.update(id, updates);
    }

    async deleteNote(id: string) {
        await this.store.delete(id);
    }
}

export const notesStore = new NotesStore();
