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
        Loader2,
    } from "lucide-svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { fade, scale } from "svelte/transition";
    import ConsistencyChart from "./ConsistencyChart.svelte";
    import StreakFire from "$lib/components/ui/StreakFire.svelte";
    import { settings } from "$lib/stores/settings.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import HistoryGrid from "./HistoryGrid.svelte";

    const isMinimal = $derived(settings.theme === "minimal");

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

    const stats = $derived([
        {
            label: "Best Streak",
            value: insights.maxStreak,
            icon: Flame,
            color: "text-orange-400",
        },
        {
            label: "At Risk",
            value: insights.atRisk,
            icon: AlertTriangle,
            color: "text-red-400",
        },
        {
            label: "Champions",
            value: insights.champions,
            icon: Award,
            color: "text-purple-400",
        },
        {
            label: "Completion",
            value: `${Math.round(todayProgress)}%`,
            icon: Target,
            color: "text-primary",
        },
    ]);
</script>

{#if habitsStore.status === "saving" || habitsStore.status === "success"}
    <div
        style="animation: premiumEnter 0.6s var(--easing-premium)"
        class="fixed top-24 right-8 z-[100] px-4 py-2 rounded-2xl border backdrop-blur-xl flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 {habitsStore.status ===
        'saving'
            ? 'bg-white/5 border-white/10 text-white/70'
            : 'bg-primary/10 border-primary/20 text-primary'}"
    >
        {#if habitsStore.status === "saving"}
            <Loader2 size={14} class="animate-spin opacity-50" />
            <span class="text-[10px] font-bold uppercase tracking-[0.2em]"
                >Synchronizing</span
            >
        {:else}
            <Check size={14} class="text-primary" />
            <span class="text-[10px] font-bold uppercase tracking-[0.2em]"
                >Stable</span
            >
        {/if}
    </div>
{/if}

<div class="page-container relative max-w-7xl mx-auto px-4 py-8">
    <StreakFire bind:this={fire} />

    <!-- Hero Header -->
    <div
        class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
    >
        <div class="space-y-2">
            <h1 class="text-5xl font-light tracking-tight text-white mb-2">
                {today.toLocaleDateString("en-US", { weekday: "long" })}
                <span class="text-primary opacity-50">.</span>
            </h1>
            <div class="flex items-center gap-4 text-muted text-sm">
                <span class="flex items-center gap-2">
                    <Check size={14} class="text-primary" />
                    {habitsStore.completedCount} of {habitsStore.totalCount} completed
                </span>
                <span class="w-1 h-1 rounded-full bg-line"></span>
                <span
                    >{today.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                    })}</span
                >
            </div>
        </div>

        <button
            onclick={() => (isAdding = true)}
            class="btn btn-primary flex items-center gap-2 px-8 py-3"
        >
            <Plus size={18} />
            <span class="text-xs uppercase tracking-widest font-bold"
                >New Habit</span
            >
        </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Main Content: Habits List (8 cols) -->
        <div class="lg:col-span-8 space-y-6">
            {#if habitsStore.loading}
                <div class="grid grid-cols-1 gap-4">
                    <SkeletonLoader lines={1} height="h-32" />
                    <SkeletonLoader lines={1} height="h-32" />
                </div>
            {:else if enhancedHabits.length === 0}
                <div
                    class="card-subtle flex flex-col items-center justify-center py-24 text-center border-dashed border-2"
                >
                    <div
                        class="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center mb-6 text-muted"
                    >
                        <Flame size={32} />
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">
                        Build New Rituals
                    </h3>
                    <p class="text-muted max-w-xs mx-auto mb-8">
                        The secret of your future is hidden in your daily
                        routine. Start tracking your first habit.
                    </p>
                    <button
                        onclick={() => (isAdding = true)}
                        class="btn btn-primary px-8"
                    >
                        Create Your First Habit
                    </button>
                </div>
            {:else}
                <div class="grid grid-cols-1 gap-[var(--space-2)]">
                    {#each enhancedHabits as habit (habit.id)}
                        <div
                            class="group relative card-subtle overflow-hidden !p-5 transition-all duration-500 hover:!bg-white/2 {habit.isCompleted
                                ? 'border-primary/20 bg-primary/5'
                                : ''}"
                            style="border-radius: var(--radius-subtle)"
                        >
                            <div class="flex items-center gap-5">
                                <!-- Check Button -->
                                <button
                                    onclick={(e) => {
                                        if (!habit.isCompleted)
                                            fire.ignite(e.clientX, e.clientY);
                                        habitsStore.toggle(habit.id);
                                    }}
                                    class="relative w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-95 {habit.isCompleted
                                        ? 'bg-primary border-primary text-black shadow-[0_4px_15px_rgba(var(--primary-rgb),0.3)]'
                                        : 'border-line hover:border-primary/50 text-muted hover:text-primary'}"
                                >
                                    {#if habit.isCompleted}
                                        <Check size={20} strokeWidth={3} />
                                    {:else}
                                        <Plus size={20} class="opacity-40" />
                                    {/if}
                                </button>

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-3 mb-1.5">
                                        <h3
                                            class="text-lg font-medium text-text truncate {habit.isCompleted
                                                ? 'opacity-40 italic'
                                                : ''}"
                                        >
                                            {habit.name}
                                        </h3>
                                        {#if habit.statusMessage}
                                            <span
                                                class="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full {habit.statusColor} bg-white/5 border border-current/10"
                                            >
                                                {habit.statusMessage}
                                            </span>
                                        {/if}
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="flex items-center gap-1.5 {habit.isCompleted
                                                ? 'text-primary/70'
                                                : 'text-muted'}"
                                        >
                                            <Flame
                                                size={12}
                                                class={habit.streak > 0
                                                    ? "text-orange-400"
                                                    : "text-muted opacity-30"}
                                            />
                                            <span
                                                class="text-xs font-bold leading-none"
                                                >{habit.streak}</span
                                            >
                                            <span
                                                class="text-[9px] uppercase tracking-widest font-bold opacity-50 ml-0.5"
                                                >streak</span
                                            >
                                        </div>
                                        {#if habit.streak >= 7 && !habit.isCompleted}
                                            <div
                                                class="flex items-center gap-1.5 text-red-400/80"
                                            >
                                                <AlertTriangle size={12} />
                                                <span
                                                    class="text-[9px] uppercase tracking-widest font-bold"
                                                    >At Risk</span
                                                >
                                            </div>
                                        {/if}
                                    </div>
                                </div>

                                <div class="flex items-center gap-2">
                                    <button
                                        onclick={() =>
                                            habitsStore.remove(habit.id)}
                                        class="p-2 text-muted hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <!-- Success indicator -->
                            {#if habit.isCompleted}
                                <div
                                    class="absolute bottom-0 left-0 h-0.5 bg-primary/30"
                                    style="width: 100%"
                                ></div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Sidebar: Stats & Insights (4 cols) -->
        <div class="lg:col-span-4 space-y-8">
            <!-- Performance Dashboard -->
            <div
                class="card-subtle flex flex-col !p-6"
                style="border-radius: var(--card-radius)"
            >
                <h3 class="text-white mb-8 flex items-center gap-3">
                    <div class="w-1 h-5 bg-primary rounded-full"></div>
                     Performance
                </h3>

                <div class="grid grid-cols-2 gap-[var(--space-2)]">
                    {#each stats as stat}
                        <div
                            class="p-4 rounded-[var(--radius-subtle)] bg-white/3 border border-white/5 transition-all hover:border-primary/20"
                        >
                            <stat.icon
                                size={14}
                                class="{stat.color} mb-3 opacity-70"
                            />
                            <div class="text-2xl font-light text-text">
                                {stat.value}
                            </div>
                            <div
                                class="text-[9px] uppercase tracking-widest text-muted font-bold mt-1"
                            >
                                {stat.label}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Heatmap -->
            <div class="card-subtle">
                <HistoryGrid weeks={10} />
            </div>

            <!-- Summary Chart -->
            <div class="card-subtle">
                <div class="flex justify-between items-center mb-6">
                    <h3
                        class="text-xs font-bold uppercase tracking-widest text-muted"
                    >
                        7-Day Consistency
                    </h3>
                    <div
                        class="flex items-center gap-1 text-[10px] text-primary font-bold"
                    >
                        <TrendingUp size={12} />
                        ACTIVE
                    </div>
                </div>
                <ConsistencyChart height="h-32" />
            </div>
        </div>
    </div>
</div>

{#if isAdding}
    <div
        class="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
        transition:fade={{ duration: 300 }}
        onclick={() => (isAdding = false)}
        onkeydown={(e) => e.key === "Escape" && (isAdding = false)}
        role="button"
        tabindex="0"
    >
        <div
            class="w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 shadow-2xl"
            transition:scale={{ duration: 400, start: 0.9, opacity: 0 }}
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
        >
            <div class="flex justify-between items-start mb-8">
                <div>
                    <h2 class="text-3xl font-bold text-white mb-2">
                        New Ritual
                    </h2>
                    <p class="text-muted">
                        What new behavior are you committing to today?
                    </p>
                </div>
                <button
                    onclick={() => (isAdding = false)}
                    class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            <div class="space-y-6">
                <div class="relative">
                    <input
                        type="text"
                        bind:value={newHabitName}
                        placeholder="Enter habit name..."
                        class="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        onkeydown={(e) => e.key === "Enter" && addHabit()}
                    />
                </div>

                <div class="flex flex-wrap gap-2">
                    {#each ["Drink Water", "Meditation", "Read 10 pages", "Workout", "Early Wakeup"] as suggestion}
                        <button
                            onclick={() => (newHabitName = suggestion)}
                            class="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                        >
                            {suggestion}
                        </button>
                    {/each}
                </div>

                <div class="flex gap-4 pt-4">
                    <button
                        onclick={() => (isAdding = false)}
                        class="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
                    >
                        Maybe Later
                    </button>
                    <button
                        onclick={addHabit}
                        disabled={!newHabitName.trim()}
                        class="flex-[2] py-4 bg-primary text-black rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                    >
                        Begin Streak
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    /* Custom spacing for the page container to align with premium look */
    .page-container {
        animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
