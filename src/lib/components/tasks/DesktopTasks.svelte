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
    } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { fade, slide } from "svelte/transition";

    let filter = $state("all");
    let isAdding = $state(false);

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

    // Derived filtered tasks
    let filteredTasks = $derived.by(() => {
        const all = tasksStore.tasks;
        switch (filter) {
            case "active":
                return all.filter((t) => t.status !== "completed");
            case "completed":
                return all.filter((t) => t.status === "completed");
            case "high":
                return all.filter(
                    (t) => t.priority === "high" && t.status !== "completed",
                );
            case "scheduled":
                return all.filter(
                    (t) => t.scheduled && t.status !== "completed",
                );
            default:
                return all.filter((t) => t.status !== "completed"); // Default to active
        }
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

    function handleAddTask() {
        if (!newTask.title.trim()) return;

        tasksStore.add({
            title: newTask.title,
            project: newTask.project,
            priority: newTask.priority,
            deadline: newTask.deadline
                ? new Date(newTask.deadline).toISOString()
                : null,
            scheduled: newTask.scheduled
                ? new Date(newTask.scheduled).toISOString()
                : null,
        });

        // Reset
        newTask = {
            title: "",
            project: "General",
            priority: "medium",
            deadline: "",
            scheduled: "",
        };
        isAdding = false;
    }
</script>

<div class="space-y-8 pb-12 h-full flex flex-col">
    <!-- Header -->
    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-3xl font-bold text-white mb-2">My Tasks</h1>
            <p class="text-neutral-400">Capture, Organize, Engage.</p>
        </div>
        <button
            onclick={() => (isAdding = !isAdding)}
            class="px-4 py-2 bg-white text-black rounded-lg font-medium flex items-center gap-2 hover:bg-neutral-200 transition-colors"
        >
            {#if isAdding}
                Cancel
            {:else}
                <Plus size={18} /> New Task
            {/if}
        </button>
    </div>

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
        <div
            transition:slide
            class="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-4"
        >
            <input
                bind:value={newTask.title}
                type="text"
                placeholder="What needs to be done?"
                class="w-full bg-transparent text-xl text-white placeholder:text-neutral-600 focus:outline-none border-b border-neutral-800 pb-2"
                autoFocus
            />

            <div class="flex flex-wrap items-center gap-4">
                <!-- Project Selector -->
                <div class="relative group">
                    <select
                        bind:value={newTask.project}
                        class="appearance-none bg-neutral-800 text-neutral-300 px-3 py-1.5 rounded-lg text-sm border border-neutral-700 focus:border-white focus:outline-none pr-8 cursor-pointer"
                    >
                        {#each projects as p}
                            <option value={p}>{p}</option>
                        {/each}
                    </select>
                    <Tag
                        size={14}
                        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                    />
                </div>

                <!-- Priority Selector -->
                <div
                    class="flex bg-neutral-800 rounded-lg p-1 border border-neutral-700"
                >
                    {#each ["low", "medium", "high"] as p}
                        <button
                            onclick={() => (newTask.priority = p as any)}
                            class="px-3 py-1 rounded text-xs capitalize transition-colors {newTask.priority ===
                            p
                                ? 'bg-neutral-600 text-white'
                                : 'text-neutral-400 hover:text-white'}"
                        >
                            {p}
                        </button>
                    {/each}
                </div>

                <!-- Deadline -->
                <div
                    class="flex items-center gap-2 text-sm text-neutral-400 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700"
                >
                    <AlertCircle size={14} />
                    <span class="text-xs">Deadline:</span>
                    <input
                        type="date"
                        bind:value={newTask.deadline}
                        class="bg-transparent text-white focus:outline-none w-[110px]"
                    />
                </div>

                <!-- Scheduled -->
                <div
                    class="flex items-center gap-2 text-sm text-neutral-400 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700"
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
                    disabled={!newTask.title.trim()}
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add Task
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
                    <p>No tasks found for this view.</p>
                </div>
            {/if}

            {#each filteredTasks as task (task.id)}
                <div
                    transition:slide|local
                    class="group relative flex items-start gap-4 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-all"
                >
                    <!-- Checkbox -->
                    <button
                        onclick={() => tasksStore.toggle(task.id)}
                        class="mt-1 w-5 h-5 rounded border border-neutral-600 group-hover:border-white flex items-center justify-center transition-colors {task.status ===
                        'completed'
                            ? 'bg-green-500 border-green-500 text-black'
                            : 'hover:bg-neutral-800'}"
                    >
                        {#if task.status === "completed"}
                            <CheckSquare size={14} />
                        {/if}
                    </button>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <h3
                                    class="text-neutral-200 font-medium truncate pr-4 transition-colors {task.status ===
                                    'completed'
                                        ? 'line-through text-neutral-500'
                                        : ''}"
                                >
                                    {task.title}
                                </h3>
                                <div
                                    class="flex flex-wrap items-center gap-3 mt-2"
                                >
                                    <span
                                        class="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700"
                                    >
                                        {task.project}
                                    </span>

                                    {#if task.priority !== "medium" || task.priority === "high"}
                                        <span
                                            class="text-xs px-2 py-0.5 rounded-full border {getPriorityColor(
                                                task.priority,
                                            )} flex items-center gap-1"
                                        >
                                            <AlertCircle size={10} />
                                            {task.priority}
                                        </span>
                                    {/if}

                                    {#if task.deadline}
                                        <span
                                            class="text-xs text-neutral-400 flex items-center gap-1"
                                            title="Deadline"
                                        >
                                            <AlertCircle
                                                size={12}
                                                class="text-red-400"
                                            />
                                            Due {formatDate(task.deadline)}
                                        </span>
                                    {/if}

                                    {#if task.scheduled}
                                        <span
                                            class="text-xs text-neutral-400 flex items-center gap-1"
                                            title="Scheduled Date"
                                        >
                                            <CalendarDays
                                                size={12}
                                                class="text-blue-400"
                                            />
                                            Do: {formatDate(task.scheduled)}
                                        </span>
                                    {/if}
                                </div>
                            </div>

                            <button
                                onclick={() => tasksStore.remove(task.id)}
                                class="text-neutral-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                title="Delete Task"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
            <div
                class="p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800 backdrop-blur-sm"
            >
                <h3 class="font-bold text-white mb-4 flex items-center gap-2">
                    <div class="w-1.5 h-4 bg-green-500 rounded-full"></div>
                    Focus Mode
                </h3>
                <p class="text-sm text-neutral-400 mb-6">
                    You have <span class="text-white font-medium"
                        >{tasksStore.activeCount}</span
                    >
                    active tasks.
                    {#if tasksStore.tasks.filter((t) => t.priority === "high" && t.status !== "completed").length > 0}
                        <br />Prioritize your
                        <span class="text-red-400"
                            >{tasksStore.tasks.filter(
                                (t) =>
                                    t.priority === "high" &&
                                    t.status !== "completed",
                            ).length} high priority</span
                        > tasks.
                    {/if}
                </p>

                <div class="space-y-2 mb-6">
                    <div
                        class="h-2 w-full bg-neutral-800 rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-green-500 transition-all duration-500"
                            style="width: {tasksStore.tasks.length
                                ? (tasksStore.completedCount /
                                      tasksStore.tasks.length) *
                                  100
                                : 0}%"
                        ></div>
                    </div>
                    <div class="flex justify-between text-xs text-neutral-500">
                        <span>{tasksStore.completedCount} completed</span>
                        <span>{tasksStore.activeCount} remaining</span>
                    </div>
                </div>

                <button
                    class="w-full py-2.5 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-sm font-medium text-neutral-300 transition-colors"
                >
                    Start Focus Session
                </button>
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
