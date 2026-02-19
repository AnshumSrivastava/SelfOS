<script lang="ts">
    import { libraryStore } from "$lib/stores/library.svelte";
    import { BookOpen, Sparkles, ArrowRight } from "lucide-svelte";
    import { fade } from "svelte/transition";

    const activeBooks = $derived(libraryStore.reading.slice(0, 2));
</script>

<div class="space-y-4">
    <div class="flex items-center gap-2 px-1">
        <BookOpen size={14} class="text-primary/60" />
        <h3
            class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
        >
            Intellectual Momentum
        </h3>
    </div>

    <div class="space-y-3">
        {#each activeBooks as book}
            <div
                class="p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
            >
                <div class="flex gap-4">
                    {#if book.coverUrl}
                        <img
                            src={book.coverUrl}
                            alt={book.title}
                            class="w-12 h-16 rounded-lg object-cover bg-white/5 border border-white/5"
                        />
                    {:else}
                        <div
                            class="w-12 h-16 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center"
                        >
                            <BookOpen size={16} class="text-muted/20" />
                        </div>
                    {/if}
                    <div class="flex-1 min-w-0">
                        <h4
                            class="text-sm font-bold text-white truncate group-hover:text-primary transition-colors"
                        >
                            {book.title}
                        </h4>
                        <p class="text-[10px] text-muted font-medium mb-2">
                            {book.author}
                        </p>
                        <div
                            class="w-full h-1 bg-white/5 rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-primary/40 transition-all duration-700"
                                style="width: 45%"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        {/each}

        {#if activeBooks.length === 0}
            <div
                class="p-6 rounded-3xl border border-dashed border-white/5 text-center"
            >
                <p
                    class="text-[9px] font-black text-muted/30 uppercase tracking-widest"
                >
                    Cognitive Buffer Reserved
                </p>
            </div>
        {/if}
    </div>
</div>
