<script lang="ts">
    import { X } from "lucide-svelte";
    import { libraryStore } from "$lib/stores/library.svelte";

    let { isOpen = $bindable(false) } = $props();

    let title = $state("");
    let author = $state("");
    let why = $state("");
    let coverColor = $state("bg-blue-500");
    let coverUrl = $state(""); // New state for cover URL

    let searchQuery = $state("");
    let searchResults = $state<any[]>([]);
    let isSearching = $state(false);

    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-teal-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-slate-500",
    ];

    async function searchBooks() {
        if (!searchQuery.trim()) return;
        isSearching = true;
        try {
            const res = await fetch(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(
                    searchQuery,
                )}&limit=5`,
            );
            const data = await res.json();
            searchResults = data.docs;
        } catch (e) {
            console.error("Failed to search books", e);
        } finally {
            isSearching = false;
        }
    }

    function selectBook(book: any) {
        title = book.title;
        author = book.author_name ? book.author_name[0] : "";
        if (book.cover_i) {
            coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
            coverColor = ""; // Clear color if using URL
        } else {
            coverUrl = "";
            coverColor = "bg-blue-500"; // Default fallback
        }
        searchResults = [];
        searchQuery = "";
    }

    function handleSubmit() {
        if (!title) return;

        libraryStore.addBook({
            title,
            author,
            why,
            coverUrl: coverUrl || coverColor,
        });

        // Reset and close
        title = "";
        author = "";
        why = "";
        coverUrl = "";
        searchQuery = "";
        coverColor = "bg-blue-500";
        isOpen = false;
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
        <div
            class="w-full max-w-md bg-surface border border-line rounded-xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        >
            <button
                onclick={() => (isOpen = false)}
                class="absolute top-4 right-4 text-muted hover:text-white transition-colors"
                aria-label="Close"
            >
                <X size={20} />
            </button>

            <h2 class="text-xl font-bold text-white mb-6">
                Quick Capture Book
            </h2>

            <div class="mb-6 space-y-2">
                <label for="book-search" class="text-sm text-muted"
                    >Search Open Library</label
                >
                <div class="flex gap-2">
                    <input
                        id="book-search"
                        type="text"
                        bind:value={searchQuery}
                        placeholder="Search by title..."
                        class="flex-1 bg-background border border-line rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                        onkeydown={(e) => e.key === "Enter" && searchBooks()}
                    />
                    <button
                        onclick={searchBooks}
                        disabled={isSearching}
                        class="px-4 py-2 bg-surface border border-line rounded-lg text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        {isSearching ? "..." : "Search"}
                    </button>
                </div>
                {#if searchResults.length > 0}
                    <div
                        class="bg-background border border-line rounded-lg mt-2 overflow-hidden"
                    >
                        {#each searchResults as result}
                            <button
                                class="w-full text-left p-3 hover:bg-surface border-b border-line last:border-0 flex gap-3 items-center"
                                onclick={() => selectBook(result)}
                            >
                                {#if result.cover_i}
                                    <img
                                        src={`https://covers.openlibrary.org/b/id/${result.cover_i}-S.jpg`}
                                        alt={result.title}
                                        class="w-8 h-12 object-cover rounded bg-surface"
                                    />
                                {:else}
                                    <div
                                        class="w-8 h-12 bg-surface rounded flex items-center justify-center text-xs text-muted"
                                    >
                                        ?
                                    </div>
                                {/if}
                                <div>
                                    <div
                                        class="text-sm font-medium text-white line-clamp-1"
                                    >
                                        {result.title}
                                    </div>
                                    <div
                                        class="text-xs text-muted line-clamp-1"
                                    >
                                        {result.author_name
                                            ? result.author_name.join(", ")
                                            : "Unknown"}
                                    </div>
                                </div>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>

            <div class="relative flex py-2 items-center">
                <div class="flex-grow border-t border-line"></div>
                <span class="flex-shrink mx-4 text-muted text-xs uppercase"
                    >Or enter manually</span
                >
                <div class="flex-grow border-t border-line"></div>
            </div>

            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                class="space-y-4"
            >
                <div>
                    {#if coverUrl}
                        <div class="flex justify-center mb-4">
                            <img
                                src={coverUrl}
                                alt="Selected cover"
                                class="w-24 h-36 object-cover rounded shadow-lg"
                            />
                            <button
                                type="button"
                                onclick={() => (coverUrl = "")}
                                class="ml-2 text-xs text-red-400 hover:text-red-300 self-start"
                                >Remove</button
                            >
                        </div>
                    {/if}
                </div>

                <div class="space-y-1">
                    <label for="book-title" class="text-sm text-muted"
                        >Title (Required)</label
                    >
                    <input
                        id="book-title"
                        type="text"
                        bind:value={title}
                        placeholder="Book Title"
                        class="w-full bg-background border border-line rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                        required
                    />
                </div>

                <div class="space-y-1">
                    <label for="book-author" class="text-sm text-muted"
                        >Author (Optional)</label
                    >
                    <input
                        id="book-author"
                        type="text"
                        bind:value={author}
                        placeholder="Author Name"
                        class="w-full bg-background border border-line rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                    />
                </div>

                <div class="space-y-1">
                    <label for="book-why" class="text-sm text-muted"
                        >Why this book?</label
                    >
                    <textarea
                        id="book-why"
                        bind:value={why}
                        placeholder="Capturing intent..."
                        rows="3"
                        class="w-full bg-background border border-line rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary resize-none"
                    ></textarea>
                </div>

                <div class="space-y-2">
                    <span class="text-sm text-muted"
                        >Cover Color (Fallback)</span
                    >
                    <div class="flex flex-wrap gap-2">
                        {#each colors as color}
                            <button
                                type="button"
                                aria-label="Select color {color}"
                                class="w-8 h-8 rounded-full {color} ring-2 ring-offset-2 ring-offset-surface transition-all {coverColor ===
                                color
                                    ? 'ring-white'
                                    : 'ring-transparent opacity-70 hover:opacity-100'}"
                                onclick={() => {
                                    coverColor = color;
                                    coverUrl = ""; // Clear URL if color selected
                                }}
                            ></button>
                        {/each}
                    </div>
                </div>

                <div class="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onclick={() => (isOpen = false)}
                        class="px-4 py-2 text-muted hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-6 py-2 bg-primary text-black font-medium rounded-lg hover:brightness-110 transition-all"
                    >
                        Save Book
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
