<script lang="ts">
    import { fly } from "svelte/transition";
    import { tutorialStore } from "../../stores/tutorial.svelte";
    import { tutorialEngine } from "../../tutorial/engine";

    let progress = $derived(tutorialStore.state.progress);
    let step = $derived(tutorialEngine.currentStep);
</script>

{#if progress?.isRunning && step}
    <div
        class="fixed bottom-6 right-6 z-[10001] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full py-2 px-4 shadow-xl flex items-center gap-3"
        transition:fly={{ y: 20, duration: 300 }}
    >
        <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span
                class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider"
            >
                Tutorial Active
            </span>
        </div>

        <div class="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>

        <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
            Step {progress.stepIndex + 1}
        </span>

        <button
            class="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-red-500"
            onclick={() => tutorialEngine.stop()}
            title="Stop Tutorial"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
            >
        </button>
    </div>
{/if}

<style>
    .bg-primary {
        background-color: var(--accent-color, #3b82f6);
    }
</style>
