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
        class="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        onclick={() => (isOpen = false)}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === "Escape" && (isOpen = false)}
        aria-label="Close modal"
    ></div>

    <!-- Drawer -->
    <div
        class="fixed bottom-0 left-0 right-0 bg-[var(--color-background)] rounded-t-3xl z-[100] p-6 pb-32 border-t border-[var(--color-line)]/50 max-h-[85vh] overflow-y-auto shadow-2xl"
        transition:fly={{ y: 200, duration: 300, easing: (t) => t * (2 - t) }}
    >
        <div class="flex items-center justify-between mb-8">
            <h2
                class="text-xl font-bold tracking-tight text-[var(--color-text)]"
            >
                New Task
            </h2>
            <button
                onclick={() => (isOpen = false)}
                class="w-10 h-10 rounded-full bg-[var(--color-line)]/30 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] active:scale-90 transition-all"
            >
                <X size={20} />
            </button>
        </div>

        <form
            onsubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            class="space-y-8"
        >
            <textarea
                bind:value={title}
                placeholder="What's on your mind?"
                class="w-full bg-transparent text-2xl font-medium text-[var(--color-text)] placeholder:text-[var(--color-muted)]/30 focus:outline-none resize-none border-b border-[var(--color-line)]/30 pb-4"
                rows="2"
                onkeydown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            ></textarea>

            <!-- Projects -->
            <div class="space-y-3">
                <span
                    class="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-widest block"
                    >Project</span
                >
                <div
                    class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
                >
                    {#each ["General", "Work", "Personal", "Finance", "Health", "Learning"] as t}
                        <button
                            type="button"
                            onclick={() => (tag = t)}
                            class="px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border {tag ===
                            t
                                ? 'bg-[var(--color-primary)] text-black border-[var(--color-primary)]'
                                : 'bg-[var(--theme-surface)] text-[var(--color-muted)] border-[var(--color-line)]/50'}"
                        >
                            {t}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Priority -->
            <div class="space-y-3">
                <span
                    class="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-widest block"
                    >Priority</span
                >
                <div
                    class="flex bg-[var(--theme-surface)] rounded-2xl p-1.5 border border-[var(--color-line)]/50 w-full"
                >
                    {#each ["low", "medium", "high"] as p}
                        <button
                            type="button"
                            onclick={() => (priority = p as any)}
                            class="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all {priority ===
                            p
                                ? 'bg-[var(--color-line)] text-[var(--color-text)] shadow-sm'
                                : 'text-[var(--color-muted)]'}"
                        >
                            {p}
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-3">
                    <label
                        class="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-widest flex items-center gap-1.5"
                    >
                        <AlertCircle size={14} /> Deadline
                    </label>
                    <div
                        class="relative bg-[var(--theme-surface)] rounded-2xl border border-[var(--color-line)]/50 p-3.5 flex items-center gap-2"
                    >
                        <input
                            type="date"
                            bind:value={deadline}
                            class="bg-transparent text-[var(--color-text)] w-full text-sm font-medium focus:outline-none [-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                </div>

                <div class="space-y-3">
                    <label
                        class="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-widest flex items-center gap-1.5"
                    >
                        <Calendar size={14} /> Do On
                    </label>
                    <div
                        class="relative bg-[var(--theme-surface)] rounded-2xl border border-[var(--color-line)]/50 p-3.5 flex items-center gap-2"
                    >
                        <input
                            type="date"
                            bind:value={scheduled}
                            class="bg-transparent text-[var(--color-text)] w-full text-sm font-medium focus:outline-none [-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                </div>
            </div>

            <div class="pt-6 flex justify-end">
                <button
                    type="submit"
                    disabled={!title.trim()}
                    class="w-full py-4 rounded-2xl bg-[var(--color-primary)] text-black font-bold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[var(--color-primary)]/10 active:scale-95 transition-all"
                >
                    Add Task <ArrowUp size={20} strokeWidth={3} />
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
