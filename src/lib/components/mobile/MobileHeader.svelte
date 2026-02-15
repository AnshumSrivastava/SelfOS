<script>
    import { Search } from "lucide-svelte";
    import { searchStore } from "$lib/stores/search.svelte";
    import { fade } from "svelte/transition";

    let { title = "SelfOS", action = null, showMenu = true } = $props();
</script>

<header
    class="h-16 flex items-center justify-between px-6 sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-line"
>
    <div class="flex flex-col">
        {#if title === "SelfOS"}
            <div class="flex items-center gap-2" in:fade>
                <div class="w-1.5 h-6 bg-primary rounded-full"></div>
                <span class="text-xl font-bold tracking-tight text-white"
                    >SelfOS</span
                >
            </div>
        {:else}
            <h1 class="text-lg font-bold text-white tracking-tight" in:fade>
                {title}
            </h1>
        {/if}
    </div>

    <div class="flex items-center gap-4">
        {#if action}
            {@render action()}
        {/if}

        <button
            onclick={() => searchStore.open()}
            class="p-2 rounded-xl bg-surface/50 border border-line/50 text-muted active:scale-95 transition-all"
            aria-label="Open Search"
        >
            <Search size={18} />
        </button>

        {#if showMenu}
            <!-- Note: The main layout handles the menu visibility but we can trigger it here if needed -->
            <!-- For now, we'll keep it consistent with the existing nav triggering the menu -->
        {/if}
    </div>
</header>
