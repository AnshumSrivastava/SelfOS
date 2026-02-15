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
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";

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

<div class="card-subtle overflow-hidden relative group">
    <div
        class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"
    ></div>

    <div class="flex items-center justify-between mb-8 relative z-10">
        <div class="flex items-center gap-4">
            <div
                class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-inner"
            >
                <Activity size={24} />
            </div>
            <div>
                <h2 class="text-xl font-bold text-white tracking-tight">
                    Rituals
                </h2>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-primary"
                        >{completionRate}% Done</span
                    >
                    <span class="w-1 h-1 rounded-full bg-line"></span>
                    <span class="text-xs text-muted"
                        >{habitsStore.completedCount}/{habitsStore.totalCount} completed</span
                    >
                </div>
            </div>
        </div>
        <button
            onclick={() => goto(`${base}/habits`)}
            class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-muted hover:text-white hover:bg-white/10 transition-all"
        >
            Manage
        </button>
    </div>

    <!-- Progress Bar -->
    {#if todayHabits.length > 0}
        <div class="mb-8 relative z-10">
            <div
                class="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5"
            >
                <div
                    class="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.5)]"
                    style="width: {completionRate}%"
                ></div>
            </div>
        </div>
    {/if}

    <div class="space-y-3 relative z-10">
        {#if habitsStore.loading}
            <SkeletonLoader lines={3} height="h-12" />
        {:else}
            {#each todayHabits as habit}
                <button
                    onclick={() => habitsStore.toggle(habit.id)}
                    class="w-full flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all group"
                >
                    <div
                        class="w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 {habit.completed
                            ? 'bg-primary border-primary text-black scale-105'
                            : 'border-white/10 group-hover:border-primary/50'}"
                    >
                        {#if habit.completed}
                            <Check size={18} strokeWidth={3} />
                        {/if}
                    </div>
                    <div class="flex-1 text-left">
                        <p
                            class="text-sm font-bold transition-all {habit.completed
                                ? 'text-muted line-through opacity-50'
                                : 'text-white'}"
                        >
                            {habit.name}
                        </p>
                        {#if habit.streakMessage && !habit.completed}
                            <p
                                class="text-[10px] uppercase font-bold tracking-wider mt-0.5 {getStreakColor(
                                    habit.streakStatus,
                                )}"
                            >
                                {habit.streakMessage}
                            </p>
                        {/if}
                    </div>
                    {#if habit.streak > 0}
                        <div
                            class="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/5 {habit.streakStatus ===
                            'at-risk'
                                ? 'bg-red-500/10 text-red-400 border-red-400/20'
                                : habit.streakStatus === 'warning'
                                  ? 'bg-orange-500/10 text-orange-400 border-orange-400/20'
                                  : habit.streakStatus === 'strong'
                                    ? 'bg-green-500/10 text-green-400 border-green-400/20'
                                    : 'bg-primary/10 text-primary border-primary/20'}"
                        >
                            {#if habit.streakStatus === "at-risk"}
                                <AlertTriangle size={12} />
                            {:else if habit.streakStatus === "strong"}
                                <TrendingUp size={12} />
                            {:else}
                                <Flame size={12} />
                            {/if}
                            <span
                                class="text-xs font-mono font-bold tracking-tighter"
                                >{habit.streak}</span
                            >
                        </div>
                    {/if}
                </button>
            {/each}

            {#if todayHabits.length === 0}
                <div
                    class="text-center py-12 text-muted bg-white/5 rounded-3xl border border-dashed border-white/10"
                >
                    <Activity size={40} class="mx-auto mb-4 opacity-20" />
                    <p class="text-sm font-bold text-white/50">Quiet Day</p>
                    <p class="text-[10px] uppercase tracking-widest mt-2">
                        No active rituals
                    </p>
                </div>
            {/if}
        {/if}
    </div>
</div>
