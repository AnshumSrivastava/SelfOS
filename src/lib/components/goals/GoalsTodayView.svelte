<script lang="ts">
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte";
    import { tasksStore, type Task } from "$lib/stores/tasks.svelte";
    import {
        Zap,
        Clock,
        AlertTriangle,
        CheckCircle,
        ArrowRight,
        Play,
        Archive,
    } from "lucide-svelte";
    import { fade, fly, slide } from "svelte/transition";
    import GoalProgressRing from "./GoalProgressRing.svelte";

    let { isMobile = false } = $props();

    // Ranked Action Queue Logic
    const actionQueue = $derived.by(() => {
        const pendingTasks: { task: Task; goal: Goal; score: number }[] = [];

        const activeGoals = goalsStore.goals.filter(
            (g) => g.status === "active",
        );

        activeGoals.forEach((goal) => {
            const tasks = goalsStore
                .getGoalTasks(goal.id)
                .filter((t) => t.status !== "completed");

            tasks.forEach((task) => {
                // Scoring Formula: Goal Priority (30) + Goal Health (20) + Task Urgency (50)
                let score = 0;

                // Goal Priority
                if (goal.priority === "high") score += 30;
                else if (goal.priority === "medium") score += 15;
                else score += 5;

                // Goal Health (higher score if stalling to prompt action)
                const health = goalsStore.getGoalHealth(goal.id);
                if (health === "stalled") score += 20;
                else if (health === "at-risk") score += 10;

                // Task Urgency (based on deadline if exists)
                if (task.deadline) {
                    const daysLeft =
                        (new Date(task.deadline).getTime() - Date.now()) /
                        (1000 * 60 * 60 * 24);
                    if (daysLeft < 0)
                        score += 50; // Overdue
                    else if (daysLeft < 1)
                        score += 40; // Due today
                    else if (daysLeft < 3) score += 25; // Due soon
                } else if (!task.deadline && goal.priority === "high") {
                    score += 10; // High priority goal tasks get a slight boost even without deadline
                }

                pendingTasks.push({ task, goal, score });
            });
        });

        return pendingTasks.sort((a, b) => b.score - a.score);
    });

    const topAction = $derived(actionQueue[0]);
    const remainingQueue = $derived(actionQueue.slice(1, 6));

    const stalledGoals = $derived(
        goalsStore.goals.filter(
            (g) =>
                g.status === "active" &&
                goalsStore.getGoalHealth(g.id) === "stalled",
        ),
    );

    async function completeTask(taskId: string) {
        await tasksStore.toggle(taskId);
    }
</script>

<div class="flex-1 overflow-y-auto custom-scrollbar bg-background">
    <div class="max-w-5xl mx-auto p-12 space-y-16">
        <!-- 1. THE NORTH STAR (Recommended MOVE) -->
        {#if topAction}
            <section class="relative group" in:fade>
                <!-- Cinematic Backdrop -->
                <div
                    class="absolute inset-0 bg-primary/5 rounded-[3rem] border border-primary/10 transition-all duration-700 group-hover:bg-primary/10 group-hover:border-primary/20"
                ></div>

                <div
                    class="relative p-12 md:p-16 flex flex-col md:flex-row items-center gap-16"
                >
                    <div class="flex-shrink-0 relative scale-125 md:scale-150">
                        <GoalProgressRing
                            progress={goalsStore.getGoalProgress(
                                topAction.goal.id,
                            )}
                            health={goalsStore.getGoalHealth(topAction.goal.id)}
                            size="lg"
                        />
                        <div
                            class="absolute inset-0 flex items-center justify-center"
                        >
                            <Zap
                                size={40}
                                class="text-primary animate-pulse blur-[1px]"
                            />
                        </div>
                    </div>

                    <div class="flex-1 text-center md:text-left space-y-6">
                        <div class="flex flex-col gap-2">
                            <div
                                class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.3em] w-fit mx-auto md:mx-0"
                            >
                                Strategic Focus
                            </div>
                            <h2
                                class="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[1.1]"
                            >
                                {topAction.task.title}
                            </h2>
                        </div>

                        <div
                            class="flex flex-wrap items-center justify-center md:justify-start gap-6"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-line"
                                >
                                    <Archive size={14} class="text-muted" />
                                </div>
                                <div
                                    class="flex flex-col items-start leading-tight"
                                >
                                    <span
                                        class="text-[9px] font-black text-muted uppercase tracking-widest"
                                        >Target Objective</span
                                    >
                                    <span
                                        class="text-sm font-bold text-white/80"
                                        >{topAction.goal.title}</span
                                    >
                                </div>
                            </div>

                            {#if topAction.task.deadline}
                                <div
                                    class="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20"
                                >
                                    <span
                                        class="text-[10px] font-black text-rose-500 uppercase tracking-widest"
                                        >Deadline: {new Date(
                                            topAction.task.deadline,
                                        ).toLocaleDateString()}</span
                                    >
                                </div>
                            {/if}
                        </div>

                        <div
                            class="pt-8 flex flex-wrap items-center justify-center md:justify-start gap-6"
                        >
                            <button
                                onclick={() => completeTask(topAction.task.id)}
                                class="h-16 px-10 bg-primary text-black rounded-2xl flex items-center gap-4 group/btn shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                <span
                                    class="text-sm font-black uppercase tracking-[0.2em]"
                                    >Execute Mission</span
                                >
                                <ArrowRight
                                    size={20}
                                    class="group-hover/btn:translate-x-2 transition-transform"
                                />
                            </button>
                            <button
                                class="h-16 px-8 border border-line hover:border-white/20 rounded-2xl text-muted text-xs font-black uppercase tracking-widest transition-all"
                            >
                                Adjust Strategy
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        {/if}

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <!-- 2. Action Queue (Minimal List) -->
            <div class="lg:col-span-7 space-y-8">
                <div
                    class="flex items-center justify-between border-b border-line pb-4"
                >
                    <h3
                        class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3"
                    >
                        <Clock size={16} /> Sequence of Operations
                    </h3>
                    <span
                        class="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full"
                        >{actionQueue.length} Pending</span
                    >
                </div>

                <div class="space-y-4">
                    {#each remainingQueue as item (item.task.id)}
                        <div
                            class="group bg-surface/20 hover:bg-surface/40 border border-transparent hover:border-line/50 p-5 rounded-[1.5rem] flex items-center gap-6 transition-all"
                        >
                            <button
                                onclick={() => completeTask(item.task.id)}
                                class="w-12 h-12 rounded-2xl bg-surface border border-line group-hover:border-primary flex items-center justify-center text-muted group-hover:text-primary transition-all active:scale-90"
                            >
                                <CheckCircle size={22} />
                            </button>

                            <div class="flex-1 min-w-0">
                                <span
                                    class="text-[9px] font-black text-muted uppercase tracking-widest block mb-1"
                                >
                                    {item.goal.title}
                                </span>
                                <p
                                    class="text-base font-bold text-white truncate group-hover:text-primary transition-colors"
                                >
                                    {item.task.title}
                                </p>
                            </div>

                            <button
                                class="opacity-0 group-hover:opacity-100 p-3 text-muted hover:text-white transition-all"
                            >
                                <Play size={18} />
                            </button>
                        </div>
                    {/each}

                    {#if actionQueue.length <= 1}
                        <div
                            class="py-20 text-center border-2 border-dashed border-line/30 rounded-[2rem]"
                        >
                            <p class="text-muted text-sm font-medium italic">
                                Operational status clear. Strategic objectives
                                maintained.
                            </p>
                        </div>
                    {/if}
                </div>
            </div>

            <!-- 3. Health Monitor -->
            <div class="lg:col-span-5 space-y-8">
                <div
                    class="flex items-center justify-between border-b border-line pb-4"
                >
                    <h3
                        class="text-[10px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-3"
                    >
                        <AlertTriangle size={16} /> Health Protocol
                    </h3>
                </div>

                <div class="space-y-4">
                    {#each stalledGoals as goal (goal.id)}
                        <div
                            class="bg-rose-500/5 border border-rose-500/10 p-6 rounded-[1.5rem] space-y-4"
                        >
                            <div class="flex items-center justify-between">
                                <span
                                    class="px-3 py-1 rounded-full bg-rose-500/10 text-[9px] font-black text-rose-500 uppercase tracking-widest"
                                    >Critical Drift</span
                                >
                                <span class="text-[10px] font-medium text-muted"
                                    >14+ Days Stalled</span
                                >
                            </div>
                            <h4
                                class="text-lg font-bold text-white leading-tight"
                            >
                                {goal.title}
                            </h4>
                            <button
                                class="w-full py-3 bg-surface border border-line rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary/50 transition-all"
                            >
                                Define New Pulse →
                            </button>
                        </div>
                    {/each}

                    {#if stalledGoals.length === 0}
                        <div
                            class="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-[1.5rem] text-center"
                        >
                            <div
                                class="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4"
                            >
                                <CheckCircle
                                    size={24}
                                    class="text-emerald-500"
                                />
                            </div>
                            <h4 class="text-white font-bold mb-2">
                                Systems Nominal
                            </h4>
                            <p class="text-xs text-muted">
                                All strategic initiatives are within operational
                                parameters.
                            </p>
                        </div>
                    {/if}
                </div>
            </div>
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
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.1);
    }
</style>
