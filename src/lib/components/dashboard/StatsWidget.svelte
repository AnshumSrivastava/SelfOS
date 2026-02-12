<script lang="ts">
    import {
        Flame,
        Wallet,
        CheckSquare,
        Clock,
        TrendingUp,
        TrendingDown,
        ArrowRight,
    } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { financeStore } from "$lib/stores/finance.svelte";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";

    // Calculate stats with insights
    let maxStreak = $derived(
        Math.max(0, ...habitsStore.habits.map((h) => h.streak)),
    );
    let completedTasks = $derived(tasksStore.completedCount);
    let totalTasks = $derived(tasksStore.tasks.length);
    let netWorth = $derived(financeStore.balance);
    let totalFocusTime = $derived(0); // Placeholder

    // Calculate completion rate
    let taskCompletionRate = $derived(
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    );

    // Get habit consistency (habits completed today)
    let habitConsistency = $derived(
        habitsStore.totalCount > 0
            ? Math.round(
                  (habitsStore.completedCount / habitsStore.totalCount) * 100,
              )
            : 0,
    );

    const stats = $derived([
        {
            icon: Flame,
            value: maxStreak,
            unit: "Days",
            label: "Best Streak",
            insight:
                maxStreak >= 7
                    ? "Excellent momentum!"
                    : maxStreak >= 3
                      ? "Building consistency"
                      : "Start building habits",
            trendUp: maxStreak >= 3,
            color: "primary",
            link: `${base}/habits`,
            actionable: maxStreak < 7,
        },
        {
            icon: Wallet,
            value: `₹${Math.abs(netWorth).toFixed(0)}`,
            unit: "",
            label: netWorth >= 0 ? "Net Worth" : "Net Debt",
            insight:
                netWorth >= 1000
                    ? "Strong position"
                    : netWorth >= 0
                      ? "Building wealth"
                      : "Track expenses",
            trendUp: netWorth >= 0,
            color: "secondary",
            link: `${base}/finance`,
            actionable: netWorth < 1000,
        },
        {
            icon: CheckSquare,
            value: taskCompletionRate,
            unit: "%",
            label: "Tasks Complete",
            insight:
                taskCompletionRate >= 80
                    ? "Great progress!"
                    : taskCompletionRate >= 50
                      ? "Keep pushing"
                      : "Focus needed",
            trendUp: taskCompletionRate >= 50,
            color: "primary",
            link: `${base}/tasks`,
            actionable: taskCompletionRate < 80,
        },
        {
            icon: Clock,
            value: habitConsistency,
            unit: "%",
            label: "Habit Score",
            insight:
                habitConsistency === 100
                    ? "Perfect day!"
                    : habitConsistency >= 70
                      ? "Almost there"
                      : "Keep going",
            trendUp: habitConsistency >= 70,
            color: "secondary",
            link: `${base}/habits`,
            actionable: habitConsistency < 100,
        },
    ]);
</script>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {#each stats as stat}
        {@const Icon = stat.icon}
        {@const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown}
        <button
            onclick={() => goto(stat.link)}
            class="card-subtle hover:border-{stat.color}/30 transition-all group cursor-pointer text-left relative overflow-hidden"
        >
            <!-- Background gradient for actionable items -->
            {#if stat.actionable}
                <div
                    class="absolute inset-0 bg-gradient-to-br from-{stat.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
            {/if}

            <div class="relative z-10">
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
                    </div>
                </div>
                <div class="flex items-baseline gap-1 mb-1">
                    <span class="text-2xl font-bold text-white"
                        >{stat.value}</span
                    >
                    {#if stat.unit}
                        <span class="text-sm text-muted">{stat.unit}</span>
                    {/if}
                </div>
                <p class="text-sm text-muted mb-2">{stat.label}</p>
                <div class="flex items-center justify-between">
                    <p class="text-xs text-primary font-medium">
                        {stat.insight}
                    </p>
                    {#if stat.actionable}
                        <ArrowRight
                            size={14}
                            class="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                    {/if}
                </div>
            </div>
        </button>
    {/each}
</div>
