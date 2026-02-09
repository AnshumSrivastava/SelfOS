<script>
    import {
        Folder,
        Layers,
        BookOpen,
        Archive,
        ChevronRight,
        MoreHorizontal,
    } from "lucide-svelte";

    /** @type {any[]} */
    const paraSections = [
        {
            id: "projects",
            title: "Projects",
            subtitle: "Goal-oriented efforts with a deadline.",
            icon: Layers,
            color: "text-primary",
            bg: "bg-primary/10",
            items: [
                { name: "SelfOS Remake", status: "Active", progress: 75 },
                { name: "Q4 Fitness Plan", status: "Active", progress: 30 },
                { name: "Home Office Setup", status: "Paused", progress: 50 },
            ],
        },
        {
            id: "areas",
            title: "Areas",
            subtitle: "Responsibilities with no end date.",
            icon: Folder,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            items: [
                { name: "Health & Fitness", items: 12 },
                { name: "Finances", items: 45 },
                { name: "Career Development", items: 8 },
                { name: "Home Maintenance", items: 5 },
            ],
        },
        {
            id: "resources",
            title: "Resources",
            subtitle: "Topics of ongoing interest.",
            icon: BookOpen,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            items: [
                { name: "Coding Tutorials", items: 156 },
                { name: "Recipes", items: 42 },
                { name: "Book Notes", items: 28 },
                { name: "Design Inspiration", items: 90 },
            ],
        },
        {
            id: "archives",
            title: "Archives",
            subtitle: "Inactive items for reference.",
            icon: Archive,
            color: "text-muted",
            bg: "bg-surface",
            items: [
                { name: "Old Client Projects", date: "2025" },
                { name: "Travel logs", date: "2024" },
            ],
        },
    ];
</script>

<div class="space-y-8 pb-12">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">P.A.R.A. System</h1>
        <p class="text-muted">Projects · Areas · Resources · Archives</p>
    </div>

    <div class="grid grid-cols-1 gap-8">
        {#each paraSections as section}
            <div class="card relative overflow-hidden group">
                <div class="flex items-start gap-4 mb-6">
                    <div class="p-3 rounded-lg {section.bg} {section.color}">
                        <svelte:component this={section.icon} size={24} />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-white">
                            {section.title}
                        </h2>
                        <p class="text-sm text-muted">{section.subtitle}</p>
                    </div>
                </div>

                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {#each section.items as item}
                        <div
                            class="p-4 rounded-xl bg-background border border-line hover:border-{section.id ===
                            'archives'
                                ? 'white'
                                : 'primary'}/50 transition-all cursor-pointer group/item flex flex-col justify-between h-24"
                        >
                            <div class="flex justify-between items-start">
                                <span
                                    class="font-medium text-white group-hover/item:text-primary transition-colors"
                                    >{item.name}</span
                                >
                                <MoreHorizontal
                                    size={16}
                                    class="text-muted opacity-0 group-hover/item:opacity-100 transition-opacity"
                                />
                            </div>

                            <div class="text-xs text-muted">
                                {#if section.id === "projects" && item.progress !== undefined}
                                    <div
                                        class="w-full h-1 bg-surface rounded-full overflow-hidden mt-2"
                                    >
                                        <div
                                            class="h-full bg-primary"
                                            style="width: {item.progress}%"
                                        ></div>
                                    </div>
                                {:else if (section.id === "areas" || section.id === "resources") && item.items !== undefined}
                                    {item.items} items
                                {:else if item.date !== undefined}
                                    Archived: {item.date}
                                {/if}
                            </div>
                        </div>
                    {/each}

                    <!-- Add New -->
                    <button
                        class="p-4 rounded-xl border border-dashed border-line hover:bg-surface/50 hover:border-primary/50 text-muted hover:text-white transition-all flex items-center justify-center h-24"
                    >
                        <span class="text-sm font-medium">Add New</span>
                    </button>
                </div>

                <div
                    class="absolute -right-12 -top-12 w-48 h-48 {section.bg} blur-3xl rounded-full opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity"
                ></div>
            </div>
        {/each}
    </div>
</div>
