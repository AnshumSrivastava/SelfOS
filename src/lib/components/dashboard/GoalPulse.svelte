<script lang="ts">
    import { Target, ArrowRight, TrendingUp, Flag } from "lucide-svelte";
    import { goalsStore } from "$lib/stores/goals.svelte";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { fade } from "svelte/transition";

    const nextSteps = $derived(dashboardStore.goalNextSteps);
    const activeGoals = $derived(goalsStore.activeGoals);
</script>

<div class="card-subtle p-6 flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-purple-400/10 text-purple-400">
                <Target size={20} />
            </div>
            <h2 class="text-xl font-semibold text-white">Goal Pulse</h2>
        </div>
    </div>

    <div class="flex-1 space-y-6">
        {#if nextSteps.length > 0}
            <div class="space-y-3">
                <span
                    class="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5"
                >
                    <Flag size={12} />
                    Next Strategic Steps
                </span>
                <div class="space-y-4">
                    {#each nextSteps.slice(0, 2) as step}
                        <div class="group cursor-pointer">
                            <p
                                class="text-[10px] font-bold text-muted uppercase tracking-tighter mb-1 truncate"
                            >
                                {step.goal_title}
                            </p>
                            <div
                                class="flex items-start gap-2 group-hover:translate-x-1 transition-transform"
                            >
                                <ArrowRight
                                    size={14}
                                    class="text-purple-400 mt-0.5 shrink-0"
                                />
                                <p
                                    class="text-sm font-semibold text-white leading-tight"
                                >
                                    {step.next_step}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <div class="space-y-3 pt-2">
            <span
                class="text-[10px] font-bold text-muted uppercase tracking-widest"
                >Strategic Progress</span
            >
            <div class="space-y-3">
                {#each activeGoals.slice(0, 2) as goal}
                    {@const progress = goalsStore.getGoalProgress(goal.id)}
                    <div class="space-y-1.5">
                        <div
                            class="flex items-center justify-between text-[11px] font-bold"
                        >
                            <span class="text-white/80 truncate max-w-[150px]"
                                >{goal.title}</span
                            >
                            <span class="text-primary">{progress}%</span>
                        </div>
                        <div
                            class="w-full h-1 bg-surface rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-primary transition-all duration-1000"
                                style="width: {progress}%"
                            ></div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <div
        class="mt-6 pt-4 border-t border-line flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-widest"
    >
        <span>Horizon Status</span>
        <span class="text-white">On Track</span>
    </div>
</div>
