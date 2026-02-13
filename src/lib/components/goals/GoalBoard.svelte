<script lang="ts">
    import { dndzone, type DndEvent } from "svelte-dnd-action";
    import {
        goalsStore,
        type Goal,
        type GoalArea,
        type GoalHorizon,
    } from "$lib/stores/goals.svelte";
    import {
        Target,
        Calendar,
        Tag,
        Plus,
        LayoutGrid,
        ChevronRight,
        Network,
    } from "lucide-svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
    import { flip } from "svelte/animate";

    interface Props {
        activeArea: GoalArea | "All";
        focusedGoalId: string | null;
        onOpenModal: (goal: Goal | null, parentId?: string) => void;
    }

    let { activeArea, focusedGoalId, onOpenModal }: Props = $props();

    // Board columns configuration
    const columns: { id: GoalHorizon; title: string; color: string }[] = [
        { id: "long", title: "Long Term", color: "border-primary/20" },
        { id: "mid", title: "Mid Term", color: "border-purple-500/20" },
        { id: "short", title: "Short Term", color: "border-green-500/20" },
    ];

    // Local state for dndzone
    let boardData = $state<Record<string, Goal[]>>({
        long: [],
        mid: [],
        short: [],
    });

    // Helper to check if a goal is a child of the focused goal (recursive)
    function isChildOf(goalId: string, parentId: string): boolean {
        const goal = goalsStore.goals.find((g) => g.id === goalId);
        if (!goal || !goal.parentId) return false;
        if (goal.parentId === parentId) return true;
        return isChildOf(goal.parentId, parentId);
    }

    // Update board data when store goals, activeArea, or focusedGoalId changes
    $effect(() => {
        let filteredGoals = goalsStore.activeGoals.filter(
            (g) => activeArea === "All" || g.area === activeArea,
        );

        if (focusedGoalId) {
            filteredGoals = filteredGoals.filter(
                (g) => g.id === focusedGoalId || isChildOf(g.id, focusedGoalId),
            );
        }

        boardData = {
            long: filteredGoals.filter((g) => g.horizon === "long"),
            mid: filteredGoals.filter((g) => g.horizon === "mid"),
            short: filteredGoals.filter((g) => g.horizon === "short"),
        };
    });

    const flipDurationMs = 300;

    function handleDndConsider(
        columnId: string,
        e: CustomEvent<DndEvent<Goal>>,
    ) {
        boardData[columnId] = e.detail.items;
    }

    function handleDndFinalize(
        columnId: string,
        e: CustomEvent<DndEvent<Goal>>,
    ) {
        boardData[columnId] = e.detail.items;
        e.detail.items.forEach((item) => {
            if (item.horizon !== columnId) {
                goalsStore.updateGoal(item.id, {
                    horizon: columnId as GoalHorizon,
                });
            }
        });
    }

    function formatDeadline(deadline?: string) {
        if (!deadline) return null;
        const date = new Date(deadline);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }
</script>

<div class="flex gap-4 h-full min-h-[600px] overflow-x-auto pb-10">
    {#each columns as column}
        <div
            class="flex-1 flex flex-col min-w-[320px] max-w-[400px] bg-surface rounded-2xl border border-line overflow-hidden"
        >
            <!-- Column Header -->
            <div
                class="p-3 px-4 bg-surface/40 border-b border-line flex items-center justify-between"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="w-1.5 h-1.5 rounded-full {column.id === 'long'
                            ? 'bg-primary'
                            : column.id === 'mid'
                              ? 'bg-purple-500'
                              : 'bg-green-500'}"
                    ></div>
                    <h3
                        class="font-bold text-white text-[11px] uppercase tracking-[0.2em]"
                    >
                        {column.title}
                    </h3>
                    <span
                        class="px-2 py-0.5 rounded-full bg-background/50 text-[9px] font-black text-muted"
                    >
                        {boardData[column.id].length}
                    </span>
                </div>
                <button
                    onclick={() => onOpenModal(null)}
                    class="p-1.5 hover:bg-white/5 rounded-lg text-muted hover:text-white transition-colors"
                >
                    <Plus size={14} />
                </button>
            </div>

            <!-- Drop Zone -->
            <div
                class="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar"
                use:dndzone={{
                    items: boardData[column.id],
                    flipDurationMs,
                    type: "goal-card",
                    dropTargetStyle: {
                        outline: "2px dashed var(--color-primary-low)",
                        outlineOffset: "-4px",
                        borderRadius: "1rem",
                    },
                }}
                onconsider={(e) => handleDndConsider(column.id, e)}
                onfinalize={(e) => handleDndFinalize(column.id, e)}
            >
                {#each boardData[column.id] as goal (goal.id)}
                    <div animate:flip={{ duration: flipDurationMs }}>
                        {@render GoalCard({ goal })}
                    </div>
                {/each}

                {#if boardData[column.id].length === 0}
                    <div
                        class="flex flex-col items-center justify-center py-12 border border-dashed border-line rounded-xl text-muted text-[10px] uppercase font-bold tracking-widest opacity-30"
                    >
                        <p>Empty</p>
                    </div>
                {/if}
            </div>
        </div>
    {/each}
</div>

{#snippet GoalCard({ goal }: { goal: Goal })}
    {@const progress = goalsStore.getGoalProgress(goal.id)}
    {@const children = goalsStore.getGoalChildren(goal.id)}
    {@const tasks = goalsStore.getGoalTasks(goal.id)}
    {@const deadline = formatDeadline(goal.deadline)}
    {@const parent = goalsStore.getGoalParent(goal.id)}

    <div
        class="bg-surface/50 border border-line rounded-xl p-3 hover:border-primary/20 transition-all group/card cursor-grab active:cursor-grabbing shadow-sm"
        onclick={() => onOpenModal(goal)}
        onkeydown={(e) => e.key === "Enter" && onOpenModal(goal)}
        role="button"
        tabindex="0"
    >
        <div class="space-y-2.5">
            <!-- Context Breadcrumb -->
            {#if parent}
                <div
                    class="flex items-center gap-1.5 text-[9px] text-muted-foreground font-bold uppercase tracking-wider mb-1"
                >
                    <Network size={10} class="text-primary/40" />
                    <span class="truncate max-w-[150px]">{parent.title}</span>
                </div>
            {/if}

            <div class="flex justify-between items-start gap-2">
                <h4
                    class="text-sm font-bold text-white group-hover/card:text-primary transition-colors line-clamp-2 leading-tight"
                >
                    {goal.title}
                </h4>
                <span
                    class="text-[11px] font-black text-white bg-background/40 px-1.5 py-0.5 rounded border border-white/5"
                >
                    {progress}%
                </span>
            </div>

            <!-- Tiny Progress -->
            <div class="w-full">
                <ProgressBar value={progress} height="h-1" showValue={false} />
            </div>

            <div
                class="flex items-center justify-between text-[10px] text-muted font-bold pt-1"
            >
                <div class="flex items-center gap-2.5">
                    <span class="flex items-center gap-1 text-primary/60">
                        <LayoutGrid size={10} />
                        {children.length + tasks.length}
                    </span>
                    {#if deadline}
                        <span class="flex items-center gap-1 opacity-70">
                            <Calendar size={10} />
                            {deadline}
                        </span>
                    {/if}
                </div>
                <div class="text-[9px] tracking-widest opacity-40 uppercase">
                    {goal.area}
                </div>
            </div>
        </div>
    </div>
{/snippet}

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
</style>
