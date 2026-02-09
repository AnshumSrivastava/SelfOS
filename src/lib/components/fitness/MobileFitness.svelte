<script>
    import { Dumbbell, Activity, Play, Timer, Flame } from "lucide-svelte";

    const workouts = [
        {
            title: "Push Day",
            duration: "45m",
            calories: 320,
            date: "Today",
        },
        {
            title: "Morning Cardio",
            duration: "30m",
            calories: 250,
            date: "Yesterday",
        },
    ];
</script>

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Fitness</h1>
        <button
            class="w-10 h-10 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
        >
            <Play size={20} fill="black" />
        </button>
    </div>

    <!-- Rings / Main Stats -->
    <div class="grid grid-cols-2 gap-4">
        <div
            class="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-900 aspect-square flex flex-col justify-between relative overflow-hidden"
        >
            <!-- Simplified Ring Visualization -->
            <div
                class="absolute inset-0 flex items-center justify-center opacity-20"
            >
                <Activity size={80} />
            </div>

            <Activity class="text-emerald-500 relative z-10" size={24} />
            <div class="relative z-10">
                <span class="text-3xl font-bold text-white block">450</span>
                <span class="text-xs text-gray-500">Active Cal</span>
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <div
                class="flex-1 p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex flex-col justify-center"
            >
                <span class="text-xs text-gray-500 block">Steps</span>
                <span class="text-xl font-bold text-white block">8,432</span>
            </div>
            <div
                class="flex-1 p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex flex-col justify-center"
            >
                <span class="text-xs text-gray-500 block">Sleep</span>
                <span class="text-xl font-bold text-white block">7h 12m</span>
            </div>
        </div>
    </div>

    <!-- Today's Plan -->
    <div class="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-900">
        <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium text-white">Next Workout</h3>
            <span
                class="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full"
                >Strength</span
            >
        </div>
        <div class="flex items-center gap-4">
            <div
                class="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white"
            >
                <Dumbbell size={20} />
            </div>
            <div>
                <h4 class="font-bold text-white">Pull Day (Back & Bi)</h4>
                <p class="text-xs text-gray-500">45-60 mins • Hard</p>
            </div>
        </div>
        <button
            class="w-full mt-4 py-3 rounded-xl bg-white text-black font-medium text-sm"
            >Start Session</button
        >
    </div>

    <!-- Recent List -->
    <div class="space-y-3">
        <h3 class="text-lg font-medium text-white">Recent</h3>
        {#each workouts as w}
            <div
                class="flex items-center justify-between p-4 rounded-xl bg-[#0A0A0A] border border-neutral-900"
            >
                <div class="flex items-center gap-3">
                    <div class="text-gray-400">
                        <Activity size={18} />
                    </div>
                    <div>
                        <p class="font-medium text-white text-sm">{w.title}</p>
                        <p class="text-xs text-gray-500">{w.date}</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="block text-white font-medium text-sm"
                        >{w.calories} cal</span
                    >
                    <span class="block text-xs text-gray-500">{w.duration}</span
                    >
                </div>
            </div>
        {/each}
    </div>
</div>
