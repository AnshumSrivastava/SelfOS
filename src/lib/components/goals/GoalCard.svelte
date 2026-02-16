<script lang="ts">
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte";
    import GoalProgressRing from "./GoalProgressRing.svelte";
    import {
        Target,
        Flag,
        Calendar,
        AlertCircle,
        ChevronRight,
        Zap,
    } from "lucide-svelte";

    let { goal, onclick, onFocus } = $props<{
        goal: Goal;
        onclick?: (goal: Goal) => void;
        onFocus?: (goalId: string) => void;
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
    class="group relative card-subtle p-5 transition-all duration-300 cursor-pointer overflow-hidden border-transparent hover:border-primary/20"
    onclick={() => onclick?.(goal)}
    onkeydown={(e) => e.key === "Enter" && onclick?.(goal)}
    role="button"
    tabindex="0"
>
    <!-- Background Glow -->
    <div
        class="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
    ></div>

    <div class="flex items-center gap-6 relative z-10">
        <!-- Progress Indicator -->
        <div class="flex-shrink-0">
            <GoalProgressRing {progress} {health} size="md" />
        </div>

        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
                <span
                    class="text-[9px] font-black uppercase tracking-[0.2em] text-muted"
                >
                    {goal.area}
                </span>
                <div class="w-1 h-1 rounded-full bg-line"></div>
                <span
                    class="text-[9px] font-bold uppercase tracking-widest {goal.priority ===
                    'high'
                        ? 'text-rose-500'
                        : 'text-muted/60'}"
                >
                    {goal.priority || "normal"}
                </span>
            </div>

            <h3
                class="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate"
            >
                {goal.title}
            </h3>

            {#if goal.targetDate}
                <div
                    class="flex items-center gap-1.5 mt-2 text-[10px] text-muted"
                >
                    <Calendar size={12} class="opacity-50" />
                    <span class="font-medium"
                        >Targets {new Date(goal.targetDate).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                        )}</span
                    >
                </div>
            {/if}
        </div>

        <div class="flex items-center gap-3">
            {#if onFocus}
                <button
                    class="p-2.5 rounded-xl bg-surface border border-line text-muted hover:text-primary hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100"
                    onclick={(e) => {
                        e.stopPropagation();
                        onFocus(goal.id);
                    }}
                    title="Focus on this mission"
                >
                    <Zap size={16} />
                </button>
            {/if}

            <ChevronRight
                size={20}
                class="text-muted/30 group-hover:text-primary group-hover:translate-x-1 transition-all"
            />
        </div>
    </div>

    <!-- Minimal Health Indicator -->
    {#if health !== "on-track"}
        <div class="absolute top-0 left-0">
            <div
                class="w-1.5 h-full {health === 'stalled'
                    ? 'bg-rose-500'
                    : 'bg-amber-500'} opacity-50"
            ></div>
        </div>
    {/if}
</div>
