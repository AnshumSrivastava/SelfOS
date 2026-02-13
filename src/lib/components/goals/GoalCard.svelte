<script lang="ts">
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte";
    import GoalProgressRing from "./GoalProgressRing.svelte";
    import {
        Target,
        Flag,
        Calendar,
        AlertCircle,
        ChevronRight,
    } from "lucide-svelte";

    let { goal, onclick } = $props<{
        goal: Goal;
        onclick?: (goal: Goal) => void;
    }>();

    const progress = $derived(goalsStore.getGoalProgress(goal.id));
    const health = $derived(goalsStore.getGoalHealth(goal.id));

    const horizonColors = {
        life: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        long: "bg-primary/10 text-primary border-primary/20",
        mid: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
        short: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };

    const priorityColors = {
        high: "text-rose-500",
        normal: "text-amber-500",
        low: "text-muted",
    };
</script>

<div
    class="group relative card-subtle p-4 transition-all duration-300 cursor-pointer"
    onclick={() => onclick?.(goal)}
    onkeydown={(e) => e.key === "Enter" && onclick?.(goal)}
    role="button"
    tabindex="0"
>
    <div class="flex items-start gap-4">
        <!-- Progress Indicator -->
        <GoalProgressRing {progress} {health} size="md" />

        <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2 mb-1">
                <span
                    class="px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider {horizonColors[
                        goal.horizon as keyof typeof horizonColors
                    ]}"
                >
                    {goal.horizon}
                </span>

                {#if goal.priority === "high"}
                    <Flag size={14} class="text-rose-500" />
                {/if}
            </div>

            <h3
                class="text-white font-semibold truncate group-hover:text-primary transition-colors"
            >
                {goal.title}
            </h3>

            {#if goal.vision}
                <p
                    class="text-muted text-xs line-clamp-1 mt-1 font-serif italic"
                >
                    "{goal.vision}"
                </p>
            {/if}

            <div
                class="flex items-center gap-4 mt-3 text-[10px] text-muted font-medium"
            >
                {#if goal.targetDate}
                    <div class="flex items-center gap-1">
                        <Calendar size={12} />
                        <span
                            >{new Date(
                                goal.targetDate,
                            ).toLocaleDateString()}</span
                        >
                    </div>
                {/if}

                <div class="flex items-center gap-1">
                    <Target size={12} />
                    <span>{goal.area}</span>
                </div>
            </div>
        </div>

        <button class="p-2 text-muted/50 hover:text-white transition-colors">
            <ChevronRight size={20} />
        </button>
    </div>

    <!-- Health Label (Conditional) -->
    {#if health !== "on-track"}
        <div class="absolute -top-1 -right-1">
            <div
                class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-line text-[9px] font-bold {health ===
                'stalled'
                    ? 'text-rose-500'
                    : 'text-amber-500'}"
            >
                <AlertCircle size={10} />
                {health.toUpperCase()}
            </div>
        </div>
    {/if}
</div>
