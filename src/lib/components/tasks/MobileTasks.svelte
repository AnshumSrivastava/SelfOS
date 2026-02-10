<script lang="ts">
    import { Plus, Check, Calendar, AlertCircle } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { slide } from "svelte/transition";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte"; // Assuming we reuse this or a similar logic

    let filter = $state("active");
    let isQuickCaptureOpen = $state(false);

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
            default:
                return all.filter((t) => t.status !== "completed");
        }
    });

    function formatDate(iso: string | null) {
        if (!iso) return "";
        const d = new Date(iso);
        const now = new Date();
        // clear time
        d.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        if (d.getTime() === now.getTime()) return "Today";
        if (d.getTime() === now.getTime() + 86400000) return "Tomorrow";
        return d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    }
</script>

<div class="space-y-6 pb-24">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Tasks</h1>
        <button
            onclick={() => (isQuickCaptureOpen = true)}
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {#each [{ id: "active", label: "Active" }, { id: "high", label: "High Priority" }, { id: "completed", label: "Completed" }] as tab}
            <button
                onclick={() => (filter = tab.id)}
                class="px-4 py-2 rounded-full border border-neutral-800 text-sm font-medium whitespace-nowrap transition-colors {filter ===
                tab.id
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-900 text-gray-400'}"
            >
                {tab.label}
            </button>
        {/each}
    </div>

    <!-- Task List -->
    <div class="space-y-3">
        {#if filteredTasks.length === 0}
            <div class="text-center py-12 text-zinc-600">
                <p>No tasks yet.</p>
            </div>
        {/if}

        {#each filteredTasks as task (task.id)}
            <div
                transition:slide|local
                class="p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex items-start gap-4 active:scale-[0.99] transition-transform"
            >
                <button
                    onclick={() => tasksStore.toggle(task.id)}
                    aria-label="Toggle task status"
                    class="mt-1 w-6 h-6 rounded-full border-2 border-neutral-700 flex items-center justify-center hover:border-white transition-colors {task.status ===
                    'completed'
                        ? 'bg-green-500 border-green-500'
                        : ''}"
                >
                    {#if task.status === "completed"}
                        <Check size={14} class="text-black" />
                    {/if}
                </button>
                <div class="flex-1">
                    <p
                        class="font-medium text-white {task.status ===
                        'completed'
                            ? 'line-through text-zinc-500'
                            : ''}"
                    >
                        {task.title}
                    </p>
                    <div class="flex flex-wrap items-center gap-3 mt-2">
                        <span
                            class="text-xs text-gray-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800"
                            >{task.project}</span
                        >
                        {#if task.deadline}
                            <span
                                class="text-xs {formatDate(task.deadline) ===
                                'Today'
                                    ? 'text-red-400'
                                    : 'text-gray-500'} flex items-center gap-1"
                            >
                                <Calendar size={10} />
                                {formatDate(task.deadline)}
                            </span>
                        {/if}
                        {#if task.priority === "high"}
                            <span
                                class="text-xs text-red-400 flex items-center gap-1"
                            >
                                <AlertCircle size={10} /> High
                            </span>
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<QuickCapture bind:isOpen={isQuickCaptureOpen} />
