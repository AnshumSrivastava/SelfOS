<script lang="ts">
    import { X, Book, Send } from "lucide-svelte";
    import { libraryStore } from "$lib/stores/library.svelte";

    let { isOpen = $bindable(false) } = $props();

    let thought = $state("");
    let selectedBookId = $state<string | null>(null);

    // Auto-select most recently active book
    $effect(() => {
        if (isOpen && !selectedBookId && libraryStore.books.length > 0) {
            selectedBookId = libraryStore.books[0].id;
        }
    });

    function handleSubmit() {
        if (!selectedBookId || !thought.trim()) return;

        libraryStore.addToScratchpad(selectedBookId, thought.trim());

        // Reset and close
        thought = "";
        isOpen = false;
        // Keep selectedBookId for likely next use
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
    >
        <div
            class="w-full max-w-lg bg-surface border border-line rounded-xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200"
        >
            <button
                onclick={() => (isOpen = false)}
                class="absolute top-4 right-4 text-muted hover:text-white transition-colors"
                aria-label="Close"
            >
                <X size={20} />
            </button>

            <h2 class="text-xl font-bold text-white mb-4">Quick Thought</h2>

            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                class="space-y-4"
            >
                <textarea
                    bind:value={thought}
                    placeholder="What's on your mind?"
                    rows="4"
                    class="w-full bg-background border border-line rounded-lg p-4 text-white focus:outline-none focus:border-primary resize-none text-lg"
                    required
                    autofocus
                    onkeydown={(e) =>
                        e.key === "Enter" &&
                        !e.shiftKey &&
                        (e.preventDefault(), handleSubmit())}
                ></textarea>

                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <label
                            for="book-select"
                            class="text-xs text-muted uppercase tracking-wider font-medium mb-1 block"
                            >Save to Book</label
                        >
                        <div class="relative">
                            <select
                                id="book-select"
                                bind:value={selectedBookId}
                                class="w-full bg-background border border-line rounded-lg pl-10 pr-4 py-2 text-white appearance-none focus:outline-none focus:border-primary text-sm truncate"
                            >
                                {#each libraryStore.books as book}
                                    <option value={book.id}>{book.title}</option
                                    >
                                {/each}
                            </select>
                            <Book
                                size={16}
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!thought.trim()}
                        class="h-10 px-6 bg-primary text-black font-medium rounded-lg hover:brightness-110 transition-all flex items-center gap-2 self-end disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} /> Save
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
