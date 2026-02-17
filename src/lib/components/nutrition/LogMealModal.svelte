<script lang="ts">
    import { X, Save, Utensils, Zap, Flame, Clock, Star } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";
    import { nutritionStore, type Meal } from "$lib/stores/nutrition.svelte";
    import Modal from "$lib/components/ui/Modal.svelte";

    let { isOpen = $bindable() } = $props();

    let name = $state("");
    let calories = $state(0);
    let protein = $state(0);
    let carbs = $state(0);
    let fats = $state(0);
    let time = $state(
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
    );
    let isFrequent = $state(false);

    let showFrequent = $state(true);

    function save() {
        if (!name || calories <= 0) return;
        nutritionStore.addMeal({
            name,
            calories,
            protein,
            carbs,
            fats,
            time,
            isFrequent,
        });
        reset();
        isOpen = false;
    }

    function selectFrequent(meal: Meal) {
        name = meal.name;
        calories = meal.calories;
        protein = meal.protein;
        carbs = meal.carbs;
        fats = meal.fats;
        showFrequent = false;
    }

    function reset() {
        name = "";
        calories = 0;
        protein = 0;
        carbs = 0;
        fats = 0;
        isFrequent = false;
    }
</script>

<Modal bind:isOpen title="Log Meal">
    {#if showFrequent && nutritionStore.frequentMeals.length > 0}
        <div class="mb-8">
            <div
                class="flex items-center gap-2 text-xs font-extrabold text-primary mb-4 uppercase tracking-tighter"
            >
                <Star size={14} /> Frequent Meals
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {#each nutritionStore.frequentMeals as m}
                    <button
                        onclick={() => selectFrequent(m)}
                        class="p-3 rounded-xl border border-line bg-surface/50 text-left hover:border-primary/50 hover:bg-surface transition-all group"
                    >
                        <p
                            class="text-sm font-bold text-white group-hover:text-primary transition-colors"
                        >
                            {m.name}
                        </p>
                        <p class="text-[10px] text-muted">
                            {m.calories} kcal • P:{m.protein} C:{m.carbs}
                            F:{m.fats}
                        </p>
                    </button>
                {/each}
            </div>
            <div class="mt-4 flex justify-center">
                <button
                    onclick={() => (showFrequent = false)}
                    class="text-xs text-muted hover:text-white transition-colors"
                    >Or add a new custom meal</button
                >
            </div>
        </div>
    {:else}
        <div class="space-y-6">
            <!-- Title & Time -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div class="sm:col-span-2 space-y-2">
                    <label
                        class="text-xs font-bold text-muted uppercase ml-1"
                        for="meal-name">Meal Name</label
                    >
                    <div class="relative">
                        <Utensils
                            size={16}
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                        />
                        <input
                            id="meal-name"
                            type="text"
                            bind:value={name}
                            placeholder="e.g. Scrambled Eggs"
                            class="input w-full pl-10"
                        />
                    </div>
                </div>
                <div class="space-y-2">
                    <label
                        class="text-xs font-bold text-muted uppercase ml-1"
                        for="meal-time">Time</label
                    >
                    <div class="relative">
                        <Clock
                            size={16}
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                        />
                        <input
                            id="meal-time"
                            type="text"
                            bind:value={time}
                            class="input w-full pl-10"
                        />
                    </div>
                </div>
            </div>

            <!-- Calories & Frequent -->
            <div class="grid grid-cols-2 gap-6 items-end">
                <div class="space-y-2">
                    <label
                        class="text-xs font-bold text-muted uppercase ml-1"
                        for="calories">Total Calories</label
                    >
                    <div class="relative">
                        <Flame
                            size={16}
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500"
                        />
                        <input
                            id="calories"
                            type="number"
                            bind:value={calories}
                            class="input w-full pl-10"
                        />
                    </div>
                </div>
                <button
                    onclick={() => (isFrequent = !isFrequent)}
                    class="p-4 rounded-xl border transition-all flex items-center justify-center gap-2 {isFrequent
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'border-line bg-surface/50 text-muted'}"
                >
                    <Star
                        size={18}
                        fill={isFrequent ? "currentColor" : "none"}
                    />
                    <span class="text-sm font-bold">Mark Frequent</span>
                </button>
            </div>

            <!-- Macros -->
            <div
                class="p-6 rounded-2xl bg-surface/50 border border-line space-y-6"
            >
                <p
                    class="text-xs font-bold text-muted uppercase tracking-widest text-center"
                >
                    Macronutrients (Optional)
                </p>
                <div class="grid grid-cols-3 gap-4">
                    <div class="space-y-2 text-center">
                        <span
                            class="text-[10px] font-bold text-blue-400 uppercase"
                            >Protein (g)</span
                        >
                        <input
                            type="number"
                            bind:value={protein}
                            class="input text-center w-full bg-background"
                            aria-label="Protein grams"
                        />
                    </div>
                    <div class="space-y-2 text-center">
                        <span
                            class="text-[10px] font-bold text-yellow-500 uppercase"
                            >Carbs (g)</span
                        >
                        <input
                            type="number"
                            bind:value={carbs}
                            class="input text-center w-full bg-background"
                            aria-label="Carbs grams"
                        />
                    </div>
                    <div class="space-y-2 text-center">
                        <span
                            class="text-[10px] font-bold text-red-500 uppercase"
                            >Fats (g)</span
                        >
                        <input
                            type="number"
                            bind:value={fats}
                            class="input text-center w-full bg-background"
                            aria-label="Fats grams"
                        />
                    </div>
                </div>
            </div>

            <div class="flex gap-4">
                {#if nutritionStore.frequentMeals.length > 0}
                    <button
                        onclick={() => (showFrequent = true)}
                        class="btn btn-ghost border-line flex-1">Back</button
                    >
                {/if}
                <button
                    onclick={save}
                    disabled={!name || calories <= 0}
                    class="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                    <Save size={18} /> Log Intake
                </button>
            </div>
        </div>
    {/if}
</Modal>
