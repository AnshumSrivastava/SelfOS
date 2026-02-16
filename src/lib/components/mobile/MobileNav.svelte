<script lang="ts">
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import {
        House,
        CheckSquare,
        RotateCw,
        Zap,
        Menu,
        HelpCircle,
        Calendar,
        Layers,
        Target,
        Edit3,
        Library,
        BookOpen,
        DollarSign,
        Heart,
        Salad,
        Settings,
    } from "lucide-svelte";
    import { tutorialStore } from "$lib/stores/tutorial.svelte";
    import { settings } from "$lib/stores/settings.svelte";
    import { fade } from "svelte/transition";
    import MobileMenu from "./MobileMenu.svelte";

    let isMenuOpen = $state(false);

    // Map of keys to their display properties
    const linkMap: Record<string, { name: string; icon: any; href: string }> = {
        dashboard: { name: "Home", icon: House, href: `${base}/` },
        tasks: { name: "Tasks", icon: CheckSquare, href: `${base}/tasks` },
        habits: { name: "Habits", icon: RotateCw, href: `${base}/habits` },
        focus: { name: "Focus", icon: Zap, href: `${base}/focus` },
        calendar: {
            name: "Calendar",
            icon: Calendar,
            href: `${base}/calendar`,
        },
        projects: { name: "Projects", icon: Layers, href: `${base}/para` },
        goals: { name: "Goals", icon: Target, href: `${base}/goals` },
        notes: { name: "Notes", icon: Edit3, href: `${base}/notes` },
        library: { name: "Library", icon: Library, href: `${base}/library` },
        journal: { name: "Journal", icon: BookOpen, href: `${base}/journal` },
        finance: { name: "Finance", icon: DollarSign, href: `${base}/finance` },
        fitness: { name: "Fitness", icon: Heart, href: `${base}/fitness` },
        nutrition: {
            name: "Nutrition",
            icon: Salad,
            href: `${base}/nutrition`,
        },
        settings: {
            name: "Settings",
            icon: Settings,
            href: `${base}/settings`,
        },
    };

    // Derived links based on settings
    const activeLinks = $derived(
        settings.mobileNavItems?.map((key) => linkMap[key]).filter(Boolean) || [
            linkMap.dashboard,
            linkMap.tasks,
            linkMap.habits,
            linkMap.focus,
        ],
    );

    let pressTimer: any;
    function handleTouchStart() {
        pressTimer = setTimeout(() => {
            tutorialStore.showHub = true;
        }, 800);
    }
    function handleTouchEnd() {
        clearTimeout(pressTimer);
    }
</script>

<nav
    class="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none flex justify-center"
>
    <div
        class="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-6 py-4 flex items-center gap-8 shadow-2xl shadow-black/50 pointer-events-auto"
    >
        {#each activeLinks as link}
            {@const isActive =
                link.href === `${base}/`
                    ? $page.url.pathname === link.href
                    : $page.url.pathname.startsWith(link.href)}
            <a
                href={link.href}
                data-sveltekit-preload-hover
                aria-label={link.name}
                class="relative flex flex-col items-center justify-center transition-all {isActive
                    ? 'text-white scale-110'
                    : 'text-white/40 hover:text-white/70'}"
            >
                <link.icon
                    size={26}
                    strokeWidth={isActive ? 2.5 : 2}
                    class="transition-all drop-shadow-lg"
                />
                {#if isActive}
                    <div
                        class="absolute -bottom-2 w-1 h-1 bg-white rounded-full"
                        in:fade
                    ></div>
                {/if}
            </a>
        {/each}

        <div class="w-px h-6 bg-white/10"></div>

        <button
            onclick={() => (isMenuOpen = true)}
            ontouchstart={handleTouchStart}
            ontouchend={handleTouchEnd}
            aria-label="Menu and Help (Long press for Help)"
            class="flex flex-col items-center justify-center transition-all {isMenuOpen
                ? 'text-white scale-110'
                : 'text-white/40 hover:text-white/70'}"
        >
            <Menu size={26} strokeWidth={2} />
        </button>
    </div>
</nav>

<MobileMenu bind:isOpen={isMenuOpen} />
