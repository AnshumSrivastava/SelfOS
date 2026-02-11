<script lang="ts">
    import { currentUser } from "$lib/data/mockData";
    import {
        Plus,
        Target,
        TrendingUp,
        Calendar,
        Link as LinkIcon,
        Trash2,
        Edit,
        Check,
        X,
    } from "lucide-svelte";
    import { fly, scale, fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    const goals = $state(currentUser.data.goals);

    let showAddModal = $state(false);
    let selectedGoal = $state(null);

    // Category colors
    const categoryColors = {
        personal: "from-purple-500/20 to-purple-600/20",
        career: "from-blue-500/20 to-blue-600/20",
        health: "from-green-500/20 to-green-600/20",
        finance: "from-yellow-500/20 to-yellow-600/20",
        learning: "from-pink-500/20 to-pink-600/20",
        other: "from-gray-500/20 to-gray-600/20",
    };

    function getProgressColor(progress: number) {
        if (progress >= 75) return "text-green-400";
        if (progress >= 50) return "text-yellow-400";
        if (progress >= 25) return "text-orange-400";
        return "text-red-400";
    }
</script>

<svelte:head>
    <title>Goals | SelfOS</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-8">
    <!-- Header -->
    <header
        class="flex items-center justify-between mb-12"
        in:fly={{ y: -20, duration: 600, easing: cubicOut }}
    >
        <div class="flex items-center gap-4">
            <div class="p-3 rounded-2xl bg-primary/10">
                <Target size={32} class="text-primary" />
            </div>
            <div>
                <h1 class="text-4xl font-bold tracking-tight">Goals</h1>
                <p class="text-muted mt-1">
                    Track your progress and achieve your dreams
                </p>
            </div>
        </div>
        <button
            onclick={() => (showAddModal = true)}
            class="group flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-full font-medium hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-primary/20"
        >
            <Plus
                size={20}
                class="group-hover:rotate-90 transition-transform duration-300"
            />
            New Goal
        </button>
    </header>

    <!-- Stats Overview -->
    <section
        class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        in:fly={{ y: 20, duration: 600, easing: cubicOut, delay: 100 }}
    >
        <div class="stat-card p-6">
            <div class="flex items-center justify-between mb-4">
                <span class="text-sm text-muted">Active Goals</span>
                <TrendingUp size={16} class="text-green-400" />
            </div>
            <div class="text-4xl font-bold">
                {goals.filter((g) => !g.archived).length}
            </div>
        </div>
        <div class="stat-card p-6">
            <div class="flex items-center justify-between mb-4">
                <span class="text-sm text-muted">Avg Progress</span>
                <Target size={16} class="text-primary" />
            </div>
            <div class="text-4xl font-bold">
                {Math.round(
                    goals.reduce((sum, g) => sum + g.progress, 0) /
                        goals.length,
                )}%
            </div>
        </div>
        <div class="stat-card p-6">
            <div class="flex items-center justify-between mb-4">
                <span class="text-sm text-muted">Completed</span>
                <Check size={16} class="text-green-400" />
            </div>
            <div class="text-4xl font-bold">
                {goals.filter((g) => g.progress === 100).length}
            </div>
        </div>
    </section>

    <!-- Goals Grid -->
    <section class="space-y-6">
        {#each goals as goal, i}
            <div
                class="goal-card group"
                in:fly={{
                    y: 20,
                    duration: 500,
                    easing: cubicOut,
                    delay: 200 + i * 100,
                }}
            >
                <!-- Progress Ring -->
                <div class="flex-shrink-0">
                    <div class="relative w-24 h-24">
                        <!-- Background circle -->
                        <svg class="w-24 h-24 transform -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="rgba(255,255,255,0.1)"
                                stroke-width="8"
                                fill="none"
                            />
                            <!-- Progress circle -->
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                stroke-width="8"
                                fill="none"
                                class="{getProgressColor(
                                    goal.progress,
                                )} transition-all duration-1000"
                                stroke-dasharray={2 * Math.PI * 40}
                                stroke-dashoffset={2 *
                                    Math.PI *
                                    40 *
                                    (1 - goal.progress / 100)}
                                stroke-linecap="round"
                            />
                        </svg>
                        <!-- Percentage text -->
                        <div
                            class="absolute inset-0 flex items-center justify-center"
                        >
                            <span
                                class="text-lg font-bold {getProgressColor(
                                    goal.progress,
                                )}">{goal.progress}%</span
                            >
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <h3
                                class="text-xl font-bold group-hover:text-primary transition-colors"
                            >
                                {goal.title}
                            </h3>
                            {#if goal.description}
                                <p class="text-sm text-muted mt-1">
                                    {goal.description}
                                </p>
                            {/if}
                        </div>
                        <span
                            class="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r {categoryColors[
                                goal.category
                            ]} capitalize"
                        >
                            {goal.category}
                        </span>
                    </div>

                    <!-- Progress Bar -->
                    <div class="mb-4">
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-muted"
                                >{goal.current} / {goal.target}
                                {goal.unit}</span
                            >
                            {#if goal.deadline}
                                <span
                                    class="text-muted flex items-center gap-1"
                                >
                                    <Calendar size={14} />
                                    {goal.deadline.toLocaleDateString()}
                                </span>
                            {/if}
                        </div>
                        <div
                            class="h-2 bg-white/5 rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full {getProgressColor(
                                    goal.progress,
                                )} bg-current rounded-full transition-all duration-1000"
                                style="width: {goal.progress}%"
                            ></div>
                        </div>
                    </div>

                    <!-- Milestones -->
                    {#if goal.milestones.length > 0}
                        <div class="flex flex-wrap gap-2 mb-4">
                            {#each goal.milestones as milestone}
                                <div
                                    class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
                                >
                                    <div
                                        class="w-4 h-4 rounded border-2 {milestone.completed
                                            ? 'bg-primary border-primary'
                                            : 'border-white/20'} flex items-center justify-center"
                                    >
                                        {#if milestone.completed}
                                            <Check
                                                size={10}
                                                class="text-black"
                                            />
                                        {/if}
                                    </div>
                                    <span
                                        class={milestone.completed
                                            ? "text-muted line-through"
                                            : "text-white"}
                                        >{milestone.title}</span
                                    >
                                </div>
                            {/each}
                        </div>
                    {/if}

                    <!-- Actions -->
                    <div
                        class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <button
                            class="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <Edit
                                size={16}
                                class="text-muted hover:text-white transition-colors"
                            />
                        </button>
                        <button
                            class="p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <LinkIcon
                                size={16}
                                class="text-muted hover:text-white transition-colors"
                            />
                        </button>
                        <button
                            class="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2
                                size={16}
                                class="text-muted hover:text-red-400 transition-colors"
                            />
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </section>
</div>

<style>
    .stat-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 1rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }

    .goal-card {
        display: flex;
        gap: 2rem;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 1.5rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .goal-card:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }
</style>
