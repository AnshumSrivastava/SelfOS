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
                streakMessage = "Preserve Streak";
            } else if (streak >= 3 && !completed) {
                streakStatus = "warning";
                streakMessage = "Continue Flow";
            }

            return {
                ...habit,
                completed,
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

<div class="space-y-4">
    <div class="flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
            <Activity size={14} class="text-primary/60" />
            <h3
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
            >
                Vitality Loops
            </h3>
        </div>
        <span
            class="text-[9px] font-black text-primary/40 uppercase tracking-[0.1em]"
            >{completionRate}% Optimal</span
        >
    </div>

    <div class="space-y-3">
        {#if habitsStore.loading}
            <SkeletonLoader lines={2} height="h-10" />
        {:else}
            {#each todayHabits as habit}
                <button
                    onclick={() => habitsStore.toggle(habit.id)}
                    class="w-full flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/30 hover:bg-white/[0.04] transition-all group"
                >
                    <div
                        class="w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 {habit.completed
                            ? 'bg-primary border-primary text-black'
                            : 'border-white/10 group-hover:border-primary/50'}"
                    >
                        {#if habit.completed}
                            <Check size={14} strokeWidth={3} />
                        {/if}
                    </div>
                    <div class="flex-1 text-left min-w-0">
                        <p
                            class="text-sm font-bold truncate transition-all {habit.completed
                                ? 'text-muted/40 line-through'
                                : 'text-white'}"
                        >
                            {habit.name}
                        </p>
                    </div>
                    {#if habit.streak > 0}
                        <div
                            class="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5"
                        >
                            <Flame
                                size={10}
                                class={habit.completed
                                    ? "text-primary"
                                    : "text-orange-400"}
                            />
                            <span
                                class="text-[10px] font-black font-mono {habit.completed
                                    ? 'text-primary/60'
                                    : 'text-white'}">{habit.streak}</span
                            >
                        </div>
                    {/if}
                </button>
            {/each}

            {#if todayHabits.length === 0}
                <div
                    class="p-6 rounded-3xl border border-dashed border-white/5 text-center"
                >
                    <p
                        class="text-[9px] font-black text-muted/30 uppercase tracking-widest"
                    >
                        Base Metabolism Idle
                    </p>
                </div>
            {/if}
        {/if}
    </div>
</div>
