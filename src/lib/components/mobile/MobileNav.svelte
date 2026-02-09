<script>
    import { page } from "$app/stores";
    import {
        House,
        Layers,
        CheckSquare,
        Brain,
        Plus,
        Menu,
    } from "lucide-svelte";
    import MobileMenu from "./MobileMenu.svelte";

    let isMenuOpen = $state(false);

    const links = [
        { name: "Home", icon: House, href: "/" },
        { name: "Projects", icon: Layers, href: "/para" },
        // Middle button is handled separately
        { name: "Tasks", icon: CheckSquare, href: "/tasks" },
        // Notes removed from here, added to menu
    ];
</script>

<nav
    class="fixed bottom-6 left-4 right-4 h-16 bg-[#1A1A1A] border border-[#333] rounded-2xl flex items-center justify-between px-6 z-50 shadow-2xl backdrop-blur-md"
>
    {#each links.slice(0, 2) as link}
        {@const isActive = $page.url.pathname === link.href}
        <a
            href={link.href}
            class="flex flex-col items-center justify-center p-2 rounded-xl transition-all {isActive
                ? 'text-white'
                : 'text-gray-500'}"
        >
            <link.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        </a>
    {/each}

    <button
        class="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-lg shadow-white/20 active:scale-95 transition-transform"
    >
        <Plus size={28} strokeWidth={3} />
    </button>

    {#each links.slice(2, 3) as link}
        {@const isActive = $page.url.pathname === link.href}
        <a
            href={link.href}
            class="flex flex-col items-center justify-center p-2 rounded-xl transition-all {isActive
                ? 'text-white'
                : 'text-gray-500'}"
        >
            <link.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
        </a>
    {/each}

    <button
        onclick={() => (isMenuOpen = true)}
        class="flex flex-col items-center justify-center p-2 rounded-xl transition-all {isMenuOpen
            ? 'text-white'
            : 'text-gray-500'}"
    >
        <Menu size={22} strokeWidth={2} />
    </button>
</nav>

<MobileMenu bind:isOpen={isMenuOpen} />
