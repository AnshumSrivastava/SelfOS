<script lang="ts">
    import { Play, FastForward, Clock, ListTodo, Target } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { focusStore } from "$lib/stores/focus.svelte";
    import { projectsStore } from "$lib/stores/projects.svelte";
    import { fade } from "svelte/transition";

    function getProjectName(id: string | null) {
        if (!id) return "Inbox";
        const project = projectsStore.getProject(id);
        return project ? project.name : "Unknown";
    }

    const nowTask = $derived(
        tasksStore.tasks.find((t) => t.status === "in_progress") ||
            tasksStore.tasks.find(
                (t) => t.priority === "high" && t.status !== "completed",
            ),
    );
    const nextTasks = $derived(
        tasksStore.tasks
            .filter((t) => t.status === "pending" && t.id !== nowTask?.id)
            .slice(0, 3),
    );
    const laterTasks = $derived(
        tasksStore.tasks
            .filter((t) => t.priority === "low" && t.status !== "completed")
            .slice(0, 2),
    );

    async function handleStartFocus(task: any) {
        focusStore.reset();
        focusStore.toggle();
    }
</script>

<div class="card-subtle p-6 flex flex-col h-full">
    <div class="flex items-center gap-3 mb-6">
        <div class="p-2 rounded-lg bg-emerald-400/10 text-emerald-400">
            <ListTodo size={20} />
        </div>
        <h2 class="text-xl font-semibold text-white">Execution Lanes</h2>
    </div>

    <div class="flex-1 space-y-6">
        <!-- NOW LANE -->
        <div class="space-y-3">
            <div class="flex items-center justify-between">
                <span
                    class="text-[10px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5"
                >
                    <span
                        class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                    ></span>
                    Now
                </span>
                {#if nowTask}
                    <button
                        onclick={() => handleStartFocus(nowTask)}
                        class="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-white transition-colors"
                    >
                        Lock In
                    </button>
                {/if}
            </div>

            {#if nowTask}
                <div
                    class="p-5 rounded-2xl bg-emerald-400/5 border border-emerald-400/20 group hover:border-emerald-400/40 transition-all shadow-sm shadow-emerald-400/5"
                >
                    <div class="flex items-center justify-between mb-3">
                        <span
                            class="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/10"
                        >
                            {getProjectName(nowTask.projectId)}
                        </span>
                        {#if nowTask.priority === "high"}
                            <span
                                class="text-[9px] font-bold uppercase tracking-tighter text-red-400 flex items-center gap-1"
                            >
                                <span
                                    class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"
                                ></span>
                                Top Priority
                            </span>
                        {/if}
                    </div>
                    <h3
                        class="text-base font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors"
                    >
                        {nowTask.title}
                    </h3>
                    <div
                        class="flex items-center gap-4 pt-3 border-t border-emerald-400/10 text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest"
                    >
                        <div class="flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>Focus Ready</span>
                        </div>
                        {#if nowTask.deadline}
                            <div class="flex items-center gap-1.5">
                                <Target size={12} />
                                <span>Due Today</span>
                            </div>
                        {/if}
                    </div>
                </div>
            {:else}
                <div
                    class="p-4 rounded-2xl bg-surface border border-dashed border-line text-center py-8"
                >
                    <p
                        class="text-[10px] font-bold text-muted uppercase tracking-widest"
                    >
                        No active focal point
                    </p>
                </div>
            {/if}
        </div>

        <!-- NEXT LANE -->
        <div class="space-y-3">
            <span
                class="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-1.5"
            >
                <FastForward size={12} class="text-primary" />
                Next Execution
            </span>
            <div class="grid grid-cols-1 gap-2">
                {#each nextTasks as task}
                    <div
                        class="p-4 rounded-xl bg-surface border border-line hover:border-primary/20 transition-all group"
                    >
                        <div class="flex items-center justify-between mb-1.5">
                            <span
                                class="text-[9px] font-bold uppercase tracking-tighter text-muted group-hover:text-primary/60 transition-colors"
                            >
                                {getProjectName(task.projectId)}
                            </span>
                            {#if task.priority === "high"}
                                <div
                                    class="w-1 h-1 rounded-full bg-red-400"
                                ></div>
                            {/if}
                        </div>
                        <span
                            class="text-sm font-bold text-white line-clamp-1 group-hover:text-primary transition-colors"
                            >{task.title}</span
                        >
                    </div>
                {/each}
                {#if nextTasks.length === 0}
                    <p
                        class="text-[10px] font-bold text-muted opacity-40 px-3 py-4 border border-dashed border-line rounded-xl text-center"
                    >
                        No follow-up tasks scheduled
                    </p>
                {/if}
            </div>
        </div>

        <!-- LATER LANE -->
        <div class="space-y-3">
            <span
                class="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-1.5 opacity-60"
            >
                <Clock size={12} />
                Strategic Buffer
            </span>
            <div class="grid grid-cols-1 gap-2">
                {#each laterTasks as task}
                    <div
                        class="p-3 rounded-lg bg-surface/30 border border-line/30 opacity-60 hover:opacity-100 transition-all group"
                    >
                        <div class="flex items-center justify-between gap-3">
                            <span
                                class="text-xs font-semibold text-muted group-hover:text-white line-clamp-1 transition-colors"
                                >{task.title}</span
                            >
                            <span
                                class="text-[9px] font-bold uppercase tracking-tighter text-muted whitespace-nowrap"
                            >
                                {getProjectName(task.projectId)}
                            </span>
                        </div>
                    </div>
                {/each}
                {#if laterTasks.length === 0}
                    <p class="text-[10px] font-bold text-muted opacity-30 px-3">
                        Lane clear. No low-priority items.
                    </p>
                {/if}
            </div>
        </div>
    </div>
</div>
