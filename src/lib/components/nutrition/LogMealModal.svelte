<script lang="ts">
    import { Save, Utensils, Zap, Flame, Clock, Star } from "lucide-svelte";
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

<Modal bind:isOpen title="Log Intake">
    {#if showFrequent && nutritionStore.frequentMeals.length > 0}
        <div class="space-y-6">
            <div class="flex items-center justify-between mb-2">
                <p
                    class="text-[10px] font-black text-primary uppercase tracking-[0.2em]"
                >
                    Frequent Selections
                </p>
                <button
                    onclick={() => (showFrequent = false)}
                    class="text-[10px] font-bold text-muted uppercase hover:text-white transition-colors"
                    >Manual Entry</button
                >
            </div>

            <div class="grid grid-cols-1 gap-2">
                {#each nutritionStore.frequentMeals as m}
                    <button
                        onclick={() => selectFrequent(m)}
                        class="p-5 rounded-2xl bg-white/5 border border-transparent hover:border-primary/20 hover:bg-white/10 transition-all text-left flex justify-between items-center group"
                    >
                        <div>
                            <p
                                class="text-sm font-bold text-white group-hover:text-primary transition-colors"
                            >
                                {m.name}
                            </p>
                            <p
                                class="text-[10px] text-muted font-bold uppercase tracking-widest mt-1"
                            >
                                P:{m.protein}g • C:{m.carbs}g • F:{m.fats}g
                            </p>
                        </div>
                        <div class="text-right">
                            <p
                                class="text-lg font-light text-theme-text-strong tracking-tighter"
                            >
                                {m.calories}
                            </p>
                            <p
                                class="text-[8px] text-muted font-black uppercase tracking-widest"
                            >
                                kcal
                            </p>
                        </div>
                    </button>
                {/each}
            </div>
        </div>
    {:else}
        <div class="space-y-6">
            <!-- Header Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2 space-y-2">
                    <label
                        for="meal-name-field"
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                        >Nutrient Name</label
                    >
                    <div class="relative">
                        <Utensils
                            size={14}
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                        />
                        <input
                            id="meal-name-field"
                            type="text"
                            bind:value={name}
                            placeholder="e.g. Protein Shake"
                            class="input w-full pl-11 bg-white/5 border-white/5 focus:border-primary/30"
                        />
                    </div>
                </div>
                <div class="space-y-2">
                    <label
                        for="meal-time-field"
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                        >Time</label
                    >
                    <div class="relative">
                        <Clock
                            size={14}
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                        />
                        <input
                            id="meal-time-field"
                            type="text"
                            bind:value={time}
                            class="input w-full pl-11 bg-white/5 border-white/5"
                        />
                    </div>
                </div>
            </div>

            <!-- Calories & Toggle -->
            <div class="grid grid-cols-2 gap-4 items-end">
                <div class="space-y-2">
                    <label
                        for="meal-calories-field"
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                        >Caloric Intensity</label
                    >
                    <div class="relative">
                        <Flame
                            size={14}
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                        />
                        <input
                            id="meal-calories-field"
                            type="number"
                            bind:value={calories}
                            class="input w-full pl-11 bg-white/5 border-white/5 focus:border-orange-500/30"
                        />
                    </div>
                </div>
                <button
                    onclick={() => (isFrequent = !isFrequent)}
                    class="h-[52px] rounded-2xl border transition-all flex items-center justify-center gap-3 {isFrequent
                        ? 'bg-primary text-black border-primary'
                        : 'bg-white/5 border-transparent text-muted hover:text-white hover:border-white/10'}"
                >
                    <Star
                        size={14}
                        fill={isFrequent ? "currentColor" : "none"}
                    />
                    <span
                        class="text-[10px] font-black uppercase tracking-[0.2em]"
                        >Frequent</span
                    >
                </button>
            </div>

            <!-- Macros -->
            <div
                class="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-5"
            >
                <p
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] text-center opacity-60"
                >
                    Detailed Macros (Optional)
                </p>
                <div class="grid grid-cols-3 gap-4">
                    <div class="space-y-2">
                        <span
                            class="text-[9px] font-bold text-blue-400 uppercase tracking-widest text-center block"
                            >Protein</span
                        >
                        <input
                            type="number"
                            bind:value={protein}
                            class="input text-center w-full bg-white/5 border-transparent"
                        />
                    </div>
                    <div class="space-y-2">
                        <span
                            class="text-[9px] font-bold text-yellow-500 uppercase tracking-widest text-center block"
                            >Carbs</span
                        >
                        <input
                            type="number"
                            bind:value={carbs}
                            class="input text-center w-full bg-white/5 border-transparent"
                        />
                    </div>
                    <div class="space-y-2">
                        <span
                            class="text-[9px] font-bold text-red-500 uppercase tracking-widest text-center block"
                            >Fats</span
                        >
                        <input
                            type="number"
                            bind:value={fats}
                            class="input text-center w-full bg-white/5 border-transparent"
                        />
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4 pt-2">
                {#if nutritionStore.frequentMeals.length > 0}
                    <button
                        onclick={() => (showFrequent = true)}
                        class="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
                        >Back</button
                    >
                {/if}
                <button
                    onclick={save}
                    disabled={!name || calories <= 0}
                    class="flex-[2] py-4 bg-primary text-black rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-primary/20"
                >
                    Confirm Intake
                </button>
            </div>
        </div>
    {/if}
</Modal>
