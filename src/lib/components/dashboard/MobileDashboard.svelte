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

<div class="space-y-6 pb-20 relative">
    <StreakFire bind:this={fire} />
    <!-- Greeting & Status -->
    <div class="space-y-1 mt-2">
        <h1 class="text-3xl font-light tracking-tight text-white">
            Good Morning
        </h1>
        <p class="text-gray-500">You have {activeTasks} priorities today.</p>
    </div>

    <!-- Main Focus Card -->
    <div class=" p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <span
            class="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium mb-4 inline-block"
            >Deep Work</span
        >
        <div class="flex items-end justify-between">
            <div>
                <h2 class="text-3xl font-bold text-white">45m</h2>
                <p class="text-gray-400 text-sm mt-1">Remaining today</p>
            </div>
            <button
                onclick={() => (showQuickCapture = true)}
                class="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
                <Plus size={24} />
            </button>
        </div>
    </div>

    <!-- Quick Stats Row -->
    <div class="grid grid-cols-2 gap-4">
        <div
            class="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex flex-col justify-between h-32"
        >
            <Flame class="text-orange-500" size={24} />
            <div>
                <span class="text-2xl font-bold text-white block"
                    ><NumberTicker value={maxStreak} /></span
                >
                <span class="text-xs text-gray-500">Day Streak</span>
            </div>
        </div>
        <div
            class="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex flex-col justify-between h-32"
        >
            <div class="text-emerald-500 text-lg font-bold">
                <NumberTicker value={taskCompletionRate} />%
            </div>
            <div>
                <span class="text-2xl font-bold text-white block"
                    >{completedTasks}/{totalTasksStr}</span
                >
                <span class="text-xs text-gray-500">Tasks Done</span>
            </div>
        </div>
    </div>

    <!-- Habits Section -->
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-white">Habits</h3>
            <span class="text-xs text-gray-500"
                >{completedHabits}/{habitsStore.totalCount} Complete</span
            >
        </div>

        <!-- Consistency Graph -->
        <div
            class="px-4 py-4 bg-[#0A0A0A] rounded-2xl border border-neutral-900 mb-2"
        >
            <ConsistencyChart height="h-24" showLabels={false} />
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
                    class="w-full p-4 rounded-xl bg-[#0A0A0A] border border-neutral-900 flex items-center justify-between group active:scale-[0.99] transition-all"
                >
                    <span
                        class="text-sm font-medium {isCompleted
                            ? 'text-gray-500 line-through'
                            : 'text-white'}">{habit.name}</span
                    >
                    <div
                        class="w-6 h-6 rounded-full border-2 {isCompleted
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-neutral-700'} flex items-center justify-center transition-colors"
                    >
                        {#if isCompleted}
                            <Check
                                size={14}
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
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-white">Tasks</h3>
            <button class="text-xs text-gray-400">View All</button>
        </div>

        <div class="space-y-2">
            {#each tasksStore.tasks.slice(0, 3) as task}
                <div
                    class="w-full p-4 rounded-xl bg-[#0A0A0A] border border-neutral-900 flex items-center justify-between"
                >
                    <div class="flex flex-col items-start text-left">
                        <p
                            class="text-white text-sm font-medium {task.completed
                                ? 'line-through text-gray-500'
                                : ''}"
                        >
                            {task.title}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                            {task.tag} • {task.due}
                        </p>
                    </div>
                    <button
                        onclick={(e) => {
                            if (!task.completed) {
                                fire.ignite(e.clientX, e.clientY);
                            }
                            tasksStore.toggle(task.id);
                        }}
                        aria-label="Toggle task status"
                        class="w-4 h-4 rounded-full border-2 {task.completed
                            ? 'bg-red-500 border-red-500'
                            : 'border-neutral-700'}"
                    ></button>
                </div>
            {/each}
            {#if tasksStore.tasks.length === 0}
                <div class="text-center py-4 text-gray-500 text-sm">
                    No tasks yet. Add one!
                </div>
            {/if}
        </div>
    </div>

    <QuickCapture bind:isOpen={showQuickCapture} />
</div>
