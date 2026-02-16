<script lang="ts">
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import {
        Plus,
        User,
        Utensils,
        Droplets,
        Flame,
        ChevronRight,
        Trash2,
        Calendar,
        Star,
        Apple,
    } from "lucide-svelte";
    import { nutritionStore } from "$lib/stores/nutrition.svelte";
    import NutritionProfileModal from "./NutritionProfileModal.svelte";
    import LogMealModal from "./LogMealModal.svelte";
    import MealPlanModal from "./MealPlanModal.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import { syncStore } from "$lib/stores/sync.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        nutritionStore.init();
    });

    let isProfileOpen = $state(false);
    let isLogMealOpen = $state(false);
    let isPlanMealOpen = $state(false);

    let stats = $derived(nutritionStore.todayStats);
    let goals = $derived(nutritionStore.goals);
    let meals = $derived(nutritionStore.meals);
    let water = $derived(nutritionStore.water);

    // Calculate percentages for rings/bars
    let calPercent = $derived(
        Math.min((stats.calories / goals.targetCalories) * 100, 100),
    );
    let proteinPercent = $derived(
        Math.min((stats.protein / goals.targetProtein) * 100, 100),
    );
    let carbsPercent = $derived(
        Math.min((stats.carbs / goals.targetCarbs) * 100, 100),
    );
    let fatsPercent = $derived(
        Math.min((stats.fats / goals.targetFat) * 100, 100),
    );
    let waterPercent = $derived(
        Math.min((water / goals.targetWater) * 100, 100),
    );

    function addWater(amount: number) {
        nutritionStore.addWater(amount);
    }
</script>

<div class="page-container h-full relative">
    <PageHeader title="Nutrition" subtitle="Metabolic Control" icon={Utensils}>
        <button
            onclick={() => (isProfileOpen = true)}
            class="btn btn-ghost border-line flex items-center gap-2"
        >
            <User size={18} /> Profile & Goals
        </button>
        <button
            onclick={() => (isLogMealOpen = true)}
            class="btn btn-primary flex items-center gap-2"
        >
            <Plus size={18} /> Log Intake
        </button>
    </PageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-10">
            <!-- Meal Log -->
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-light text-white">
                        Today's Intake
                    </h3>
                    <div
                        class="flex gap-4 text-xs font-bold text-muted uppercase tracking-widest"
                    >
                        <span>P: {stats.protein}g</span>
                        <span>C: {stats.carbs}g</span>
                        <span>F: {stats.fats}g</span>
                    </div>
                </div>

                <div class="space-y-3">
                    {#if nutritionStore.loading}
                        {#each Array(4) as _}
                            <div class="card-subtle p-5 space-y-3">
                                <SkeletonLoader lines={1} />
                            </div>
                        {/each}
                    {:else}
                        {#each meals as meal (meal.id)}
                            <div
                                class="card-subtle flex items-center justify-between p-5 group hover:bg-surface/50 transition-all border-white/5 bg-surface/20 backdrop-blur-xl"
                            >
                                <div class="flex items-center gap-5">
                                    <div
                                        class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/5"
                                    >
                                        <Utensils size={20} />
                                    </div>
                                    <div>
                                        <h4
                                            class="font-bold text-white group-hover:text-primary transition-colors"
                                        >
                                            {meal.name}
                                        </h4>
                                        <p
                                            class="text-[10px] text-muted uppercase font-bold tracking-widest opacity-40 group-hover:opacity-100 transition-opacity"
                                        >
                                            {meal.time} • P:{meal.protein}G C:{meal.carbs}G
                                            F:{meal.fats}G
                                        </p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-6">
                                    <span
                                        class="text-xl font-bold text-white tracking-tight"
                                        >{meal.calories}
                                        <span
                                            class="text-[10px] text-muted font-bold uppercase tracking-widest"
                                            >kcal</span
                                        ></span
                                    >
                                    <button
                                        onclick={() =>
                                            nutritionStore.removeMeal(meal.id)}
                                        class="p-2 text-muted/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        {/each}
                    {/if}

                    {#if meals.length === 0}
                        <div
                            class="card-subtle text-center py-20 border-dashed opacity-50"
                        >
                            <Apple
                                size={48}
                                class="mx-auto mb-4 text-muted/20"
                            />
                            <p class="text-muted">No food logged yet today.</p>
                            <button
                                onclick={() => (isLogMealOpen = true)}
                                class="text-primary text-sm hover:underline mt-2"
                                >Add your first meal</button
                            >
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Water Tracking -->
            <div
                class="card-subtle relative overflow-hidden p-8 bg-blue-500/5 group"
            >
                <div
                    class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"
                >
                    <Droplets size={160} />
                </div>

                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h3 class="text-lg font-light text-white">
                            Hydration Tracker
                        </h3>
                        <p class="text-xs text-muted uppercase tracking-widest">
                            Goal: {goals.targetWater} Liters
                        </p>
                    </div>
                    <div class="text-right">
                        <span class="text-3xl font-bold text-blue-400"
                            >{water.toFixed(1)}L</span
                        >
                        <span class="text-xs text-muted block"
                            >({waterPercent.toFixed(0)}%)</span
                        >
                    </div>
                </div>

                <div class="flex gap-3 mb-8">
                    {#each Array(10) as _, i}
                        <div
                            class="flex-1 h-3 rounded-full bg-background border border-line overflow-hidden"
                        >
                            <div
                                class="h-full bg-blue-500 transition-all duration-700"
                                style="width: {Math.max(
                                    0,
                                    Math.min(100, (waterPercent - i * 10) * 10),
                                )}%"
                            ></div>
                        </div>
                    {/each}
                </div>

                <div class="flex gap-4">
                    <button
                        onclick={() => addWater(0.25)}
                        class="flex-1 btn btn-ghost border-line text-xs font-bold uppercase py-4 hover:bg-blue-500 hover:text-white transition-all"
                        >+ 250ml</button
                    >
                    <button
                        onclick={() => addWater(0.5)}
                        class="flex-1 btn btn-ghost border-line text-xs font-bold uppercase py-4 hover:bg-blue-500 hover:text-white transition-all"
                        >+ 500ml</button
                    >
                    <button
                        onclick={() => nutritionStore.resetWater()}
                        class="px-6 btn btn-ghost text-muted hover:text-red-400"
                        ><Trash2 size={16} /></button
                    >
                </div>
            </div>
        </div>

        <!-- Sidebar Summary -->
        <div class="space-y-10">
            <!-- Calorie Ring -->
            <div
                class="card-subtle flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20"
            >
                <div
                    class="relative w-48 h-48 mb-6 flex items-center justify-center"
                >
                    <svg
                        class="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                    >
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            stroke-width="8"
                            fill="transparent"
                            class="text-background"
                        />
                        <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            stroke-width="8"
                            fill="transparent"
                            stroke-dasharray="552"
                            stroke-dashoffset={552 - (552 * calPercent) / 100}
                            class="text-primary transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div class="absolute text-center">
                        <h4 class="text-4xl font-bold text-white block">
                            {(
                                (goals.targetCalories || 2500) -
                                (stats.calories || 0)
                            ).toLocaleString()}
                        </h4>
                        <span
                            class="text-[10px] text-muted uppercase tracking-[0.2em] font-black"
                            >Kcal Left</span
                        >
                    </div>
                </div>
                <div class="text-center">
                    <p class="text-lg font-bold text-white">
                        {(stats.calories || 0).toLocaleString()}
                        <span class="text-xs text-muted font-normal italic"
                            >Eaten</span
                        >
                    </p>
                    <p class="text-xs text-muted">
                        Daily Target: {(
                            goals.targetCalories || 2500
                        ).toLocaleString()} kcal
                    </p>
                </div>
            </div>

            <!-- Macros Split -->
            <div class="card-subtle p-6 space-y-8">
                <h3
                    class="text-sm font-bold text-muted uppercase tracking-widest text-center border-b border-line pb-4"
                >
                    Daily Macros
                </h3>

                <!-- Protein -->
                <div class="space-y-3">
                    <div class="flex justify-between items-end">
                        <span
                            class="text-xs font-black text-blue-400 uppercase tracking-widest"
                            >Protein</span
                        >
                        <span class="text-sm font-bold text-white"
                            >{stats.protein}g
                            <span class="text-[10px] text-muted font-normal"
                                >/ {goals.targetProtein}g</span
                            ></span
                        >
                    </div>
                    <div
                        class="h-1.5 w-full bg-background rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-blue-500 transition-all duration-1000"
                            style="width: {proteinPercent}%"
                        ></div>
                    </div>
                </div>

                <!-- Carbs -->
                <div class="space-y-3">
                    <div class="flex justify-between items-end">
                        <span
                            class="text-xs font-black text-yellow-500 uppercase tracking-widest"
                            >Carbs</span
                        >
                        <span class="text-sm font-bold text-white"
                            >{stats.carbs}g
                            <span class="text-[10px] text-muted font-normal"
                                >/ {goals.targetCarbs}g</span
                            ></span
                        >
                    </div>
                    <div
                        class="h-1.5 w-full bg-background rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-yellow-500 transition-all duration-1000"
                            style="width: {carbsPercent}%"
                        ></div>
                    </div>
                </div>

                <!-- Fats -->
                <div class="space-y-3">
                    <div class="flex justify-between items-end">
                        <span
                            class="text-xs font-black text-red-500 uppercase tracking-widest"
                            >Fats</span
                        >
                        <span class="text-sm font-bold text-white"
                            >{stats.fats}g
                            <span class="text-[10px] text-muted font-normal"
                                >/ {goals.targetFat}g</span
                            ></span
                        >
                    </div>
                    <div
                        class="h-1.5 w-full bg-background rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-red-500 transition-all duration-1000"
                            style="width: {fatsPercent}%"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- Meal Suggestions / Planner -->
            <div class="card-subtle p-6 bg-surface/30">
                <div class="flex items-center justify-between mb-6">
                    <h3
                        class="text-lg font-light text-white flex items-center gap-2"
                    >
                        <Calendar size={18} class="text-secondary" /> Meal Planner
                    </h3>
                    <button
                        onclick={() => (isPlanMealOpen = true)}
                        class="text-xs text-primary hover:underline"
                        >Plan Ahead</button
                    >
                </div>
                <div class="space-y-3">
                    {#each nutritionStore.frequentMeals.slice(0, 3) as fav}
                        <button
                            onclick={() => nutritionStore.addMeal(fav)}
                            class="w-full p-4 rounded-xl border border-line bg-surface hover:border-primary/50 transition-all text-left group"
                        >
                            <span
                                class="text-[10px] text-primary font-black uppercase tracking-widest block mb-1"
                                >Quick Add</span
                            >
                            <span
                                class="text-sm font-bold text-white group-hover:text-primary transition-colors"
                                >{fav.name}</span
                            >
                            <span class="text-[10px] text-muted block mt-1"
                                >{fav.calories} kcal</span
                            >
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<NutritionProfileModal bind:isOpen={isProfileOpen} />
<LogMealModal bind:isOpen={isLogMealOpen} />
<MealPlanModal bind:isOpen={isPlanMealOpen} />
