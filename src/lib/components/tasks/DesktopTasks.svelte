<script lang="ts">
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
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
        Check,
    } from "lucide-svelte";
    import { onMount } from "svelte";
    import { tasksStore, type Task } from "$lib/stores/tasks.svelte";
    import { projectsStore } from "$lib/stores/projects.svelte";
    import { fade, slide, scale } from "svelte/transition";
    import TaskCard from "./QuestCard.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import Modal from "$lib/components/ui/Modal.svelte";

    let isLoading = $derived(tasksStore.loading);
    let tasks = $derived(tasksStore.tasks);

    onMount(() => {
        tasksStore.init();
    });

    let filter = $state("all");
    let isAdding = $state(false);
    let isProcessing = $state(false);
    let retypeTarget = $state<Task | null>(null);
    let isRetypeOpen = $state(false);
    let retypeValue = $state("");
    let retypeError = $state("");

    let newTask = $state({
        title: "",
        projectId: null as string | null,
        priority: "medium" as "low" | "medium" | "high",
        deadline: "",
        scheduled: "",
    });

    let filteredTasks = $derived.by(() => {
        let tasksList = tasksStore.tasks;
        switch (filter) {
            case "active":
                tasksList = tasksList.filter((t) => t.status !== "completed");
                break;
            case "completed":
                tasksList = tasksList.filter((t) => t.status === "completed");
                break;
            case "high":
                tasksList = tasksList.filter(
                    (t) => t.priority === "high" && t.status !== "completed",
                );
                break;
            case "scheduled":
                tasksList = tasksList.filter(
                    (t) => t.scheduled && t.status !== "completed",
                );
                break;
            case "today":
                return tasksStore.todayTasks.map((t) => ({
                    ...t,
                    urgency: 90,
                    urgencyLabel: "Today",
                    urgencyColor: "text-orange-400",
                }));
            default:
                // Default: filter out stale tasks from the main list so they only show in the "Requires Attention" section
                const staleIds = new Set(
                    tasksStore.staleTasks.map((t) => t.id),
                );
                tasksList = tasksList.filter(
                    (t) => t.status !== "completed" && !staleIds.has(t.id),
                );
        }
        return tasksList
            .map((task) => {
                let urgency = 0;
                if (task.priority === "high") urgency += 20;
                return { ...task, urgency };
            })
            .sort((a, b) => b.urgency - a.urgency);
    });

    let insights = $derived.by(() => {
        const overdue = tasksStore.overdueTasks.length;
        const dueToday = tasksStore.todayTasks.length;
        const highPriority = tasksStore.tasks.filter(
            (t) => t.priority === "high" && t.status !== "completed",
        ).length;
        const staleCount = tasksStore.staleTasks.length;
        return { overdue, dueToday, highPriority, staleCount };
    });

    async function handleAddTask() {
        if (!newTask.title.trim()) return;
        isProcessing = true;
        try {
            await tasksStore.addBatch(
                newTask.title,
                newTask.projectId,
                newTask.priority,
            );
            newTask = {
                title: "",
                projectId: null,
                priority: "medium",
                deadline: "",
                scheduled: "",
            };
            isAdding = false;
        } catch (error) {
            console.error("[DesktopTasks] Failed to add tasks:", error);
        } finally {
            isProcessing = false;
        }
    }

    async function handleRetype() {
        if (!retypeTarget) return;
        retypeError = "";
        try {
            await tasksStore.retypeTask(retypeTarget.id, retypeValue);
            isRetypeOpen = false;
            retypeTarget = null;
            retypeValue = "";
        } catch (e: any) {
            retypeError = e.message || "Failed to carry over task.";
        }
    }
</script>

{#if tasksStore.status === "saving" || tasksStore.status === "success"}
    <div
        style="animation: premiumEnter 0.6s var(--easing-premium)"
        class="fixed top-24 right-8 z-[100] px-4 py-2 rounded-2xl border backdrop-blur-xl flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 {tasksStore.status ===
        'saving'
            ? 'bg-white/5 border-white/10 text-white/70'
            : 'bg-primary/10 border-primary/20 text-primary'}"
    >
        {#if tasksStore.status === "saving"}
            <Loader2 size={14} class="animate-spin opacity-50" />
            <span class="text-[10px] font-bold uppercase tracking-[0.2em]"
                >Synchronizing</span
            >
        {:else}
            <Check size={14} class="text-primary" />
            <span class="text-[10px] font-bold uppercase tracking-[0.2em]"
                >Stable</span
            >
        {/if}
    </div>
{/if}

<div class="page-container relative h-full flex flex-col">
    <PageHeader
        title="Tasks"
        subtitle="{tasksStore.activeCount} active · {tasksStore.completedCount} completed"
    >
        <button
            onclick={() => (isAdding = !isAdding)}
            class="btn {isAdding
                ? 'btn-ghost'
                : 'btn-primary'} flex items-center gap-2"
        >
            {#if isAdding}
                Cancel
            {:else}
                <Plus size={16} /> New Task
            {/if}
        </button>
    </PageHeader>

    <!-- Insights Bar -->
    {#if insights.overdue > 0 || insights.dueToday > 0 || insights.highPriority > 0}
        <div class="grid grid-cols-3 gap-[var(--space-2)]">
            {#if insights.overdue > 0}
                <div
                    class="p-4 rounded-[var(--radius-subtle)] bg-red-400/5 border border-red-400/10 transition-all hover:bg-red-400/10"
                >
                    <div class="flex items-center gap-2 mb-1">
                        <AlertCircle
                            size={14}
                            class="text-red-400 opacity-70"
                        />
                        <span
                            class="text-[10px] uppercase font-bold tracking-widest text-red-400/70"
                            >Overdue</span
                        >
                    </div>
                    <p class="text-2xl font-light text-white">
                        {insights.overdue}
                    </p>
                </div>
            {/if}
            {#if insights.dueToday > 0}
                <div
                    class="p-4 rounded-[var(--radius-subtle)] bg-orange-400/5 border border-orange-400/10 transition-all hover:bg-orange-400/10"
                >
                    <div class="flex items-center gap-2 mb-1">
                        <Flame size={14} class="text-orange-400 opacity-70" />
                        <span
                            class="text-[10px] uppercase font-bold tracking-widest text-orange-400/70"
                            >Today</span
                        >
                    </div>
                    <p class="text-2xl font-light text-white">
                        {insights.dueToday}
                    </p>
                </div>
            {/if}
            {#if insights.highPriority > 0}
                <div
                    class="p-4 rounded-[var(--radius-subtle)] bg-primary/5 border border-primary/10 transition-all hover:bg-primary/10"
                >
                    <div class="flex items-center gap-2 mb-1">
                        <Target size={14} class="text-primary opacity-70" />
                        <span
                            class="text-[10px] uppercase font-bold tracking-widest text-primary/70"
                            >High Priority</span
                        >
                    </div>
                    <p class="text-2xl font-light text-white">
                        {insights.highPriority}
                    </p>
                </div>
            {/if}
        </div>
    {/if}

    <!-- Filters -->
    <div class="flex gap-4 border-b border-line pb-4 overflow-x-auto">
        {#each [{ id: "all", label: "All Active" }, { id: "high", label: "High Priority" }, { id: "scheduled", label: "Scheduled" }, { id: "completed", label: "Completed" }] as tab}
            <button
                onclick={() => (filter = tab.id)}
                class="px-2 py-1.5 transition-all text-sm font-medium relative {filter ===
                tab.id
                    ? 'text-primary'
                    : 'text-muted hover:text-text'}"
            >
                {tab.label}
                {#if filter === tab.id}
                    <div
                        class="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-primary rounded-full"
                    ></div>
                {/if}
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
                onkeydown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleAddTask();
                    }
                }}
            ></textarea>
            <div class="flex flex-wrap items-center gap-4">
                <div class="relative group">
                    <select
                        bind:value={newTask.projectId}
                        class="appearance-none input px-3 py-1.5 pr-8 cursor-pointer"
                    >
                        <option value={null}>Inbox (No Project)</option>
                        {#each projectsStore.projects as p}
                            <option value={p.id}>{p.name}</option>
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
            </div>
            <div class="flex justify-end pt-2">
                <button
                    onclick={handleAddTask}
                    disabled={!newTask.title.trim() || isProcessing}
                    class="btn btn-primary"
                >
                    {#if isProcessing}
                        <Loader2 size={18} class="animate-spin" /> Processing...
                    {:else}
                        Add Tasks
                    {/if}
                </button>
            </div>
        </div>
    {/if}

    <div
        class="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden mt-8"
    >
        <div
            class="lg:col-span-2 space-y-3 overflow-y-auto pr-2 custom-scrollbar"
        >
            {#if tasksStore.loading}
                <div class="space-y-3">
                    <SkeletonLoader lines={1} height="h-24" />
                    <SkeletonLoader lines={1} height="h-24" />
                </div>
            {:else if filteredTasks.length === 0 && tasksStore.staleTasks.length === 0}
                <div class="text-center py-12 text-neutral-500">
                    <CheckSquare size={48} class="mx-auto mb-4 opacity-50" />
                    <p class="text-lg font-medium">No tasks found</p>
                </div>
            {/if}

            <!-- Requires Attention Section (Stale Tasks) -->
            {#if tasksStore.staleTasks.length > 0 && filter === "all"}
                <section class="space-y-4 mb-10">
                    <div class="flex items-center gap-3 px-1">
                        <AlertCircle size={14} class="text-orange-400" />
                        <h3
                            class="text-[10px] font-black text-orange-400/80 uppercase tracking-[0.2em]"
                        >
                            Requires Attention ({tasksStore.staleTasks.length})
                        </h3>
                    </div>

                    <div class="space-y-3">
                        {#each tasksStore.staleTasks as task (task.id)}
                            <div
                                class="card-subtle !p-5 border-orange-400/10 bg-orange-400/2 flex items-center justify-between group"
                            >
                                <div class="flex items-center gap-4">
                                    <div
                                        class="w-10 h-10 rounded-full bg-orange-400/10 flex items-center justify-center text-orange-400"
                                    >
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <h4 class="font-medium text-white">
                                            {task.title}
                                        </h4>
                                        <p
                                            class="text-[10px] text-muted uppercase font-bold tracking-wider"
                                        >
                                            Unfinished from {task.scheduled ||
                                                task.deadline ||
                                                "yesterday"}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onclick={() => {
                                        retypeTarget = task;
                                        retypeValue = "";
                                        retypeError = "";
                                        isRetypeOpen = true;
                                    }}
                                    class="px-4 py-2 rounded-xl bg-orange-400 text-black text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                                >
                                    Carry Over
                                </button>
                            </div>
                        {/each}
                    </div>
                    <div class="flex-1 h-px bg-theme-line-soft"></div>
                </section>
            {/if}
            {#each filteredTasks as task (task.id)}
                <TaskCard
                    {task}
                    onToggle={() => tasksStore.toggle(task.id)}
                    onDelete={() => tasksStore.remove(task.id)}
                />
            {/each}
        </div>
        <div class="space-y-[var(--space-3)]">
            <div
                class="card-subtle flex flex-col !p-6"
                style="border-radius: var(--card-radius)"
            >
                <h3 class="text-white mb-6 flex items-center gap-3">
                    <div class="w-1 h-5 bg-primary rounded-full"></div>
                    Overview
                </h3>
                <p class="text-sm text-muted mb-6 leading-relaxed">
                    You have <span class="text-text font-medium"
                        >{tasksStore.activeCount}</span
                    > active tasks.
                </p>
                <div class="space-y-3 mb-8">
                    <div
                        class="h-1 w-full bg-line rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-primary transition-all duration-700 ease-out"
                            style="width: {tasksStore.tasks.length
                                ? (tasksStore.completedCount /
                                      tasksStore.tasks.length) *
                                  100
                                : 0}%"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<Modal bind:isOpen={isRetypeOpen} title="Intentional Carry-Over">
    <div class="space-y-6">
        <div
            class="p-6 rounded-2xl bg-orange-400/5 border border-orange-400/10"
        >
            <p
                class="text-xs text-orange-400 font-bold uppercase tracking-widest mb-2"
            >
                Intentionality Requirement
            </p>
            <p class="text-sm text-theme-text-secondary leading-relaxed">
                To carry over <span class="text-white font-bold"
                    >"{retypeTarget?.title}"</span
                >, you must manually retype the title below. Friction is the
                antidote to procrastination.
            </p>
        </div>

        <div class="space-y-2">
            <label
                class="text-[10px] font-bold uppercase tracking-widest text-muted"
                for="retype-input">Type exact title to confirm</label
            >
            <input
                id="retype-input"
                type="text"
                bind:value={retypeValue}
                onpaste={(e) => e.preventDefault()}
                onkeydown={(e) => e.key === "Enter" && handleRetype()}
                placeholder="Type title here..."
                class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg text-white placeholder-muted focus:outline-none focus:border-orange-400 transition-all font-mono"
                autocomplete="off"
            />
            {#if retypeError}
                <p
                    class="text-[10px] text-red-400 font-bold uppercase tracking-wider px-2"
                    in:scale
                >
                    {retypeError}
                </p>
            {/if}
        </div>

        <div class="flex gap-4">
            <button
                onclick={() => {
                    retypeTarget = null;
                    retypeValue = "";
                }}
                class="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
            >
                Not Today
            </button>
            <button
                onclick={handleRetype}
                disabled={retypeValue.trim() !== retypeTarget?.title.trim()}
                class="flex-[2] py-4 bg-orange-400 text-black rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-orange-400/20"
            >
                Confirm Carry Over
            </button>
        </div>
    </div>
</Modal>
