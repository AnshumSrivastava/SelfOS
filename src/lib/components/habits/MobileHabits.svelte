<script lang="ts">
    import { Check, Flame, Plus, Trash2, X } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { scale, fade, slide } from "svelte/transition";
    import ConsistencyChart from "./ConsistencyChart.svelte";
    import StreakFire from "$lib/components/ui/StreakFire.svelte";

    // Helper to get day letter and date number for the weekly strip
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - today.getDay() + i + 1); // Start from Monday
        return {
            name: d.toLocaleDateString("en-US", { weekday: "narrow" }),
            date: d.getDate(),
            isToday: d.toDateString() === today.toDateString(),
        };
    });

    let isAdding = $state(false);
    let newHabitName = $state("");

    function addHabit() {
        if (newHabitName.trim()) {
            habitsStore.add(newHabitName.trim());
            newHabitName = "";
            isAdding = false;
        }
    }

    let fire: StreakFire;
</script>

<div class="page-container relative">
    <StreakFire bind:this={fire} />
    <div class="module-header mb-6">
        <h1 class="text-3xl font-light text-white">Habits</h1>
        <button
            onclick={() => (isAdding = true)}
            class="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Habits List -->
    <div class="space-y-3 mb-6">
        {#each habitsStore.habits as habit (habit.id)}
            {@const isCompleted = habitsStore.isCompleted(habit.id)}
            <div
                class="card-subtle flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
            >
                <button
                    onclick={(e) => {
                        if (!isCompleted) {
                            fire.ignite(e.clientX, e.clientY);
                        }
                        habitsStore.toggle(habit.id);
                    }}
                    class="flex items-center gap-3 flex-1 text-left"
                >
                    <div
                        class="w-6 h-6 rounded border-2 {isCompleted
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-line'} flex items-center justify-center transition-colors"
                    >
                        {#if isCompleted}
                            <Check
                                size={14}
                                class="text-black"
                                strokeWidth={3}
                            />
                        {/if}
                    </div>
                    <span
                        class="text-lg font-medium {isCompleted
                            ? 'text-muted line-through'
                            : 'text-white'}"
                    >
                        {habit.name}
                    </span>
                </button>

                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5 text-xs text-muted">
                        <Flame
                            size={12}
                            class={habit.streak > 10 ? "text-orange-500" : ""}
                        />
                        <span>{habit.streak}</span>
                    </div>

                    <button
                        onclick={(e) => {
                            e.stopPropagation();
                            habitsStore.remove(habit.id);
                        }}
                        class="text-muted hover:text-red-500 p-1"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        {/each}
    </div>

    <!-- Consistency Graph -->
    <div class="card-subtle mb-2">
        <div class="flex justify-between items-end mb-4">
            <h2
                class="text-sm font-medium text-muted uppercase tracking-widest"
            >
                Consistency
            </h2>
            <span class="text-xs text-muted font-mono">LAST 7 DAYS</span>
        </div>

        <ConsistencyChart height="h-28" />
    </div>
</div>

{#if isAdding}
    <div
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="card-subtle w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl"
            transition:slide={{ duration: 300, axis: "y" }}
        >
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-white">New Habit</h3>
                <button
                    onclick={() => (isAdding = false)}
                    class="text-muted hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <input
                type="text"
                bind:value={newHabitName}
                placeholder="What habit do you want to build?"
                class="input w-full mb-6"
                onkeydown={(e) => e.key === "Enter" && addHabit()}
                autofocus
            />

            <div class="flex gap-3 justify-end">
                <button
                    onclick={() => (isAdding = false)}
                    class="btn btn-ghost"
                >
                    Cancel
                </button>
                <button
                    onclick={addHabit}
                    disabled={!newHabitName.trim()}
                    class="btn btn-primary px-6"
                >
                    Create
                </button>
            </div>

            <!-- Spacer for mobile keyboard -->
            <div class="h-4 sm:hidden"></div>
        </div>
    </div>
{/if}
