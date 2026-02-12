<script lang="ts">
    import {
        CheckSquare,
        AlertCircle,
        Calendar,
        Tag,
        Filter,
        Plus,
        Clock,
        MoreVertical,
        Trash2,
        CalendarDays,
        Flame,
        Target,
        TrendingUp,
        Loader2,
    } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { fade, slide } from "svelte/transition";
    import TaskCard from "./QuestCard.svelte";

    let filter = $state("all");
    let isAdding = $state(false);
    let isProcessing = $state(false);

    // New Task Form State
    let newTask = $state({
        title: "",
        project: "General",
        priority: "medium" as "low" | "medium" | "high",
        deadline: "",
        scheduled: "",
    });

    const projects = [
        "General",
        "Work",
        "Personal",
        "Finance",
        "Health",
        "Learning",
    ];

    // Enhanced filtered tasks with urgency calculation
    let filteredTasks = $derived.by(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let tasks = tasksStore.tasks;

        // Apply filter
        switch (filter) {
            case "active":
                tasks = tasks.filter((t) => t.status !== "completed");
                break;
            case "completed":
                tasks = tasks.filter((t) => t.status === "completed");
                break;
            case "high":
                tasks = tasks.filter(
                    (t) => t.priority === "high" && t.status !== "completed",
                );
                break;
            case "scheduled":
                tasks = tasks.filter(
                    (t) => t.scheduled && t.status !== "completed",
                );
                break;
            default:
                tasks = tasks.filter((t) => t.status !== "completed");
        }

        // Calculate urgency for each task
        return tasks
            .map((task) => {
                let urgency = 0;
                let urgencyLabel = "";
                let urgencyColor = "text-muted";

                if (task.deadline) {
                    const deadline = new Date(task.deadline);
                    deadline.setHours(0, 0, 0, 0);
                    const daysUntil = Math.floor(
                        (deadline.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24),
                    );

                    if (daysUntil < 0) {
                        urgency = 100;
                        urgencyLabel = `${Math.abs(daysUntil)}d overdue`;
                        urgencyColor = "text-red-400";
                    } else if (daysUntil === 0) {
                        urgency = 90;
                        urgencyLabel = "Due today";
                        urgencyColor = "text-orange-400";
                    } else if (daysUntil === 1) {
                        urgency = 80;
                        urgencyLabel = "Due tomorrow";
                        urgencyColor = "text-yellow-400";
                    } else if (daysUntil <= 3) {
                        urgency = 70;
                        urgencyLabel = `${daysUntil}d left`;
                        urgencyColor = "text-yellow-400";
                    } else if (daysUntil <= 7) {
                        urgency = 50;
                        urgencyLabel = `${daysUntil}d left`;
                        urgencyColor = "text-blue-400";
                    }
                }

                if (task.priority === "high") urgency += 20;
                else if (task.priority === "medium") urgency += 10;

                return { ...task, urgency, urgencyLabel, urgencyColor };
            })
            .sort((a, b) => {
                if (filter === "completed") return 0;
                return b.urgency - a.urgency;
            });
    });

    // Calculate insights
    let insights = $derived.by(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const overdue = tasksStore.tasks.filter((t) => {
            if (t.status === "completed" || !t.deadline) return false;
            const deadline = new Date(t.deadline);
            deadline.setHours(0, 0, 0, 0);
            return deadline < today;
        }).length;

        const dueToday = tasksStore.tasks.filter((t) => {
            if (t.status === "completed" || !t.deadline) return false;
            const deadline = new Date(t.deadline);
            deadline.setHours(0, 0, 0, 0);
            return deadline.getTime() === today.getTime();
        }).length;

        const highPriority = tasksStore.tasks.filter(
            (t) => t.priority === "high" && t.status !== "completed",
        ).length;

        return { overdue, dueToday, highPriority };
    });

    function getPriorityColor(p: string) {
        switch (p) {
            case "high":
                return "text-red-400 border-red-400/20 bg-red-400/10";
            case "medium":
                return "text-yellow-400 border-yellow-400/20 bg-yellow-400/10";
            case "low":
                return "text-blue-400 border-blue-400/20 bg-blue-400/10";
            default:
                return "text-gray-400 border-gray-400/20 bg-gray-400/10";
        }
    }

    function formatDate(iso: string | null) {
        if (!iso) return "";
        return new Date(iso).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    }

    async function handleAddTask() {
        if (!newTask.title.trim()) return;

        isProcessing = true;
        try {
            await tasksStore.addBatch(
                newTask.title,
                newTask.project,
                newTask.priority,
            );

            newTask = {
                title: "",
                project: "General",
                priority: "medium",
                deadline: "",
                scheduled: "",
            };
            isAdding = false;
        } catch (error) {
            console.error("Failed to add tasks:", error);
        } finally {
            isProcessing = false;
        }
    }
</script>

<div class="page-container relative h-full">
    <!-- Header -->
    <div class="module-header">
        <div>
            <h1 class="text-3xl font-light text-white">Tasks</h1>
            <p class="text-muted">
                {tasksStore.activeCount} active tasks · {tasksStore.completedCount}
                completed
            </p>
        </div>
        <button
            onclick={() => (isAdding = !isAdding)}
            class="btn {isAdding
                ? 'btn-ghost'
                : 'btn-primary'} flex items-center gap-2"
        >
            {#if isAdding}
                Cancel
            {:else}
                <Plus size={18} /> New Task
            {/if}
        </button>
    </div>

    <!-- Insights Bar -->
    {#if insights.overdue > 0 || insights.dueToday > 0 || insights.highPriority > 0}
        <div class="grid grid-cols-3 gap-4">
            {#if insights.overdue > 0}
                <div
                    class="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                    <div class="flex items-center gap-2 mb-1">
                        <AlertCircle size={16} class="text-red-400" />
                        <span class="text-sm font-medium text-red-400"
                            >Overdue</span
                        >
                    </div>
                    <p class="text-2xl font-bold text-white">
                        {insights.overdue}
                    </p>
                </div>
            {/if}
            {#if insights.dueToday > 0}
                <div
                    class="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20"
                >
                    <div class="flex items-center gap-2 mb-1">
                        <Flame size={16} class="text-orange-400" />
                        <span class="text-sm font-medium text-orange-400"
                            >Due Today</span
                        >
                    </div>
                    <p class="text-2xl font-bold text-white">
                        {insights.dueToday}
                    </p>
                </div>
            {/if}
            {#if insights.highPriority > 0}
                <div
                    class="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
                >
                    <div class="flex items-center gap-2 mb-1">
                        <Target size={16} class="text-yellow-400" />
                        <span class="text-sm font-medium text-yellow-400"
                            >High Priority</span
                        >
                    </div>
                    <p class="text-2xl font-bold text-white">
                        {insights.highPriority}
                    </p>
                </div>
            {/if}
        </div>
    {/if}

    <!-- Filters -->
    <div class="flex gap-2 border-b border-neutral-800 pb-4 overflow-x-auto">
        {#each [{ id: "all", label: "All Active" }, { id: "high", label: "High Priority" }, { id: "scheduled", label: "Scheduled" }, { id: "completed", label: "Completed" }] as tab}
            <button
                onclick={() => (filter = tab.id)}
                class="px-4 py-1.5 rounded-full border transition-all text-sm font-medium {filter ===
                tab.id
                    ? 'bg-white text-black border-white'
                    : 'text-neutral-400 border-transparent hover:text-white hover:bg-neutral-800'}"
            >
                {tab.label}
            </button>
        {/each}
    </div>

    <!-- Add Task Panel -->
    {#if isAdding}
        <div transition:slide class="card-subtle space-y-4">
            <textarea
                bind:value={newTask.title}
                placeholder="What needs to be done?&#10;Paste multiple lines or a YouTube playlist URL..."
                class="w-full bg-transparent text-xl text-white placeholder:text-muted/50 focus:outline-none border-b border-line pb-2 resize-none"
                rows="3"
                autofocus
                onkeydown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleAddTask();
                    }
                }}
            ></textarea>
            <div class="text-[10px] text-neutral-500 mt-1">
                Press Ctrl+Enter to add
            </div>

            <div class="flex flex-wrap items-center gap-4">
                <div class="relative group">
                    <select
                        bind:value={newTask.project}
                        class="appearance-none input px-3 py-1.5 pr-8 cursor-pointer"
                    >
                        {#each projects as p}
                            <option value={p}>{p}</option>
                        {/each}
                    </select>
                    <Tag
                        size={14}
                        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                    />
                </div>

                <div
                    class="flex bg-background/50 rounded-lg p-1 border border-line"
                >
                    {#each ["low", "medium", "high"] as p}
                        <button
                            onclick={() => (newTask.priority = p as any)}
                            class="px-3 py-1 rounded text-xs capitalize transition-colors {newTask.priority ===
                            p
                                ? 'bg-primary text-black font-medium'
                                : 'text-muted hover:text-white'}"
                        >
                            {p}
                        </button>
                    {/each}
                </div>

                <div
                    class="flex items-center gap-2 text-sm text-muted bg-background/50 px-3 py-1.5 rounded-lg border border-line"
                >
                    <AlertCircle size={14} />
                    <span class="text-xs">Deadline:</span>
                    <input
                        type="date"
                        bind:value={newTask.deadline}
                        class="bg-transparent text-white focus:outline-none w-[110px]"
                    />
                </div>

                <div
                    class="flex items-center gap-2 text-sm text-muted bg-background/50 px-3 py-1.5 rounded-lg border border-line"
                >
                    <CalendarDays size={14} />
                    <span class="text-xs">Do on:</span>
                    <input
                        type="date"
                        bind:value={newTask.scheduled}
                        class="bg-transparent text-white focus:outline-none w-[110px]"
                    />
                </div>
            </div>

            <div class="flex justify-end pt-2">
                <button
                    onclick={handleAddTask}
                    disabled={!newTask.title.trim() || isProcessing}
                    class="btn btn-primary"
                >
                    {#if isProcessing}
                        <Loader2 size={18} class="animate-spin" />
                        Processing...
                    {:else}
                        Add Tasks
                    {/if}
                </button>
            </div>
        </div>
    {/if}

    <!-- Task List -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        <div
            class="lg:col-span-2 space-y-3 overflow-y-auto pr-2 custom-scrollbar"
        >
            {#if filteredTasks.length === 0}
                <div class="text-center py-12 text-neutral-500">
                    <CheckSquare size={48} class="mx-auto mb-4 opacity-50" />
                    <p class="text-lg font-medium">No tasks found</p>
                    <p class="text-sm mt-2">
                        {filter === "completed"
                            ? "Complete some tasks to see them here"
                            : "Add a new task to get started"}
                    </p>
                </div>
            {/if}

            {#each filteredTasks as task (task.id)}
                <TaskCard
                    {task}
                    onToggle={() => tasksStore.toggle(task.id)}
                    onDelete={() => tasksStore.remove(task.id)}
                />
            {/each}
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
            <div class="card-subtle flex flex-col">
                <h3 class="font-bold text-white mb-4 flex items-center gap-2">
                    <div class="w-1.5 h-4 bg-green-500 rounded-full"></div>
                    Progress Overview
                </h3>
                <p class="text-sm text-neutral-400 mb-6">
                    You have <span class="text-white font-medium"
                        >{tasksStore.activeCount}</span
                    >
                    active tasks.
                    {#if insights.highPriority > 0}
                        <br />Prioritize your
                        <span class="text-red-400"
                            >{insights.highPriority} high priority</span
                        > tasks.
                    {/if}
                </p>

                <div class="space-y-2 mb-6">
                    <div
                        class="h-2 w-full bg-neutral-800 rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                            style="width: {tasksStore.tasks.length
                                ? (tasksStore.completedCount /
                                      tasksStore.tasks.length) *
                                  100
                                : 0}%"
                        ></div>
                    </div>
                    <div class="flex justify-between text-xs text-neutral-500">
                        <span>{tasksStore.completedCount} completed</span>
                        <span
                            >{tasksStore.tasks.length > 0
                                ? Math.round(
                                      (tasksStore.completedCount /
                                          tasksStore.tasks.length) *
                                          100,
                                  )
                                : 0}%</span
                        >
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="space-y-3">
                    <div
                        class="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50"
                    >
                        <span class="text-sm text-neutral-400">Active</span>
                        <span class="text-sm font-semibold text-white"
                            >{tasksStore.activeCount}</span
                        >
                    </div>
                    <div
                        class="flex items-center justify-between p-3 rounded-lg bg-neutral-800/50"
                    >
                        <span class="text-sm text-neutral-400">Completed</span>
                        <span class="text-sm font-semibold text-green-400"
                            >{tasksStore.completedCount}</span
                        >
                    </div>
                    {#if insights.overdue > 0}
                        <div
                            class="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                        >
                            <span class="text-sm text-red-400">Overdue</span>
                            <span class="text-sm font-semibold text-red-400"
                                >{insights.overdue}</span
                            >
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
