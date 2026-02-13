<script lang="ts">
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte";
    import { Calendar, ChevronLeft, ChevronRight, Target } from "lucide-svelte";
    import { fade, slide } from "svelte/transition";

    const goalsWithDeadlines = $derived(
        goalsStore.goals.filter((g) => g.targetDate && g.status === "active"),
    );

    // Timeline logic
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const currentYear = new Date().getFullYear();
    const timelineMonths = $derived.by(() => {
        const list = [];
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() + i);
            list.push({
                name: months[date.getMonth()],
                year: date.getFullYear(),
                index: date.getMonth(),
            });
        }
        return list;
    });

    const horizonColors = {
        life: "bg-purple-500",
        long: "bg-blue-500",
        mid: "bg-indigo-500",
        short: "bg-emerald-500",
    };

    function getGoalStyle(goal: Goal) {
        if (!goal.targetDate) return "";
        const target = new Date(goal.targetDate);
        const now = new Date();

        // Simple positioning logic for 6-month view
        const startOfView = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfView = new Date(now.getFullYear(), now.getMonth() + 6, 0);

        if (target < startOfView) return "display: none;";

        const totalDuration = endOfView.getTime() - startOfView.getTime();
        const startOffset = Math.max(
            0,
            new Date(goal.createdAt).getTime() - startOfView.getTime(),
        );
        const endOffset = Math.min(
            totalDuration,
            target.getTime() - startOfView.getTime(),
        );

        const left = (startOffset / totalDuration) * 100;
        const width = Math.max(
            5,
            ((endOffset - startOffset) / totalDuration) * 100,
        );

        return `left: ${left}%; width: ${width}%;`;
    }
</script>

<div
    class="bg-slate-900/30 border border-slate-800 rounded-3xl p-8 overflow-hidden h-[600px] flex flex-col"
>
    <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-bold text-white flex items-center gap-3">
            <Calendar class="text-blue-500" />
            Strategic Roadmap
        </h2>

        <div
            class="flex items-center gap-1 bg-slate-800/50 p-1 rounded-xl border border-slate-700"
        >
            <button
                class="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            >
                <ChevronLeft size={16} />
            </button>
            <span
                class="px-4 text-[10px] font-black uppercase text-slate-300 tracking-widest"
                >Next 6 Months</span
            >
            <button
                class="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    </div>

    <div class="flex-1 relative min-h-0 flex flex-col">
        <!-- Timeline Header -->
        <div class="flex border-b border-slate-800/50 mb-4 pb-4">
            <div class="w-48 shrink-0"></div>
            <div class="flex-1 flex">
                {#each timelineMonths as month}
                    <div class="flex-1 text-center">
                        <span
                            class="text-[10px] font-black text-slate-500 uppercase tracking-widest"
                            >{month.name}</span
                        >
                        <p class="text-[8px] text-slate-700 font-bold">
                            {month.year}
                        </p>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Vertical Month Dividers -->
        <div class="absolute top-12 bottom-0 left-48 right-0 flex">
            {#each timelineMonths as _}
                <div
                    class="flex-1 border-r border-slate-800/30 last:border-0 h-full"
                ></div>
            {/each}
        </div>

        <!-- Roadmap Rows -->
        <div class="flex-1 overflow-y-auto custom-scrollbar relative pr-4">
            {#if goalsWithDeadlines.length === 0}
                <div
                    class="flex flex-col items-center justify-center h-64 text-center"
                >
                    <div
                        class="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-700 mb-4"
                    >
                        <Target size={24} />
                    </div>
                    <p class="text-xs text-slate-500 italic">
                        No goals with deadlines found.
                    </p>
                </div>
            {:else}
                <div class="space-y-6">
                    {#each goalsWithDeadlines as goal (goal.id)}
                        <div class="flex items-center group h-12">
                            <div class="w-48 shrink-0 pr-4">
                                <h4
                                    class="text-xs font-bold text-slate-400 truncate group-hover:text-white transition-colors"
                                >
                                    {goal.title}
                                </h4>
                                <span
                                    class="text-[9px] text-slate-600 uppercase tracking-widest font-black"
                                    >{goal.horizon}</span
                                >
                            </div>

                            <div
                                class="flex-1 relative h-6 bg-slate-950/20 rounded-full overflow-hidden"
                            >
                                <div
                                    class="absolute top-0 bottom-0 rounded-full opacity-80 group-hover:opacity-100 transition-all flex items-center px-4 {horizonColors[
                                        goal.horizon as keyof typeof horizonColors
                                    ]}"
                                    style={getGoalStyle(goal)}
                                >
                                    <div
                                        class="h-1 bg-white/20 rounded-full w-full relative overflow-hidden"
                                    >
                                        <div
                                            class="absolute h-full bg-white transition-all duration-1000"
                                            style="width: {goalsStore.getGoalProgress(
                                                goal.id,
                                            )}%"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
</style>
