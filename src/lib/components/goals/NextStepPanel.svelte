<script lang="ts">
    import { goalsStore } from "$lib/stores/goals.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { Zap, ArrowRight, AlertCircle, Trophy } from "lucide-svelte";
    import GoalProgressRing from "./GoalProgressRing.svelte";
    import { slide, fade } from "svelte/transition";

    const nextAction = $derived.by(() => {
        // 1. Find high-priority goals that are on-going
        const activeGoals = goalsStore.goals.filter(
            (g) => g.status === "active" && !g.completed,
        );

        // Sort goals by priority and health
        const prioritizedGoals = [...activeGoals].sort((a, b) => {
            // High priority first
            if (a.priority === "high" && b.priority !== "high") return -1;
            if (b.priority === "high" && a.priority !== "high") return 1;

            // At-risk health first
            const healthA = goalsStore.getGoalHealth(a.id);
            const healthB = goalsStore.getGoalHealth(b.id);
            if (healthA === "at-risk" && healthB !== "at-risk") return -1;
            if (healthB === "at-risk" && healthA !== "at-risk") return 1;

            return 0;
        });

        if (prioritizedGoals.length === 0) return null;

        // Find the first pending task for the top prioritized goal
        for (const goal of prioritizedGoals) {
            const tasks = tasksStore.tasks.filter(
                (t) => t.goalId === goal.id && t.status !== "completed",
            );
            if (tasks.length > 0) {
                // Return goal + task
                return { goal, task: tasks[0] };
            }
        }

        return null;
    });

    const completionStats = $derived.by(() => {
        const total = goalsStore.goals.length;
        const completed = goalsStore.goals.filter(
            (g) => g.status === "completed" || g.completed,
        ).length;
        return {
            total,
            completed,
            percentage: total > 0 ? (completed / total) * 100 : 0,
        };
    });
</script>

<div
    class="bg-surface/40 border border-line rounded-3xl p-6 backdrop-blur-sm overflow-hidden relative"
>
    <!-- Background Sparkle -->
    <div
        class="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 blur-3xl rounded-full"
    ></div>

    <div class="flex flex-col md:flex-row items-center gap-8 relative">
        {#if nextAction}
            <div class="flex-shrink-0">
                <GoalProgressRing
                    progress={goalsStore.getGoalProgress(nextAction.goal.id)}
                    health={goalsStore.getGoalHealth(nextAction.goal.id)}
                    size="lg"
                />
            </div>

            <div class="flex-1 text-center md:text-left">
                <div
                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-widest mb-4"
                >
                    <Zap size={12} />
                    Next Logical Move
                </div>

                <h3 class="text-xl font-bold text-white mb-2 leading-tight">
                    {nextAction.task.title}
                </h3>
                <p
                    class="text-sm text-muted flex items-center justify-center md:justify-start gap-2"
                >
                    <span class="text-muted/50 font-medium">Part of:</span>
                    <span class="text-white/80 font-bold"
                        >{nextAction.goal.title}</span
                    >
                </p>

                <div
                    class="flex items-center justify-center md:justify-start gap-4 mt-6"
                >
                    <button
                        onclick={() =>
                            tasksStore.update(nextAction.task.id, {
                                status: "completed",
                            })}
                        class="flex items-center gap-2 px-6 py-2.5 bg-primary hover:opacity-90 text-black rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
                    >
                        Mark Done
                        <ArrowRight size={18} />
                    </button>

                    {#if goalsStore.getGoalHealth(nextAction.goal.id) !== "on-track"}
                        <div
                            class="flex items-center gap-2 text-[10px] font-bold text-rose-400 bg-rose-400/10 px-3 py-2 rounded-xl border border-rose-400/20"
                        >
                            <AlertCircle size={14} />
                            GOAL IS STALLED
                        </div>
                    {/if}
                </div>
            </div>
        {:else}
            <div
                class="flex-1 flex flex-col items-center justify-center py-4 text-center"
            >
                <div
                    class="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-primary mb-4 border border-line"
                >
                    <Trophy size={32} />
                </div>
                <h3 class="text-lg font-bold text-white mb-1">Board Cleared</h3>
                <p class="text-sm text-muted">
                    You're currently ahead of your objectives. Time to
                    strategize?
                </p>
                <button
                    class="mt-6 text-primary font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-colors"
                >
                    View Roadmap
                </button>
            </div>
        {/if}

        <!-- Side Stats (Optional) -->
        <div class="hidden lg:block w-[1px] h-24 bg-line"></div>

        <div class="hidden lg:flex flex-col gap-4 min-w-[140px]">
            <div>
                <p
                    class="text-[9px] font-black text-muted uppercase tracking-widest mb-1"
                >
                    Strategic Momentum
                </p>
                <div
                    class="flex items-end gap-2 text-2xl font-black text-white"
                >
                    {completionStats.completed}
                    <span
                        class="text-sm text-muted font-medium pb-1.5 capitalize"
                        >/ {completionStats.total} Goals</span
                    >
                </div>
            </div>
            <div class="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                <div
                    class="bg-primary h-full transition-all duration-1000"
                    style="width: {completionStats.percentage}%"
                ></div>
            </div>
        </div>
    </div>
</div>
