<script>
    import { Target, Flag, Calendar, ChevronRight } from "lucide-svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";

    const goals = [
        {
            title: "Launch SaaS MVP",
            deadline: "Dec 31",
            progress: 65,
            color: "primary",
            tasks: 12,
            completed: 8,
        },
        {
            title: "Reach 10% Body Fat",
            deadline: "Nov 15",
            progress: 40,
            color: "secondary",
            tasks: 20,
            completed: 8,
        },
        {
            title: "Read 12 Books",
            deadline: "Dec 31",
            progress: 33,
            color: "blue-500",
            tasks: 12,
            completed: 4,
        },
    ];
</script>

<div class="space-y-8 pb-12">
    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-3xl font-bold text-white mb-2">Goals & Vision</h1>
            <p class="text-muted">12-Week Year Planning.</p>
        </div>

        <div class="text-right">
            <p class="text-xs text-muted mb-1">Current Cycle</p>
            <p class="font-bold text-white">
                Q4 2026 <span class="text-primary ml-2">Week 5/12</span>
            </p>
        </div>
    </div>

    <div class="grid grid-cols-1 gap-6">
        {#each goals as goal}
            <div
                class="card group hover:border-{goal.color === 'blue-500'
                    ? 'blue-500'
                    : goal.color}/50 transition-all cursor-pointer"
            >
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-start gap-4">
                        <div
                            class="p-3 rounded-lg bg-{goal.color === 'blue-500'
                                ? 'blue-500'
                                : goal.color}/10 text-{goal.color === 'blue-500'
                                ? 'blue-500'
                                : goal.color}"
                        >
                            <Target size={24} />
                        </div>
                        <div>
                            <h3
                                class="text-xl font-bold text-white group-hover:text-{goal.color ===
                                'blue-500'
                                    ? 'blue-500'
                                    : goal.color} transition-colors"
                            >
                                {goal.title}
                            </h3>
                            <div
                                class="flex items-center gap-4 mt-2 text-sm text-muted"
                            >
                                <span class="flex items-center gap-1"
                                    ><Flag size={14} />
                                    {goal.tasks} Milestones</span
                                >
                                <span class="flex items-center gap-1"
                                    ><Calendar size={14} /> Due {goal.deadline}</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-3xl font-bold text-white"
                            >{goal.progress}%</span
                        >
                        <p class="text-xs text-muted">Completed</p>
                    </div>
                </div>

                <div
                    class="h-4 w-full bg-background rounded-full overflow-hidden mb-6 border border-line/50"
                >
                    <div
                        class="h-full bg-{goal.color === 'blue-500'
                            ? 'blue-500'
                            : goal.color} relative overflow-hidden"
                        style="width: {goal.progress}%"
                    >
                        <div
                            class="absolute inset-0 bg-white/20 animate-pulse"
                        ></div>
                    </div>
                </div>

                <div
                    class="flex items-center justify-between pt-4 border-t border-line/50"
                >
                    <div class="flex -space-x-2">
                        <div
                            class="w-8 h-8 rounded-full bg-surface border-2 border-background flex items-center justify-center text-xs text-muted"
                        >
                            You
                        </div>
                        <div
                            class="w-8 h-8 rounded-full bg-surface border-2 border-background flex items-center justify-center text-xs text-muted"
                        >
                            +
                        </div>
                    </div>
                    <button
                        class="text-sm font-medium text-white hover:text-primary flex items-center gap-1 transition-colors"
                    >
                        View Strategy <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>
