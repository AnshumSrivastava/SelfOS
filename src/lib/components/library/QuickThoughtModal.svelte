<script lang="ts">
    import { Book, Send } from "lucide-svelte";
    import { libraryStore } from "$lib/stores/library.svelte";
    import Modal from "$lib/components/ui/Modal.svelte";

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
    }
</script>

<Modal bind:isOpen title="Capture Insight">
    <form
        onsubmit={(e) => {
            e.preventDefault();
            handleSubmit();
        }}
        class="space-y-6"
    >
        <div class="space-y-2">
            <label
                for="quick-thought-textarea"
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                >Intellectual Stream</label
            >
            <textarea
                id="quick-thought-textarea"
                bind:value={thought}
                placeholder="What's the core insight?"
                rows="5"
                class="w-full bg-white/5 border border-white/5 rounded-2xl p-5 text-white focus:outline-none focus:border-primary/30 resize-none text-lg leading-relaxed placeholder:text-muted/20"
                required
                onkeydown={(e) =>
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    (e.preventDefault(), handleSubmit())}
            ></textarea>
        </div>

        <div class="space-y-4">
            <div class="space-y-2">
                <label
                    for="book-select"
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                    >Contextual Reference</label
                >
                <div class="relative">
                    <Book
                        size={14}
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                    />
                    <select
                        id="book-select"
                        bind:value={selectedBookId}
                        class="w-full bg-white/5 border border-white/5 rounded-2xl pl-11 pr-4 py-4 text-white appearance-none focus:outline-none focus:border-primary/30 text-sm truncate"
                    >
                        {#each libraryStore.books as book}
                            <option value={book.id} class="bg-neutral-900"
                                >{book.title}</option
                            >
                        {/each}
                    </select>
                </div>
            </div>

            <button
                type="submit"
                disabled={!thought.trim()}
                class="w-full py-4 bg-primary text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale shadow-lg shadow-primary/20"
            >
                <Send size={16} /> Archive Insight
            </button>
        </div>
    </form>
</Modal>
