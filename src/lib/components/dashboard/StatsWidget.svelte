<script lang="ts">
    import {
        Flame,
        Wallet,
        CheckSquare,
        Clock,
        TrendingUp,
        TrendingDown,
    } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { financeStore } from "$lib/stores/finance.svelte";
    // Removed import { focusStore } from "$lib/stores/focus.svelte";

    // Calculate stats
    let maxStreak = $derived(
        Math.max(0, ...habitsStore.habits.map((h) => h.streak)),
    );
    let completedTasks = $derived(tasksStore.completedCount);
    let totalTasks = $derived(tasksStore.tasks.length);
    let netWorth = $derived(financeStore.balance);
    // Note: Focus store doesn't have sessions, so we'll use a placeholder for now
    let totalFocusTime = $derived(0); // Will be implemented when focus store is updated

    const stats = $derived([
        {
            icon: Flame,
            value: maxStreak,
            unit: "Days",
            label: "Habit Streak",
            trend: "+10%",
            trendUp: true,
            color: "primary",
        },
        {
            icon: Wallet,
            value: `₹${netWorth.toFixed(1)}`,
            unit: "",
            label: "Net Worth",
            trend: "+2.5%",
            trendUp: true,
            color: "secondary",
        },
        {
            icon: CheckSquare,
            value: `${completedTasks}/${totalTasks}`,
            unit: "",
            label: "Tasks Done",
            trend: completedTasks > 0 ? "+5%" : "0%",
            trendUp: completedTasks > 0,
            color: "primary",
        },
        {
            icon: Clock,
            value: totalFocusTime.toFixed(1),
            unit: "h",
            label: "Deep Work",
            trend: "+15%",
            trendUp: true,
            color: "secondary",
        },
    ]);
</script>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {#each stats as stat}
        {@const Icon = stat.icon}
        {@const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown}
        <div
            class="card hover:border-{stat.color}/30 transition-all group cursor-pointer"
        >
            <div class="flex items-start justify-between mb-4">
                <div
                    class="w-12 h-12 rounded-xl bg-{stat.color}/10 flex items-center justify-center text-{stat.color} group-hover:scale-110 transition-transform"
                >
                    <Icon size={24} />
                </div>
                <div
                    class="flex items-center gap-1 text-xs {stat.trendUp
                        ? 'text-green-400'
                        : 'text-red-400'}"
                >
                    <TrendIcon size={14} />
                    <span>{stat.trend}</span>
                </div>
            </div>
            <div class="flex items-baseline gap-1 mb-1">
                <span class="text-2xl font-bold text-white">{stat.value}</span>
                {#if stat.unit}
                    <span class="text-sm text-muted">{stat.unit}</span>
                {/if}
            </div>
            <p class="text-sm text-muted">{stat.label}</p>
        </div>
    {/each}
</div>
