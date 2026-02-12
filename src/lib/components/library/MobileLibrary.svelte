<script lang="ts">
    import { Book, Plus, Star } from "lucide-svelte";
    import { libraryStore } from "$lib/stores/library.svelte";
    import AddBookModal from "./AddBookModal.svelte";
    import BookDetailsModal from "./BookDetailsModal.svelte";

    let isAddModalOpen = $state(false);
    let selectedBookId = $state<string | null>(null);
    let isDetailsModalOpen = $state(false);

    function openBook(id: string) {
        selectedBookId = id;
        isDetailsModalOpen = true;
    }
</script>

<div class="space-y-6 pb-24">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Library</h1>
        <button
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            onclick={() => (isAddModalOpen = true)}
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Currently Reading -->
    <div>
        <h3 class="text-sm text-gray-500 uppercase tracking-widest mb-3">
            Reading
        </h3>
        <div class="space-y-4">
            {#each libraryStore.reading as book}
                <div
                    class="card-subtle flex gap-4 active:scale-95 transition-transform cursor-pointer"
                    onclick={() => openBook(book.id)}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === "Enter" && openBook(book.id)}
                >
                    <div
                        class="w-20 aspect-[2/3] rounded-lg flex items-center justify-center text-white/50 relative overflow-hidden shrink-0 bg-surface"
                    >
                        {#if book.cover && book.cover.startsWith("http")}
                            <img
                                src={book.cover}
                                alt={book.title}
                                class="absolute inset-0 w-full h-full object-cover opacity-80"
                            />
                        {:else}
                            <div
                                class="absolute inset-0 {book.cover} opacity-20"
                            ></div>
                            <Book size={24} />
                        {/if}
                    </div>
                    <div class="flex-1 flex flex-col justify-center">
                        <h4 class="font-bold text-white line-clamp-1">
                            {book.title}
                        </h4>
                        <p class="text-xs text-gray-500 line-clamp-1">
                            {book.author}
                        </p>
                        <div class="mt-2 flex gap-2">
                            <span
                                class="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-line text-muted capitalize"
                            >
                                {book.status}
                            </span>
                        </div>
                    </div>
                </div>
            {/each}
            {#if libraryStore.reading.length === 0}
                <div class="text-center text-gray-600 py-4 text-sm">
                    No books currently reading.
                </div>
            {/if}
        </div>
    </div>

    <!-- List -->
    <div>
        <h3 class="text-sm text-gray-500 uppercase tracking-widest mb-3">
            All Books
        </h3>
        <div class="grid grid-cols-2 gap-4">
            {#each libraryStore.books as book}
                <div
                    class="card-subtle flex flex-col justify-between aspect-[2/3] text-left w-full h-full active:scale-95 transition-transform cursor-pointer"
                    onclick={() => openBook(book.id)}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === "Enter" && openBook(book.id)}
                >
                    <div
                        class="aspect-[2/3] rounded-lg mb-3 flex items-center justify-center text-white/50 relative overflow-hidden bg-surface"
                    >
                        {#if book.cover && book.cover.startsWith("http")}
                            <img
                                src={book.cover}
                                alt={book.title}
                                class="absolute inset-0 w-full h-full object-cover opacity-80"
                            />
                        {:else}
                            <div
                                class="absolute inset-0 {book.cover} opacity-20"
                            ></div>
                            <Book size={20} />
                        {/if}
                        {#if book.status === "Done"}
                            <div
                                class="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"
                            ></div>
                        {/if}
                    </div>
                    <h4 class="font-medium text-white text-sm line-clamp-1">
                        {book.title}
                    </h4>
                    <p class="text-xs text-gray-500 line-clamp-1">
                        {book.author}
                    </p>
                </div>
            {/each}
            <button
                class="aspect-[2/3] rounded-xl border border-dashed border-neutral-800 flex items-center justify-center text-gray-600 hover:border-gray-600 hover:text-gray-400 transition-colors"
                onclick={() => (isAddModalOpen = true)}
            >
                <Plus size={24} />
            </button>
        </div>
    </div>
</div>

<AddBookModal bind:isOpen={isAddModalOpen} />
<BookDetailsModal bind:isOpen={isDetailsModalOpen} bookId={selectedBookId} />
