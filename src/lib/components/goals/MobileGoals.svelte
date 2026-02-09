<script>
    import { Target, Flag, Calendar, Plus } from "lucide-svelte";

    const goals = [
        {
            title: "Launch SaaS MV",
            deadline: "Dec 31",
            progress: 65,
            tasks: 12,
        },
        {
            title: "Reach 10% Body Fat",
            deadline: "Nov 15",
            progress: 40,
            tasks: 20,
        },
        {
            title: "Read 12 Books",
            deadline: "Dec 31",
            progress: 33,
            tasks: 12,
        },
    ];
</script>

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Goals</h1>
        <button
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Cycle Info -->
    <div
        class="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 flex justify-between items-center"
    >
        <div>
            <span class="text-xs text-gray-500 uppercase tracking-wider"
                >Current Cycle</span
            >
            <div class="text-white font-medium">Q4 2026</div>
        </div>
        <div class="text-right">
            <span class="text-xs text-gray-500 uppercase tracking-wider"
                >Week</span
            >
            <div class="text-emerald-500 font-bold">5 / 12</div>
        </div>
    </div>

    <!-- Goals List -->
    <div class="space-y-4">
        {#each goals as goal}
            <div
                class="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-900 space-y-4 relative overflow-hidden"
            >
                <div class="flex justify-between items-start relative z-10">
                    <div>
                        <h3 class="font-bold text-white text-lg">
                            {goal.title}
                        </h3>
                        <div class="flex items-center gap-3 mt-1">
                            <span
                                class="text-xs text-gray-500 flex items-center gap-1"
                                ><Flag size={10} />
                                {goal.tasks} Milestones</span
                            >
                            <span
                                class="text-xs text-gray-500 flex items-center gap-1"
                                ><Calendar size={10} /> {goal.deadline}</span
                            >
                        </div>
                    </div>
                    <span class="text-xl font-bold text-white"
                        >{goal.progress}%</span
                    >
                </div>

                <div
                    class="h-2 w-full bg-neutral-800 rounded-full overflow-hidden relative z-10"
                >
                    <div
                        class="h-full bg-white"
                        style="width: {goal.progress}%"
                    ></div>
                </div>
            </div>
        {/each}
    </div>
</div>
