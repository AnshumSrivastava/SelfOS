<script>
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import {
        House,
        Layers,
        CheckSquare,
        Brain,
        Plus,
        Menu,
        RotateCw,
        DollarSign,
        Heart,
        Salad,
        Edit3,
        Library,
        Target,
        BookOpen,
        Zap,
        Settings,
        Calendar,
    } from "lucide-svelte";
    import MobileMenu from "./MobileMenu.svelte";
    import { settings } from "$lib/stores/settings.svelte";

    let isMenuOpen = $state(false);

    const allLinks = [
        { name: "Home", icon: House, href: `${base}/`, key: "dashboard" },
        {
            name: "Projects",
            icon: Layers,
            href: `${base}/para`,
            key: "projects",
        },
        {
            name: "Tasks",
            icon: CheckSquare,
            href: `${base}/tasks`,
            key: "tasks",
        },
        {
            name: "Habits",
            icon: RotateCw,
            href: `${base}/habits`,
            key: "habits",
        },
        {
            name: "Finance",
            icon: DollarSign,
            href: `${base}/finance`,
            key: "finance",
        },
        {
            name: "Fitness",
            icon: Heart,
            href: `${base}/fitness`,
            key: "fitness",
        },
        {
            name: "Nutrition",
            icon: Salad,
            href: `${base}/nutrition`,
            key: "nutrition",
        },
        { name: "Notes", icon: Edit3, href: `${base}/notes`, key: "notes" },
        {
            name: "Library",
            icon: Library,
            href: `${base}/library`,
            key: "library",
        },
        { name: "Goals", icon: Target, href: `${base}/goals`, key: "goals" },
        {
            name: "Journal",
            icon: BookOpen,
            href: `${base}/journal`,
            key: "journal",
        },
        { name: "Focus", icon: Zap, href: `${base}/focus`, key: "focus" },
        {
            name: "Calendar",
            icon: Calendar,
            href: `${base}/calendar`,
            key: "calendar",
        },
        {
            name: "Balance",
            icon: Heart,
            href: `${base}/life-balance`,
            key: "lifeBalance",
        },
        {
            name: "Settings",
            icon: Settings,
            href: `${base}/settings`,
            key: "settings",
        },
    ];

    let displayedLinks = $derived(
        settings.mobileNavItems
            .map((key) => allLinks.find((l) => l.key === key))
            .filter((l) => l !== undefined),
    );
</script>

<nav
    class="fixed bottom-6 left-4 right-4 h-16 bg-[#1A1A1A] border border-[#333] rounded-2xl flex items-center justify-between px-6 z-50 shadow-2xl backdrop-blur-md"
>
    {#each displayedLinks as link}
        {@const isActive =
            link.href === `${base}/`
                ? $page.url.pathname === link.href
                : $page.url.pathname.startsWith(link.href)}
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
