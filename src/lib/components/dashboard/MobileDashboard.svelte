<script lang="ts">
    import {
        Flame,
        Check,
        Plus,
        Zap,
        Edit3,
        Target,
        Search,
    } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { focusStore } from "$lib/stores/focus.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";
    import ConsistencyChart from "$lib/components/habits/ConsistencyChart.svelte";
    import StreakFire from "$lib/components/ui/StreakFire.svelte";
    import NumberTicker from "$lib/components/ui/NumberTicker.svelte";
    import { base } from "$app/paths";

    let showQuickCapture = $state(false);
    let fire: StreakFire;

    // Derived stats
    let activeTasks = $derived(tasksStore.activeCount);
    let completedHabits = $derived(habitsStore.completedCount);
    let totalTasksStr = $derived(tasksStore.tasks.length);
    let completedTasks = $derived(tasksStore.completedCount);

    let maxStreak = $derived(
        Math.max(0, ...habitsStore.habits.map((h) => h.streak)),
    );
    let taskCompletionRate = $derived(
        totalTasksStr > 0
            ? Math.round((completedTasks / totalTasksStr) * 100)
            : 0,
    );
</script>

<div class="page-container relative px-6 pb-24">
    <StreakFire bind:this={fire} />

    <!-- Summary Row -->
    <div class="flex items-center justify-between mt-4 mb-8">
        <div class="space-y-0.5">
            <h1
                class="text-2xl font-bold tracking-tight text-[var(--color-text)]"
            >
                Today
            </h1>
            <p
                class="text-[var(--color-muted)] text-xs font-medium uppercase tracking-wider"
            >
                {activeTasks} urgent • {completedHabits} habits
            </p>
        </div>
        <div class="flex items-center gap-4">
            <div class="flex flex-col items-end">
                <div class="flex items-center gap-1 text-orange-500 font-bold">
                    <Flame size={16} />
                    <NumberTicker value={maxStreak} />
                </div>
                <span
                    class="text-[8px] font-bold uppercase tracking-widest text-[var(--color-muted)]"
                    >Streak</span
                >
            </div>
            <div
                class="flex flex-col items-end border-l border-[var(--color-line)] pl-4"
            >
                <div class="text-[var(--color-primary)] font-bold">
                    <NumberTicker value={taskCompletionRate} />%
                </div>
                <span
                    class="text-[8px] font-bold uppercase tracking-widest text-[var(--color-muted)]"
                    >Rate</span
                >
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-4 gap-4 mb-10">
        <button
            onclick={() => (showQuickCapture = true)}
            class="flex flex-col items-center gap-2 group"
        >
            <div
                class="w-full aspect-square rounded-2xl bg-[var(--color-primary)] text-black flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-[var(--color-primary)]/10"
            >
                <Plus size={20} strokeWidth={3} />
            </div>
            <span
                class="text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]"
                >Task</span
            >
        </button>
        <button
            onclick={() => (window.location.href = `${base}/habits`)}
            class="flex flex-col items-center gap-2 group"
        >
            <div
                class="w-full aspect-square rounded-2xl bg-[var(--theme-surface)] border border-[var(--color-line)] text-[var(--color-text)] flex items-center justify-center active:scale-90 transition-all"
            >
                <Check size={18} strokeWidth={2.5} />
            </div>
            <span
                class="text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]"
                >Habit</span
            >
        </button>
        <button
            onclick={() => focusStore.toggle()}
            class="flex flex-col items-center gap-2 group"
        >
            <div
                class="w-full aspect-square rounded-2xl bg-[var(--theme-surface)] border border-[var(--color-line)] text-[var(--color-text)] flex items-center justify-center active:scale-90 transition-all {focusStore.isRunning
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                    : ''}"
            >
                <Zap size={18} strokeWidth={2.5} />
            </div>
            <span
                class="text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]"
                >Focus</span
            >
        </button>
        <button
            onclick={() => (window.location.href = `${base}/notes`)}
            class="flex flex-col items-center gap-2 group"
        >
            <div
                class="w-full aspect-square rounded-2xl bg-[var(--theme-surface)] border border-[var(--color-line)] text-[var(--color-text)] flex items-center justify-center active:scale-90 transition-all"
            >
                <Edit3 size={18} strokeWidth={2.5} />
            </div>
            <span
                class="text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted)]"
                >Note</span
            >
        </button>
    </div>

    <!-- Focus Header (Minimal) -->
    {#if focusStore.isRunning || focusStore.timeLeft < 25 * 60}
        <div
            class="mb-10 px-4 py-3 rounded-2xl border border-[var(--color-line)] bg-[var(--theme-surface)]/50 flex items-center justify-between"
        >
            <div class="flex items-center gap-3">
                <div
                    class="w-2 h-2 rounded-full bg-[var(--color-primary)] {focusStore.isRunning
                        ? 'animate-pulse'
                        : ''}"
                ></div>
                <span
                    class="text-sm font-bold tracking-tight text-[var(--color-text)]"
                    >{focusStore.mode === "focus" ? "Focusing" : "Break"}</span
                >
            </div>
            <div class="flex items-center gap-4">
                <span
                    class="text-xl font-mono font-bold text-[var(--color-text)]"
                    >{focusStore.formattedTime}</span
                >
                <button
                    onclick={() => focusStore.toggle()}
                    class="text-[var(--color-muted)]"
                >
                    {#if focusStore.isRunning}<Plus
                            class="rotate-45"
                            size={20}
                        />{:else}<Zap size={20} />{/if}
                </button>
            </div>
        </div>
    {/if}

    <!-- Standardized List Blocks -->
    <div class="space-y-10">
        <!-- Habits -->
        <section class="space-y-4">
            <div
                class="flex items-center justify-between border-b border-[var(--color-line)] pb-2"
            >
                <h2
                    class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]"
                >
                    Primary Habits
                </h2>
                <div class="w-16 h-4">
                    <ConsistencyChart height="h-full" showLabels={false} />
                </div>
            </div>
            <div class="space-y-1">
                {#each habitsStore.habits.slice(0, 3) as habit}
                    {@const isCompleted = habitsStore.isCompleted(habit.id)}
                    <button
                        onclick={(e) => {
                            if (!isCompleted) fire.ignite(e.clientX, e.clientY);
                            habitsStore.toggle(habit.id);
                        }}
                        class="w-full flex items-center justify-between py-3 px-1 active:bg-[var(--color-line)]/20 transition-colors group"
                    >
                        <div
                            class="flex items-center gap-4 text-left overflow-hidden"
                        >
                            <div
                                class="w-6 h-6 rounded-lg border-2 {isCompleted
                                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                                    : 'border-[var(--color-line)]'} flex items-center justify-center transition-all shrink-0"
                            >
                                {#if isCompleted}<Check
                                        size={14}
                                        class="text-black"
                                        strokeWidth={3}
                                    />{/if}
                            </div>
                            <span
                                class="text-sm font-medium truncate {isCompleted
                                    ? 'text-[var(--color-muted)] line-through'
                                    : 'text-[var(--color-text)]'}"
                            >
                                {habit.name}
                            </span>
                        </div>
                        <span
                            class="text-[10px] font-bold text-[var(--color-muted)]/50 shrink-0"
                            >{habit.streak}d</span
                        >
                    </button>
                {/each}
            </div>
        </section>

        <!-- Tasks -->
        <section class="space-y-4">
            <div
                class="flex items-center justify-between border-b border-[var(--color-line)] pb-2"
            >
                <h2
                    class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]"
                >
                    Top Priorities
                </h2>
                <button
                    onclick={() => (window.location.href = `${base}/tasks`)}
                    class="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider"
                    >All</button
                >
            </div>
            <div class="space-y-1">
                {#each tasksStore.tasks.slice(0, 3) as task}
                    <div
                        class="w-full flex items-center justify-between py-3 px-1 group"
                    >
                        <div
                            class="flex items-center gap-4 text-left overflow-hidden"
                        >
                            <button
                                onclick={(e) => {
                                    if (task.status !== "completed")
                                        fire.ignite(e.clientX, e.clientY);
                                    tasksStore.toggle(task.id);
                                }}
                                class="w-6 h-6 rounded-full border-2 {task.status ===
                                'completed'
                                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                                    : 'border-[var(--color-line)]'} flex items-center justify-center transition-all shrink-0"
                            >
                                {#if task.status === "completed"}<Check
                                        size={14}
                                        class="text-black"
                                        strokeWidth={3}
                                    />{/if}
                            </button>
                            <div class="flex flex-col min-w-0">
                                <span
                                    class="text-sm font-medium truncate {task.status ===
                                    'completed'
                                        ? 'text-[var(--color-muted)] line-through'
                                        : 'text-[var(--color-text)]'}"
                                >
                                    {task.title}
                                </span>
                                <span
                                    class="text-[10px] font-bold uppercase tracking-tight text-[var(--color-muted)] truncate"
                                >
                                    {task.project}
                                </span>
                            </div>
                        </div>
                        {#if task.deadline}
                            <span
                                class="text-[9px] font-medium text-[var(--color-muted)] shrink-0 border border-[var(--color-line)] px-1.5 py-0.5 rounded"
                            >
                                {new Date(task.deadline).toLocaleDateString(
                                    undefined,
                                    { month: "short", day: "numeric" },
                                )}
                            </span>
                        {/if}
                    </div>
                {/each}
                {#if tasksStore.tasks.length === 0}
                    <div
                        class="py-8 bg-[var(--theme-surface)]/30 rounded-2xl border border-dashed border-[var(--color-line)] flex items-center justify-center text-[var(--color-muted)] text-sm italic"
                    >
                        No active tasks
                    </div>
                {/if}
            </div>
        </section>
    </div>

    <QuickCapture bind:isOpen={showQuickCapture} />
</div>
