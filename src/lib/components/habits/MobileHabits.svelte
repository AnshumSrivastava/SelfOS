<script lang="ts">
    import { Check, Flame, Plus, Trash2, X } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { scale, fade, slide } from "svelte/transition";
    import ConsistencyChart from "./ConsistencyChart.svelte";
    import StreakFire from "$lib/components/ui/StreakFire.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";

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
    let newHabitCategory = $state("Growth");

    const categoriesList = [
        "Health",
        "Focus",
        "Identity",
        "Learning",
        "Wealth",
        "Social",
        "Growth",
    ];

    function addHabit() {
        if (newHabitName.trim()) {
            habitsStore.add(newHabitName.trim(), newHabitCategory);
            newHabitName = "";
            isAdding = false;
        }
    }

    // Grouping logic for mobile
    let groupedHabits = $derived.by(() => {
        const groups: Record<string, typeof habitsStore.habits> = {};
        habitsStore.habits.forEach((habit) => {
            const cat = habit.category || "Uncategorized";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(habit);
        });
        return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    });

    let fire: StreakFire;
    import { onMount } from "svelte";

    onMount(() => {
        habitsStore.init();
    });
</script>

{#snippet headerAction()}
    <button
        onclick={() => (isAdding = true)}
        class="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        aria-label="Add Habit"
    >
        <Plus size={18} strokeWidth={3} />
    </button>
{/snippet}

<div class="page-container relative pb-28">
    <MobileHeader title="Rituals" action={headerAction} />
    <StreakFire bind:this={fire} />

    <div class="px-6 mt-6">
        <!-- Habits List -->
        <div class="space-y-8 mb-6">
            {#if habitsStore.loading}
                <SkeletonLoader lines={4} height="h-16" />
            {:else if habitsStore.habits.length === 0}
                <div class="py-12 text-center text-muted">
                    <p>No rituals defined yet.</p>
                </div>
            {:else}
                {#each groupedHabits as [category, habits]}
                    <div class="category-group">
                        <h3
                            class="text-[10px] font-bold uppercase tracking-widest text-muted mb-3 px-1"
                        >
                            {category}
                        </h3>
                        <div class="space-y-3">
                            {#each habits as habit (habit.id)}
                                {@const isCompleted = habitsStore.isCompleted(
                                    habit.id,
                                )}
                                <div
                                    class="card-subtle flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
                                >
                                    <button
                                        onclick={(e) => {
                                            if (!isCompleted) {
                                                fire?.ignite(
                                                    e.clientX,
                                                    e.clientY,
                                                );
                                            }
                                            habitsStore.toggle(habit.id);
                                        }}
                                        class="flex items-center gap-3 flex-1 text-left"
                                    >
                                        <div
                                            class="w-6 h-6 rounded border-2 {isCompleted
                                                ? 'bg-primary border-primary'
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
                                            class="text-base font-bold {isCompleted
                                                ? 'opacity-40 line-through'
                                                : 'text-white'}"
                                        >
                                            {habit.name}
                                        </span>
                                    </button>

                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex items-center gap-1.5 text-xs text-muted"
                                        >
                                            <Flame
                                                size={12}
                                                class={habit.streak > 0
                                                    ? "text-orange-500"
                                                    : "opacity-20"}
                                            />
                                            <span class="font-mono"
                                                >{habit.streak}</span
                                            >
                                        </div>

                                        <button
                                            onclick={(e) => {
                                                e.stopPropagation();
                                                habitsStore.remove(habit.id);
                                            }}
                                            class="text-muted/60 p-1 active:scale-90"
                                            aria-label="Delete Habit"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Consistency Graph -->
        <div class="card-subtle p-6 mb-2">
            <div class="flex justify-between items-end mb-4">
                <h2
                    class="text-[10px] font-bold text-muted uppercase tracking-[0.2em]"
                >
                    Consistency
                </h2>
                <span class="text-[9px] text-muted/60 font-mono"
                    >LAST 7 DAYS</span
                >
            </div>

            <ConsistencyChart height="h-28" />
        </div>
    </div>
</div>

{#if isAdding}
    <div
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center sm:p-4"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="card-subtle w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl shadow-2xl p-8 pb-32"
            transition:slide={{ duration: 300, axis: "y" }}
        >
            <div class="flex justify-between items-center mb-8">
                <h3 class="text-xl font-bold text-white">New Ritual</h3>
                <button
                    onclick={() => (isAdding = false)}
                    class="w-10 h-10 rounded-full bg-surface text-muted hover:text-white transition-all flex items-center justify-center"
                >
                    <X size={20} />
                </button>
            </div>

            <div class="space-y-6 mb-8">
                <div class="form-group flex flex-col gap-2">
                    <label
                        class="text-[10px] font-bold uppercase tracking-widest text-muted"
                        for="m-name">Description</label
                    >
                    <input
                        id="m-name"
                        type="text"
                        bind:value={newHabitName}
                        placeholder="What habit are you building?"
                        class="input w-full"
                    />
                </div>

                <div class="form-group flex flex-col gap-2">
                    <label
                        class="text-[10px] font-bold uppercase tracking-widest text-muted"
                        for="m-cat">Category</label
                    >
                    <select
                        id="m-cat"
                        bind:value={newHabitCategory}
                        class="input w-full"
                    >
                        {#each categoriesList as category}
                            <option value={category}>{category}</option>
                        {/each}
                    </select>
                </div>
            </div>

            <div class="flex gap-4">
                <button
                    onclick={() => (isAdding = false)}
                    class="btn btn-ghost flex-1 py-3"
                >
                    Cancel
                </button>
                <button
                    onclick={addHabit}
                    disabled={!newHabitName.trim()}
                    class="btn btn-primary flex-1 py-3 font-bold"
                >
                    Create Ritual
                </button>
            </div>
        </div>
    </div>
{/if}
