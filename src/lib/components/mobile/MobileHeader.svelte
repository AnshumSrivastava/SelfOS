<script>
    import { Bell, Search } from "lucide-svelte";
    import { searchStore } from "$lib/stores/search.svelte";
</script>

<header
    class="h-16 flex items-center justify-between px-6 sticky top-0 z-40 bg-black/80 backdrop-blur-sm"
>
    <div class="flex items-center gap-3"></div>

    <div class="flex items-center gap-4">
        <button
            onclick={() => searchStore.open()}
            class="text-gray-400 hover:text-white transition-colors"
        >
            <Search size={22} />
        </button>
        <button
            class="text-gray-400 hover:text-white transition-colors relative"
        >
            <Bell size={22} />
            <span
                class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-black"
            ></span>
        </button>
    </div>
</header>
