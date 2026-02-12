<script lang="ts">
    import {
        Check,
        Flame,
        Trophy,
        Plus,
        Trash2,
        X,
        TrendingUp,
        AlertTriangle,
        Target,
        Award,
    } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { scale, fade } from "svelte/transition";
    import ConsistencyChart from "./ConsistencyChart.svelte";
    import StreakFire from "$lib/components/ui/StreakFire.svelte";

    let todayProgress = $derived(
        (habitsStore.completedCount / (habitsStore.totalCount || 1)) * 100 || 0,
    );

    const today = new Date();

    let isAdding = $state(false);
    let newHabitName = $state("");

    // Calculate insights
    let insights = $derived.by(() => {
        const maxStreak = Math.max(
            0,
            ...habitsStore.habits.map((h) => h.streak),
        );
        const atRisk = habitsStore.habits.filter(
            (h) => h.streak >= 3 && !habitsStore.isCompleted(h.id),
        ).length;
        const champions = habitsStore.habits.filter(
            (h) => h.streak >= 7,
        ).length;

        return { maxStreak, atRisk, champions };
    });

    // Enhanced habits with status
    let enhancedHabits = $derived.by(() => {
        return habitsStore.habits.map((habit) => {
            const isCompleted = habitsStore.isCompleted(habit.id);
            let status = "normal";
            let statusMessage = "";
            let statusColor = "";

            if (habit.streak >= 21) {
                status = "champion";
                statusMessage = "Champion!";
                statusColor = "text-purple-400";
            } else if (habit.streak >= 7) {
                status = "strong";
                statusMessage = "Strong Streak";
                statusColor = "text-green-400";
            } else if (habit.streak >= 3 && !isCompleted) {
                status = "at-risk";
                statusMessage = "At Risk!";
                statusColor = "text-orange-400";
            }

            return {
                ...habit,
                isCompleted,
                status,
                statusMessage,
                statusColor,
            };
        });
    });

    function addHabit() {
        if (newHabitName.trim()) {
            habitsStore.add(newHabitName.trim());
            newHabitName = "";
            isAdding = false;
        }
    }

    let fire: StreakFire;
</script>

<div class="page-container relative">
    <StreakFire bind:this={fire} />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Main Column: Habits -->
        <div class="lg:col-span-2 space-y-10">
            <div class="module-header mb-8">
                <div>
                    <h1
                        class="text-3xl font-light text-white flex items-center gap-3"
                    >
                        {today.toLocaleDateString("en-US", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                        })}
                        <span
                            class="text-lg font-normal text-muted px-3 py-1 rounded-full border border-line bg-background"
                            >Week {Math.ceil(
                                (today.getDate() + 6 - today.getDay()) / 7,
                            )}</span
                        >
                    </h1>
                    <p class="text-muted">
                        {todayProgress === 100
                            ? "Perfect day! All habits completed 🎉"
                            : todayProgress >= 70
                              ? "Great progress! Keep it up 💪"
                              : "Let's build those habits today!"}
                    </p>
                </div>

                <button
                    onclick={() => (isAdding = true)}
                    class="btn btn-primary flex items-center gap-2"
                >
                    <Plus size={18} /> New Habit
                </button>
            </div>

            <!-- Habits Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each enhancedHabits as habit (habit.id)}
                    <div
                        class="card-subtle group hover:border-primary transition-all relative overflow-hidden text-left {habit.status ===
                        'at-risk'
                            ? 'border-orange-500/30'
                            : habit.status === 'champion'
                              ? 'border-purple-500/30'
                              : ''}"
                    >
                        <div
                            class="flex justify-between items-start mb-4 relative z-10"
                        >
                            <button
                                onclick={(e) => {
                                    if (!habit.isCompleted) {
                                        fire.ignite(e.clientX, e.clientY);
                                    }
                                    habitsStore.toggle(habit.id);
                                }}
                                class="text-left flex-1"
                            >
                                <h3
                                    class="font-bold text-lg text-white group-hover:text-primary transition-colors mb-2"
                                >
                                    {habit.name}
                                </h3>
                                {#if habit.statusMessage}
                                    <span
                                        class="text-xs px-2 py-0.5 rounded-full bg-current/10 {habit.statusColor} font-medium"
                                    >
                                        {habit.statusMessage}
                                    </span>
                                {:else}
                                    <span
                                        class="text-xs text-muted border border-line px-2 py-0.5 rounded-full"
                                        >Daily</span
                                    >
                                {/if}
                            </button>
                            <div class="flex gap-2 items-center">
                                <button
                                    onclick={(e) => {
                                        e.stopPropagation();
                                        habitsStore.remove(habit.id);
                                    }}
                                    class="w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted hover:text-red-500 hover:border-red-500 transition-colors bg-surface opacity-0 group-hover:opacity-100"
                                    title="Delete Habit"
                                >
                                    <Trash2 size={14} />
                                </button>
                                <button
                                    onclick={(e) => {
                                        if (!habit.isCompleted) {
                                            fire.ignite(e.clientX, e.clientY);
                                        }
                                        habitsStore.toggle(habit.id);
                                    }}
                                    class="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all {habit.isCompleted
                                        ? 'bg-primary border-primary text-black scale-110'
                                        : 'border-line hover:border-primary bg-surface hover:scale-105'}"
                                >
                                    {#if habit.isCompleted}<Check
                                            size={18}
                                        />{/if}
                                </button>
                            </div>
                        </div>

                        <div
                            class="relative z-10 pt-4 border-t border-line/50 mt-4 flex items-center justify-between"
                        >
                            <div class="flex items-center gap-2">
                                <div
                                    class="flex items-center gap-1 text-sm {habit.isCompleted
                                        ? 'text-primary'
                                        : 'text-muted'}"
                                >
                                    <Flame
                                        size={16}
                                        class={habit.isCompleted
                                            ? "text-orange-500"
                                            : habit.status === "at-risk"
                                              ? "text-orange-400"
                                              : "text-muted"}
                                    />
                                    <span class="font-semibold"
                                        >{habit.streak}</span
                                    >
                                    <span class="text-xs">days</span>
                                </div>
                            </div>
                            {#if habit.streak >= 21}
                                <Trophy size={16} class="text-purple-400" />
                            {:else if habit.streak >= 7}
                                <Trophy size={16} class="text-yellow-500" />
                            {:else if habit.status === "at-risk"}
                                <AlertTriangle
                                    size={16}
                                    class="text-orange-400"
                                />
                            {/if}
                        </div>

                        <!-- Background Effects -->
                        {#if habit.isCompleted}
                            <div
                                class="absolute bottom-0 left-0 w-full h-1 bg-primary"
                            ></div>
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"
                            ></div>
                        {:else if habit.status === "at-risk"}
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"
                            ></div>
                        {:else if habit.status === "champion"}
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none"
                            ></div>
                        {/if}
                    </div>
                {/each}

                {#if habitsStore.habits.length === 0}
                    <div
                        class="col-span-full text-center py-12 text-muted card border-dashed"
                    >
                        <Flame size={48} class="mx-auto mb-4 opacity-50" />
                        <p class="text-lg font-medium mb-2">No habits yet</p>
                        <p class="text-sm mb-4">
                            Start building positive habits to track your
                            progress
                        </p>
                        <button
                            onclick={() => (isAdding = true)}
                            class="btn btn-primary"
                        >
                            <Plus size={18} /> Create Your First Habit
                        </button>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Sidebar Column: Stats & Graph -->
        <div class="space-y-10">
            <!-- Insights Bar (Now a vertical stack) -->
            <div class="space-y-6">
                <div
                    class="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20"
                >
                    <div class="flex items-center gap-2 mb-1">
                        <Flame size={16} class="text-primary" />
                        <span class="text-sm font-medium text-primary"
                            >Best Streak</span
                        >
                    </div>
                    <p class="text-2xl font-bold text-white">
                        {insights.maxStreak}
                    </p>
                    <p class="text-xs text-muted mt-1">
                        {insights.maxStreak >= 21
                            ? "Legendary!"
                            : insights.maxStreak >= 7
                              ? "Excellent momentum"
                              : "Keep building"}
                    </p>
                </div>

                {#if insights.atRisk > 0}
                    <div
                        class="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20"
                    >
                        <div class="flex items-center gap-2 mb-1">
                            <AlertTriangle size={16} class="text-orange-400" />
                            <span class="text-sm font-medium text-orange-400"
                                >At Risk</span
                            >
                        </div>
                        <p class="text-2xl font-bold text-white">
                            {insights.atRisk}
                        </p>
                        <p class="text-xs text-muted mt-1">
                            Complete today to protect your streaks
                        </p>
                    </div>
                {/if}

                {#if insights.champions > 0}
                    <div
                        class="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20"
                    >
                        <div class="flex items-center gap-2 mb-1">
                            <Award size={16} class="text-purple-400" />
                            <span class="text-sm font-medium text-purple-400"
                                >Champions</span
                            >
                        </div>
                        <p class="text-2xl font-bold text-white">
                            {insights.champions}
                        </p>
                        <p class="text-xs text-muted mt-1">7+ day streaks</p>
                    </div>
                {/if}

                <div
                    class="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20"
                >
                    <div class="flex items-center gap-2 mb-1">
                        <Target size={16} class="text-green-400" />
                        <span class="text-sm font-medium text-green-400"
                            >Today's Progress</span
                        >
                    </div>
                    <p class="text-2xl font-bold text-white">
                        {Math.round(todayProgress)}%
                    </p>
                    <p class="text-xs text-muted mt-1">
                        {habitsStore.completedCount}/{habitsStore.totalCount} completed
                    </p>
                </div>
            </div>

            <!-- Consistency Graph -->
            <div class="card-subtle">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-white">Consistency</h3>
                    <div class="flex items-center gap-2 text-sm text-muted">
                        <TrendingUp size={16} class="text-emerald-400" />
                    </div>
                </div>

                <ConsistencyChart height="h-40" />
            </div>
        </div>
    </div>
</div>

{#if isAdding}
    <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        transition:fade={{ duration: 200 }}
        onclick={() => (isAdding = false)}
    >
        <div
            class="card-subtle w-full max-w-md shadow-2xl"
            transition:scale={{ duration: 200, start: 0.95 }}
            onclick={(e) => e.stopPropagation()}
        >
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-white">New Habit</h3>
                <button
                    onclick={() => (isAdding = false)}
                    class="text-muted hover:text-[var(--color-text)] transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <input
                type="text"
                bind:value={newHabitName}
                placeholder="What habit do you want to build?"
                class="input w-full mb-6"
                onkeydown={(e) => e.key === "Enter" && addHabit()}
                autofocus
            />

            <div class="flex gap-3 justify-end">
                <button
                    onclick={() => (isAdding = false)}
                    class="btn btn-ghost"
                >
                    Cancel
                </button>
                <button
                    onclick={addHabit}
                    disabled={!newHabitName.trim()}
                    class="btn btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create Habit
                </button>
            </div>
        </div>
    </div>
{/if}
