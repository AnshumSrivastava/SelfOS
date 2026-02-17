<script lang="ts">
    import { X } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";

    let { isOpen = $bindable(false), title, children } = $props();

    function close() {
        isOpen = false;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape" && isOpen) {
            close();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        role="button"
        tabindex="0"
        onclick={close}
        onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") close();
        }}
    >
        <div
            class="bg-[#111] border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            transition:scale={{ start: 0.95, duration: 200 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            tabindex="-1"
        >
            <div
                class="flex items-center justify-between p-6 border-b border-neutral-800"
            >
                <h3 class="text-xl font-bold text-white">{title}</h3>
                <button
                    onclick={close}
                    class="p-1 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-neutral-800"
                >
                    <X size={20} />
                </button>
            </div>

            <div class="p-6 overflow-y-auto custom-scrollbar">
                {@render children()}
            </div>
        </div>
    </div>
{/if}

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 2px;
    }
</style>
