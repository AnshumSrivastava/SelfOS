<script>
    import { Bell, Search } from "lucide-svelte";
    import { searchStore } from "$lib/stores/search.svelte";
    import Logo from "$lib/components/ui/Logo.svelte";
</script>

<header
    class="h-16 flex items-center justify-between px-6 sticky top-0 z-40 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-[var(--color-line)]/50"
>
    <div class="flex items-center gap-2">
        <Logo size={24} />
        <span class="text-lg font-bold tracking-tight text-[var(--color-text)]"
            >SelfOS</span
        >
    </div>

    <div class="flex items-center gap-4">
        <button
            onclick={() => searchStore.open()}
            class="text-[var(--color-muted)] hover:text-[var(--color-text)] active:scale-90 transition-all"
        >
            <Search size={20} />
        </button>
        <button
            class="text-[var(--color-muted)] hover:text-[var(--color-text)] active:scale-90 transition-all relative"
        >
            <Bell size={20} />
            <span
                class="absolute top-0 right-0 w-2 h-2 bg-[var(--color-primary)] rounded-full border border-[var(--color-background)]"
            ></span>
        </button>
    </div>
</header>
