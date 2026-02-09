<script>
    import { X, ArrowUp } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { fade, fly } from "svelte/transition";

    let { isOpen = $bindable(false) } = $props();

    let title = $state("");
    let tag = $state("General");

    function handleSubmit() {
        if (!title.trim()) return;
        tasksStore.add(title, tag);
        title = "";
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
        class="fixed bottom-0 left-0 right-0 bg-[#111] rounded-t-3xl z-50 p-6 border-t border-neutral-800"
        transition:fly={{ y: 100, duration: 300 }}
    >
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-medium text-white">Quick Capture</h2>
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
            class="space-y-4"
        >
            <input
                type="text"
                bind:value={title}
                placeholder="What's on your mind?"
                class="w-full bg-transparent text-xl text-white placeholder:text-neutral-600 focus:outline-none"
            />

            <div class="flex items-center gap-2 overflow-x-auto py-2">
                {#each ["General", "Work", "Personal", "Finance", "Health"] as t}
                    <button
                        type="button"
                        onclick={() => (tag = t)}
                        class="px-4 py-2 rounded-full text-sm font-medium transition-colors {tag ===
                        t
                            ? 'bg-white text-black'
                            : 'bg-neutral-900 text-gray-400 border border-neutral-800'}"
                    >
                        {t}
                    </button>
                {/each}
            </div>

            <div class="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={!title.trim()}
                    class="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ArrowUp size={24} />
                </button>
            </div>
        </form>
    </div>
{/if}
