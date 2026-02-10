<script lang="ts">
    import {
        Heart,
        Users,
        Gamepad2,
        Sparkles,
        Plus,
        Check,
    } from "lucide-svelte";

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
        { id: 1, title: "Jog 5km", category: "health", completed: false },
        { id: 2, title: "Call Mom", category: "family", completed: false },
        { id: 3, title: "Guitar", category: "fun", completed: true },
        { id: 4, title: "Meditate", category: "spiritual", completed: false },
        { id: 5, title: "Water 3L", category: "health", completed: false },
    ]);

    function toggleTask(id: number) {
        const task = tasks.find((t) => t.id === id);
        if (task) task.completed = !task.completed;
    }
</script>

<div class="pb-24 px-4 pt-6 space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-[var(--color-text)]">
            Life Balance
        </h1>
        <button
            class="btn btn-icon bg-surface text-[var(--color-text)] border border-line rounded-full w-10 h-10 flex items-center justify-center"
        >
            <Plus size={20} />
        </button>
    </div>

    <div class="grid grid-cols-2 gap-4">
        {#each categories as cat}
            <div
                class="bg-surface p-4 rounded-xl border border-line flex flex-col items-center text-center"
            >
                <div class="p-2 rounded-full {cat.bg}/10 {cat.color} mb-2">
                    <cat.icon size={20} />
                </div>
                <span class="text-sm font-bold text-[var(--color-text)]"
                    >{cat.name}</span
                >
                <span class="text-xs text-muted mt-1"
                    >{tasks.filter((t) => t.category === cat.id && !t.completed)
                        .length} Tasks</span
                >
            </div>
        {/each}
    </div>

    <div class="space-y-6">
        {#each categories as cat}
            {#if tasks.filter((t) => t.category === cat.id).length > 0}
                <div>
                    <h3
                        class="font-bold text-[var(--color-text)] text-sm mb-3 flex items-center gap-2"
                    >
                        <cat.icon size={14} class={cat.color} />
                        {cat.name}
                    </h3>
                    <div class="space-y-2">
                        {#each tasks.filter((t) => t.category === cat.id) as task}
                            <div
                                class="flex items-center justify-between p-3 bg-surface rounded-xl border border-line"
                                onclick={() => toggleTask(task.id)}
                            >
                                <span
                                    class="text-sm {task.completed
                                        ? 'text-muted line-through'
                                        : 'text-[var(--color-text)]'}"
                                    >{task.title}</span
                                >
                                <div
                                    class="w-5 h-5 rounded-full border border-line flex items-center justify-center {task.completed
                                        ? cat.bg +
                                          ' border-transparent text-white'
                                        : ''}"
                                >
                                    {#if task.completed}
                                        <Check size={12} />
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div>
