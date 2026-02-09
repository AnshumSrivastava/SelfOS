<script>
    import {
        X,
        House,
        RotateCw,
        DollarSign,
        Heart,
        Salad,
        CheckSquare,
        Edit3,
        Library,
        Target,
        Layers,
        BookOpen,
        Zap,
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { page } from "$app/stores";
    import { base } from "$app/paths";

    let { isOpen = $bindable(false) } = $props();

    const links = [
        {
            name: "Hub",
            icon: House,
            href: `${base}/`,
            color: "text-white",
            bg: "bg-white/10",
        },
        {
            name: "Tasks",
            icon: CheckSquare,
            href: `${base}/tasks`,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            name: "Habits",
            icon: RotateCw,
            href: `${base}/habits`,
            color: "text-orange-400",
            bg: "bg-orange-400/10",
        },
        {
            name: "Finance",
            icon: DollarSign,
            href: `${base}/finance`,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
        {
            name: "Fitness",
            icon: Heart,
            href: `${base}/fitness`,
            color: "text-red-400",
            bg: "bg-red-400/10",
        },
        {
            name: "Nutrition",
            icon: Salad,
            href: `${base}/nutrition`,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
        },
        {
            name: "Notes",
            icon: Edit3,
            href: `${base}/notes`,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
        },
        {
            name: "Library",
            icon: Library,
            href: `${base}/library`,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
        {
            name: "Goals",
            icon: Target,
            href: `${base}/goals`,
            color: "text-pink-400",
            bg: "bg-pink-400/10",
        },
        {
            name: "Projects",
            icon: Layers,
            href: `${base}/para`,
            color: "text-cyan-400",
            bg: "bg-cyan-400/10",
        },
        {
            name: "Journal",
            icon: BookOpen,
            href: `${base}/journal`,
            color: "text-indigo-400",
            bg: "bg-indigo-400/10",
        },
        {
            name: "Focus",
            icon: Zap,
            href: `${base}/focus`,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
        },
    ];
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[60] flex flex-col bg-black/90 backdrop-blur-xl"
        transition:fade={{ duration: 200 }}
    >
        <!-- Header -->
        <div
            class="flex items-center justify-between px-6 py-4 border-b border-white/10"
        >
            <span class="text-lg font-medium text-white">Menu</span>
            <button
                onclick={() => (isOpen = false)}
                class="p-2 rounded-full bg-white/10 text-white"
            >
                <X size={20} />
            </button>
        </div>

        <!-- Grid -->
        <div
            class="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-4 content-start"
        >
            {#each links as link}
                {@const isActive = $page.url.pathname === link.href}
                <a
                    href={link.href}
                    onclick={() => (isOpen = false)}
                    class="flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/5 active:scale-95 transition-all {isActive
                        ? 'ring-1 ring-white/50 bg-white/10'
                        : ''}"
                >
                    <div
                        class="w-12 h-12 rounded-full {link.bg} {link.color} flex items-center justify-center"
                    >
                        <link.icon size={24} />
                    </div>
                    <span class="text-xs font-medium text-gray-400 text-center"
                        >{link.name}</span
                    >
                </a>
            {/each}
        </div>
    </div>
{/if}
