<script lang="ts">
    import {
        Flame,
        Check,
        Plus,
        Zap,
        Edit3,
        Target,
        Search,
        Activity,
        Utensils,
        Wallet,
        BookOpen,
        Calendar as CalendarIcon,
        Book,
        Trophy,
    } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { focusStore } from "$lib/stores/focus.svelte";
    import { fitnessStore } from "$lib/stores/fitness.svelte";
    import { nutritionStore } from "$lib/stores/nutrition.svelte";
    import { financeStore } from "$lib/stores/finance.svelte";
    import { goalsStore } from "$lib/stores/goals.svelte";
    import { libraryStore } from "$lib/stores/library.svelte";
    import { calendarStore } from "$lib/stores/calendar.svelte";
    import { journalStore } from "$lib/stores/journal.svelte";
    import { gamificationStore } from "$lib/stores/gamification.svelte";
    import { userStore } from "$lib/stores/user.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";
    import ConsistencyChart from "$lib/components/habits/ConsistencyChart.svelte";
    import StreakFire from "$lib/components/ui/StreakFire.svelte";
    import NumberTicker from "$lib/components/ui/NumberTicker.svelte";
    import { base } from "$app/paths";

    let showQuickCapture = $state(false);
    let fire: StreakFire;

    // Time-based greeting
    let now = new Date();
    let hour = now.getHours();
    let greeting = $derived.by(() => {
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    });

    let formattedDate = $derived(
        now.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
        }),
    );

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

    // Module specific derivations
    let nextEvent = $derived(
        calendarStore.events
            .filter(
                (e) =>
                    e.date === new Date().toISOString().split("T")[0] ||
                    new Date(e.date) > new Date(),
            )
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
            )[0],
    );

    let topGoal = $derived(goalsStore.activeGoals[0]);
    let currentBook = $derived(libraryStore.reading[0]);
</script>

<div class="page-container relative px-6 pb-36 overflow-x-hidden">
    <StreakFire bind:this={fire} />

    <!-- Subtle Premium Background Glow -->
    <div
        class="absolute -top-24 -left-20 w-64 h-64 bg-[var(--color-primary)]/5 blur-[120px] rounded-full pointer-events-none"
    ></div>
    <div
        class="absolute top-1/2 -right-20 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"
    ></div>

    <!-- Summary Row -->
    <div class="flex items-center justify-between mt-6 mb-10">
        <div class="space-y-1">
            <p
                class="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] opacity-80"
            >
                {formattedDate}
            </p>
            <h1
                class="text-2xl font-bold tracking-tight text-[var(--color-text)] leading-tight"
            >
                {greeting}, {userStore.currentUser?.displayName || "Explorer"}
            </h1>
        </div>
        <div class="flex items-center gap-5">
            <div class="flex flex-col items-end">
                <div
                    class="flex items-center gap-1.5 text-orange-500 font-bold"
                >
                    <Flame size={18} />
                    <NumberTicker value={maxStreak} />
                </div>
                <span
                    class="text-[7px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-60 mt-0.5"
                    >Streak</span
                >
            </div>
            <div
                class="flex flex-col items-end border-l border-[var(--color-line)]/50 pl-5"
            >
                <div class="text-[var(--color-primary)] font-bold text-lg">
                    <NumberTicker value={taskCompletionRate} />%
                </div>
                <span
                    class="text-[7px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-60 mt-0.5"
                    >Rate</span
                >
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-4 gap-4 mb-12">
        <button
            onclick={() => (showQuickCapture = true)}
            class="flex flex-col items-center gap-2.5 group"
        >
            <div
                class="w-full aspect-square rounded-2xl bg-[var(--color-primary)] text-black flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-[var(--color-primary)]/20"
            >
                <Plus size={22} strokeWidth={3} />
            </div>
            <span
                class="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)]"
                >Task</span
            >
        </button>
        <button
            onclick={() => (window.location.href = `${base}/habits`)}
            class="flex flex-col items-center gap-2.5 group"
        >
            <div
                class="w-full aspect-square rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 text-[var(--color-text)] flex items-center justify-center active:scale-90 transition-all shadow-sm"
            >
                <Check size={20} strokeWidth={2.5} />
            </div>
            <span
                class="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)]"
                >Habit</span
            >
        </button>
        <button
            onclick={() => focusStore.toggle()}
            class="flex flex-col items-center gap-2.5 group"
        >
            <div
                class="w-full aspect-square rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 text-[var(--color-text)] flex items-center justify-center active:scale-90 transition-all shadow-sm {focusStore.isRunning
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)] shadow-[var(--color-primary)]/10'
                    : ''}"
            >
                <Zap size={20} strokeWidth={2.5} />
            </div>
            <span
                class="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)]"
                >Focus</span
            >
        </button>
        <button
            onclick={() => (window.location.href = `${base}/notes`)}
            class="flex flex-col items-center gap-2.5 group"
        >
            <div
                class="w-full aspect-square rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 text-[var(--color-text)] flex items-center justify-center active:scale-90 transition-all shadow-sm"
            >
                <Edit3 size={20} strokeWidth={2.5} />
            </div>
            <span
                class="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)]"
                >Note</span
            >
        </button>
    </div>

    <!-- Focus Header (Minimal) -->
    {#if focusStore.isRunning || focusStore.timeLeft < 25 * 60}
        <div
            class="mb-12 px-5 py-4 rounded-2xl border border-[var(--color-line)]/50 bg-[var(--theme-surface)]/40 backdrop-blur-xl flex items-center justify-between shadow-xl shadow-black/5"
        >
            <div class="flex items-center gap-4">
                <div
                    class="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)] {focusStore.isRunning
                        ? 'animate-pulse shadow-[0_0_12px_var(--color-primary)]'
                        : ''}"
                ></div>
                <div class="flex flex-col">
                    <span
                        class="text-xs font-bold tracking-tight text-[var(--color-text)]"
                        >{focusStore.mode === "focus"
                            ? "Current Focus"
                            : "Rest Phase"}</span
                    >
                    <span
                        class="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)]"
                        >{focusStore.isRunning ? "Active" : "Paused"}</span
                    >
                </div>
            </div>
            <div class="flex items-center gap-5">
                <span
                    class="text-2xl font-mono font-bold text-[var(--color-text)] tracking-tighter"
                    >{focusStore.formattedTime}</span
                >
                <button
                    onclick={() => focusStore.toggle()}
                    class="w-8 h-8 rounded-full bg-[var(--color-line)]/50 flex items-center justify-center text-[var(--color-muted)] active:scale-90 transition-all"
                >
                    {#if focusStore.isRunning}<Plus
                            class="rotate-45"
                            size={18}
                        />{:else}<Zap size={18} />{/if}
                </button>
            </div>
        </div>
    {/if}

    <!-- Standardized List Blocks -->
    <div class="space-y-12">
        <!-- Habits -->
        <section class="space-y-5">
            <div
                class="flex items-center justify-between border-b border-[var(--color-line)]/50 pb-3"
            >
                <h2
                    class="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-muted)] opacity-70"
                >
                    Habit Mastery
                </h2>
                <div class="w-16 h-5">
                    <ConsistencyChart height="h-full" showLabels={false} />
                </div>
            </div>
            <div class="space-y-1.5">
                {#each habitsStore.habits.slice(0, 3) as habit}
                    {@const isCompleted = habitsStore.isCompleted(habit.id)}
                    <button
                        onclick={(e) => {
                            if (!isCompleted) fire.ignite(e.clientX, e.clientY);
                            habitsStore.toggle(habit.id);
                        }}
                        class="w-full flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-[var(--theme-surface)]/30 active:scale-[0.99] transition-all group"
                    >
                        <div
                            class="flex items-center gap-4 text-left overflow-hidden"
                        >
                            <div
                                class="w-6.5 h-6.5 rounded-lg border-2 {isCompleted
                                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                                    : 'border-[var(--color-line)]'} flex items-center justify-center transition-all shrink-0"
                            >
                                {#if isCompleted}<Check
                                        size={14}
                                        class="text-black"
                                        strokeWidth={3}
                                    />{/if}
                            </div>
                            <span
                                class="text-sm font-semibold truncate {isCompleted
                                    ? 'text-[var(--color-muted)] line-through'
                                    : 'text-[var(--color-text)]'}"
                            >
                                {habit.name}
                            </span>
                        </div>
                        <div class="flex flex-col items-end shrink-0">
                            <span
                                class="text-[9px] font-bold text-[var(--color-muted)]/60"
                                >Streak</span
                            >
                            <span
                                class="text-[10px] font-bold text-[var(--color-primary)]"
                                >{habit.streak}d</span
                            >
                        </div>
                    </button>
                {/each}
            </div>
        </section>

        <!-- Tasks -->
        <section class="space-y-5">
            <div
                class="flex items-center justify-between border-b border-[var(--color-line)]/50 pb-3"
            >
                <h2
                    class="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-muted)] opacity-70"
                >
                    Deep Work
                </h2>
                <button
                    onclick={() => (window.location.href = `${base}/tasks`)}
                    class="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest border border-[var(--color-primary)]/20 px-3 py-1 rounded-full bg-[var(--color-primary)]/5"
                    >View All</button
                >
            </div>
            <div class="space-y-1.5">
                {#each tasksStore.tasks.slice(0, 3) as task}
                    <div
                        class="w-full flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-[var(--theme-surface)]/30 transition-all group"
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
                                class="w-6.5 h-6.5 rounded-full border-2 {task.status ===
                                'completed'
                                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-[0_0_15px_rgba(0,255,157,0.2)]'
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
                                    class="text-sm font-semibold truncate {task.status ===
                                    'completed'
                                        ? 'text-[var(--color-muted)] line-through'
                                        : 'text-[var(--color-text)]'}"
                                >
                                    {task.title}
                                </span>
                                <span
                                    class="text-[9px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-60 truncate"
                                >
                                    {task.project}
                                </span>
                            </div>
                        </div>
                        {#if task.deadline}
                            <span
                                class="text-[9px] font-bold text-[var(--color-muted)] shrink-0 bg-[var(--color-line)]/30 border border-[var(--color-line)] px-2 py-0.5 rounded-md"
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
                        class="py-10 bg-[var(--theme-surface)]/20 rounded-2xl border border-dashed border-[var(--color-line)]/50 flex flex-col items-center justify-center gap-2 text-[var(--color-muted)]"
                    >
                        <span class="text-xs font-medium italic"
                            >Peace of mind attained.</span
                        >
                        <span
                            class="text-[9px] font-bold uppercase tracking-widest opacity-50"
                            >No pending tasks</span
                        >
                    </div>
                {/if}
            </div>
        </section>

        <!-- Module Insights -->
        <section class="space-y-6">
            <div
                class="flex items-center justify-between border-b border-[var(--color-line)]/50 pb-3"
            >
                <h2
                    class="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-muted)] opacity-70"
                >
                    System State
                </h2>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <!-- Fitness -->
                <button
                    onclick={() => (window.location.href = `${base}/fitness`)}
                    class="p-5 rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 flex flex-col gap-4 text-left active:scale-[0.97] transition-all shadow-lg shadow-black/5"
                >
                    <div class="flex items-center justify-between">
                        <div
                            class="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-[0_0_15px_rgba(0,255,157,0.1)]"
                        >
                            <Activity size={18} />
                        </div>
                        <span
                            class="text-[8px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-50"
                            >Fitness</span
                        >
                    </div>
                    <div>
                        <p
                            class="text-[15px] font-bold text-[var(--color-text)] tracking-tight"
                        >
                            {fitnessStore.stats.todaySteps.toLocaleString()}
                            <span
                                class="text-[10px] font-medium text-[var(--color-muted)]"
                                >steps</span
                            >
                        </p>
                        <div
                            class="w-full h-1.5 bg-[var(--color-line)]/30 rounded-full mt-3 overflow-hidden shadow-inner"
                        >
                            <div
                                class="h-full bg-[var(--color-primary)] transition-all relative overflow-hidden"
                                style="width: {Math.min(
                                    100,
                                    (fitnessStore.stats.todaySteps /
                                        fitnessStore.stats.stepGoal) *
                                        100,
                                )}%"
                            >
                                <div
                                    class="absolute inset-0 bg-white/20 animate-pulse"
                                ></div>
                            </div>
                        </div>
                    </div>
                </button>

                <!-- Nutrition -->
                <button
                    onclick={() => (window.location.href = `${base}/nutrition`)}
                    class="p-5 rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 flex flex-col gap-4 text-left active:scale-[0.97] transition-all shadow-lg shadow-black/5"
                >
                    <div class="flex items-center justify-between">
                        <div
                            class="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        >
                            <Utensils size={18} />
                        </div>
                        <span
                            class="text-[8px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-50"
                            >Nutrition</span
                        >
                    </div>
                    <div>
                        <p
                            class="text-[15px] font-bold text-[var(--color-text)] tracking-tight"
                        >
                            {nutritionStore.todayStats.calories}
                            <span
                                class="text-[10px] font-medium text-[var(--color-muted)]"
                                >/ {nutritionStore.goals.calories} kcal</span
                            >
                        </p>
                        <div
                            class="w-full h-1.5 bg-[var(--color-line)]/30 rounded-full mt-3 overflow-hidden shadow-inner"
                        >
                            <div
                                class="h-full bg-emerald-500 transition-all relative overflow-hidden"
                                style="width: {Math.min(
                                    100,
                                    (nutritionStore.todayStats.calories /
                                        nutritionStore.goals.calories) *
                                        100,
                                )}%"
                            >
                                <div
                                    class="absolute inset-0 bg-white/20 animate-pulse"
                                ></div>
                            </div>
                        </div>
                    </div>
                </button>

                <!-- Finance -->
                <button
                    onclick={() => (window.location.href = `${base}/finance`)}
                    class="p-5 rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 flex flex-col gap-4 text-left active:scale-[0.97] transition-all shadow-lg shadow-black/5"
                >
                    <div class="flex items-center justify-between">
                        <div
                            class="p-2 rounded-lg bg-blue-500/10 text-blue-500"
                        >
                            <Wallet size={18} />
                        </div>
                        <span
                            class="text-[8px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-50"
                            >Finance</span
                        >
                    </div>
                    <div>
                        <p
                            class="text-[17px] font-bold text-[var(--color-text)] tracking-tight"
                        >
                            ${financeStore.balance.toLocaleString()}
                        </p>
                        <p
                            class="text-[9px] font-bold text-[var(--color-muted)] mt-1.5 uppercase tracking-widest opacity-60"
                        >
                            Net Worth
                        </p>
                    </div>
                </button>

                <!-- Goals -->
                <button
                    onclick={() => (window.location.href = `${base}/goals`)}
                    class="p-5 rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 flex flex-col gap-4 text-left active:scale-[0.97] transition-all shadow-lg shadow-black/5"
                >
                    <div class="flex items-center justify-between">
                        <div
                            class="p-2 rounded-lg bg-purple-500/10 text-purple-500"
                        >
                            <Target size={18} />
                        </div>
                        <span
                            class="text-[8px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-50"
                            >Goals</span
                        >
                    </div>
                    <div>
                        {#if topGoal}
                            <div class="flex items-end gap-2">
                                <p
                                    class="text-[17px] font-bold text-[var(--color-text)] tracking-tight leading-none"
                                >
                                    {goalsStore.getGoalProgress(topGoal.id)}%
                                </p>
                                <span
                                    class="text-[8px] font-bold uppercase text-[var(--color-primary)] mb-0.5"
                                    >Progress</span
                                >
                            </div>
                            <p
                                class="text-[9px] font-bold text-[var(--color-muted)] mt-2 truncate uppercase tracking-widest opacity-60"
                            >
                                {topGoal.title}
                            </p>
                        {:else}
                            <p
                                class="text-sm font-bold text-[var(--color-muted)] italic"
                            >
                                No active goals
                            </p>
                        {/if}
                    </div>
                </button>

                <!-- Library -->
                <button
                    onclick={() => (window.location.href = `${base}/library`)}
                    class="p-5 rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 flex flex-col gap-4 text-left active:scale-[0.97] transition-all shadow-lg shadow-black/5"
                >
                    <div class="flex items-center justify-between">
                        <div
                            class="p-2 rounded-lg bg-orange-500/10 text-orange-500"
                        >
                            <BookOpen size={18} />
                        </div>
                        <span
                            class="text-[8px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-50"
                            >Library</span
                        >
                    </div>
                    <div>
                        {#if currentBook}
                            <p
                                class="text-xs font-bold text-[var(--color-text)] line-clamp-1 leading-normal"
                            >
                                {currentBook.title}
                            </p>
                            <p
                                class="text-[9px] font-bold text-[var(--color-muted)] mt-1.5 truncate uppercase tracking-widest opacity-60"
                            >
                                {currentBook.author}
                            </p>
                        {:else}
                            <p
                                class="text-sm font-bold text-[var(--color-muted)] italic"
                            >
                                Not reading
                            </p>
                        {/if}
                    </div>
                </button>

                <!-- Calendar -->
                <button
                    onclick={() => (window.location.href = `${base}/calendar`)}
                    class="p-5 rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 flex flex-col gap-4 text-left active:scale-[0.97] transition-all shadow-lg shadow-black/5"
                >
                    <div class="flex items-center justify-between">
                        <div
                            class="p-2 rounded-lg bg-rose-500/10 text-rose-500"
                        >
                            <CalendarIcon size={18} />
                        </div>
                        <span
                            class="text-[8px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-50"
                            >Calendar</span
                        >
                    </div>
                    <div>
                        {#if nextEvent}
                            <p
                                class="text-[14px] font-bold text-[var(--color-text)] tracking-tight"
                            >
                                {nextEvent.startTime || "All Day"}
                            </p>
                            <p
                                class="text-[9px] font-bold text-[var(--color-muted)] mt-1.5 truncate uppercase tracking-widest opacity-60"
                            >
                                {nextEvent.title}
                            </p>
                        {:else}
                            <p
                                class="text-sm font-bold text-[var(--color-muted)] italic"
                            >
                                No events
                            </p>
                        {/if}
                    </div>
                </button>

                <!-- Journal -->
                <button
                    onclick={() => (window.location.href = `${base}/journal`)}
                    class="p-5 rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 flex flex-col gap-4 text-left active:scale-[0.97] transition-all shadow-lg shadow-black/5"
                >
                    <div class="flex items-center justify-between">
                        <div
                            class="p-2 rounded-lg bg-cyan-500/10 text-cyan-500"
                        >
                            <Book size={18} />
                        </div>
                        <span
                            class="text-[8px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-50"
                            >Journal</span
                        >
                    </div>
                    <div>
                        {#if journalStore.entries.length > 0}
                            <p
                                class="text-xs font-bold text-[var(--color-text)] line-clamp-1 leading-normal"
                            >
                                {journalStore.entries[0].title}
                            </p>
                            <p
                                class="text-[9px] font-bold text-[var(--color-muted)] mt-1.5 truncate uppercase tracking-widest opacity-60"
                            >
                                Latest Entry
                            </p>
                        {:else}
                            <p
                                class="text-sm font-bold text-[var(--color-muted)] italic"
                            >
                                No entries
                            </p>
                        {/if}
                    </div>
                </button>

                <!-- Gamification -->
                <button
                    onclick={() =>
                        (window.location.href = `${base}/gamification`)}
                    class="p-5 rounded-2xl bg-[var(--theme-surface)]/40 backdrop-blur-xl border border-[var(--color-line)]/50 flex flex-col gap-4 text-left active:scale-[0.97] transition-all shadow-lg shadow-black/5"
                >
                    <div class="flex items-center justify-between">
                        <div
                            class="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"
                        >
                            <Trophy size={18} />
                        </div>
                        <span
                            class="text-[8px] font-bold uppercase tracking-widest text-[var(--color-muted)] opacity-50"
                            >Player</span
                        >
                    </div>
                    <div>
                        {#if gamificationStore.profile}
                            <div class="flex items-end gap-2">
                                <p
                                    class="text-[17px] font-bold text-[var(--color-text)] tracking-tight leading-none"
                                >
                                    Lvl {gamificationStore.profile.level}
                                </p>
                                <span
                                    class="text-[8px] font-bold uppercase text-yellow-500 mb-0.5"
                                    >{gamificationStore.profile.xp} XP</span
                                >
                            </div>
                            <div
                                class="w-full h-1.5 bg-[var(--color-line)]/30 rounded-full mt-3 overflow-hidden shadow-inner"
                            >
                                <div
                                    class="h-full bg-yellow-500 transition-all relative overflow-hidden"
                                    style="width: {gamificationStore.xpProgress}%"
                                >
                                    <div
                                        class="absolute inset-0 bg-white/20 animate-pulse"
                                    ></div>
                                </div>
                            </div>
                        {:else}
                            <p
                                class="text-sm font-bold text-[var(--color-muted)] italic"
                            >
                                No profile
                            </p>
                        {/if}
                    </div>
                </button>
            </div>
        </section>
    </div>

    <QuickCapture bind:isOpen={showQuickCapture} />
</div>
