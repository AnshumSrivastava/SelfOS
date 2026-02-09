<script lang="ts">
    import WelcomeWidget from "$lib/components/dashboard/WelcomeWidget.svelte";
    import StatCard from "$lib/components/ui/StatCard.svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { financeStore } from "$lib/stores/finance.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";
    import {
        Activity,
        Wallet,
        CheckSquare,
        Flame,
        Clock,
        Calendar,
        Check,
        Plus,
    } from "lucide-svelte";

    let showQuickCapture = $state(false);

    // Derived stats
    let totalHabits = $derived(habitsStore.totalCount);
    let completedHabits = $derived(habitsStore.completedCount);
    let activeTasks = $derived(tasksStore.activeCount);
    let completedTasks = $derived(tasksStore.completedCount);
    let maxStreak = $derived(
        Math.max(0, ...habitsStore.habits.map((h) => h.streak)),
    );
</script>

<div class="space-y-8 relative">
    <!-- Quick Capture Modal -->
    <QuickCapture bind:isOpen={showQuickCapture} />

    <!-- Welcome Section -->
    <div class="flex items-center justify-between">
        <WelcomeWidget />
        <button
            onclick={() => (showQuickCapture = true)}
            class="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary text-black shadow-lg hover:scale-105 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
            title="Habit Streak"
            value="{maxStreak} Days"
            icon={Flame}
            trend={10}
            subtext="Best: 24 days"
        />
        <StatCard
            title="Net Worth"
            value="₹{financeStore.balance}"
            icon={Wallet}
            trend={2.5}
            color="secondary"
        />
        <StatCard
            title="Tasks Done"
            value="{completedTasks}/{tasksStore.tasks.length}"
            icon={CheckSquare}
            trend={-5}
        />
        <StatCard
            title="Deep Work"
            value="4.5h"
            icon={Clock}
            trend={15}
            color="secondary"
        />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Focus Area -->
        <div class="lg:col-span-2 space-y-6">
            <div class="card min-h-[400px]">
                <div class="flex justify-between items-center mb-6">
                    <h2
                        class="text-xl font-bold text-white flex items-center gap-2"
                    >
                        <Activity class="text-primary" />
                        Activity Overview
                    </h2>
                    <select
                        class="bg-background border border-line rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-primary"
                    >
                        <option>This Week</option>
                        <option>This Month</option>
                    </select>
                </div>

                <div class="h-64 flex items-end gap-4 px-2">
                    <!-- Placeholder Chart Bars -->
                    {#each Array(7) as _, i}
                        <div
                            class="flex-1 flex flex-col justify-end gap-2 group cursor-pointer"
                        >
                            <div
                                class="w-full bg-surface rounded-t-lg relative h-full overflow-hidden"
                            >
                                <div
                                    class="absolute bottom-0 w-full bg-primary/20 group-hover:bg-primary/40 transition-all duration-300 rounded-t-lg"
                                    style="height: {Math.random() * 80 + 20}%"
                                ></div>
                            </div>
                            <span class="text-center text-xs text-muted"
                                >Thinking...</span
                            >
                        </div>
                    {/each}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    class="card hover:border-primary/50 transition-colors cursor-pointer group"
                >
                    <h3
                        class="font-bold text-lg mb-4 text-white group-hover:text-primary transition-colors"
                    >
                        Today's Habits
                    </h3>
                    <div class="space-y-4">
                        {#each habitsStore.habits.slice(0, 4) as habit}
                            {@const isCompleted = habitsStore.isCompleted(
                                habit.id,
                            )}
                            <button
                                onclick={() => habitsStore.toggle(habit.id)}
                                class="flex items-center gap-3 w-full text-left"
                            >
                                <div
                                    class="w-5 h-5 rounded border border-line group-hover/item:border-primary flex items-center justify-center cursor-pointer transition-colors bg-surface {isCompleted
                                        ? 'bg-primary border-primary'
                                        : ''}"
                                >
                                    {#if isCompleted}<Check
                                            size={14}
                                            class="text-black"
                                        />{/if}
                                </div>
                                <span
                                    class="text-sm font-medium transition-colors {isCompleted
                                        ? 'text-muted line-through'
                                        : 'text-white'}">{habit.name}</span
                                >
                            </button>
                        {/each}
                    </div>
                </div>

                <div
                    class="card hover:border-primary/50 transition-colors cursor-pointer group"
                >
                    <h3
                        class="font-bold text-lg mb-4 text-white group-hover:text-primary transition-colors"
                    >
                        Upcoming Tasks
                    </h3>
                    <div class="space-y-3">
                        {#each tasksStore.tasks.slice(0, 3) as task}
                            <button
                                onclick={() => tasksStore.toggle(task.id)}
                                class="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors w-full text-left"
                            >
                                <div>
                                    <p
                                        class="text-sm font-medium transition-colors {task.completed
                                            ? 'text-muted line-through'
                                            : 'text-white'}"
                                    >
                                        {task.title}
                                    </p>
                                    <p class="text-xs text-muted">
                                        {task.due}
                                    </p>
                                </div>
                                <span
                                    class="text-xs px-2 py-1 rounded bg-surface border border-line"
                                    >{task.tag}</span
                                >
                            </button>
                        {/each}
                        {#if tasksStore.tasks.length === 0}
                            <div class="text-sm text-muted text-center py-4">
                                No tasks pending
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <!-- Side Panel / Quick Access -->
        <div class="space-y-6">
            <div class="card bg-surface border-primary/20">
                <h3 class="font-bold text-white mb-4">Daily Progress</h3>
                <div class="space-y-6">
                    <ProgressBar label="Tasks Completed" value={8} max={12} />
                    <ProgressBar
                        label="Water Intake"
                        value={1500}
                        max={2500}
                        color="secondary"
                    />
                    <ProgressBar
                        label="Calorie Goal"
                        value={1200}
                        max={2200}
                        color="primary"
                    />
                </div>
            </div>

            <div class="card relative overflow-hidden">
                <div class="absolute top-0 right-0 p-4 opacity-10">
                    <Calendar size={120} />
                </div>
                <h3 class="font-bold text-white mb-2">Upcoming Events</h3>
                <div class="relative z-10 space-y-4">
                    <div class="border-l-2 border-primary pl-4 py-1">
                        <p class="font-bold text-white">Team Meeting</p>
                        <p class="text-xs text-muted">10:00 AM - 11:30 AM</p>
                    </div>
                    <div class="border-l-2 border-secondary pl-4 py-1">
                        <p class="font-bold text-white">Dentist Appt</p>
                        <p class="text-xs text-muted">Tomorrow, 3:00 PM</p>
                    </div>
                    <button
                        class="w-full btn border border-line hover:bg-white/5 mt-2 text-sm text-muted"
                    >
                        View Calendar
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
