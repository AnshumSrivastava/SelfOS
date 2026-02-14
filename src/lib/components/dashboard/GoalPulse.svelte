<script lang="ts">
    import { Target, ArrowRight, TrendingUp, Flag } from "lucide-svelte";
    import { goalsStore } from "$lib/stores/goals.svelte";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { fade } from "svelte/transition";

    const nextSteps = $derived(dashboardStore.goalNextSteps);
    const activeGoals = $derived(goalsStore.activeGoals);
</script>

<div class="card-subtle p-6 flex flex-col h-full">
    <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-purple-400/10 text-purple-400">
                <Target size={20} />
            </div>
            <h2 class="text-xl font-semibold text-white">Strategic Horizon</h2>
        </div>
        <span
            class="text-[9px] font-bold uppercase tracking-[0.2em] text-muted"
        >
            {activeGoals.length} Active Targets
        </span>
    </div>

    <div class="flex-1 space-y-8">
        {#if nextSteps.length > 0}
            <div class="space-y-4">
                <span
                    class="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5"
                >
                    <Flag size={12} />
                    Critical Path Operations
                </span>
                <div class="space-y-5">
                    {#each nextSteps.slice(0, 2) as step}
                        <div
                            class="group cursor-default border-l-2 border-purple-400/20 pl-4 hover:border-purple-400 transition-all"
                        >
                            <p
                                class="text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 truncate opacity-70"
                            >
                                {step.goal_title}
                            </p>
                            <div class="flex items-start gap-2.5">
                                <ArrowRight
                                    size={14}
                                    class="text-purple-400 mt-0.5 shrink-0"
                                />
                                <p
                                    class="text-sm font-bold text-white leading-snug group-hover:text-primary transition-colors"
                                >
                                    {step.next_step}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <div class="space-y-5 pt-2">
            <span
                class="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-60"
                >Execution Progress</span
            >
            <div class="space-y-5">
                {#each activeGoals.slice(0, 2) as goal}
                    {@const progress = goalsStore.getGoalProgress(goal.id)}
                    <div class="space-y-2">
                        <div
                            class="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight"
                        >
                            <span class="text-white/90 truncate max-w-[150px]"
                                >{goal.title}</span
                            >
                            <span class="text-primary font-mono"
                                >{progress}%</span
                            >
                        </div>
                        <div
                            class="w-full h-1.5 bg-surface/50 rounded-full overflow-hidden border border-line/30"
                        >
                            <div
                                class="h-full bg-gradient-to-r from-purple-500 to-primary transition-all duration-1000"
                                style="width: {progress}%"
                            ></div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <div
        class="mt-8 pt-6 border-t border-line/50 flex items-center justify-between"
    >
        <div class="flex flex-col gap-1">
            <span
                class="text-[9px] font-bold text-muted uppercase tracking-[0.2em]"
                >Trajectory Status</span
            >
            <span
                class="text-xs font-bold text-emerald-400 uppercase tracking-widest"
                >Nominal Performance</span
            >
        </div>
        <TrendingUp size={16} class="text-purple-400 opacity-50" />
    </div>
</div>
