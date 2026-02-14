<script lang="ts">
    import { Flame, Activity, AlertTriangle, TrendingUp } from "lucide-svelte";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { fade } from "svelte/transition";

    const risks = $derived(dashboardStore.momentumRisks);
    const completedCount = $derived(habitsStore.completedCount);
    const totalCount = $derived(habitsStore.totalCount);
    const progress = $derived(
        totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
    );
</script>

<div class="card-subtle p-6 flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-orange-400/10 text-orange-400">
                <Flame size={20} />
            </div>
            <h2 class="text-xl font-semibold text-white">Momentum</h2>
        </div>
        <div
            class="flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-line"
        >
            <TrendingUp size={12} class="text-primary" />
            <span class="text-[10px] font-bold text-white tracking-widest"
                >{Math.round(progress)}%</span
            >
        </div>
    </div>

    <div class="flex-1 space-y-4">
        {#if risks.length > 0}
            <div
                class="p-3 rounded-xl bg-orange-400/5 border border-orange-400/20 mb-2"
            >
                <div class="flex items-center gap-2 text-orange-400 mb-2">
                    <AlertTriangle size={14} />
                    <span
                        class="text-[10px] font-bold uppercase tracking-widest"
                        >Streaks at Risk</span
                    >
                </div>
                <div class="flex flex-wrap gap-2">
                    {#each risks as risk}
                        <div
                            class="px-2 py-1 rounded-lg bg-orange-400/10 text-orange-400 text-[10px] font-bold border border-orange-400/20"
                        >
                            {risk.name} ({risk.streak}d)
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <div class="grid grid-cols-1 gap-3">
            {#each habitsStore.habits.slice(0, 3) as habit}
                {@const isDone = habitsStore.isCompleted(habit.id)}
                <div class="flex items-center justify-between group">
                    <div class="flex items-center gap-3 min-w-0">
                        <div
                            class="w-2 h-2 rounded-full {isDone
                                ? 'bg-primary'
                                : 'bg-line'} shadow-[0_0_8px] {isDone
                                ? 'shadow-primary/40'
                                : 'shadow-transparent'}"
                        ></div>
                        <span
                            class="text-sm font-medium {isDone
                                ? 'text-muted line-through'
                                : 'text-white'} truncate transition-all"
                        >
                            {habit.name}
                        </span>
                    </div>
                    <span
                        class="text-[10px] font-bold text-muted group-hover:text-primary transition-colors"
                    >
                        {habit.streak}d
                    </span>
                </div>
            {/each}
        </div>
    </div>

    <div
        class="mt-6 pt-4 border-t border-line flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-widest"
    >
        <span>Consistency Score</span>
        <span class="text-white">Relentless</span>
    </div>
</div>
