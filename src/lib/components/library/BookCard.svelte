<script lang="ts">
    import { Book as BookIcon, Check, Star } from "lucide-svelte";
    import type { Book } from "$lib/stores/library.svelte";

    let { book, onclick } = $props<{ book: Book; onclick: () => void }>();
</script>

<div
    class="group cursor-pointer"
    {onclick}
    onkeydown={(e) => e.key === "Enter" && onclick()}
    tabindex="0"
    role="button"
>
    <!-- Cover -->
    <div
        class="aspect-[2/3] rounded-lg shadow-lg relative overflow-hidden mb-4 bg-surface border border-line group-hover:shadow-primary/20 transition-all duration-300 group-hover:-translate-y-2"
    >
        {#if book.coverUrl && book.coverUrl.startsWith("http")}
            <img
                src={book.coverUrl}
                alt={book.title}
                class="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
        {:else}
            <div
                class="absolute inset-0 {book.coverUrl} opacity-20 group-hover:opacity-30 transition-opacity"
            ></div>
        {/if}
        <div
            class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 {book.coverUrl &&
            book.coverUrl.startsWith('http')
                ? 'opacity-0 group-hover:opacity-100 bg-black/60 backdrop-blur-sm'
                : ''} transition-all duration-300"
        >
            <BookIcon size={32} class="mb-2 text-white/50" />
            <h3 class="font-bold text-white line-clamp-2 text-sm leading-tight">
                {book.title}
            </h3>
            <p
                class="text-[10px] text-muted mt-1 uppercase tracking-wider font-bold"
            >
                {book.author}
            </p>
        </div>

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
                class="text-[10px] uppercase tracking-wider font-medium text-muted px-2 py-0.5 rounded-full border border-line"
                >{book.status}</span
            >
            {#if (book.rating || 0) > 0}
                <div class="flex gap-0.5 text-yellow-500">
                    {#each Array(book.rating) as _}<Star
                            size={10}
                            fill="currentColor"
                        />{/each}
                </div>
            {/if}
        </div>
        {#if book.status === "Reading"}
            <p class="text-[10px] text-muted mt-1 whitespace-nowrap">
                Updated {new Date(book.lastActivityDate).toLocaleDateString()}
            </p>
        {/if}
    </div>
</div>
