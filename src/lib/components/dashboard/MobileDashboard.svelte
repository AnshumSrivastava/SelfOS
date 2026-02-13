<script lang="ts">
    import { Flame, Check, ArrowRight, Plus } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";
    import ConsistencyChart from "$lib/components/habits/ConsistencyChart.svelte";
    import StreakFire from "$lib/components/ui/StreakFire.svelte";
    import NumberTicker from "$lib/components/ui/NumberTicker.svelte";

    let showQuickCapture = $state(false);
    let fire: StreakFire;

    // Derived stats
    let totalHabits = $derived(habitsStore.totalCount);
    let completedHabits = $derived(habitsStore.completedCount);
    let activeTasks = $derived(tasksStore.activeCount);
    let completedTasks = $derived(tasksStore.completedCount);
    let totalTasksStr = $derived(tasksStore.tasks.length);

    // Simple streak calculation (sum of all habit streaks for now or max streak? Let's use max streak of any habit for visual)
    let maxStreak = $derived(
        Math.max(0, ...habitsStore.habits.map((h) => h.streak)),
    );
    let taskCompletionRate = $derived(
        totalTasksStr > 0
            ? Math.round((completedTasks / totalTasksStr) * 100)
            : 0,
    );
</script>

<div class="page-container relative px-6">
    <StreakFire bind:this={fire} />
    <!-- Greeting & Status -->
    <div class="space-y-1 mt-6 mb-8">
        <h1
            class="text-3xl font-bold tracking-tight text-[var(--color-text)] line-clamp-1"
        >
            Good Morning
        </h1>
        <p class="text-[var(--color-muted)] text-sm">
            You have {activeTasks} priorities today.
        </p>
    </div>

    <!-- Main Focus Card -->
    <div
        class="card-subtle relative overflow-hidden group bg-gradient-to-br from-[var(--theme-surface)] to-[var(--theme-surface)]/50 border-[var(--color-line)]/50"
    >
        <div
            class="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 blur-3xl rounded-full -mr-16 -mt-16"
        ></div>

        <span
            class="px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider mb-4 inline-block border border-[var(--color-primary)]/20"
            >Deep Work</span
        >
        <div class="flex items-end justify-between relative z-10">
            <div>
                <h2
                    class="text-4xl font-bold text-[var(--color-text)] tracking-tight"
                >
                    45m
                </h2>
                <p class="text-[var(--color-muted)] text-xs mt-1 font-medium">
                    Remaining today
                </p>
            </div>
            <button
                onclick={() => (showQuickCapture = true)}
                class="w-12 h-12 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 active:scale-90 transition-all"
            >
                <Plus size={24} strokeWidth={2.5} />
            </button>
        </div>
    </div>

    <!-- Quick Stats Row -->
    <div class="grid grid-cols-2 gap-4 my-8">
        <div
            class="card-subtle flex flex-col justify-between h-28 border-[var(--color-line)]/50"
        >
            <Flame class="text-orange-500" size={20} />
            <div>
                <span
                    class="text-2xl font-bold text-[var(--color-text)] block tracking-tight"
                    ><NumberTicker value={maxStreak} /></span
                >
                <span
                    class="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]"
                    >Day Streak</span
                >
            </div>
        </div>
        <div
            class="card-subtle flex flex-col justify-between h-28 border-[var(--color-line)]/50"
        >
            <div
                class="text-[var(--color-primary)] text-sm font-bold tracking-tight"
            >
                <NumberTicker value={taskCompletionRate} />%
            </div>
            <div>
                <span
                    class="text-2xl font-bold text-[var(--color-text)] block tracking-tight"
                    >{completedTasks}/{totalTasksStr}</span
                >
                <span
                    class="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]"
                    >Tasks Done</span
                >
            </div>
        </div>
    </div>

    <!-- Habits Section -->
    <div class="space-y-4 my-10">
        <div class="flex items-center justify-between">
            <h3
                class="text-sm font-bold uppercase tracking-widest text-[var(--color-muted)]"
            >
                Habits
            </h3>
            <span
                class="text-[10px] font-medium text-[var(--color-muted)]/60 bg-[var(--color-line)]/30 px-2 py-0.5 rounded-full"
                >{completedHabits}/{habitsStore.totalCount}</span
            >
        </div>

        <!-- Consistency Graph -->
        <div
            class="card-subtle p-3 border-[var(--color-line)]/50 bg-[var(--theme-surface)]/30"
        >
            <ConsistencyChart height="h-16" showLabels={false} />
        </div>

        <div class="space-y-2">
            {#each habitsStore.habits.slice(0, 3) as habit}
                {@const isCompleted = habitsStore.isCompleted(habit.id)}
                <button
                    onclick={(e) => {
                        if (!isCompleted) {
                            fire.ignite(e.clientX, e.clientY);
                        }
                        habitsStore.toggle(habit.id);
                    }}
                    class="card-subtle flex items-center justify-between group active:scale-[0.98] transition-all py-3 border-[var(--color-line)]/30 hover:border-[var(--color-line)]"
                >
                    <span
                        class="text-sm font-medium {isCompleted
                            ? 'text-[var(--color-muted)] line-through'
                            : 'text-[var(--color-text)]'}">{habit.name}</span
                    >
                    <div
                        class="w-5 h-5 rounded-full border-2 {isCompleted
                            ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                            : 'border-[var(--color-line)]'} flex items-center justify-center transition-all"
                    >
                        {#if isCompleted}
                            <Check
                                size={12}
                                class="text-black"
                                strokeWidth={3}
                            />
                        {/if}
                    </div>
                </button>
            {/each}
        </div>
    </div>

    <!-- Tasks Section -->
    <div class="space-y-4 my-10">
        <div class="flex items-center justify-between">
            <h3
                class="text-sm font-bold uppercase tracking-widest text-[var(--color-muted)]"
            >
                Tasks
            </h3>
            <button
                class="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary)] hover:underline"
                >View All</button
            >
        </div>

        <div class="space-y-2">
            {#each tasksStore.tasks.slice(0, 3) as task}
                <div
                    class="card-subtle flex items-center justify-between py-3 border-[var(--color-line)]/30"
                >
                    <div class="flex flex-col items-start text-left">
                        <p
                            class="text-[var(--color-text)] text-sm font-medium {task.status ===
                            'completed'
                                ? 'line-through text-[var(--color-muted)]'
                                : ''}"
                        >
                            {task.title}
                        </p>
                        <p
                            class="text-[10px] text-[var(--color-muted)] mt-0.5 font-medium uppercase tracking-tight"
                        >
                            {task.project}
                            {#if task.deadline}
                                • {new Date(task.deadline).toLocaleDateString(
                                    undefined,
                                    { month: "short", day: "numeric" },
                                )}{/if}
                        </p>
                    </div>
                    <button
                        onclick={(e) => {
                            if (task.status !== "completed") {
                                fire.ignite(e.clientX, e.clientY);
                            }
                            tasksStore.toggle(task.id);
                        }}
                        aria-label="Toggle task status"
                        class="w-5 h-5 rounded-full border-2 {task.status ===
                        'completed'
                            ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                            : 'border-[var(--color-line)]'} transition-all active:scale-90"
                    >
                        {#if task.status === "completed"}
                            <div
                                class="flex items-center justify-center w-full h-full"
                            >
                                <Check
                                    size={12}
                                    class="text-black"
                                    strokeWidth={3}
                                />
                            </div>
                        {/if}
                    </button>
                </div>
            {/each}
            {#if tasksStore.tasks.length === 0}
                <div
                    class="text-center py-8 text-[var(--color-muted)] text-sm font-medium italic"
                >
                    No tasks yet. Add one!
                </div>
            {/if}
        </div>
    </div>

    <QuickCapture bind:isOpen={showQuickCapture} />
</div>
