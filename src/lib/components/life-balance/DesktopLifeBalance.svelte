<script lang="ts">
    import {
        Heart,
        Users,
        Gamepad2,
        Sparkles,
        Plus,
        CheckSquare,
    } from "lucide-svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";

    // Categories
    const categories = [
        {
            id: "health",
            name: "Health",
            icon: Heart,
            color: "text-red-500",
            bg: "bg-red-500",
        },
        {
            id: "family",
            name: "Family",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500",
        },
        {
            id: "fun",
            name: "Fun",
            icon: Gamepad2,
            color: "text-yellow-500",
            bg: "bg-yellow-500",
        },
        {
            id: "spiritual",
            name: "Spiritual",
            icon: Sparkles,
            color: "text-purple-500",
            bg: "bg-purple-500",
        },
    ];

    let tasks = $state([
        {
            id: 1,
            title: "Morning Jog (5km)",
            category: "health",
            completed: false,
        },
        { id: 2, title: "Call Mom", category: "family", completed: false },
        { id: 3, title: "Play Guitar", category: "fun", completed: true },
        {
            id: 4,
            title: "Meditation (10m)",
            category: "spiritual",
            completed: false,
        },
        {
            id: 5,
            title: "Drink 3L Water",
            category: "health",
            completed: false,
        },
        {
            id: 6,
            title: "Date Night Planning",
            category: "family",
            completed: false,
        },
    ]);

    function toggleTask(id: number) {
        const task = tasks.find((t) => t.id === id);
        if (task) task.completed = !task.completed;
    }

    function getProgress(category: string) {
        const catTasks = tasks.filter((t) => t.category === category);
        if (catTasks.length === 0) return 0;
        return Math.round(
            (catTasks.filter((t) => t.completed).length / catTasks.length) *
                100,
        );
    }
</script>

<div class="page-container h-full">
    <div class="module-header">
        <div>
            <h1 class="text-3xl font-light text-white">Life Balance</h1>
            <p class="text-muted">
                Harmony across Health, Family, Fun, and Spirit.
            </p>
        </div>
        <button class="btn btn-primary flex items-center gap-2">
            <Plus size={18} /> New Goal
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each categories as cat}
            <div
                class="card-subtle group hover:border-primary/30 transition-all"
            >
                <div class="flex items-center gap-3 mb-4">
                    <div class="p-3 rounded-lg {cat.bg}/10 {cat.color}">
                        <cat.icon size={24} />
                    </div>
                    <h3 class="text-lg font-light text-white">
                        {cat.name}
                    </h3>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-muted">Progress</span>
                        <span class="font-medium text-white"
                            >{getProgress(cat.id)}%</span
                        >
                    </div>
                    <ProgressBar
                        value={getProgress(cat.id)}
                        color={cat.bg.replace("bg-", "")}
                    />
                </div>
            </div>
        {/each}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Tasks Lists -->
        {#each categories as cat}
            <div class="card-subtle bg-surface/30">
                <div class="flex items-center justify-between mb-4">
                    <h3
                        class="text-lg font-light text-white flex items-center gap-2"
                    >
                        <cat.icon size={18} class={cat.color} />
                        {cat.name} Goals
                    </h3>
                    <button
                        class="text-xs text-muted hover:text-[var(--color-text)] flex items-center gap-1"
                    >
                        <Plus size={12} /> Add
                    </button>
                </div>

                <div class="space-y-3">
                    {#each tasks.filter((t) => t.category === cat.id) as task}
                        <div
                            class="flex items-center gap-3 group cursor-pointer"
                            onclick={() => toggleTask(task.id)}
                            onkeydown={(e) =>
                                e.key === "Enter" && toggleTask(task.id)}
                            role="button"
                            tabindex="0"
                        >
                            <div
                                class="w-5 h-5 rounded border border-line flex items-center justify-center transition-colors {task.completed
                                    ? cat.bg + ' border-transparent text-white'
                                    : 'hover:border-' +
                                      cat.color.replace('text-', '')}"
                            >
                                {#if task.completed}
                                    <CheckSquare size={14} />
                                {/if}
                            </div>
                            <span
                                class="text-sm {task.completed
                                    ? 'text-muted line-through'
                                    : 'text-white'} transition-colors"
                            >
                                {task.title}
                            </span>
                        </div>
                    {/each}
                    {#if tasks.filter((t) => t.category === cat.id).length === 0}
                        <p class="text-xs text-muted italic">
                            No active goals.
                        </p>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>
