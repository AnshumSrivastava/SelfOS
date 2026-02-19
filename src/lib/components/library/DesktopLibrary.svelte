<script lang="ts">
    import { Plus, Zap, BookOpen, Clock, Star } from "lucide-svelte";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import { libraryStore } from "$lib/stores/library.svelte";
    import BookCard from "./BookCard.svelte";
    import AddBookModal from "./AddBookModal.svelte";
    import BookDetailsModal from "./BookDetailsModal.svelte";
    import QuickThoughtModal from "./QuickThoughtModal.svelte";

    let activeTab = $state("All Books");

    let isAddModalOpen = $state(false);
    let isDetailsModalOpen = $state(false);
    let isQuickThoughtOpen = $state(false);
    let selectedBookId = $state<string | null>(null);

    let filteredBooks = $derived.by(() => {
        let books = libraryStore.books;

        // Filter by Status Tab
        if (activeTab === "Reading") {
            books = libraryStore.reading;
        } else if (activeTab === "Done") {
            books = books.filter((b) => b.status === "Done");
        } else if (activeTab === "Want to Read") {
            books = books.filter((b) => b.status === "Want to Read");
        } else if (activeTab === "Paused") {
            books = books.filter((b) => b.status === "Paused");
        }

        return books;
    });

    function openBookDetails(id: string) {
        selectedBookId = id;
        isDetailsModalOpen = true;
    }

    const tabs = ["All Books", "Reading", "Want to Read", "Paused", "Done"];
</script>

<div class="page-container space-y-12 pb-24">
    <PageHeader
        title="Intellectual Lab"
        subtitle="Continuous synthesis and systematic insight capture."
    >
        <div class="flex items-center gap-3">
            <button
                class="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-muted hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                onclick={() => (isQuickThoughtOpen = true)}
            >
                <Zap size={14} class="text-primary" /> Capture Insight
            </button>
            <button
                class="btn btn-primary px-6 h-[46px] flex items-center gap-2"
                onclick={() => (isAddModalOpen = true)}
            >
                <Plus size={18} /> New Volume
            </button>
        </div>
    </PageHeader>

    <!-- Active Reading Highlight -->
    {#if libraryStore.reading.length > 0}
        <div class="space-y-6">
            <div class="flex items-center gap-2 px-1">
                <BookOpen size={16} class="text-primary" />
                <h3
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                >
                    Deep Work / Active Reading
                </h3>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {#each libraryStore.reading.slice(0, 2) as activeBook}
                    <button
                        onclick={() => openBookDetails(activeBook.id)}
                        class="group relative flex gap-8 p-10 rounded-[32px] bg-white/5 border border-white/5 hover:border-primary/30 transition-all text-left"
                    >
                        <div
                            class="w-32 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-500"
                        >
                            {#if activeBook.coverUrl && activeBook.coverUrl.startsWith("http")}
                                <img
                                    src={activeBook.coverUrl}
                                    alt={activeBook.title}
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <div
                                    class="w-full h-full bg-neutral-900 flex items-center justify-center text-muted/20"
                                >
                                    <BookOpen size={32} />
                                </div>
                            {/if}
                        </div>
                        <div class="flex flex-col justify-center space-y-4">
                            <div>
                                <h4
                                    class="text-2xl font-light text-theme-text-strong tracking-tighter mb-1 line-clamp-2"
                                >
                                    {activeBook.title}
                                </h4>
                                <p
                                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                                >
                                    {activeBook.author}
                                </p>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="flex gap-1">
                                    {#each Array(5) as _, i}
                                        <Star
                                            size={10}
                                            class={i < (activeBook.rating || 0)
                                                ? "text-primary fill-primary"
                                                : "text-white/10"}
                                        />
                                    {/each}
                                </div>
                                <span
                                    class="text-[9px] font-bold text-muted/40 uppercase tracking-widest flex items-center gap-1"
                                >
                                    <Clock size={10} />
                                    {new Date(
                                        activeBook.lastActivityDate,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div
                            class="absolute top-8 right-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Zap size={20} />
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Filtering & Collection -->
    <div class="space-y-8">
        <div class="flex items-center justify-between border-b border-white/5">
            <div class="flex gap-10">
                {#each tabs as tab}
                    <button
                        class="pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative {activeTab ===
                        tab
                            ? 'text-primary'
                            : 'text-muted hover:text-white'}"
                        onclick={() => (activeTab = tab)}
                    >
                        {tab}
                        {#if activeTab === tab}
                            <div
                                class="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                            ></div>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <div
            class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-10 gap-y-16"
        >
            {#each filteredBooks as book (book.id)}
                <BookCard {book} onclick={() => openBookDetails(book.id)} />
            {/each}

            <button
                class="aspect-[2/3] rounded-[32px] border border-dashed border-white/10 flex flex-col items-center justify-center text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group w-full"
                onclick={() => (isAddModalOpen = true)}
            >
                <Plus
                    size={32}
                    class="mb-4 group-hover:scale-110 transition-transform"
                />
                <span class="text-[10px] font-black uppercase tracking-[0.2em]"
                    >Add New Volume</span
                >
            </button>
        </div>
    </div>
</div>

<AddBookModal bind:isOpen={isAddModalOpen} />
<BookDetailsModal bind:isOpen={isDetailsModalOpen} bookId={selectedBookId} />
<QuickThoughtModal bind:isOpen={isQuickThoughtOpen} />
