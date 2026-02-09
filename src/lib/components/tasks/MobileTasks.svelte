<script>
    import { Plus, Check, Calendar } from "lucide-svelte";

    const tasks = [
        {
            title: "Refactor Auth System",
            project: "SelfOS",
            due: "Today",
            priority: "High",
        },
        {
            title: "Write Q4 Goals",
            project: "Life",
            due: "Tomorrow",
            priority: "Medium",
        },
        {
            title: "Buy Groceries",
            project: "Personal",
            due: "Today",
            priority: "Low",
        },
    ];
</script>

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Tasks</h1>
        <button
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {#each ["Inbox", "Today", "Upcoming", "Projects"] as filter}
            <button
                class="px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 text-sm font-medium text-gray-400 whitespace-nowrap {filter ===
                'Today'
                    ? 'bg-white text-black border-white'
                    : ''}"
            >
                {filter}
            </button>
        {/each}
    </div>

    <!-- Task List -->
    <div class="space-y-3">
        {#each tasks as task}
            <div
                class="p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex items-start gap-4"
            >
                <button
                    aria-label="Toggle task status"
                    class="mt-1 w-6 h-6 rounded-full border-2 border-neutral-700 flex items-center justify-center hover:border-white transition-colors"
                >
                </button>
                <div class="flex-1">
                    <p class="font-medium text-white">{task.title}</p>
                    <div class="flex items-center gap-3 mt-1.5">
                        <span
                            class="text-xs text-gray-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800"
                            >{task.project}</span
                        >
                        {#if task.due === "Today"}
                            <span
                                class="text-xs text-red-400 flex items-center gap-1"
                                ><Calendar size={10} /> Today</span
                            >
                        {:else}
                            <span class="text-xs text-gray-500">{task.due}</span
                            >
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
