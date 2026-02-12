<script lang="ts">
    import { X, ArrowUp, Calendar, Clock, AlertCircle } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { fade, fly } from "svelte/transition";

    let { isOpen = $bindable(false) } = $props();

    let title = $state("");
    let tag = $state("General");
    let priority = $state<"low" | "medium" | "high">("medium");
    let deadline = $state("");
    let scheduled = $state("");

    async function handleSubmit() {
        if (!title.trim()) return;

        await tasksStore.addBatch(title, tag, priority);

        // Reset form
        title = "";
        tag = "General";
        priority = "medium";
        deadline = "";
        scheduled = "";

        isOpen = false;
    }
</script>

{#if isOpen}
    <!-- Backdrop -->
    <div
        class="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        onclick={() => (isOpen = false)}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === "Escape" && (isOpen = false)}
        aria-label="Close modal"
    ></div>

    <!-- Drawer -->
    <div
        class="fixed bottom-0 left-0 right-0 bg-[#111] rounded-t-3xl z-50 p-6 border-t border-neutral-800 max-h-[85vh] overflow-y-auto"
        transition:fly={{ y: 100, duration: 300 }}
    >
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-medium text-white">New Task</h2>
            <button
                onclick={() => (isOpen = false)}
                class="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-gray-400"
            >
                <X size={18} />
            </button>
        </div>

        <form
            onsubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            class="space-y-6"
        >
            <textarea
                bind:value={title}
                placeholder="What's on your mind?&#10;Paste tasks (one per line) or a YouTube playlist URL..."
                class="w-full bg-transparent text-xl text-white placeholder:text-neutral-600 focus:outline-none resize-none"
                rows="3"
                onkeydown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            ></textarea>

            <!-- Projects -->
            <div class="space-y-2">
                <label
                    class="text-xs text-neutral-500 font-medium uppercase tracking-wider"
                    >Project</label
                >
                <div
                    class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
                >
                    {#each ["General", "Work", "Personal", "Finance", "Health", "Learning"] as t}
                        <button
                            type="button"
                            onclick={() => (tag = t)}
                            class="px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap {tag ===
                            t
                                ? 'bg-white text-black'
                                : 'bg-neutral-900 text-gray-400 border border-neutral-800'}"
                        >
                            {t}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Priority -->
            <div class="space-y-2">
                <label
                    class="text-xs text-neutral-500 font-medium uppercase tracking-wider"
                    >Priority</label
                >
                <div
                    class="flex bg-neutral-900 rounded-xl p-1 border border-neutral-800 w-full"
                >
                    {#each ["low", "medium", "high"] as p}
                        <button
                            type="button"
                            onclick={() => (priority = p as any)}
                            class="flex-1 py-2 rounded-lg text-sm capitalize transition-all {priority ===
                            p
                                ? 'bg-neutral-700 text-white shadow-sm'
                                : 'text-neutral-500'}"
                        >
                            {p}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                    <label
                        class="text-xs text-neutral-500 font-medium uppercase tracking-wider flex items-center gap-1"
                    >
                        <AlertCircle size={12} /> Deadline
                    </label>
                    <div
                        class="relative bg-neutral-900 rounded-xl border border-neutral-800 p-3 flex items-center gap-2"
                    >
                        <input
                            type="date"
                            bind:value={deadline}
                            class="bg-transparent text-white w-full text-sm focus:outline-none [-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <label
                        class="text-xs text-neutral-500 font-medium uppercase tracking-wider flex items-center gap-1"
                    >
                        <Calendar size={12} /> Do On
                    </label>
                    <div
                        class="relative bg-neutral-900 rounded-xl border border-neutral-800 p-3 flex items-center gap-2"
                    >
                        <input
                            type="date"
                            bind:value={scheduled}
                            class="bg-transparent text-white w-full text-sm focus:outline-none [-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                </div>
            </div>

            <div class="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={!title.trim()}
                    class="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                >
                    <ArrowUp size={28} />
                </button>
            </div>
        </form>
    </div>
{/if}

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
