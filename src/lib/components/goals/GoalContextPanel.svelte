<script lang="ts">
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import {
        Activity,
        Target,
        Clock,
        AlertCircle,
        Plus,
        CheckCircle,
        BookOpen,
        ChevronRight,
        Share2,
        Settings2,
        Sparkles,
        Zap,
    } from "lucide-svelte";
    import { fade, slide } from "svelte/transition";
    import GoalProgressRing from "./GoalProgressRing.svelte";

    let { goalId, onEdit } = $props<{
        goalId: string;
        onEdit?: (g: Goal) => void;
    }>();

    const goal = $derived(goalsStore.goals.find((g) => g.id === goalId));
    const tasks = $derived(goalsStore.getGoalTasks(goalId));
    const children = $derived(goalsStore.getGoalChildren(goalId));
    const progress = $derived(goalsStore.getGoalProgress(goalId));
    const health = $derived(goalsStore.getGoalHealth(goalId));

    const pendingTasks = $derived(
        tasks.filter((t) => t.status !== "completed"),
    );

    let newTaskLabel = $state("");

    async function addTask() {
        if (!newTaskLabel.trim()) return;
        await goalsStore.addTasksBatch(goalId, newTaskLabel);
        newTaskLabel = "";
    }
</script>

{#if goal}
    <div
        class="h-full flex flex-col bg-surface/20 border-l border-line overflow-y-auto custom-scrollbar"
        in:fade
    >
        <!-- Header -->
        <div class="p-8 border-b border-line space-y-6">
            <div class="flex items-center justify-between">
                <div class="p-2 rounded-xl bg-primary/10 text-primary">
                    <Target size={20} />
                </div>
                <div class="flex gap-2">
                    <button
                        onclick={() => onEdit?.(goal)}
                        class="p-2 hover:bg-surface rounded-lg text-muted hover:text-white transition-colors"
                    >
                        <Settings2 size={18} />
                    </button>
                </div>
            </div>

            <div class="space-y-2">
                <h2
                    class="text-2xl font-bold text-white tracking-tight leading-tight"
                >
                    {goal.title}
                </h2>
                <div class="flex items-center gap-3">
                    <span
                        class="text-[10px] font-black text-primary uppercase tracking-widest"
                        >{goal.horizon}</span
                    >
                    <span class="text-[10px] text-muted">•</span>
                    <span
                        class="text-[10px] font-bold text-muted uppercase tracking-widest"
                        >{goal.area}</span
                    >
                </div>
            </div>

            <div
                class="flex items-center gap-8 py-4 px-6 bg-background/50 rounded-2xl border border-line"
            >
                <GoalProgressRing {progress} {health} size="md" />
                <div class="space-y-1">
                    <p class="text-2xl font-black text-white">{progress}%</p>
                    <p
                        class="text-[10px] font-bold text-muted uppercase tracking-widest"
                    >
                        PROGRESS
                    </p>
                </div>
            </div>
        </div>

        <div class="p-8 space-y-10 flex-1">
            <!-- Health Status -->
            <div class="space-y-4">
                <h3
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2"
                >
                    <Activity size={14} /> Health pulse
                </h3>

                {#if health === "stalled"}
                    <div
                        class="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3"
                    >
                        <AlertCircle size={18} class="text-red-500 shrink-0" />
                        <div>
                            <p class="text-xs font-bold text-red-500 mb-1">
                                GOAL IS STALLED
                            </p>
                            <p class="text-[10px] text-muted leading-relaxed">
                                No activity detected for 14 days. Define a small
                                next step to break the inertia.
                            </p>
                        </div>
                    </div>
                {:else if health === "at-risk"}
                    <div
                        class="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex gap-3"
                    >
                        <Clock size={18} class="text-orange-500 shrink-0" />
                        <div>
                            <p class="text-xs font-bold text-orange-500 mb-1">
                                ATTENTION NEEDED
                            </p>
                            <p class="text-[10px] text-muted leading-relaxed">
                                Velocity is dropping. Check your weekly
                                milestones.
                            </p>
                        </div>
                    </div>
                {:else}
                    <div
                        class="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex gap-3"
                    >
                        <Sparkles size={18} class="text-emerald-500 shrink-0" />
                        <div>
                            <p class="text-xs font-bold text-emerald-400 mb-1">
                                OPTIMAL MOMENTUM
                            </p>
                            <p class="text-[10px] text-muted leading-relaxed">
                                Strategy is aligned with execution. Stay the
                                course.
                            </p>
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Next Steps -->
            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] flex items-center gap-2"
                    >
                        <Zap size={14} /> next steps
                    </h3>
                    <span class="text-[10px] text-muted font-bold"
                        >{pendingTasks.length} pending</span
                    >
                </div>

                <div class="space-y-2">
                    {#each pendingTasks.slice(0, 5) as task}
                        <div
                            class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface/50 transition-all group"
                        >
                            <button
                                onclick={() => tasksStore.toggle(task.id)}
                                class="w-5 h-5 rounded border border-line group-hover:border-primary flex items-center justify-center text-transparent hover:text-primary transition-all"
                            >
                                <CheckCircle size={12} />
                            </button>
                            <span class="text-sm text-white/80 flex-1 truncate"
                                >{task.title}</span
                            >
                        </div>
                    {/each}

                    <div class="pt-2">
                        <div class="relative">
                            <input
                                type="text"
                                bind:value={newTaskLabel}
                                placeholder="Add immediate action..."
                                onkeydown={(e) =>
                                    e.key === "Enter" && addTask()}
                                class="w-full bg-background border border-line rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted/50 focus:border-primary/50 outline-none transition-all pr-12"
                            />
                            <button
                                onclick={addTask}
                                class="absolute right-2 top-2 p-1.5 bg-primary text-black rounded-lg hover:opacity-90 active:scale-95 transition-all"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Logs Link -->
            <button
                class="w-full card-subtle p-4 flex items-center justify-between group"
            >
                <div class="flex items-center gap-3">
                    <div
                        class="p-2 rounded-lg bg-surface text-muted group-hover:text-primary transition-colors"
                    >
                        <BookOpen size={16} />
                    </div>
                    <span
                        class="text-xs font-bold text-muted group-hover:text-white transition-colors"
                        >Goal Journal</span
                    >
                </div>
                <ChevronRight
                    size={16}
                    class="text-muted group-hover:translate-x-1 transition-transform"
                />
            </button>
        </div>
    </div>
{:else}
    <div
        class="h-full flex flex-col items-center justify-center p-12 text-center space-y-4"
    >
        <Target size={48} class="text-muted/20" />
        <p class="text-sm text-muted italic">
            Select an objective to inspect its trajectory and take action.
        </p>
    </div>
{/if}

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
