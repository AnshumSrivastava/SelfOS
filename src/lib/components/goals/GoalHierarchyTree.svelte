<script lang="ts">
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte";
    import GoalCard from "./GoalCard.svelte";
    import { ChevronDown, ChevronRight } from "lucide-svelte";
    import { slide } from "svelte/transition";
    import GoalHierarchyTree from "./GoalHierarchyTree.svelte";

    let {
        parentId = null,
        horizon = "all",
        depth = 0,
        onGoalClick,
    } = $props<{
        parentId?: string | null;
        horizon?: string | "all";
        depth?: number;
        onGoalClick?: (goal: Goal) => void;
    }>();

    const goals = $derived.by(() => {
        let list = parentId
            ? goalsStore.getGoalChildren(parentId)
            : goalsStore.goals.filter((g) => !g.parentId);

        if (horizon !== "all" && !parentId) {
            list = list.filter((g) => g.horizon === horizon);
        }
        return list;
    });

    let expanded = $state<Record<string, boolean>>({});

    function toggle(id: string) {
        expanded[id] = !expanded[id];
    }
</script>

<div class="space-y-4 {depth > 0 ? 'ml-8 border-l border-line pl-6 mt-4' : ''}">
    {#each goals as goal (goal.id)}
        <div class="relative">
            <!-- Connector Line for Nesting -->
            {#if depth > 0}
                <div class="absolute -left-6 top-8 w-6 h-[1px] bg-line"></div>
            {/if}

            <div class="flex items-start gap-2">
                {#if goalsStore.getGoalChildren(goal.id).length > 0}
                    <button
                        onclick={() => toggle(goal.id)}
                        class="mt-4 p-1 rounded-md hover:bg-surface text-muted transition-colors"
                    >
                        {#if expanded[goal.id]}
                            <ChevronDown size={16} />
                        {:else}
                            <ChevronRight size={16} />
                        {/if}
                    </button>
                {:else}
                    <div class="w-8"></div>
                {/if}

                <div class="flex-1">
                    <GoalCard {goal} />
                </div>
            </div>

            {#if expanded[goal.id]}
                <div transition:slide={{ duration: 300 }}>
                    <GoalHierarchyTree
                        parentId={goal.id}
                        {horizon}
                        depth={depth + 1}
                        {onGoalClick}
                    />
                </div>
            {/if}
        </div>
    {/each}

    {#if goals.length === 0 && depth === 0}
        <div
            class="flex flex-col items-center justify-center p-12 bg-surface rounded-3xl border border-dashed border-line"
        >
            <p class="text-muted text-sm">No goals found for this horizon.</p>
        </div>
    {/if}
</div>
