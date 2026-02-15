<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { TUTORIAL_FLOWS } from "../../tutorial/flows";
    import { tutorialEngine } from "../../tutorial/engine";
    import { tutorialStore } from "../../stores/tutorial.svelte";

    let { show = $bindable(false) } = $props();

    function startFlow(flowId: string) {
        show = false;
        tutorialEngine.startFlow(flowId);
    }

    function toggle() {
        show = !show;
        if (show) tutorialStore.setHasOpenedHub();
    }
</script>

{#if show}
    <div
        class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        transition:fade={{ duration: 200 }}
        onclick={() => (show = false)}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.key === "Escape" && (show = false)}
    >
        <div
            class="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[80vh]"
            transition:fly={{ y: 20, duration: 400 }}
            onclick={(e) => e.stopPropagation()}
            role="none"
        >
            <div
                class="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center"
            >
                <div>
                    <h2
                        class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight"
                    >
                        Tutorial Hub
                    </h2>
                    <p class="text-gray-500 dark:text-gray-400 mt-1">
                        Select a module to learn how it works.
                    </p>
                </div>
                <button
                    class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    onclick={() => (show = false)}
                    aria-label="Close Hub"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
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

            <div class="flex-1 overflow-y-auto p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each TUTORIAL_FLOWS as flow}
                        <button
                            class="group flex flex-col p-6 text-left rounded-2xl border border-gray-100 dark:border-gray-800 hover-border-primary-50 hover-border-primary-50 hover:bg-primary/[0.02] dark:hover:bg-primary/[0.05] transition-all"
                            onclick={() => startFlow(flow.id)}
                        >
                            <h4
                                class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors"
                            >
                                {flow.title}
                            </h4>
                            <p
                                class="text-sm text-gray-500 dark:text-gray-400 mt-2 flex-1"
                            >
                                {flow.description}
                            </p>
                            <div
                                class="mt-4 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Start Flow
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="ml-1"><path d="m9 18 6-6-6-6" /></svg
                                >
                            </div>
                        </button>
                    {/each}
                </div>
            </div>

            <div
                class="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center"
            >
                <div
                    class="flex gap-4 text-xs font-medium text-gray-400 uppercase tracking-widest"
                >
                    <span>{tutorialStore.platform} optimized</span>
                    <span>Local-first architecture</span>
                </div>
                <div class="text-xs text-gray-500">
                    Press <span
                        class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                        >Esc</span
                    > to close
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .text-primary {
        color: var(--accent-color, #3b82f6);
    }
    .hover-border-primary-50:hover {
        border-color: rgba(var(--accent-color-rgb, 59 130 246), 0.5);
    }
</style>
