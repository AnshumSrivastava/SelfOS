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
        Settings, // Import Settings
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { settings } from "$lib/stores/settings.svelte";

    let { isOpen = $bindable(false) } = $props();

    const links = [
        {
            name: "Hub",
            icon: House,
            href: `${base}/`,
            color: "text-white",
            bg: "bg-white/10",
            key: "dashboard",
        },
        {
            name: "Tasks",
            icon: CheckSquare,
            href: `${base}/tasks`,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            key: "tasks",
        },
        {
            name: "Habits",
            icon: RotateCw,
            href: `${base}/habits`,
            color: "text-orange-400",
            bg: "bg-orange-400/10",
            key: "habits",
        },
        {
            name: "Finance",
            icon: DollarSign,
            href: `${base}/finance`,
            color: "text-green-400",
            bg: "bg-green-400/10",
            key: "finance",
        },
        {
            name: "Fitness",
            icon: Heart,
            href: `${base}/fitness`,
            color: "text-red-400",
            bg: "bg-red-400/10",
            key: "fitness",
        },
        {
            name: "Nutrition",
            icon: Salad,
            href: `${base}/nutrition`,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            key: "nutrition",
        },
        {
            name: "Notes",
            icon: Edit3,
            href: `${base}/notes`,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            key: "notes",
        },
        {
            name: "Library",
            icon: Library,
            href: `${base}/library`,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            key: "library",
        },
        {
            name: "Goals",
            icon: Target,
            href: `${base}/goals`,
            color: "text-pink-400",
            bg: "bg-pink-400/10",
            key: "goals",
        },
        {
            name: "Projects",
            icon: Layers,
            href: `${base}/para`,
            color: "text-cyan-400",
            bg: "bg-cyan-400/10",
            key: "projects",
        },
        {
            name: "Journal",
            icon: BookOpen,
            href: `${base}/journal`,
            color: "text-indigo-400",
            bg: "bg-indigo-400/10",
            key: "journal",
        },
        {
            name: "Focus",
            icon: Zap,
            href: `${base}/focus`,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            key: "focus",
        },
        {
            name: "Settings",
            icon: Settings,
            href: `${base}/settings`,
            color: "text-gray-400",
            bg: "bg-gray-400/10",
            key: "settings",
        },
    ];

    let filteredLinks = $derived(
        links.filter((link) => settings.features[link.key]),
    );
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[60] flex flex-col bg-[var(--color-background)]/95 backdrop-blur-xl transition-colors duration-300"
        transition:fade={{ duration: 200 }}
    >
        <!-- Header -->
        <div
            class="flex items-center justify-between px-6 py-4 border-b border-[var(--color-line)]"
        >
            <span class="text-lg font-medium text-[var(--color-text)]"
                >Menu</span
            >
            <button
                onclick={() => (isOpen = false)}
                class="p-2 rounded-full bg-[var(--color-text)]/10 text-[var(--color-text)]"
            >
                <X size={20} />
            </button>
        </div>

        <!-- Grid -->
        <div
            class="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-4 content-start"
        >
            {#each filteredLinks as link}
                {@const isActive = $page.url.pathname === link.href}
                <a
                    href={link.href}
                    onclick={() => (isOpen = false)}
                    class="flex flex-col items-center gap-3 p-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] active:scale-95 transition-all {isActive
                        ? 'ring-1 ring-primary/50 bg-primary/5'
                        : ''}"
                >
                    <div
                        class="w-12 h-12 rounded-full {link.bg} {link.color} flex items-center justify-center"
                    >
                        <link.icon size={24} />
                    </div>
                    <span class="text-xs font-medium text-muted text-center"
                        >{link.name}</span
                    >
                </a>
            {/each}
        </div>
    </div>
{/if}
