<script>
    import { Bell, Search } from "lucide-svelte";
    import { searchStore } from "$lib/stores/search.svelte";
    import Logo from "$lib/components/ui/Logo.svelte";
</script>

<header
    class="h-14 flex items-center justify-between px-6 sticky top-0 z-40 bg-[var(--color-background)]"
>
    <div class="flex items-center gap-2">
        <Logo size={20} />
        <span
            class="text-base font-bold tracking-tight text-[var(--color-text)]"
            >SelfOS</span
        >
    </div>

    <div class="flex items-center gap-5">
        <button
            onclick={() => searchStore.open()}
            class="text-[var(--color-muted)] hover:text-[var(--color-text)] active:scale-95 transition-all"
        >
            <Search size={18} />
        </button>
        <button
            class="text-[var(--color-muted)] hover:text-[var(--color-text)] active:scale-95 transition-all relative"
        >
            <Bell size={18} />
            <span
                class="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full"
            ></span>
        </button>
    </div>
</header>
