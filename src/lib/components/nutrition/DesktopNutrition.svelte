<script>
    import StatCard from "$lib/components/ui/StatCard.svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
    import {
        Utensils,
        Flame,
        Droplets,
        Apple,
        Plus,
        ChevronRight,
    } from "lucide-svelte";
</script>

<div class="space-y-8 pb-12">
    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-3xl font-bold text-[var(--color-text)] mb-2">
                Macro Tracker
            </h1>
            <p class="text-muted">Fuel your body efficiently.</p>
        </div>
        <button class="btn btn-primary flex items-center gap-2">
            <Plus size={18} /> Log Meal
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
            class="card bg-surface border-primary/20 flex flex-col items-center justify-center p-8"
        >
            <div
                class="relative w-40 h-40 mb-4 flex items-center justify-center"
            >
                <!-- Circular Progress Placeholder -->
                <svg class="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        stroke-width="12"
                        fill="transparent"
                        class="text-background"
                    />
                    <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        stroke-width="12"
                        fill="transparent"
                        stroke-dasharray="440"
                        stroke-dashoffset="140"
                        class="text-primary"
                    />
                </svg>
                <div class="absolute text-center">
                    <span
                        class="text-3xl font-bold text-[var(--color-text)] block"
                        >1,240</span
                    >
                    <span class="text-xs text-muted">Kcal left</span>
                </div>
            </div>
            <p class="text-sm text-muted">Daily Goal: 2,400 Kcal</p>
        </div>

        <div class="card md:col-span-2 space-y-6 flex flex-col justify-center">
            <h3 class="font-bold text-[var(--color-text)] mb-2">
                Macronutrients
            </h3>
            <div>
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-blue-400 font-bold">Protein</span>
                    <span class="text-muted">120g / 180g</span>
                </div>
                <div
                    class="h-2 w-full bg-background rounded-full overflow-hidden mb-1"
                >
                    <div
                        class="h-full bg-blue-500 w-[66%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    ></div>
                </div>
            </div>
            <div>
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-yellow-400 font-bold">Carbs</span>
                    <span class="text-muted">140g / 250g</span>
                </div>
                <div
                    class="h-2 w-full bg-background rounded-full overflow-hidden mb-1"
                >
                    <div
                        class="h-full bg-yellow-500 w-[56%] rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                    ></div>
                </div>
            </div>
            <div>
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-red-400 font-bold">Fats</span>
                    <span class="text-muted">35g / 70g</span>
                </div>
                <div
                    class="h-2 w-full bg-background rounded-full overflow-hidden mb-1"
                >
                    <div
                        class="h-full bg-red-500 w-[50%] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    ></div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
            <h3 class="font-bold text-[var(--color-text)] mb-6">
                Today's Meals
            </h3>
            <div class="space-y-4">
                {#each [{ name: "Breakfast", cal: 450, time: "8:00 AM", items: "Oatmeal, Eggs, Coffee" }, { name: "Lunch", cal: 850, time: "1:00 PM", items: "Chicken Salad, Rice" }, { name: "Snack", cal: 200, time: "4:30 PM", items: "Protein Bar" }] as meal}
                    <div
                        class="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-transparent hover:border-line transition-all group cursor-pointer"
                    >
                        <div>
                            <h4
                                class="font-bold text-[var(--color-text)] group-hover:text-primary transition-colors"
                            >
                                {meal.name}
                            </h4>
                            <p class="text-xs text-muted mt-1">{meal.items}</p>
                        </div>
                        <div class="text-right">
                            <span
                                class="block font-bold text-[var(--color-text)]"
                                >{meal.cal} kcal</span
                            >
                            <span class="text-xs text-muted">{meal.time}</span>
                        </div>
                    </div>
                {/each}

                <button
                    class="w-full border-t border-line pt-4 text-center text-sm text-muted hover:text-[var(--color-text)] transition-colors"
                >
                    + Add Dinner
                </button>
            </div>
        </div>

        <div class="card bg-surface/50 border-primary/10">
            <div class="flex items-center justify-between mb-4">
                <h3
                    class="font-bold text-[var(--color-text)] flex items-center gap-2"
                >
                    <Utensils size={18} class="text-primary" /> Meal Planner
                </h3>
                <button class="text-xs text-primary hover:underline"
                    >View Week</button
                >
            </div>
            <div class="space-y-3">
                <div class="p-3 bg-surface rounded-lg border border-line">
                    <span class="text-xs text-muted block mb-1"
                        >Tomorrow • Breakfast</span
                    >
                    <span class="font-bold text-[var(--color-text)]"
                        >Avocado Toast & Eggs</span
                    >
                </div>
                <div class="p-3 bg-surface rounded-lg border border-line">
                    <span class="text-xs text-muted block mb-1"
                        >Tomorrow • Lunch</span
                    >
                    <span class="font-bold text-[var(--color-text)]"
                        >Grilled Salmon & Quinoa</span
                    >
                </div>
            </div>
            <button class="w-full btn btn-sm btn-secondary mt-4"
                >Plan Next Meal</button
            >
        </div>

        <div class="card relative overflow-hidden">
            <div class="absolute top-0 right-0 p-8 opacity-5">
                <Apple size={160} />
            </div>
            <h3 class="font-bold text-[var(--color-text)] mb-4">
                Water Tracker
            </h3>

            <div class="flex items-center justify-center gap-2 mb-8">
                {#each Array(8) as _, i}
                    <div
                        class="h-12 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-end justify-center overflow-hidden cursor-pointer hover:bg-blue-500/20 transition-all {i <
                        4
                            ? 'bg-blue-500/20'
                            : ''}"
                    >
                        <div
                            class="w-full bg-blue-500 rounded-b-full {i < 4
                                ? 'h-full'
                                : 'h-0'} transition-all duration-500"
                        ></div>
                    </div>
                {/each}
            </div>

            <div class="text-center">
                <span
                    class="text-4xl font-bold text-[var(--color-text)] block mb-1"
                    >1,250ml</span
                >
                <span class="text-sm text-muted">Goal: 2,500ml</span>
            </div>

            <div class="mt-8 flex justify-center">
                <button
                    class="btn bg-blue-500 text-white hover:bg-blue-600 rounded-full px-8"
                    >+ Add 250ml</button
                >
            </div>
        </div>
    </div>
</div>
