<script lang="ts">
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import {
        LayoutDashboard,
        CheckSquare,
        Wallet,
        Dumbbell,
        Utensils,
        Brain,
        Book,
        Target,
        Folder,
        PenTool,
        Clock,
        Activity,
        Settings,
    } from "lucide-svelte";

    import { settings } from "$lib/stores/settings.svelte";

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: `${base}/`,
            key: "dashboard",
        },
        {
            label: "Habits",
            icon: Activity,
            href: `${base}/habits`,
            key: "habits",
        },
        {
            label: "Finance",
            icon: Wallet,
            href: `${base}/finance`,
            key: "finance",
        },
        {
            label: "Fitness",
            icon: Dumbbell,
            href: `${base}/fitness`,
            key: "fitness",
        },
        {
            label: "Nutrition",
            icon: Utensils,
            href: `${base}/nutrition`,
            key: "nutrition",
        },
        {
            label: "Tasks",
            icon: CheckSquare,
            href: `${base}/tasks`,
            key: "tasks",
        },
        { label: "Notes", icon: Brain, href: `${base}/notes`, key: "notes" },
        {
            label: "Library",
            icon: Book,
            href: `${base}/library`,
            key: "library",
        },
        { label: "Goals", icon: Target, href: `${base}/goals`, key: "goals" },
        {
            label: "Projects",
            icon: Folder,
            href: `${base}/para`,
            key: "projects",
        },
        {
            label: "Journal",
            icon: PenTool,
            href: `${base}/journal`,
            key: "journal",
        },
        { label: "Focus", icon: Clock, href: `${base}/focus`, key: "focus" },
        {
            label: "Settings",
            icon: Settings,
            href: `${base}/settings`,
            key: "settings",
        }, // Added Settings
    ];

    let filteredMenuItems = $derived(
        menuItems.filter((item) => settings.features[item.key]),
    );
</script>

<aside
    class="w-64 border-r border-line h-screen fixed left-0 top-0 bg-background flex flex-col pt-6 z-50"
>
    <div class="px-6 mb-8 flex items-center gap-3">
        <div
            class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"
        >
            <div class="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
        </div>
        <span class="text-xl font-bold tracking-tight text-[var(--color-text)]"
            >SelfOS</span
        >
    </div>

    <nav class="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {#each filteredMenuItems as item}
            {@const isActive = $page.url.pathname === item.href}
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
                href={item.href}
                class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group {isActive
                    ? 'bg-surface text-primary border border-line shadow-lg shadow-black/20'
                    : 'text-muted hover:text-white hover:bg-surface/50'}"
            >
                <item.icon
                    size={20}
                    class="transition-colors {isActive
                        ? 'text-primary drop-shadow-[0_0_8px_rgba(0,255,157,0.5)]'
                        : 'group-hover:text-white'}"
                />
                <span class="font-medium text-sm">{item.label}</span>
            </a>
        {/each}
    </nav>

    <div class="p-4 border-t border-line">
        <div class="p-4 rounded-xl bg-surface border border-line">
            <p class="text-xs text-muted mb-2">Daily Progress</p>
            <div
                class="h-1.5 w-full bg-background rounded-full overflow-hidden"
            >
                <div
                    class="h-full bg-primary w-[65%] rounded-full shadow-[0_0_10px_rgba(0,255,157,0.6)] animate-pulse"
                ></div>
            </div>
        </div>
    </div>
</aside>
