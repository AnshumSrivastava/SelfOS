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
    class="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none flex justify-center"
>
    <!-- Floating Island Nav -->
    <div
        class="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] px-6 py-4 flex items-center gap-8 shadow-2xl shadow-black/50 pointer-events-auto"
    >
        {#each primaryLinks as link}
            {@const isActive =
                link.href === `${base}/`
                    ? $page.url.pathname === link.href
                    : $page.url.pathname.startsWith(link.href)}
            <a
                href={link.href}
                data-sveltekit-preload-hover
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
            class="flex flex-col items-center justify-center transition-all {isMenuOpen
                ? 'text-white scale-110'
                : 'text-white/40 hover:text-white/70'}"
        >
            <Menu size={26} strokeWidth={2} />
        </button>
    </div>
</nav>

<MobileMenu bind:isOpen={isMenuOpen} />
