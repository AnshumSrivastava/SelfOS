<script lang="ts">
    import { Plus } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import MobileQuestCard from "$lib/components/tasks/MobileQuestCard.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";

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

<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-2">
                ⚔️ Quest Board
            </h1>
            <p class="text-sm text-gray-400 mt-1">
                {activeCount} active · {completedCount} completed
            </p>
        </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {#each [{ id: "active", label: "All Active" }, { id: "high", label: "High Priority" }, { id: "completed", label: "Completed" }] as tab}
            <button
                onclick={() => (filter = tab.id)}
                class="px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-all active:scale-95 {filter ===
                tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                    : 'bg-white/5 text-gray-400 border-white/10'}"
            >
                {tab.label}
            </button>
        {/each}
    </div>

    <!-- Quest List -->
    <div class="space-y-0">
        {#if filteredTasks.length === 0}
            <div class="text-center py-16">
                <div class="text-5xl mb-4">📋</div>
                <p class="text-gray-400">No quests found</p>
                <p class="text-sm text-gray-600 mt-1">
                    Tap + to add a new quest
                </p>
            </div>
        {/if}

        {#each filteredTasks as task (task.id)}
            <MobileQuestCard
                {task}
                onToggle={() => tasksStore.toggle(task.id)}
                onDelete={() => tasksStore.remove(task.id)}
            />
        {/each}
    </div>

    <!-- Floating Add Button -->
    <button
        onclick={() => (isQuickCaptureOpen = true)}
        class="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white flex items-center justify-center shadow-2xl shadow-cyan-500/30 active:scale-90 transition-transform z-30"
        aria-label="Add new quest"
    >
        <Plus size={28} />
    </button>
</div>

<QuickCapture bind:isOpen={isQuickCaptureOpen} />
