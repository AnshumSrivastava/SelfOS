<script>
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { House, CheckSquare, RotateCw, Zap, Menu } from "lucide-svelte";
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
    class="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-neutral-900 flex items-center justify-around px-4 z-50"
    style="height: calc(4rem + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom);"
>
    {#each primaryLinks as link}
        <a
            href={link.href}
            class="flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[60px] {link.href ===
            `${base}/`
                ? $page.url.pathname === link.href
                    ? 'text-white'
                    : 'text-gray-500'
                : $page.url.pathname.startsWith(link.href)
                  ? 'text-white'
                  : 'text-gray-500'}"
        >
            <link.icon
                size={24}
                strokeWidth={link.href === `${base}/`
                    ? $page.url.pathname === link.href
                        ? 2.5
                        : 2
                    : $page.url.pathname.startsWith(link.href)
                      ? 2.5
                      : 2}
            />
        </a>
    {/each}

    <button
        onclick={() => (isMenuOpen = true)}
        class="flex flex-col items-center justify-center p-2 rounded-xl transition-all min-w-[60px] {isMenuOpen
            ? 'text-white'
            : 'text-gray-500'}"
    >
        <Menu size={24} strokeWidth={2} />
    </button>
</nav>

<MobileMenu bind:isOpen={isMenuOpen} />
