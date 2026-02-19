<script lang="ts">
    import { Book as BookIcon, Check, Star, Clock } from "lucide-svelte";
    import type { Book } from "$lib/stores/library.svelte";

    let { book, onclick } = $props<{ book: Book; onclick: () => void }>();

    const statusConfig: Record<
        string,
        { label: string; color: string; icon: any }
    > = {
        Reading: {
            label: "Active",
            color: "text-primary bg-primary/10 border-primary/20",
            icon: Clock,
        },
        "Want to Read": {
            label: "Next",
            color: "text-secondary bg-secondary/10 border-secondary/20",
            icon: BookIcon,
        },
        Done: {
            label: "Archived",
            color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
            icon: Check,
        },
        Paused: {
            label: "On Hold",
            color: "text-muted bg-white/5 border-white/5",
            icon: Clock,
        },
    };

    const config = $derived(
        statusConfig[book.status] || statusConfig["Want to Read"],
    );
</script>

<div
    class="group cursor-pointer space-y-4"
    {onclick}
    onkeydown={(e) => e.key === "Enter" && onclick()}
    tabindex="0"
    role="button"
>
    <!-- Cover -->
    <div
        class="aspect-[2/3] rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-primary/10 border border-white/5 bg-neutral-900"
    >
        <!-- Background Bloom -->
        <div
            class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"
        ></div>
        {#if book.coverUrl && book.coverUrl.startsWith("http")}
            <img
                src={book.coverUrl}
                alt={book.title}
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
        {:else}
            <div
                class="absolute inset-0 flex items-center justify-center opacity-10"
            >
                <BookIcon size={64} />
            </div>
        {/if}

        <!-- Status Pill Overlay -->
        <div class="absolute top-4 left-4 z-20">
            <div
                class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] backdrop-blur-md flex items-center gap-2 border {config.color}"
            >
                <config.icon size={10} />
                {config.label}
            </div>
        </div>

        {#if book.status === "Done"}
            <div
                class="absolute top-4 right-4 z-20 bg-emerald-500 text-black rounded-full p-1.5 shadow-lg"
            >
                <Check size={12} strokeWidth={3} />
            </div>
        {/if}

        <!-- Hover Info Overlay -->
        <div
            class="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center"
        >
            <BookIcon size={24} class="mb-4 text-primary" />
            <p
                class="text-xs font-bold text-white uppercase tracking-widest leading-relaxed line-clamp-3 mb-2"
            >
                {book.title}
            </p>
            <p
                class="text-[10px] text-muted tracking-widest font-black uppercase"
            >
                {book.author}
            </p>

            {#if (book.rating || 0) > 0}
                <div class="flex gap-1 mt-6">
                    {#each Array(5) as _, i}
                        <Star
                            size={10}
                            class={i < book.rating
                                ? "text-primary fill-primary"
                                : "text-white/10"}
                        />
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <!-- Metadata Below -->
    <div class="px-1 space-y-1">
        <h3
            class="text-sm font-bold text-white tracking-tight line-clamp-1 group-hover:text-primary transition-colors transition-all duration-300"
        >
            {book.title}
        </h3>
        <div class="flex items-center justify-between">
            <p
                class="text-[10px] text-muted font-bold uppercase tracking-widest"
            >
                {book.author}
            </p>
            {#if book.status === "Reading"}
                <span
                    class="text-[8px] font-black text-primary/40 uppercase tracking-[0.2em] flex items-center gap-1"
                >
                    <Clock size={8} /> Active
                </span>
            {/if}
        </div>
    </div>
</div>
