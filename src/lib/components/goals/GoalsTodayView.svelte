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

<div class="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
    <!-- 1. Top Recommended Action (The North Star) -->
    {#if topAction}
        <section class="relative" in:fade>
            <div
                class="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 md:p-12 backdrop-blur-xl overflow-hidden group"
            >
                <!-- Abstract visual element -->
                <div
                    class="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700"
                ></div>

                <div
                    class="flex flex-col md:flex-row items-center gap-10 relative"
                >
                    <div class="flex-shrink-0 relative">
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
                            <Zap size={32} class="text-primary animate-pulse" />
                        </div>
                    </div>

                    <div class="flex-1 text-center md:text-left space-y-4">
                        <div
                            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-[0.2em]"
                        >
                            Next High-Impact MOVE
                        </div>

                        <h2
                            class="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight"
                        >
                            {topAction.task.title}
                        </h2>

                        <div
                            class="flex flex-wrap items-center justify-center md:justify-start gap-4"
                        >
                            <span
                                class="text-muted text-sm flex items-center gap-2"
                            >
                                <Archive size={14} />
                                {topAction.goal.title}
                            </span>
                            {#if topAction.task.deadline}
                                <span
                                    class="bg-red-500/10 text-red-500 text-[10px] font-bold px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-widest"
                                >
                                    DUE SOON
                                </span>
                            {/if}
                        </div>

                        <div
                            class="pt-6 flex flex-wrap items-center justify-center md:justify-start gap-4"
                        >
                            <button
                                onclick={() => completeTask(topAction.task.id)}
                                class="btn-primary px-8 py-3 rounded-2xl flex items-center gap-3 group/btn"
                            >
                                <span class="font-bold">EXECUTE NOW</span>
                                <ArrowRight
                                    size={18}
                                    class="group-hover/btn:translate-x-1 transition-transform"
                                />
                            </button>
                            <button
                                class="px-6 py-3 border border-line hover:border-white/20 rounded-2xl text-muted text-sm font-bold transition-all"
                            >
                                Log Progress...
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    {/if}

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- 2. The Action Queue (Center Stream) -->
        <div class="lg:col-span-8 space-y-6">
            <div class="flex items-center justify-between px-2">
                <h3
                    class="text-xs font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2"
                >
                    <Clock size={14} /> action queue
                </h3>
            </div>

            <div class="space-y-3">
                {#each remainingQueue as item (item.task.id)}
                    <div
                        class="bg-surface/30 border border-line/50 hover:border-line p-4 rounded-2xl flex items-center gap-4 transition-all group"
                        in:fly={{ y: 20, delay: 100 }}
                    >
                        <button
                            onclick={() => completeTask(item.task.id)}
                            class="w-10 h-10 rounded-xl border border-line group-hover:border-primary flex items-center justify-center text-muted group-hover:text-primary transition-all active:scale-90"
                        >
                            <CheckCircle size={20} />
                        </button>

                        <div class="flex-1 min-w-0">
                            <p
                                class="text-[10px] font-bold text-muted uppercase tracking-wider mb-1 truncate"
                            >
                                {item.goal.title}
                            </p>
                            <p
                                class="text-sm font-medium text-white group-hover:text-primary transition-colors truncate"
                            >
                                {item.task.title}
                            </p>
                        </div>

                        {#if item.task.deadline}
                            <div
                                class="text-[10px] font-mono text-muted-foreground bg-surface px-2 py-1 rounded border border-line"
                            >
                                {new Date(
                                    item.task.deadline,
                                ).toLocaleDateString()}
                            </div>
                        {/if}

                        <button
                            class="opacity-0 group-hover:opacity-100 p-2 text-muted hover:text-white transition-opacity"
                        >
                            <Play size={16} />
                        </button>
                    </div>
                {/each}

                {#if actionQueue.length <= 1}
                    <div
                        class="py-12 text-center bg-surface/10 rounded-3xl border border-dashed border-line"
                    >
                        <p class="text-muted text-sm italic">
                            Queue cleared. Great work on your evolution.
                        </p>
                    </div>
                {/if}
            </div>
        </div>

        <!-- 3. Risk & Health Monitor (Right Sidebar) -->
        <div class="lg:col-span-4 space-y-8">
            <div class="space-y-6">
                <h3
                    class="text-xs font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2 px-2"
                >
                    <AlertTriangle size={14} /> Attention Required
                </h3>

                <div class="space-y-4">
                    {#each stalledGoals as goal (goal.id)}
                        <div
                            class="card-subtle p-4 border-l-2 border-red-500/50 bg-red-500/5"
                        >
                            <p
                                class="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1"
                            >
                                Stalled
                            </p>
                            <h4 class="text-sm font-bold text-white mb-2">
                                {goal.title}
                            </h4>
                            <p class="text-xs text-muted leading-relaxed mb-4">
                                No progress logged in over 14 days. This
                                initiative is at risk of drift.
                            </p>
                            <button
                                class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                            >
                                Define Next Step →
                            </button>
                        </div>
                    {/each}

                    {#if stalledGoals.length === 0}
                        <div
                            class="p-8 text-center bg-emerald-500/5 border border-emerald-500/10 rounded-2xl"
                        >
                            <p
                                class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2"
                            >
                                System Optimized
                            </p>
                            <p class="text-xs text-muted">
                                All active missions are maintaining momentum.
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
