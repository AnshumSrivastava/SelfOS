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
    <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-orange-400/10 text-orange-400">
                <Flame size={20} />
            </div>
            <h2 class="text-xl font-semibold text-white">Momentum Engine</h2>
        </div>
        <div class="flex flex-col items-end gap-1">
            <span
                class="text-[9px] font-bold text-muted uppercase tracking-[0.2em]"
                >{completedCount}/{totalCount} Completed</span
            >
            <div
                class="w-20 h-1 bg-surface border border-line rounded-full overflow-hidden"
            >
                <div
                    class="h-full bg-primary transition-all duration-500"
                    style="width: {progress}%"
                ></div>
            </div>
        </div>
    </div>

    <div class="flex-1 space-y-6">
        {#if risks.length > 0}
            <div
                class="p-4 rounded-2xl bg-orange-400/5 border border-orange-400/20 mb-2 relative overflow-hidden group hover:border-orange-400/40 transition-all"
            >
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2 text-orange-400">
                        <AlertTriangle size={14} />
                        <span
                            class="text-[10px] font-bold uppercase tracking-widest"
                            >Streak Preservation</span
                        >
                    </div>
                    <span
                        class="text-[9px] font-bold text-orange-400/60 uppercase tracking-tighter"
                        >Action Required</span
                    >
                </div>
                <div class="flex flex-wrap gap-2">
                    {#each risks as risk}
                        <div
                            class="px-2.5 py-1 rounded-lg bg-orange-400/10 text-orange-400 text-[10px] font-bold border border-orange-400/20 group-hover:bg-orange-400/20 transition-colors"
                        >
                            {risk.name}
                            <span class="opacity-60 ml-1">{risk.streak}d</span>
                        </div>
                    {/each}
                </div>

                <!-- Background glow -->
                <div
                    class="absolute -right-4 -top-4 w-16 h-16 bg-orange-400/5 blur-2xl rounded-full"
                ></div>
            </div>
        {/if}

        <div class="grid grid-cols-1 gap-4">
            <span
                class="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-60"
                >Status Overview</span
            >
            {#each habitsStore.habits.slice(0, 4) as habit}
                {@const isDone = habitsStore.isCompleted(habit.id)}
                <div
                    class="flex items-center justify-between group cursor-default"
                >
                    <div class="flex items-center gap-3 min-w-0">
                        <div
                            class="w-2.5 h-2.5 rounded-full border-2 {isDone
                                ? 'bg-primary border-primary shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]'
                                : 'bg-transparent border-line'} transition-all"
                        ></div>
                        <span
                            class="text-sm font-bold {isDone
                                ? 'text-muted/60'
                                : 'text-white'} truncate transition-all group-hover:text-primary"
                        >
                            {habit.name}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span
                            class="text-[9px] font-mono text-muted group-hover:text-white transition-colors"
                        >
                            {habit.streak} DAY STREAK
                        </span>
                        {#if !isDone}
                            <div
                                class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"
                            ></div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div
        class="mt-8 pt-6 border-t border-line/50 flex items-center justify-between"
    >
        <div class="flex flex-col gap-1">
            <span
                class="text-[9px] font-bold text-muted uppercase tracking-[0.2em]"
                >Consistency Index</span
            >
            <span class="text-xs font-bold text-white uppercase tracking-widest"
                >High Performance</span
            >
        </div>
        <TrendingUp size={16} class="text-primary opacity-50" />
    </div>
</div>
