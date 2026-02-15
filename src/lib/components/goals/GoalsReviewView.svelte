<script lang="ts">
    import {
        goalsStore,
        type GoalLog,
        type Goal,
    } from "$lib/stores/goals.svelte";
    import {
        BookOpen,
        TrendingUp,
        Trophy,
        ArrowRight,
        Brain,
        Activity,
        Target,
    } from "lucide-svelte";
    import { fade, slide } from "svelte/transition";
    import GoalJournalTimeline from "./GoalJournalTimeline.svelte";
    import GoalProgressRing from "./GoalProgressRing.svelte";

    let { filters } = $props();

    const filteredGoals = $derived(
        goalsStore.goals.filter((g) => {
            const matchHorizon =
                filters.horizon === "all" || g.horizon === filters.horizon;
            const matchArea = filters.area === "All" || g.area === filters.area;
            const matchStatus =
                filters.status === "all" || g.status === filters.status;
            return matchHorizon && matchArea && matchStatus;
        }),
    );

    const stats = $derived.by(() => {
        const total = filteredGoals.length;
        const completed = filteredGoals.filter(
            (g) => g.status === "completed",
        ).length;
        const avgProgress =
            total > 0
                ? Math.round(
                      filteredGoals.reduce(
                          (acc, g) => acc + goalsStore.getGoalProgress(g.id),
                          0,
                      ) / total,
                  )
                : 0;

        return { total, completed, avgProgress };
    });

    const recentLogs = $derived(
        goalsStore.logs
            .filter((l) => filteredGoals.some((g) => g.id === l.goalId))
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .slice(0, 5),
    );

    function getGoalTitle(id: string) {
        return (
            goalsStore.goals.find((g) => g.id === id)?.title || "Unknown Goal"
        );
    }

    const moodIcons = ["Empty", "😔", "😐", "🙂", "😊", "🔥"];
</script>

<div class="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
    <!-- 1. High Level Performance -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
            class="card-subtle p-6 bg-primary/5 flex flex-col items-center text-center"
        >
            <div class="p-3 rounded-2xl bg-primary/10 text-primary mb-4">
                <Target size={24} />
            </div>
            <p
                class="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2"
            >
                Completion Rate
            </p>
            <h3 class="text-3xl font-black text-white">
                {stats.completed}
                <span class="text-sm text-muted font-normal"
                    >/ {stats.total}</span
                >
            </h3>
        </div>

        <div
            class="card-subtle p-6 bg-emerald-500/5 flex flex-col items-center text-center"
        >
            <div
                class="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4"
            >
                <TrendingUp size={24} />
            </div>
            <p
                class="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2"
            >
                Avg. Momentum
            </p>
            <h3 class="text-3xl font-black text-white">{stats.avgProgress}%</h3>
        </div>

        <div
            class="card-subtle p-6 bg-purple-500/5 flex flex-col items-center text-center"
        >
            <div class="p-3 rounded-2xl bg-purple-500/10 text-purple-500 mb-4">
                <Activity size={24} />
            </div>
            <p
                class="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2"
            >
                Reflection Score
            </p>
            <h3 class="text-3xl font-black text-white">
                {recentLogs.length}
                <span class="text-sm text-muted font-normal">Logs</span>
            </h3>
        </div>
    </div>

    <!-- 2. Recent Reflections -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div class="lg:col-span-12 space-y-6">
            <div class="flex items-center justify-between">
                <h3
                    class="text-xs font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2"
                >
                    <BookOpen size={14} /> Reflection Stream
                </h3>
            </div>

            <div class="space-y-4">
                {#each recentLogs as log (log.id)}
                    <div
                        class="bg-surface/30 border border-line p-6 rounded-3xl relative overflow-hidden group hover:border-muted transition-all"
                        in:fade
                    >
                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="flex-1 space-y-4">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="bg-primary/10 text-primary p-2 rounded-xl"
                                        >
                                            <Target size={14} />
                                        </div>
                                        <span
                                            class="text-xs font-bold text-white/90"
                                            >{getGoalTitle(log.goalId)}</span
                                        >
                                    </div>
                                    <span
                                        class="text-[10px] font-bold text-muted uppercase tracking-wider"
                                        >{new Date(
                                            log.date,
                                        ).toLocaleDateString()}</span
                                    >
                                </div>

                                <p
                                    class="text-sm text-white/70 leading-relaxed italic"
                                >
                                    {log.workDone}
                                </p>

                                {#if log.lessons}
                                    <div
                                        class="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex gap-3"
                                    >
                                        <Brain
                                            size={16}
                                            class="text-primary shrink-0"
                                        />
                                        <p
                                            class="text-xs text-primary/80 leading-relaxed font-medium"
                                        >
                                            <span
                                                class="font-bold text-primary mr-1"
                                                >KEY LESSON:</span
                                            >
                                            {log.lessons}
                                        </p>
                                    </div>
                                {/if}
                            </div>

                            <div
                                class="flex md:flex-col items-center justify-center gap-4 px-6 md:border-l border-line/30"
                            >
                                <div class="text-3xl" title="Mood">
                                    {moodIcons[log.mood] || "😐"}
                                </div>
                                <div
                                    class="text-[10px] font-black text-muted uppercase tracking-widest bg-surface p-2 rounded-lg border border-line"
                                >
                                    DIF {log.difficulty}/5
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}

                {#if recentLogs.length === 0}
                    <div
                        class="py-20 text-center bg-surface/10 rounded-[2rem] border border-dashed border-line"
                    >
                        <BookOpen
                            size={48}
                            class="mx-auto text-muted/20 mb-4"
                        />
                        <p class="text-muted text-sm italic">
                            No reflections documented for these filters.
                        </p>
                    </div>
                {/if}
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
