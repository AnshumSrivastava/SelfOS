<script lang="ts">
    import { Plus, Zap } from "lucide-svelte";
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
</script>

<div class="page-container space-y-8 pb-12">
    <PageHeader
        title="Bookshelf"
        subtitle="Quick capture. Continuous reflection."
    >
        <button
            class="btn btn-outline flex items-center gap-2"
            onclick={() => (isQuickThoughtOpen = true)}
        >
            <Zap size={18} /> Quick Thought
        </button>
        <button
            class="btn btn-primary flex items-center gap-2"
            onclick={() => (isAddModalOpen = true)}
        >
            <Plus size={18} /> Add Book
        </button>
    </PageHeader>

    <!-- Filters -->
    <div class="space-y-4">
        <div class="flex gap-8 border-b border-line overflow-x-auto">
            {#each ["All Books", "Reading", "Want to Read", "Paused", "Done"] as tab}
                <button
                    class="pb-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap {activeTab ===
                    tab
                        ? 'text-primary border-primary'
                        : 'text-muted border-transparent hover:text-white'}"
                    onclick={() => (activeTab = tab)}
                >
                    {tab}
                </button>
            {/each}
        </div>
    </div>

    <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
        role="grid"
    >
        {#each filteredBooks as book (book.id)}
            <BookCard {book} onclick={() => openBookDetails(book.id)} />
        {/each}

        <!-- Add New Placeholder -->
        <button
            class="aspect-[2/3] rounded-lg border-2 border-dashed border-line flex flex-col items-center justify-center text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group w-full"
            onclick={() => (isAddModalOpen = true)}
        >
            <Plus
                size={32}
                class="mb-2 group-hover:scale-110 transition-transform"
            />
            <span class="text-sm font-medium">Add Book</span>
        </button>
    </div>
</div>

<AddBookModal bind:isOpen={isAddModalOpen} />
<BookDetailsModal bind:isOpen={isDetailsModalOpen} bookId={selectedBookId} />
<QuickThoughtModal bind:isOpen={isQuickThoughtOpen} />
