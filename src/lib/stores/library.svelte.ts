import { LocalStore } from './localStore.svelte';

export type Book = {
    id: string;
    title: string;
    author: string;
    status: 'Reading' | 'Completed' | 'Want to Read';
    progress?: number; // 0-100
    rating?: number; // 0-5
    cover?: string; // color class
};

const DEFAULT_BOOKS: Book[] = [
    {
        id: '1',
        title: "Atomic Habits",
        author: "James Clear",
        status: "Reading",
        progress: 45,
        cover: "bg-blue-500",
    },
    {
        id: '2',
        title: "Deep Work",
        author: "Cal Newport",
        status: "Completed",
        rating: 5,
        cover: "bg-yellow-500",
    },
];

class LibraryStore {
    store = new LocalStore<Book[]>('selfos_library', DEFAULT_BOOKS);

    get books() {
        return this.store.value;
    }

    get reading() {
        return this.books.filter(b => b.status === "Reading");
    }

    addBook(book: Omit<Book, 'id'>) {
        this.store.value = [...this.store.value, { ...book, id: crypto.randomUUID() }];
    }
}

export const libraryStore = new LibraryStore();
