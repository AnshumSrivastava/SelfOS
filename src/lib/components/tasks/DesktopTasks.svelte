<script>
    import {
        CheckSquare,
        AlertCircle,
        Calendar,
        Tag,
        Filter,
        Plus,
    } from "lucide-svelte";

    const tasks = [
        {
            id: 1,
            title: "Refactor Auth System",
            project: "SelfOS",
            due: "Today",
            priority: "High",
            status: "pending",
        },
        {
            id: 2,
            title: "Write Q4 Goals",
            project: "Life",
            due: "Tomorrow",
            priority: "Medium",
            status: "pending",
        },
        {
            id: 3,
            title: "Buy Groceries",
            project: "Personal",
            due: "Today",
            priority: "Low",
            status: "done",
        },
        {
            id: 4,
            title: "Read Chapter 3",
            project: "Learning",
            due: "Oct 12",
            priority: "Medium",
            status: "pending",
        },
        {
            id: 5,
            title: "Update Resume",
            project: "Career",
            due: "Oct 15",
            priority: "High",
            status: "pending",
        },
    ];

    let filter = "all";
</script>

<div class="space-y-8 pb-12">
    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-3xl font-bold text-white mb-2">My Tasks</h1>
            <p class="text-muted">Capture, Organize, Engage.</p>
        </div>
        <button class="btn btn-primary flex items-center gap-2">
            <Plus size={18} /> New Task
        </button>
    </div>

    <div class="flex gap-4 border-b border-line pb-4 overflow-x-auto">
        {#each ["Inbox", "Today", "Upcoming", "Projects", "Completed"] as tab}
            <button
                class="px-4 py-2 rounded-full border border-line hover:border-primary hover:text-white transition-colors text-sm font-medium {tab ===
                'Today'
                    ? 'bg-surface text-white border-primary/50'
                    : 'text-muted'}"
            >
                {tab}
            </button>
        {/each}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
            {#each tasks as task}
                <div
                    class="group flex items-start gap-4 p-4 rounded-xl bg-background border border-line hover:border-primary/50 transition-all cursor-pointer"
                >
                    <button
                        class="mt-1 w-5 h-5 rounded border border-line group-hover:border-primary flex items-center justify-center transition-colors {task.status ===
                        'done'
                            ? 'bg-primary border-primary text-black'
                            : ''}"
                    >
                        {#if task.status === "done"}
                            <CheckSquare size={14} />
                        {/if}
                    </button>

                    <div class="flex-1">
                        <h3
                            class="text-white font-medium group-hover:text-primary transition-colors {task.status ===
                            'done'
                                ? 'line-through text-muted'
                                : ''}"
                        >
                            {task.title}
                        </h3>
                        <div
                            class="flex items-center gap-3 mt-2 text-xs text-muted"
                        >
                            <span class="flex items-center gap-1"
                                ><Tag size={12} /> {task.project}</span
                            >
                            <span class="flex items-center gap-1"
                                ><Calendar size={12} /> {task.due}</span
                            >
                            {#if task.priority === "High"}
                                <span
                                    class="text-red-400 flex items-center gap-1"
                                    ><AlertCircle size={12} /> High Priority</span
                                >
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
            <div class="card bg-surface/50">
                <h3 class="font-bold text-white mb-4">Focus Mode</h3>
                <p class="text-sm text-muted mb-4">
                    You have 3 high priority tasks remaining for today.
                </p>
                <div class="space-y-2">
                    <div
                        class="h-2 w-full bg-background rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-primary w-[33%] rounded-full shadow-[0_0_8px_rgba(0,255,157,0.5)]"
                        ></div>
                    </div>
                    <div class="flex justify-between text-xs text-muted">
                        <span>1 completed</span>
                        <span>3 remaining</span>
                    </div>
                </div>
                <button
                    class="w-full btn border border-line mt-6 hover:bg-surface text-sm"
                    >Start Focus Session</button
                >
            </div>

            <div class="card">
                <h3 class="font-bold text-white mb-4">Projects</h3>
                <div class="space-y-3">
                    {#each ["SelfOS", "Life", "Career", "Learning"] as proj}
                        <div
                            class="flex items-center justify-between text-sm group cursor-pointer hover:bg-surface p-2 rounded-lg transition-colors"
                        >
                            <div
                                class="flex items-center gap-2 text-muted group-hover:text-white"
                            >
                                <span class="w-2 h-2 rounded-full bg-primary"
                                ></span>
                                {proj}
                            </div>
                            <span
                                class="text-xs px-2 py-0.5 rounded bg-background border border-line group-hover:border-primary/50"
                                >3</span
                            >
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
