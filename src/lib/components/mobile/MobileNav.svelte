<script>
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { House, CheckSquare, RotateCw, Zap, Menu } from "lucide-svelte";
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
</script>

<nav
    class="fixed bottom-0 left-0 right-0 bg-[var(--color-background)] border-t border-[var(--color-line)]/50 flex items-center justify-around px-4 z-50 backdrop-blur-lg"
    style="height: calc(4.5rem + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom);"
>
    {#each primaryLinks as link}
        {@const isActive =
            link.href === `${base}/`
                ? $page.url.pathname === link.href
                : $page.url.pathname.startsWith(link.href)}
        <a
            href={link.href}
            class="relative flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[64px] {isActive
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-muted)]'}"
        >
            {#if isActive}
                <div
                    class="absolute -top-[1.25rem] w-8 h-1 bg-[var(--color-primary)] rounded-full blur-[2px] opacity-50"
                    transition:fade={{ duration: 200 }}
                ></div>
            {/if}
            <link.icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                class="transition-all {isActive
                    ? 'drop-shadow-[0_0_8px_var(--color-primary)]'
                    : ''}"
            />
            <span
                class="text-[10px] font-bold uppercase tracking-widest mt-1 {isActive
                    ? 'opacity-100'
                    : 'opacity-0'} transition-all duration-300"
            >
                {link.name}
            </span>
        </a>
    {/each}

    <button
        onclick={() => (isMenuOpen = true)}
        class="flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[64px] {isMenuOpen
            ? 'text-[var(--color-primary)]'
            : 'text-[var(--color-muted)]'}"
    >
        <Menu
            size={22}
            strokeWidth={2}
            class={isMenuOpen
                ? "drop-shadow-[0_0_8px_var(--color-primary)]"
                : ""}
        />
        <span
            class="text-[10px] font-bold uppercase tracking-widest mt-1 {isMenuOpen
                ? 'opacity-100'
                : 'opacity-0'} transition-all duration-300"
        >
            Menu
        </span>
    </button>
</nav>

<MobileMenu bind:isOpen={isMenuOpen} />
