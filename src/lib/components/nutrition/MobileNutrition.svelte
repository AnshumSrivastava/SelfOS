<script lang="ts">
    import {
        Plus,
        User,
        Utensils,
        Droplets,
        Flame,
        ChevronRight,
        Trash2,
        Star,
        Apple,
        Activity,
    } from "lucide-svelte";
    import { nutritionStore } from "$lib/stores/nutrition.svelte";
    import NutritionProfileModal from "./NutritionProfileModal.svelte";
    import LogMealModal from "./LogMealModal.svelte";

    let isProfileOpen = $state(false);
    let isLogMealOpen = $state(false);

    let stats = $derived(nutritionStore.todayStats);
    let goals = $derived(nutritionStore.goals);
    let meals = $derived(nutritionStore.meals);
    let water = $derived(nutritionStore.water);

    let calPercent = $derived(
        Math.min((stats.calories / goals.calories) * 100, 100),
    );
    let waterPercent = $derived(Math.min((water / goals.water) * 100, 100));

    function addWater(amount: number) {
        nutritionStore.addWater(amount);
    }
</script>

<div class="page-container h-full relative">
    <div class="module-header mb-8">
        <div>
            <h1 class="text-3xl font-light text-white">Nutrition</h1>
            <p class="text-xs text-muted mt-1 uppercase tracking-widest">
                {goals.calories - stats.calories} kcal remaining
            </p>
        </div>
        <button
            onclick={() => (isLogMealOpen = true)}
            class="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <div class="space-y-10">
        <!-- Summary Dashboard (Compact) -->
        <div class="grid grid-cols-2 gap-4">
            <div
                class="card-subtle p-5 flex flex-col justify-between aspect-square group active:scale-[0.98] transition-all"
            >
                <div class="flex justify-between items-start">
                    <Flame class="text-orange-500" size={24} />
                    <span
                        class="text-[10px] text-muted font-black uppercase tracking-widest"
                        >Calories</span
                    >
                </div>
                <div>
                    <span class="text-2xl font-bold text-white block"
                        >{stats.calories.toLocaleString()}</span
                    >
                    <span
                        class="text-[10px] text-muted uppercase font-bold tracking-tighter"
                        >/ {goals.calories.toLocaleString()} kcal</span
                    >
                    <div
                        class="mt-2 h-1 w-full bg-background rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-orange-500"
                            style="width: {calPercent}%"
                        ></div>
                    </div>
                </div>
            </div>

            <div
                class="card-subtle p-5 flex flex-col justify-between aspect-square group active:scale-[0.98] transition-all relative overflow-hidden"
            >
                <div class="absolute inset-0 bg-blue-500/5 -z-10"></div>
                <div class="flex justify-between items-start">
                    <Droplets class="text-blue-400" size={24} />
                    <span
                        class="text-[10px] text-muted font-black uppercase tracking-widest"
                        >Water</span
                    >
                </div>
                <div>
                    <span class="text-2xl font-bold text-white block"
                        >{water.toFixed(1)}L</span
                    >
                    <span
                        class="text-[10px] text-muted uppercase font-bold tracking-tighter"
                        >Goal: {goals.water}L</span
                    >
                    <div
                        class="mt-2 h-1 w-full bg-background rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-blue-500"
                            style="width: {waterPercent}%"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Macro Stats Row -->
        <div class="grid grid-cols-3 gap-3">
            <div class="card-subtle p-3 text-center bg-blue-500/5">
                <span
                    class="text-[10px] text-blue-400 font-black uppercase block mb-1"
                    >Protein</span
                >
                <span class="text-sm font-bold text-white"
                    >{stats.protein}g</span
                >
            </div>
            <div class="card-subtle p-3 text-center bg-yellow-500/5">
                <span
                    class="text-[10px] text-yellow-500 font-black uppercase block mb-1"
                    >Carbs</span
                >
                <span class="text-sm font-bold text-white">{stats.carbs}g</span>
            </div>
            <div class="card-subtle p-3 text-center bg-red-500/5">
                <span
                    class="text-[10px] text-red-500 font-black uppercase block mb-1"
                    >Fats</span
                >
                <span class="text-sm font-bold text-white">{stats.fats}g</span>
            </div>
        </div>

        <!-- Quick Water Log -->
        <div class="card-subtle p-1 flex gap-1 bg-surface/30">
            <button
                onclick={() => addWater(0.25)}
                class="flex-1 py-3 rounded-lg hover:bg-blue-500/10 text-[10px] font-bold text-muted hover:text-blue-400 transition-all uppercase tracking-widest"
                >+ 250ml</button
            >
            <button
                onclick={() => addWater(0.5)}
                class="flex-1 py-3 rounded-lg hover:bg-blue-500/10 text-[10px] font-bold text-muted hover:text-blue-400 transition-all uppercase tracking-widest"
                >+ 500ml</button
            >
        </div>

        <!-- Today's Meal Log -->
        <div class="space-y-6">
            <div class="flex items-center justify-between px-1">
                <h3 class="text-lg font-light text-white">Meal Log</h3>
                <button
                    onclick={() => (isProfileOpen = true)}
                    class="text-xs text-muted flex items-center gap-1 hover:text-white transition-colors"
                >
                    <User size={12} /> Edit Profile
                </button>
            </div>

            <div class="space-y-3">
                {#each meals as meal (meal.id)}
                    <div
                        class="card-subtle flex items-center justify-between p-4 active:bg-surface/50 transition-colors"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="w-10 h-10 rounded-lg bg-surface border border-line flex items-center justify-center text-primary"
                            >
                                <Utensils size={18} />
                            </div>
                            <div>
                                <p class="font-bold text-white text-sm">
                                    {meal.name}
                                </p>
                                <p
                                    class="text-[10px] text-muted uppercase tracking-wider"
                                >
                                    {meal.time} • P:{meal.protein}g
                                </p>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="block text-white font-bold text-sm"
                                >{meal.calories}</span
                            >
                            <span
                                class="block text-[10px] text-muted uppercase tracking-widest font-black"
                                >kcal</span
                            >
                        </div>
                    </div>
                {/each}

                {#if meals.length === 0}
                    <div
                        class="py-12 text-center opacity-40 italic text-sm text-muted"
                    >
                        No records today.
                    </div>
                {/if}
            </div>
        </div>

        <!-- Favorites / Quick Add -->
        {#if nutritionStore.frequentMeals.length > 0}
            <div class="space-y-4">
                <h3 class="text-lg font-light text-white px-1">Quick Add</h3>
                <div class="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {#each nutritionStore.frequentMeals as fav}
                        <button
                            onclick={() => nutritionStore.addMeal(fav)}
                            class="flex-shrink-0 card-subtle p-4 w-40 active:scale-95 transition-all text-left"
                        >
                            <span
                                class="text-sm font-bold text-white block truncate"
                                >{fav.name}</span
                            >
                            <span class="text-[10px] text-muted block mt-1"
                                >{fav.calories} kcal</span
                            >
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<NutritionProfileModal bind:isOpen={isProfileOpen} />
<LogMealModal bind:isOpen={isLogMealOpen} />
