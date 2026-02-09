<script>
    import { Book, Check, Star, Plus } from "lucide-svelte";

    const books = [
        {
            title: "Atomic Habits",
            author: "James Clear",
            status: "Reading",
            progress: 45,
            rating: 5,
            cover: "bg-blue-500",
        },
        {
            title: "Deep Work",
            author: "Cal Newport",
            status: "Completed",
            progress: 100,
            rating: 5,
            cover: "bg-yellow-500",
        },
        {
            title: "The Psychology of Money",
            author: "Morgan Housel",
            status: "To Read",
            progress: 0,
            rating: 0,
            cover: "bg-green-500",
        },
        {
            title: "Show Your Work!",
            author: "Austin Kleon",
            status: "Completed",
            progress: 100,
            rating: 4,
            cover: "bg-red-500",
        },
    ];
</script>

<div class="space-y-8 pb-12">
    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-3xl font-bold text-white mb-2">Bookshelf</h1>
            <p class="text-muted">Track your reading & insights.</p>
        </div>
        <button class="btn btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Book
        </button>
    </div>

    <div class="flex gap-8 border-b border-line">
        {#each ["All Books", "Reading", "To Read", "Completed", "Favorites"] as tab}
            <button
                class="pb-4 text-sm font-medium border-b-2 border-transparent hover:text-white transition-colors {tab ===
                'Reading'
                    ? 'text-primary border-primary'
                    : 'text-muted'}"
            >
                {tab}
            </button>
        {/each}
    </div>

    <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
    >
        {#each books as book}
            <div class="group cursor-pointer">
                <!-- Mock Cover -->
                <div
                    class="aspect-[2/3] rounded-lg shadow-lg relative overflow-hidden mb-4 bg-surface border border-line group-hover:shadow-primary/20 transition-all duration-300 group-hover:-translate-y-2"
                >
                    <div
                        class="absolute inset-0 {book.cover} opacity-20 group-hover:opacity-30 transition-opacity"
                    ></div>
                    <div
                        class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
                    >
                        <Book size={32} class="mb-2 text-white/50" />
                        <h3 class="font-bold text-white line-clamp-2">
                            {book.title}
                        </h3>
                        <p class="text-xs text-muted mt-1">{book.author}</p>
                    </div>

                    {#if book.status === "Reading"}
                        <div
                            class="absolute bottom-0 left-0 w-full h-1 bg-background"
                        >
                            <div
                                class="h-full bg-primary"
                                style="width: {book.progress}%"
                            ></div>
                        </div>
                    {/if}
                    {#if book.status === "Completed"}
                        <div
                            class="absolute top-2 right-2 bg-primary text-black rounded-full p-1"
                        >
                            <Check size={12} />
                        </div>
                    {/if}
                </div>

                <div>
                    <div class="flex justify-between items-center mb-1">
                        <span
                            class="text-xs text-muted px-2 py-0.5 rounded-full border border-line"
                            >{book.status}</span
                        >
                        {#if book.rating > 0}
                            <div class="flex gap-0.5 text-yellow-500">
                                {#each Array(book.rating) as _}<Star
                                        size={10}
                                        fill="currentColor"
                                    />{/each}
                            </div>
                        {/if}
                    </div>
                    {#if book.status === "Reading"}
                        <p class="text-xs text-muted mt-1">
                            {book.progress}% complete
                        </p>
                    {/if}
                </div>
            </div>
        {/each}

        <!-- Add New Placeholder -->
        <div
            class="aspect-[2/3] rounded-lg border-2 border-dashed border-line flex flex-col items-center justify-center text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
        >
            <Plus
                size={32}
                class="mb-2 group-hover:scale-110 transition-transform"
            />
            <span class="text-sm font-medium">Add Book</span>
        </div>
    </div>
</div>
