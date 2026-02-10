<script lang="ts">
    import { Check, Flame, Trophy, Plus, Trash2, X } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { scale, fade } from "svelte/transition";
    import ConsistencyChart from "./ConsistencyChart.svelte";
    import StreakFire from "$lib/components/ui/StreakFire.svelte";

    let todayProgress = $derived(
        (habitsStore.completedCount / (habitsStore.totalCount || 1)) * 100 || 0,
    );

    const today = new Date();

    let isAdding = $state(false);
    let newHabitName = $state("");

    function addHabit() {
        if (newHabitName.trim()) {
            habitsStore.add(newHabitName.trim());
            isAdding = false;
        }
    }

    let fire: StreakFire;
</script>

<div class="space-y-8 pb-12 relative">
    <StreakFire bind:this={fire} />
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
            onclick={() => (isAdding = true)}
            class="btn btn-primary flex items-center gap-2"
        >
            <Plus size={18} /> New Habit
        </button>
    </div>

    <!-- Consistency Graph -->
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-[var(--color-text)]">Consistency</h3>
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

        <ConsistencyChart height="h-48" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each habitsStore.habits as habit (habit.id)}
            {@const isCompleted = habitsStore.isCompleted(habit.id)}
            <div
                class="card group hover:border-primary/50 transition-all relative overflow-hidden text-left"
            >
                <div
                    class="flex justify-between items-start mb-4 relative z-10"
                >
                    <button
                        onclick={(e) => {
                            if (!isCompleted) {
                                fire.ignite(e.clientX, e.clientY);
                            }
                            habitsStore.toggle(habit.id);
                        }}
                        class="text-left flex-1"
                    >
                        <h3
                            class="font-bold text-lg text-[var(--color-text)] group-hover:text-primary transition-colors"
                        >
                            {habit.name}
                        </h3>
                        <span
                            class="text-xs text-muted border border-line px-2 py-0.5 rounded-full"
                            >Daily</span
                        >
                    </button>
                    <div class="flex gap-2 items-center">
                        <button
                            onclick={(e) => {
                                e.stopPropagation();
                                habitsStore.remove(habit.id);
                            }}
                            class="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted hover:text-red-500 hover:border-red-500 transition-colors bg-surface"
                            title="Delete Habit"
                        >
                            <Trash2 size={14} />
                        </button>
                        <button
                            onclick={(e) => {
                                if (!isCompleted) {
                                    fire.ignite(e.clientX, e.clientY);
                                }
                                habitsStore.toggle(habit.id);
                            }}
                            class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all {isCompleted
                                ? 'bg-primary border-primary text-black'
                                : 'border-line hover:border-primary bg-surface'}"
                        >
                            {#if isCompleted}<Check size={16} />{/if}
                        </button>
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
            </div>
        {/each}
    </div>
</div>

{#if isAdding}
    <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="bg-surface border border-line rounded-2xl p-6 w-full max-w-md shadow-2xl"
            transition:scale={{ duration: 200, start: 0.95 }}
        >
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-[var(--color-text)]">
                    New Habit
                </h3>
                <button
                    onclick={() => (isAdding = false)}
                    class="text-muted hover:text-[var(--color-text)] transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <input
                type="text"
                bind:value={newHabitName}
                placeholder="What habit do you want to build?"
                class="w-full bg-background border border-line rounded-xl px-4 py-3 text-[var(--color-text)] placeholder:text-muted focus:outline-none focus:border-primary mb-6"
                onkeydown={(e) => e.key === "Enter" && addHabit()}
                autofocus
            />

            <div class="flex gap-3 justify-end">
                <button
                    onclick={() => (isAdding = false)}
                    class="px-4 py-2 text-muted hover:text-[var(--color-text)] transition-colors"
                >
                    Cancel
                </button>
                <button
                    onclick={addHabit}
                    disabled={!newHabitName.trim()}
                    class="btn btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create Habit
                </button>
            </div>
        </div>
    </div>
{/if}
