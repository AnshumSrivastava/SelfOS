<script>
    import { Plus, Droplets, Apple } from "lucide-svelte";

    const meals = [
        { name: "Breakfast", cal: 450, time: "8:00 AM" },
        { name: "Lunch", cal: 850, time: "1:00 PM" },
    ];
</script>

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Nutrition</h1>
        <button
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Calories Ring -->
    <div
        class="p-6 rounded-3xl bg-[#0A0A0A] border border-neutral-900 flex flex-col items-center"
    >
        <div
            class="w-48 h-48 rounded-full border-[12px] border-neutral-800 flex items-center justify-center relative"
        >
            <div class="text-center">
                <span class="text-4xl font-bold text-white block">1,240</span>
                <span class="text-xs text-gray-500">Kcal Left</span>
            </div>
            <div
                class="absolute w-full h-full rounded-full border-[12px] border-b-transparent border-r-transparent border-t-white border-l-white rotate-45"
            ></div>
        </div>

        <div class="flex w-full justify-between mt-6 px-4">
            <div class="text-center">
                <span class="text-xs text-gray-500 block">Protein</span>
                <span class="font-bold text-blue-400">120g</span>
            </div>
            <div class="text-center">
                <span class="text-xs text-gray-500 block">Carbs</span>
                <span class="font-bold text-yellow-400">140g</span>
            </div>
            <div class="text-center">
                <span class="text-xs text-gray-500 block">Fats</span>
                <span class="font-bold text-red-400">35g</span>
            </div>
        </div>
    </div>

    <!-- Meals -->
    <div class="space-y-4">
        {#each meals as meal}
            <div
                class="p-4 rounded-xl bg-[#0A0A0A] border border-neutral-900 flex justify-between items-center decoration-slice"
            >
                <div>
                    <span class="text-xs text-gray-500 block">{meal.time}</span>
                    <span class="font-medium text-white">{meal.name}</span>
                </div>
                <div class="text-right">
                    <span class="font-bold text-white">{meal.cal}</span>
                    <span class="text-xs text-gray-500 ml-1">kcal</span>
                </div>
            </div>
        {/each}
        <button
            class="w-full py-3 rounded-xl border border-dashed border-neutral-800 text-sm text-gray-500 hover:text-white hover:border-white/50 transition-colors"
        >
            + Log Meal
        </button>
    </div>
</div>
