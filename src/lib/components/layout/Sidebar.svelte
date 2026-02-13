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
        User, // Moved User import into the main lucide-svelte block
    } from "lucide-svelte";
    import Logo from "$lib/components/ui/Logo.svelte";

    import { settings } from "$lib/stores/settings.svelte"; // Retained one settings import

    // Sidebar collapse state
    let isCollapsed = $state(false);

    function toggleSidebar() {
        isCollapsed = !isCollapsed;
        // Save preference
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(
                "selfos-sidebar-collapsed",
                JSON.stringify(isCollapsed),
            );
        }
    }

    // Load saved preference
    $effect(() => {
        if (typeof localStorage !== "undefined") {
            const saved = localStorage.getItem("selfos-sidebar-collapsed");
            if (saved) {
                isCollapsed = JSON.parse(saved);
            }
        }
    });

    // Category state management
    let expandedCategories = $state({
        health: true,
        productivity: true,
        personal: true,
        system: true,
    });

    function toggleCategory(category: keyof typeof expandedCategories) {
        if (!isCollapsed) {
            expandedCategories[category] = !expandedCategories[category];
        }
    }

    // Organized menu items by category
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
            name: "System",
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

    // Filter items based on enabled features
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
    class="border-r border-line h-screen fixed left-0 top-0 bg-background flex flex-col pt-6 z-50 transition-all duration-300 {isCollapsed
        ? 'w-16'
        : 'w-64'}"
>
    <!-- Header with Logo and Toggle -->
    <div
        class="px-4 mb-8 flex items-center {isCollapsed
            ? 'justify-center'
            : 'justify-between'}"
    >
        {#if !isCollapsed}
            <div class="flex items-center gap-3">
                <Logo size={32} className="text-primary" />
                <span
                    class="text-xl font-bold tracking-tight text-[var(--color-text)]"
                    >SelfOS</span
                >
            </div>
        {:else}
            <Logo size={32} className="text-primary" />
        {/if}

        <button
            onclick={toggleSidebar}
            class="p-1.5 rounded-lg hover:bg-surface transition-colors {isCollapsed
                ? 'mt-2'
                : ''}"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            {#if isCollapsed}
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

    <!-- Dashboard - Always visible at top -->
    <div class="px-2 mb-2">
        <!-- svelte-ignore a11y_missing_attribute -->
        <a
            href={`${base}/`}
            class="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative {$page
                .url.pathname === `${base}/`
                ? 'bg-surface text-primary border border-line'
                : 'text-muted hover:text-white hover:bg-surface/50'} {isCollapsed
                ? 'justify-center'
                : ''}"
            title={isCollapsed ? "Dashboard" : ""}
        >
            <LayoutDashboard
                size={20}
                class="transition-colors {$page.url.pathname === `${base}/`
                    ? 'text-primary'
                    : 'group-hover:text-white'} {isCollapsed ? 'mx-auto' : ''}"
            />
            {#if !isCollapsed}
                <span class="font-medium text-sm">Dashboard</span>
            {/if}

            <!-- Tooltip for collapsed state -->
            {#if isCollapsed}
                <div
                    class="absolute left-full ml-2 px-2 py-1 bg-surface border border-line rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                >
                    Dashboard
                </div>
            {/if}
        </a>
    </div>

    <div class="h-px bg-white/5 mx-2 my-2"></div>

    <nav class="flex-1 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        {#each filteredCategories as category}
            <div class="mb-1">
                <!-- Category Header -->
                {#if !isCollapsed}
                    <button
                        onclick={() => toggleCategory(category.key)}
                        class="flex items-center justify-between w-full px-3 py-2 rounded-lg text-muted hover:text-white hover:bg-surface/30 transition-all duration-200 group"
                    >
                        <span
                            class="text-xs font-semibold uppercase tracking-wider"
                            >{category.name}</span
                        >
                        {#if expandedCategories[category.key]}
                            <ChevronDown
                                size={14}
                                class="transition-transform duration-200"
                            />
                        {:else}
                            <ChevronRight
                                size={14}
                                class="transition-transform duration-200"
                            />
                        {/if}
                    </button>
                {/if}

                <!-- Category Items -->
                {#if !isCollapsed && expandedCategories[category.key]}
                    <div class="mt-1 space-y-0.5">
                        {#each category.items as item}
                            <!-- svelte-ignore a11y_missing_attribute -->
                            <a
                                href={item.href}
                                class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group {item.href ===
                                `${base}/`
                                    ? $page.url.pathname === item.href
                                        ? 'bg-surface text-primary border border-line'
                                        : 'text-muted hover:text-white hover:bg-surface/50'
                                    : $page.url.pathname.startsWith(item.href)
                                      ? 'bg-surface text-primary border border-line'
                                      : 'text-muted hover:text-white hover:bg-surface/50'}"
                            >
                                <item.icon
                                    size={18}
                                    class="transition-colors {item.href ===
                                    `${base}/`
                                        ? $page.url.pathname === item.href
                                            ? 'text-primary'
                                            : 'group-hover:text-white'
                                        : $page.url.pathname.startsWith(
                                                item.href,
                                            )
                                          ? 'text-primary'
                                          : 'group-hover:text-white'}"
                                />
                                <span class="font-medium text-sm"
                                    >{item.label}</span
                                >
                            </a>
                        {/each}
                    </div>
                {:else if isCollapsed}
                    <!-- Collapsed state: show all items without category headers -->
                    <div class="space-y-0.5">
                        {#each category.items as item}
                            <!-- svelte-ignore a11y_missing_attribute -->
                            <a
                                href={item.href}
                                class="flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 group relative {item.href ===
                                `${base}/`
                                    ? $page.url.pathname === item.href
                                        ? 'bg-surface text-primary border border-line'
                                        : 'text-muted hover:text-white hover:bg-surface/50'
                                    : $page.url.pathname.startsWith(item.href)
                                      ? 'bg-surface text-primary border border-line'
                                      : 'text-muted hover:text-white hover:bg-surface/50'}"
                                title={item.label}
                            >
                                <item.icon
                                    size={18}
                                    class="transition-colors {item.href ===
                                    `${base}/`
                                        ? $page.url.pathname === item.href
                                            ? 'text-primary'
                                            : 'group-hover:text-white'
                                        : $page.url.pathname.startsWith(
                                                item.href,
                                            )
                                          ? 'text-primary'
                                          : 'group-hover:text-white'}"
                                />

                                <!-- Tooltip -->
                                <div
                                    class="absolute left-full ml-2 px-2 py-1 bg-surface border border-line rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                                >
                                    {item.label}
                                </div>
                            </a>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}
    </nav>

    <!-- Daily Progress -->
    {#if !isCollapsed}
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
    {:else}
        <div class="p-2 border-t border-line">
            <div
                class="w-10 h-10 mx-auto rounded-lg bg-surface border border-line flex items-center justify-center"
            >
                <div
                    class="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin"
                ></div>
            </div>
        </div>
    {/if}
</aside>
