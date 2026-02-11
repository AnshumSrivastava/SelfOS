<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { confirmState } from "$lib/stores/confirm.svelte";

    function handleConfirm() {
        confirmState.handleConfirm();
    }

    function handleCancel() {
        confirmState.handleCancel();
    }
</script>

{#if confirmState.isOpen}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="bg-[#111] border border-neutral-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden"
            transition:scale={{ start: 0.95, duration: 200 }}
        >
            <!-- Glow effect -->
            <div
                class="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"
            ></div>

            <h3 class="text-xl font-bold text-white mb-2 relative z-10">
                {confirmState.title || "Confirm Action"}
            </h3>
            <p class="text-gray-400 mb-6 text-sm leading-relaxed relative z-10">
                {confirmState.message || "Are you sure you want to proceed?"}
            </p>

            <div class="flex gap-3 relative z-10">
                <button
                    onclick={handleCancel}
                    class="flex-1 px-4 py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-gray-300 font-medium hover:bg-neutral-800 transition-colors text-sm"
                >
                    Cancel
                </button>
                <button
                    onclick={handleConfirm}
                    class="flex-1 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 font-medium hover:bg-red-500/20 transition-colors text-sm"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
{/if}
