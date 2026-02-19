<script lang="ts">
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { projectsStore } from "$lib/stores/projects.svelte";
    import { FastForward, ListTodo, ArrowRight } from "lucide-svelte";
    import { fade } from "svelte/transition";

    const nextTasks = $derived(
        tasksStore.tasks.filter((t) => t.status === "pending").slice(0, 4),
    );

    function getProjectName(id: string | null) {
        if (!id) return "Inbox";
        const project = projectsStore.getProject(id);
        return project ? project.name : "Inbox";
    }
</script>

<div class="space-y-4">
    <div class="flex items-center gap-2 px-1">
        <FastForward size={14} class="text-primary/60" />
        <h3
            class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
        >
            Sequence Feed
        </h3>
    </div>

    <div class="space-y-2">
        {#each nextTasks as task}
            <div
                class="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group cursor-default"
            >
                <div class="flex items-center justify-between mb-1">
                    <span
                        class="text-[9px] font-black uppercase tracking-tighter text-muted/60 bg-white/5 px-2 py-0.5 rounded border border-white/5"
                    >
                        {getProjectName(task.projectId)}
                    </span>
                    {#if task.priority === "high"}
                        <div class="w-1 h-1 rounded-full bg-red-400"></div>
                    {/if}
                </div>
                <h4
                    class="text-sm font-bold text-white group-hover:text-primary transition-colors truncate"
                >
                    {task.title}
                </h4>
            </div>
        {/each}

        {#if nextTasks.length === 0}
            <div
                class="p-6 rounded-3xl border border-dashed border-white/5 text-center"
            >
                <p
                    class="text-[9px] font-black text-muted/30 uppercase tracking-widest"
                >
                    Horizon Clear
                </p>
            </div>
        {/if}
    </div>
</div>
