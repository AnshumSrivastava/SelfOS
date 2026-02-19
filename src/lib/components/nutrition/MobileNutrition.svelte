<script lang="ts">
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import FloatingActionButton from "$lib/components/mobile/FloatingActionButton.svelte";
    import {
        Utensils,
        GlassWater,
        Search,
        Flame,
        Droplets,
        Apple,
        Activity,
        User,
    } from "lucide-svelte";
    import { nutritionStore } from "$lib/stores/nutrition.svelte";
    import NutritionProfileModal from "./NutritionProfileModal.svelte";
    import LogMealModal from "./LogMealModal.svelte";

    import { onMount } from "svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import { syncStore } from "$lib/stores/sync.svelte";

    onMount(() => {
        nutritionStore.init();
    });

    let isProfileOpen = $state(false);
    let isLogMealOpen = $state(false);
    let isLoading = $derived(nutritionStore.loading);

    // ... (rest of script)

    let stats = $derived(nutritionStore.todayStats);
    let goals = $derived(nutritionStore.goals);
    let meals = $derived(nutritionStore.meals);
    let water = $derived(nutritionStore.water);

    let calPercent = $derived(
        Math.min((stats.calories / goals.targetCalories) * 100, 100),
    );
    let waterPercent = $derived(
        Math.min((water / nutritionStore.todayWaterTarget) * 100, 100),
    );

    function addWater(amount: number) {
        nutritionStore.addWater(amount);
    }
</script>

<div class="page-container h-full relative pb-24">
    <div class="px-6 py-8 flex items-center justify-between shrink-0">
        <div class="space-y-1">
            <h1
                class="text-3xl font-light text-white tracking-tight leading-none mb-1"
            >
                Nutrition <span class="text-primary font-bold">Engine</span>
            </h1>
            <div class="flex items-center gap-2">
                <div
                    class="w-1.5 h-1.5 rounded-full {syncStore.globalStatus ===
                    'stable'
                        ? 'bg-emerald-500'
                        : 'bg-primary animate-pulse'}"
                ></div>
                <span
                    class="text-[10px] font-bold text-muted uppercase tracking-[0.2em]"
                    >{syncStore.globalStatus === "stable"
                        ? "Operational"
                        : "Syncing..."}</span
                >
            </div>
        </div>
    </div>

    <FloatingActionButton
        onclick={() => (isLogMealOpen = true)}
        ariaLabel="Log Meal"
    />

    {#if isLoading}
        <div class="px-6 space-y-10">
            <div class="grid grid-cols-2 gap-4">
                {#each Array(2) as _}
                    <div
                        class="card-subtle p-5 aspect-square flex flex-col justify-between"
                    >
                        <SkeletonLoader circle width="w-8" height="h-8" />
                        <div class="space-y-2">
                            <SkeletonLoader
                                lines={1}
                                height="h-6"
                                width="w-3/4"
                            />
                            <SkeletonLoader
                                lines={1}
                                height="h-3"
                                width="w-1/2"
                            />
                            <SkeletonLoader
                                lines={1}
                                height="h-1"
                                width="w-full"
                            />
                        </div>
                    </div>
                {/each}
            </div>

            <div class="grid grid-cols-3 gap-3">
                {#each Array(3) as _}
                    <div class="card-subtle p-3">
                        <SkeletonLoader
                            lines={1}
                            height="h-3"
                            width="w-1/2"
                            class="mx-auto"
                        />
                        <SkeletonLoader
                            lines={1}
                            height="h-4"
                            width="w-1/3"
                            class="mx-auto mt-1"
                        />
                    </div>
                {/each}
            </div>

            <SkeletonLoader lines={1} height="h-12" />

            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <SkeletonLoader lines={1} width="w-24" />
                    <SkeletonLoader lines={1} width="w-20" />
                </div>
                <div class="space-y-3">
                    {#each Array(2) as _}
                        <div class="card-subtle p-4 flex items-center gap-4">
                            <SkeletonLoader circle width="w-10" height="h-10" />
                            <div class="flex-1 space-y-2">
                                <SkeletonLoader lines={1} width="w-1/3" />
                                <SkeletonLoader lines={1} width="w-1/4" />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <div class="px-6 space-y-8">
            <!-- Stats Overview -->
            <div class="grid grid-cols-2 gap-3">
                <div
                    class="relative overflow-hidden rounded-[24px] p-5 flex flex-col justify-between aspect-square group active:scale-[0.98] transition-all bg-surface/30 border border-white/5"
                >
                    <div class="flex justify-between items-start">
                        <div
                            class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400"
                        >
                            <Flame size={16} />
                        </div>
                        <span
                            class="text-[10px] text-muted font-black uppercase tracking-widest"
                            >Kcal</span
                        >
                    </div>

                    <div class="relative z-10">
                        <span
                            class="text-3xl font-light text-white block tracking-tighter"
                            >{stats.calories || 0}</span
                        >
                        <span
                            class="text-[9px] text-muted uppercase font-bold tracking-wider"
                            >Target: {goals.targetCalories}</span
                        >
                        <div
                            class="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-orange-500"
                                style="width: {calPercent}%"
                            ></div>
                        </div>
                    </div>
                </div>

                <div
                    class="relative overflow-hidden rounded-[24px] p-5 flex flex-col justify-between aspect-square group active:scale-[0.98] transition-all bg-blue-500/5 border border-blue-500/10"
                >
                    <div class="flex justify-between items-start">
                        <div
                            class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400"
                        >
                            <Droplets size={16} />
                        </div>
                        <span
                            class="text-[10px] text-blue-400/60 font-black uppercase tracking-widest"
                            >H2O</span
                        >
                    </div>
                    <div>
                        <span
                            class="text-3xl font-light text-white block tracking-tighter"
                            >{water.toFixed(1)}<span
                                class="text-lg text-muted/60">L</span
                            ></span
                        >
                        {#if nutritionStore.waterDeficit > 0}
                            <div class="flex items-center gap-1 mt-1">
                                <Activity size={10} class="text-blue-400" />
                                <span
                                    class="text-[9px] text-blue-400/80 font-bold uppercase tracking-wider"
                                    >Self-Correction Active (+{(
                                        nutritionStore.waterDeficit * 0.25
                                    ).toFixed(2)}L)</span
                                >
                            </div>
                        {/if}

                        <div class="flex gap-2 mt-3">
                            <button
                                onclick={() => addWater(0.25)}
                                class="flex-1 h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold leading-none flex items-center justify-center active:scale-90 transition-transform"
                                >+</button
                            >
                            <button
                                onclick={() => addWater(0.5)}
                                class="flex-1 h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold leading-none flex items-center justify-center active:scale-90 transition-transform"
                                >++</button
                            >
                        </div>
                    </div>
                </div>
            </div>

            <!-- Macros (Minimal) -->
            <div class="grid grid-cols-3 gap-3">
                {#each [{ label: "Prot", val: stats.protein, color: "text-blue-400", bg: "bg-blue-400/10" }, { label: "Carb", val: stats.carbs, color: "text-yellow-400", bg: "bg-yellow-400/10" }, { label: "Fat", val: stats.fats, color: "text-red-400", bg: "bg-red-400/10" }] as m}
                    <div
                        class="rounded-2xl {m.bg} p-3 flex flex-col items-center justify-center min-h-[4rem]"
                    >
                        <span
                            class="text-[9px] font-black uppercase tracking-widest {m.color} opacity-80"
                            >{m.label}</span
                        >
                        <span
                            class="text-lg font-bold text-white leading-none mt-1"
                            >{m.val}g</span
                        >
                    </div>
                {/each}
            </div>

            <!-- Meal Log -->
            <div class="space-y-4">
                <div class="flex items-center justify-between px-1">
                    <h3
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-1"
                    >
                        Today's Meals
                    </h3>
                    <button
                        onclick={() => (isProfileOpen = true)}
                        class="text-[10px] text-primary font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Edit Target
                    </button>
                </div>

                <div class="space-y-2">
                    {#each meals as meal (meal.id)}
                        <div
                            class="group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 active:scale-[0.99] transition-all"
                        >
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 rounded-full bg-surface/50 border border-white/5 flex items-center justify-center text-orange-400"
                                >
                                    <Utensils size={16} />
                                </div>
                                <div>
                                    <p class="font-bold text-white text-sm">
                                        {meal.name}
                                    </p>
                                    <p
                                        class="text-[10px] text-muted/60 font-bold uppercase tracking-wider"
                                    >
                                        {meal.time}
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

            <!-- Quick Add Favorites -->
            {#if nutritionStore.frequentMeals.length > 0}
                <div class="space-y-4 pt-4 border-t border-white/5">
                    <h3
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-1"
                    >
                        Quick Add
                    </h3>
                    <div
                        class="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6"
                    >
                        {#each nutritionStore.frequentMeals as fav}
                            <button
                                onclick={() => nutritionStore.addMeal(fav)}
                                class="flex-shrink-0 card-subtle p-3 w-32 active:scale-95 transition-all text-left flex flex-col gap-1"
                            >
                                <span
                                    class="text-xs font-bold text-white block truncate"
                                    >{fav.name}</span
                                >
                                <span class="text-[10px] text-muted block"
                                    >{fav.calories} kcal</span
                                >
                            </button>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</div>

<NutritionProfileModal bind:isOpen={isProfileOpen} />
<LogMealModal bind:isOpen={isLogMealOpen} />
