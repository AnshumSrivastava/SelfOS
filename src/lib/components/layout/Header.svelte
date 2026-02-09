<script lang="ts">
    import { Search, Bell, Settings, User } from "lucide-svelte";
</script>

<header
    class="h-16 border-b border-line bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 md:px-8"
>
    <div class="flex items-center gap-4 text-muted">
        <!-- Breadcrumbs or Page Title could go here -->
        <span class="text-sm hidden md:inline"
            >Welcome back, Reference One.</span
        >
        <span class="text-sm md:hidden">SelfOS</span>
    </div>

    <div class="flex items-center gap-4">
        <button
            class="p-2 hover:bg-surface rounded-full transition-colors text-muted hover:text-white"
        >
            <Search size={20} />
        </button>
        <button
            class="p-2 hover:bg-surface rounded-full transition-colors text-muted hover:text-white relative"
        >
            <Bell size={20} />
            <span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"
            ></span>
        </button>
        <div class="h-6 w-px bg-line"></div>
        <button
            class="flex items-center gap-3 pl-2 hover:bg-surface py-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-line"
        >
            <div
                class="w-8 h-8 rounded-full bg-surface border border-line flex items-center justify-center text-white font-bold text-xs"
            >
                ME
            </div>
        </button>
    </div>
</header>
