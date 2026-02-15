<script lang="ts">
    import { Plus } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import MobileTaskCard from "$lib/components/tasks/MobileQuestCard.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";

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

    let activeCount = $derived(
        tasksStore.tasks.filter((t) => t.status !== "completed").length,
    );
    let completedCount = $derived(
        tasksStore.tasks.filter((t) => t.status === "completed").length,
    );
</script>

<div class="page-container h-full">
    <!-- Header -->
    <div class="module-header">
        <div>
            <h1 class="text-3xl font-light text-white">Tasks</h1>
            <p class="text-sm text-muted mt-1">
                {activeCount} active · {completedCount} completed
            </p>
        </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {#each [{ id: "active", label: "All Active" }, { id: "high", label: "High Priority" }, { id: "completed", label: "Completed" }] as tab}
            <button
                onclick={() => (filter = tab.id)}
                class="px-4 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all active:scale-95 {filter ===
                tab.id
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-surface text-muted border-line'}"
            >
                {tab.label}
            </button>
        {/each}
    </div>

    <!-- Task List -->
    <div class="space-y-0">
        {#if tasksStore.loading}
            <SkeletonLoader lines={4} height="h-20" />
        {:else}
            {#if filteredTasks.length === 0}
                <div class="text-center py-16">
                    <p class="text-muted">No tasks found</p>
                    <p class="text-sm text-muted/60 mt-1">
                        Tap + to add a new task
                    </p>
                </div>
            {/if}

            {#each filteredTasks as task (task.id)}
                <MobileTaskCard
                    {task}
                    onToggle={() => tasksStore.toggle(task.id)}
                    onDelete={() => tasksStore.remove(task.id)}
                />
            {/each}
        {/if}
    </div>

    <!-- Floating Add Button -->
    <button
        onclick={() => (isQuickCaptureOpen = true)}
        class="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-2xl shadow-primary/30 active:scale-95 transition-transform z-30"
        aria-label="Add new task"
    >
        <Plus size={28} />
    </button>
</div>

<QuickCapture bind:isOpen={isQuickCaptureOpen} />
