<script>
    import { Check, Flame, Plus } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";

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
</script>

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Habits</h1>
        <button
            onclick={() =>
                habitsStore.add("New Habit " + (habitsStore.totalCount + 1))}
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Weekly Mini Strip -->
    <div
        class="flex justify-between items-center px-2 py-4 bg-[#0A0A0A] rounded-2xl border border-neutral-900"
    >
        {#each days as day}
            <div class="flex flex-col items-center gap-2">
                <span class="text-[10px] text-gray-500">{day.name}</span>
                <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold {day.isToday
                        ? 'bg-white text-black'
                        : 'bg-neutral-800 text-gray-400'}"
                >
                    {day.date}
                </div>
            </div>
        {/each}
    </div>

    <!-- Habits List -->
    <div class="space-y-3">
        {#each habitsStore.habits as habit}
            {@const isCompleted = habitsStore.isCompleted(habit.id)}
            <button
                onclick={() => habitsStore.toggle(habit.id)}
                class="w-full p-4 rounded-xl bg-[#0A0A0A] border border-neutral-900 flex items-center justify-between group active:scale-[0.98] transition-all"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="w-6 h-6 rounded border-2 {isCompleted
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-neutral-700'} flex items-center justify-center transition-colors"
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
                            ? 'text-gray-500 line-through'
                            : 'text-white'}">{habit.name}</span
                    >
                </div>

                <div class="flex items-center gap-1.5 text-xs text-gray-500">
                    <Flame
                        size={12}
                        class={habit.streak > 10 ? "text-orange-500" : ""}
                    />
                    <span>{habit.streak}</span>
                </div>
            </button>
        {/each}
    </div>
</div>
