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
    import { fade, scale } from "svelte/transition";
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
    class="fixed bottom-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-3xl border-t border-white/5 flex items-center justify-around px-4 pb-[env(safe-area-inset-bottom)] h-[calc(4rem+env(safe-area-inset-bottom))]"
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
            aria-current={isActive ? "page" : undefined}
            class="relative flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all {isActive
                ? 'text-primary'
                : 'text-muted/40 hover:text-white'}"
        >
            <link.icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                class="transition-all duration-300 {isActive
                    ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,255,157,0.3)]'
                    : 'opacity-60'}"
            />
            <span
                class="text-[9px] font-bold tracking-[0.05em] uppercase transition-opacity {isActive
                    ? 'opacity-100'
                    : 'opacity-40'}"
            >
                {link.name}
            </span>
        </a>
    {/each}

    <!-- Menu / Help Toggle -->
    <button
        onclick={() => (isMenuOpen = true)}
        ontouchstart={handleTouchStart}
        ontouchend={handleTouchEnd}
        aria-label="Menu and Help (Long press for Help)"
        class="relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all {isMenuOpen
            ? 'text-primary'
            : 'text-muted hover:text-white'}"
    >
        <Menu size={22} strokeWidth={isMenuOpen ? 2.5 : 2} />
        <span
            class="text-[10px] font-bold tracking-tight uppercase {isMenuOpen
                ? 'opacity-100'
                : 'opacity-40'}"
        >
            Menu
        </span>
    </button>
</nav>

<MobileMenu bind:isOpen={isMenuOpen} />
