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
        Calendar,
        Heart,
        ChevronDown,
        ChevronRight,
        PanelLeftClose,
        PanelLeft,
        User,
        LogOut,
    } from "lucide-svelte";
    import Logo from "$lib/components/ui/Logo.svelte";
    import { auth } from "$lib/stores/auth.svelte";
    import { settings } from "$lib/stores/settings.svelte";
    import { uiState } from "$lib/stores/ui.svelte";

    function toggleSidebar() {
        uiState.toggleCollapse();
    }

    let expandedCategories = $state({
        health: true,
        productivity: true,
        personal: true,
        system: true,
    });

    function toggleCategory(category: keyof typeof expandedCategories) {
        if (!uiState.isCollapsed) {
            expandedCategories[category] = !expandedCategories[category];
        }
    }

    const categories = [
        {
            name: "Health",
            key: "health" as const,
            items: [
                {
                    label: "Habits",
                    icon: Activity,
                    href: `${base}/habits`,
                    key: "habits",
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
            ],
        },
        {
            name: "Productivity",
            key: "productivity" as const,
            items: [
                {
                    label: "Tasks",
                    icon: CheckSquare,
                    href: `${base}/tasks`,
                    key: "tasks",
                },
                {
                    label: "Focus",
                    icon: Clock,
                    href: `${base}/focus`,
                    key: "focus",
                },
                {
                    label: "Calendar",
                    icon: Calendar,
                    href: `${base}/calendar`,
                    key: "calendar",
                },
                {
                    label: "Projects",
                    icon: Folder,
                    href: `${base}/para`,
                    key: "projects",
                },
            ],
        },
        {
            name: "Personal",
            key: "personal" as const,
            items: [
                {
                    label: "Notes",
                    icon: Brain,
                    href: `${base}/notes`,
                    key: "notes",
                },
                {
                    label: "Library",
                    icon: Book,
                    href: `${base}/library`,
                    key: "library",
                },
                {
                    label: "Journal",
                    icon: PenTool,
                    href: `${base}/journal`,
                    key: "journal",
                },
                {
                    label: "Goals",
                    icon: Target,
                    href: `${base}/goals`,
                    key: "goals",
                },
            ],
        },
        {
            name: "General",
            key: "system" as const,
            items: [
                {
                    label: "Finance",
                    icon: Wallet,
                    href: `${base}/finance`,
                    key: "finance",
                },
            ],
        },
    ];

    let filteredCategories = $derived(
        categories
            .map((category) => ({
                ...category,
                items: category.items.filter(
                    (item) =>
                        settings.features[
                            item.key as keyof typeof settings.features
                        ],
                ),
            }))
            .filter((category) => category.items.length > 0),
    );
</script>

<aside
    class="border-r border-line h-screen fixed left-0 top-0 bg-background flex flex-col pt-6 z-50 transition-all duration-300 {uiState.isCollapsed
        ? 'w-16'
        : 'w-64'}"
>
    <!-- Header with Logo and Toggle -->
    <div
        class="px-4 mb-8 flex items-center {uiState.isCollapsed
            ? 'justify-center'
            : 'justify-between'}"
    >
        {#if !uiState.isCollapsed}
            <a
                href={`${base}/`}
                data-sveltekit-preload-hover
                class="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
                <Logo size={32} className="text-primary" />
                <span
                    class="text-xl font-bold tracking-tight text-[var(--color-text)]"
                    >SelfOS</span
                >
            </a>
        {/if}

        <button
            onclick={toggleSidebar}
            class="p-1.5 rounded-lg hover:bg-surface transition-colors"
            aria-label={uiState.isCollapsed
                ? "Expand sidebar"
                : "Collapse sidebar"}
            title={uiState.isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            {#if uiState.isCollapsed}
                <PanelLeft
                    size={18}
                    class="text-muted hover:text-white transition-colors"
                />
            {:else}
                <PanelLeftClose
                    size={18}
                    class="text-muted hover:text-white transition-colors"
                />
            {/if}
        </button>
    </div>

    <!-- Dashboard -->
    <div class="px-2 mb-2">
        <a
            href={`${base}/`}
            class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative {$page
                .url.pathname === `${base}/`
                ? 'bg-surface text-primary border border-line'
                : 'text-muted hover:text-white hover:bg-surface/50'} {uiState.isCollapsed
                ? 'justify-center'
                : ''}"
            title={uiState.isCollapsed ? "Dashboard" : ""}
        >
            <LayoutDashboard
                size={20}
                class={$page.url.pathname === `${base}/`
                    ? "text-primary"
                    : "group-hover:text-white"}
            />
            {#if !uiState.isCollapsed}
                <span class="font-medium text-sm">Dashboard</span>
            {/if}
        </a>
    </div>

    <div class="h-px bg-white/5 mx-2 my-2"></div>

    <nav class="flex-1 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        {#each filteredCategories as category}
            <div class="mb-1">
                {#if !uiState.isCollapsed}
                    <button
                        onclick={() => toggleCategory(category.key)}
                        class="flex items-center justify-between w-full px-3 py-2 rounded-lg text-muted hover:text-white hover:bg-surface/30 transition-all duration-200"
                    >
                        <span
                            class="text-xs font-semibold uppercase tracking-wider"
                            >{category.name}</span
                        >
                        {#if expandedCategories[category.key]}
                            <ChevronDown size={14} />
                        {:else}
                            <ChevronRight size={14} />
                        {/if}
                    </button>
                {/if}

                {#if !uiState.isCollapsed && expandedCategories[category.key]}
                    <div class="mt-1 space-y-0.5">
                        {#each category.items as item}
                            <a
                                href={item.href}
                                class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group {$page.url.pathname.startsWith(
                                    item.href,
                                )
                                    ? 'bg-surface text-primary border border-line'
                                    : 'text-muted hover:text-white hover:bg-surface/50'}"
                            >
                                <item.icon
                                    size={18}
                                    class={$page.url.pathname.startsWith(
                                        item.href,
                                    )
                                        ? "text-primary"
                                        : "group-hover:text-white"}
                                />
                                <span class="font-medium text-sm"
                                    >{item.label}</span
                                >
                            </a>
                        {/each}
                    </div>
                {:else if uiState.isCollapsed}
                    <div class="space-y-0.5">
                        {#each category.items as item}
                            <a
                                href={item.href}
                                class="flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative {$page.url.pathname.startsWith(
                                    item.href,
                                )
                                    ? 'bg-surface text-primary border border-line'
                                    : 'text-muted hover:text-white hover:bg-surface/50'}"
                                title={item.label}
                            >
                                <item.icon
                                    size={18}
                                    class={$page.url.pathname.startsWith(
                                        item.href,
                                    )
                                        ? "text-primary"
                                        : "group-hover:text-white"}
                                />
                            </a>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    </nav>

    <!-- Bottom Section -->
    <div class="p-2 border-t border-line mt-auto space-y-1">
        {#if !uiState.isCollapsed}
            <div
                class="px-2 py-3 mb-2 rounded-xl bg-surface/30 border border-line/50"
            >
                <p
                    class="text-[10px] uppercase tracking-wider text-muted mb-2 font-bold"
                >
                    Daily Progress
                </p>
                <div
                    class="h-1.5 w-full bg-background/50 rounded-full overflow-hidden"
                >
                    <div class="h-full bg-primary w-[65%] rounded-full"></div>
                </div>
            </div>
        {/if}

        {#if auth.isAuthenticated && auth.user}
            <div
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface/50 transition-all group relative"
            >
                <div
                    class="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 overflow-hidden flex flex-shrink-0 items-center justify-center"
                >
                    {#if auth.user.user_metadata?.avatar_url}
                        <img
                            src={auth.user.user_metadata.avatar_url}
                            alt="Profile"
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <User size={16} class="text-primary" />
                    {/if}
                </div>
                {#if !uiState.isCollapsed}
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-white truncate">
                            {auth.user.user_metadata?.full_name ||
                                auth.user.email?.split("@")[0]}
                        </p>
                        <p class="text-[10px] text-muted truncate">
                            {auth.user.email}
                        </p>
                    </div>
                {/if}
            </div>

            <button
                onclick={() => auth.signOut()}
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:text-red-400 hover:bg-red-500/10 transition-all {uiState.isCollapsed
                    ? 'justify-center'
                    : ''}"
                title={uiState.isCollapsed ? "Sign Out" : ""}
            >
                <LogOut size={18} />
                {#if !uiState.isCollapsed}
                    <span class="font-medium text-sm">Sign Out</span>
                {/if}
            </button>
        {/if}
    </div>
</aside>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: var(--theme-line);
        border-radius: 10px;
    }
</style>
