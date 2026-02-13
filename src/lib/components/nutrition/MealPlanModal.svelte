<script lang="ts">
    import { X, Save, Calendar, Clock, Utensils, Zap } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";
    import { nutritionStore, type Meal } from "$lib/stores/nutrition.svelte";

    let { isOpen = $bindable() } = $props();

    let name = $state("");
    let calories = $state(0);
    let date = $state(new Date().toISOString().split("T")[0]); // Default to today
    let time = $state("12:00 PM");

    function save() {
        if (!name || !date) return;
        // Logic for planning can be separate or reused
        // For now, let's just use addMeal but with the specified date
        // Wait, the addMeal in store currently uses new Date().toISOString()
        // I'll update the store to allow a custom date.

        nutritionStore.addMeal(
            {
                name,
                calories,
                protein: 0,
                carbs: 0,
                fats: 0,
                time,
                // date will be handled by the updated addMeal if I change it to accept one
            },
            date,
        );

        isOpen = false;
        reset();
    }

    function reset() {
        name = "";
        calories = 0;
        date = new Date().toISOString().split("T")[0];
        time = "12:00 PM";
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        transition:fade={{ duration: 200 }}
        onclick={() => (isOpen = false)}
    >
        <div
            class="card-subtle w-full max-w-md shadow-2xl relative overflow-hidden"
            transition:scale={{ duration: 200, start: 0.95 }}
            onclick={(e) => e.stopPropagation()}
        >
            <div
                class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary"
            ></div>

            <div class="flex justify-between items-center mb-8">
                <div>
                    <h3 class="text-2xl font-light text-white">Plan a Meal</h3>
                    <p
                        class="text-xs text-muted mt-1 uppercase tracking-widest"
                    >
                        Schedule your future fueling
                    </p>
                </div>
                <button
                    onclick={() => (isOpen = false)}
                    class="p-2 rounded-full hover:bg-surface transition-colors text-muted hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            <div class="space-y-6">
                <div class="space-y-2">
                    <label class="text-xs font-bold text-muted uppercase ml-1"
                        >Meal / Food Name</label
                    >
                    <div class="relative">
                        <Utensils
                            size={16}
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                        />
                        <input
                            type="text"
                            bind:value={name}
                            placeholder="e.g. Tomorrow's Lunch"
                            class="input w-full pl-10"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label
                            class="text-xs font-bold text-muted uppercase ml-1"
                            >Date</label
                        >
                        <div class="relative">
                            <Calendar
                                size={16}
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                            />
                            <input
                                type="date"
                                bind:value={date}
                                class="input w-full pl-10"
                            />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label
                            class="text-xs font-bold text-muted uppercase ml-1"
                            >Time</label
                        >
                        <div class="relative">
                            <Clock
                                size={16}
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                            />
                            <input
                                type="text"
                                bind:value={time}
                                class="input w-full pl-10"
                            />
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-bold text-muted uppercase ml-1"
                        >Est. Calories</label
                    >
                    <div class="relative">
                        <Zap
                            size={16}
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500"
                        />
                        <input
                            type="number"
                            bind:value={calories}
                            class="input w-full pl-10"
                        />
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <button
                    onclick={save}
                    disabled={!name}
                    class="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                    <Save size={18} />
                    Add to Planner
                </button>
            </div>
        </div>
    </div>
{/if}
