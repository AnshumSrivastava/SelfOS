<script lang="ts">
    import {
        Activity,
        Check,
        Flame,
        TrendingUp,
        AlertTriangle,
    } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";

    // Get today's habits with enhanced information
    let todayHabits = $derived.by(() => {
        return habitsStore.habits.map((habit) => {
            const completed = habitsStore.isCompleted(habit.id);
            const streak = habit.streak;
            let streakStatus = "normal";
            let streakMessage = "";

            if (streak >= 7 && !completed) {
                streakStatus = "at-risk";
                streakMessage = "Don't break it!";
            } else if (streak >= 3 && !completed) {
                streakStatus = "warning";
                streakMessage = "Keep it going";
            } else if (completed && streak >= 7) {
                streakStatus = "strong";
                streakMessage = "Amazing!";
            }

            return {
                ...habit,
                completed,
                streakStatus,
                streakMessage,
            };
        });
    });

    let completionRate = $derived(
        todayHabits.length > 0
            ? Math.round(
                  (todayHabits.filter((h) => h.completed).length /
                      todayHabits.length) *
                      100,
              )
            : 0,
    );

    function getStreakColor(status: string) {
        switch (status) {
            case "at-risk":
                return "text-red-400";
            case "warning":
                return "text-orange-400";
            case "strong":
                return "text-green-400";
            default:
                return "text-primary";
        }
    }
</script>

<div class="card-subtle">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
            <div
                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
            >
                <Activity size={20} />
            </div>
            <div>
                <h2 class="text-lg font-semibold text-white">Daily Habits</h2>
                <p class="text-xs text-muted">
                    {habitsStore.completedCount}/{habitsStore.totalCount} completed
                    · {completionRate}%
                </p>
            </div>
        </div>
        <button
            onclick={() => goto(`${base}/habits`)}
            class="text-sm text-primary hover:underline font-medium"
        >
            View All
        </button>
    </div>

    <!-- Progress Bar -->
    {#if todayHabits.length > 0}
        <div class="mb-4">
            <div class="h-2 bg-surface rounded-full overflow-hidden">
                <div
                    class="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style="width: {completionRate}%"
                ></div>
            </div>
        </div>
    {/if}

    <div class="space-y-2">
        {#each todayHabits as habit}
            <button
                onclick={() => habitsStore.toggle(habit.id)}
                class="w-full flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface/80 transition-all group"
            >
                <div
                    class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all {habit.completed
                        ? 'bg-primary border-primary'
                        : 'border-line group-hover:border-primary/50'}"
                >
                    {#if habit.completed}
                        <Check size={14} class="text-black" />
                    {/if}
                </div>
                <div class="flex-1 text-left">
                    <p
                        class="text-sm font-medium {habit.completed
                            ? 'text-muted line-through'
                            : 'text-white'}"
                    >
                        {habit.name}
                    </p>
                    {#if habit.streakMessage}
                        <p
                            class="text-xs mt-0.5 {getStreakColor(
                                habit.streakStatus,
                            )}"
                        >
                            {habit.streakMessage}
                        </p>
                    {/if}
                </div>
                {#if habit.streak > 0}
                    <div
                        class="flex items-center gap-1.5 px-2 py-1 rounded-lg {habit.streakStatus ===
                        'at-risk'
                            ? 'bg-red-500/10 text-red-400'
                            : habit.streakStatus === 'warning'
                              ? 'bg-orange-500/10 text-orange-400'
                              : habit.streakStatus === 'strong'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-primary/10 text-primary'}"
                    >
                        {#if habit.streakStatus === "at-risk"}
                            <AlertTriangle size={12} />
                        {:else if habit.streakStatus === "strong"}
                            <TrendingUp size={12} />
                        {:else}
                            <Flame size={12} />
                        {/if}
                        <span class="text-xs font-semibold">{habit.streak}</span
                        >
                    </div>
                {/if}
            </button>
        {/each}

        {#if todayHabits.length === 0}
            <div class="text-center py-8 text-muted">
                <Activity size={32} class="mx-auto mb-2 opacity-50" />
                <p class="text-sm">No habits yet</p>
                <p class="text-xs mt-1">Start building good habits today!</p>
            </div>
        {/if}
    </div>
</div>
