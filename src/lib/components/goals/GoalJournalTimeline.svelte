<script lang="ts">
    import { goalsStore, type GoalLog } from "$lib/stores/goals.svelte";
    import {
        BookOpen,
        Brain,
        TrendingUp,
        Trophy,
        ArrowRight,
    } from "lucide-svelte";
    import { fade, slide } from "svelte/transition";

    let { goalId } = $props<{ goalId: string }>();

    const logs = $derived(
        goalsStore
            .getGoalLogs(goalId)
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
            ),
    );

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    const moodIcons = ["Empty", "😔", "😐", "🙂", "😊", "🔥"];
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between mb-2">
        <h3
            class="text-sm font-bold text-muted uppercase tracking-widest flex items-center gap-2"
        >
            <BookOpen size={16} />
            Reflection Journal
        </h3>
        <span class="text-[10px] text-muted/60 font-medium"
            >{logs.length} entries</span
        >
    </div>

    {#if logs.length === 0}
        <div
            class="p-8 border border-dashed border-line rounded-3xl bg-surface text-center"
        >
            <p class="text-xs text-muted italic">
                No reflections yet. Log your first victory to start the
                timeline.
            </p>
        </div>
    {:else}
        <div
            class="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-line"
        >
            {#each logs as log (log.id)}
                <div class="relative pl-10" transition:fade>
                    <!-- Dot -->
                    <div
                        class="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-background border-2 border-line flex items-center justify-center z-10"
                    >
                        <div
                            class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary-low)]"
                        ></div>
                    </div>

                    <div
                        class="bg-surface/40 border border-line rounded-2xl p-5 hover:border-muted transition-colors"
                    >
                        <div
                            class="flex items-center justify-between gap-4 mb-3"
                        >
                            <span
                                class="text-[10px] font-bold text-muted uppercase tracking-wider"
                                >{formatDate(log.date)}</span
                            >
                            <div class="flex items-center gap-3">
                                <span class="text-base" title="Mood"
                                    >{moodIcons[log.mood] || "😐"}</span
                                >
                                <div
                                    class="px-2 py-0.5 rounded-md bg-surface text-[10px] font-bold text-muted border border-line"
                                >
                                    DIF {log.difficulty}/5
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <p
                                    class="text-sm text-white/90 leading-relaxed font-medium"
                                >
                                    {log.workDone}
                                </p>
                            </div>

                            {#if log.lessons}
                                <div
                                    class="bg-primary/5 border border-primary/10 rounded-xl p-3 flex gap-3"
                                >
                                    <Brain
                                        size={14}
                                        class="text-primary/70 shrink-0 mt-0.5"
                                    />
                                    <p
                                        class="text-[11px] text-primary/60 italic"
                                    >
                                        <span
                                            class="font-bold text-primary not-italic mr-1"
                                            >Lesson:</span
                                        >
                                        {log.lessons}
                                    </p>
                                </div>
                            {/if}

                            {#if log.nextStep}
                                <div
                                    class="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest pt-2"
                                >
                                    <ArrowRight
                                        size={12}
                                        class="text-primary"
                                    />
                                    Next Step:
                                    <span class="text-white/70"
                                        >{log.nextStep}</span
                                    >
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
