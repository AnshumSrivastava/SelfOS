<script>
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import {
        House,
        CheckSquare,
        RotateCw,
        Zap,
        Menu,
        HelpCircle,
    } from "lucide-svelte";
    import { tutorialStore } from "$lib/stores/tutorial.svelte";
    import { fade } from "svelte/transition";
    import MobileMenu from "./MobileMenu.svelte";

    let isMenuOpen = $state(false);

    // Primary navigation items - only 5 for clean mobile experience
    const primaryLinks = [
        { name: "Home", icon: House, href: `${base}/` },
        { name: "Tasks", icon: CheckSquare, href: `${base}/tasks` },
        { name: "Habits", icon: RotateCw, href: `${base}/habits` },
        { name: "Focus", icon: Zap, href: `${base}/focus` },
    ];

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
    class="fixed bottom-0 left-0 right-0 bg-[var(--color-background)] border-t border-[var(--color-line)]/50 flex items-center justify-around px-4 z-50"
    style="height: calc(4rem + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom);"
>
    {#each primaryLinks as link}
        {@const isActive =
            link.href === `${base}/`
                ? $page.url.pathname === link.href
                : $page.url.pathname.startsWith(link.href)}
        <a
            href={link.href}
            data-sveltekit-preload-hover
            class="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[64px] {isActive
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-muted)]'}"
        >
            <link.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                class="transition-all"
            />
            <span
                class="text-[9px] font-bold uppercase tracking-wider mt-1 {isActive
                    ? 'opacity-100'
                    : 'opacity-40'} transition-all"
            >
                {link.name}
            </span>
        </a>
    {/each}

    <button
        class="flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[50px] text-[var(--color-muted)]"
        ontouchstart={handleTouchStart}
        ontouchend={handleTouchEnd}
        onclick={() => (tutorialStore.showHub = true)}
        aria-label="Help & Tutorial"
    >
        <HelpCircle size={22} strokeWidth={2} />
        <span
            class="text-[9px] font-bold uppercase tracking-wider mt-1 opacity-40"
            >Help</span
        >
    </button>

    <button
        onclick={() => (isMenuOpen = true)}
        class="flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[50px] {isMenuOpen
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--color-muted)]'}"
    >
        <Menu size={22} strokeWidth={2} />
        <span
            class="text-[9px] font-bold uppercase tracking-wider mt-1 {isMenuOpen
                ? 'opacity-100'
                : 'opacity-40'} transition-all"
        >
            Menu
        </span>
    </button>
</nav>

<MobileMenu bind:isOpen={isMenuOpen} />
