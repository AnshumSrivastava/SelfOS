<script lang="ts">
    import { Play, FastForward, Clock, ListTodo } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { focusStore } from "$lib/stores/focus.svelte";
    import { fade } from "svelte/transition";

    const nowTask = $derived(
        tasksStore.tasks.find((t) => t.status === "in_progress") ||
            tasksStore.tasks.find(
                (t) => t.priority === "high" && t.status !== "completed",
            ),
    );
    const nextTasks = $derived(
        tasksStore.tasks
            .filter((t) => t.status === "pending" && t.id !== nowTask?.id)
            .slice(0, 2),
    );
    const laterTasks = $derived(
        tasksStore.tasks
            .filter((t) => t.priority === "low" && t.status !== "completed")
            .slice(0, 2),
    );

    async function handleStartFocus(task: any) {
        // Implementation for locking in task to Focus Mode
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
                    class="p-4 rounded-2xl bg-emerald-400/5 border border-emerald-400/20 group hover:border-emerald-400/40 transition-all"
                >
                    <h3 class="text-sm font-bold text-white mb-2">
                        {nowTask.title}
                    </h3>
                    <div
                        class="flex items-center gap-4 text-[10px] font-bold text-emerald-400/60"
                    >
                        <span
                            class="px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/10"
                        >
                            {nowTask.projectId || "No Project"}
                        </span>
                        <div class="flex items-center gap-1">
                            <Clock size={10} />
                            <span>Focus Ready</span>
                        </div>
                    </div>
                </div>
            {:else}
                <div
                    class="p-4 rounded-2xl bg-surface border border-dashed border-line text-center py-6"
                >
                    <p
                        class="text-[10px] font-bold text-muted uppercase tracking-widest"
                    >
                        No active focus
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
                Next
            </span>
            <div class="grid grid-cols-1 gap-2">
                {#each nextTasks as task}
                    <div
                        class="p-3 rounded-xl bg-surface border border-line hover:border-primary/20 transition-all"
                    >
                        <span
                            class="text-xs font-semibold text-white line-clamp-1"
                            >{task.title}</span
                        >
                    </div>
                {/each}
                {#if nextTasks.length === 0}
                    <p class="text-[10px] font-bold text-muted opacity-50 px-3">
                        No immediate follow-ups
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
                Later
            </span>
            <div class="grid grid-cols-1 gap-2">
                {#each laterTasks as task}
                    <div
                        class="p-2 px-3 rounded-lg bg-surface/50 border border-line/50 opacity-60"
                    >
                        <span
                            class="text-[11px] font-medium text-muted line-clamp-1"
                            >{task.title}</span
                        >
                    </div>
                {/each}
                {#if laterTasks.length === 0}
                    <p class="text-[10px] font-bold text-muted opacity-30 px-3">
                        Lane clear
                    </p>
                {/if}
            </div>
        </div>
    </div>
</div>
