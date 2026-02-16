<script lang="ts">
    import { Plus } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import MobileTaskCard from "$lib/components/tasks/MobileQuestCard.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import FloatingActionButton from "$lib/components/mobile/FloatingActionButton.svelte";

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

<div class="page-container h-full pb-28">
    <MobileHeader title="Tasks" />

    <div class="px-6 mt-6 space-y-6">
        <!-- Stats Summary -->
        <div
            class="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.15em] text-muted/50 px-1"
        >
            <span
                >{activeCount} <span class="text-primary/60">Active</span></span
            >
            <span
                >{completedCount}
                <span class="text-white/20">Completed</span></span
            >
        </div>

        <!-- Filters -->
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {#each [{ id: "active", label: "Active" }, { id: "high", label: "Priority" }, { id: "completed", label: "Done" }] as tab}
                <button
                    onclick={() => (filter = tab.id)}
                    class="px-5 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 {filter ===
                    tab.id
                        ? 'bg-primary text-black'
                        : 'bg-white/5 text-muted/40'}"
                >
                    {tab.label}
                </button>
            {/each}
        </div>

        <!-- Task List -->
        <div class="space-y-3">
            {#if tasksStore.loading}
                <SkeletonLoader lines={4} height="h-20" />
            {:else}
                {#if filteredTasks.length === 0}
                    <div
                        class="text-center py-20 bg-surface/20 rounded-3xl border border-dashed border-line/50"
                    >
                        <p
                            class="text-muted font-bold uppercase tracking-widest text-[10px]"
                        >
                            No tasks found
                        </p>
                        <p class="text-[10px] text-muted/40 mt-2">
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
    </div>

    <!-- Floating Add Button -->
    <FloatingActionButton
        onclick={() => (isQuickCaptureOpen = true)}
        ariaLabel="Add new task"
    />
</div>

<QuickCapture bind:isOpen={isQuickCaptureOpen} />
