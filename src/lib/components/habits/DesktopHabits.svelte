<script lang="ts">
    import { Check, Flame, Trophy, Plus } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";

    let todayProgress = $derived(
        (habitsStore.completedCount / habitsStore.totalCount) * 100 || 0,
    );

    // Helper for weekly overview (mock data relative to today)
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - today.getDay() + i + 1); // Start Monday
        return {
            name: d.toLocaleDateString("en-US", { weekday: "short" }),
            date: d.getDate(),
            isToday: d.toDateString() === today.toDateString(),
        };
    });
</script>

<div class="space-y-8 pb-12">
    <div class="flex items-end justify-between">
        <div>
            <h1
                class="text-3xl font-bold text-[var(--color-text)] mb-2 flex items-center gap-3"
            >
                {today.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                })}
                <span
                    class="text-lg font-normal text-muted px-3 py-1 rounded-full border border-line bg-surface"
                    >Week {Math.ceil(
                        (today.getDate() + 6 - today.getDay()) / 7,
                    )}</span
                >
            </h1>
            <p class="text-muted">
                You're making great progress! Keep the streak alive.
            </p>
        </div>

        <button
            onclick={() =>
                habitsStore.add("New Habit " + (habitsStore.totalCount + 1))}
            class="btn btn-primary flex items-center gap-2"
        >
            <Plus size={18} /> New Habit
        </button>
    </div>

    <!-- Weekly Progress Strip -->
    <div class="card">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-[var(--color-text)]">Weekly Overview</h3>
            <div class="flex items-center gap-2 text-sm text-muted">
                <Flame size={16} class="text-primary" />
                <span
                    >Current Streak: {Math.max(
                        0,
                        ...habitsStore.habits.map((h) => h.streak),
                    )} Days</span
                >
            </div>
        </div>
        <div class="grid grid-cols-7 gap-4">
            {#each days as day, i}
                <div class="flex flex-col items-center gap-2">
                    <span class="text-xs text-muted">{day.name}</span>
                    <div
                        class="w-full aspect-square rounded-lg {day.isToday
                            ? 'bg-surface border-2 border-primary text-[var(--color-text)]'
                            : 'bg-surface border border-line'} flex items-center justify-center font-bold relative overflow-hidden group"
                    >
                        <!-- Mock checkmarks for past days -->
                        {#if i < days.findIndex((d) => d.isToday)}
                            <Check size={20} class="text-muted" />
                        {/if}
                        <span class="relative z-10">{day.date}</span>
                        {#if day.isToday}
                            <div
                                class="absolute inset-0 bg-primary/20 animate-pulse"
                            ></div>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each habitsStore.habits as habit}
            {@const isCompleted = habitsStore.isCompleted(habit.id)}
            <button
                onclick={() => habitsStore.toggle(habit.id)}
                class="card group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden text-left"
            >
                <div
                    class="flex justify-between items-start mb-4 relative z-10"
                >
                    <div>
                        <h3
                            class="font-bold text-lg text-[var(--color-text)] group-hover:text-primary transition-colors"
                        >
                            {habit.name}
                        </h3>
                        <span
                            class="text-xs text-muted border border-line px-2 py-0.5 rounded-full"
                            >Daily</span
                        >
                    </div>
                    <div
                        class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all {isCompleted
                            ? 'bg-primary border-primary text-black'
                            : 'border-line hover:border-primary'}"
                    >
                        {#if isCompleted}<Check size={16} />{/if}
                    </div>
                </div>

                <div
                    class="relative z-10 pt-4 border-t border-line/50 mt-4 flex items-center justify-between"
                >
                    <div class="flex items-center gap-1 text-sm text-muted">
                        <Flame
                            size={14}
                            class={isCompleted
                                ? "text-orange-500"
                                : "text-muted"}
                        />
                        <span
                            class={isCompleted
                                ? "text-[var(--color-text)]"
                                : ""}>{habit.streak} day streak</span
                        >
                    </div>
                    {#if habit.streak > 10}
                        <Trophy size={14} class="text-yellow-500" />
                    {/if}
                </div>

                <!-- Background Progress Fill Effect -->
                {#if isCompleted}
                    <div
                        class="absolute bottom-0 left-0 w-full h-1 bg-primary"
                    ></div>
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"
                    ></div>
                {/if}
            </button>
        {/each}
    </div>
</div>
