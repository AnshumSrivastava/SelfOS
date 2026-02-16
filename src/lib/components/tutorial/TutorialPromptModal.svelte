<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { tutorialStore } from "../../stores/tutorial.svelte";
    import { tutorialEngine } from "../../tutorial/engine";

    let { show = $bindable(false) } = $props();

    function accept() {
        show = false;
        tutorialStore.markPromptSeen();
        tutorialEngine.startFlow("setup");
    }

    function decline() {
        show = false;
        tutorialStore.markPromptSeen();
        tutorialStore.markSkipped();
    }
</script>

{#if show}
    <div
        class="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        transition:fade={{ duration: 300 }}
    >
        <div
            class="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
            transition:scale={{ start: 0.9, duration: 400 }}
        >
            <div class="relative h-48 bg-primary overflow-hidden">
                <!-- Abstract Decoration -->
                <div
                    class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                ></div>
                <div
                    class="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                ></div>

                <div
                    class="absolute inset-0 flex items-center justify-center text-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="drop-shadow-lg"
                    >
                        <path d="M12 2v8" /><path d="m16 6-4 4-4-4" /><path
                            d="M12 18h.01"
                        /><path
                            d="M17 13c0 2.8-2.2 5-5 5s-5-2.2-5-5a5 5 0 0 1 5-5 5 5 0 0 1 5 5Z"
                        />
                    </svg>
                </div>
            </div>

            <div class="p-8 text-center space-y-6">
                <div class="space-y-2">
                    <h2
                        class="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                        Welcome to SelfOS
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400">
                        Would you like a quick 5-minute tour to help you set up
                        and learn the core features?
                    </p>
                </div>

                <div class="flex flex-col gap-3">
                    <button
                        class="w-full py-3 px-6 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all"
                        onclick={accept}
                    >
                        Start Guided Tour
                    </button>
                    <button
                        class="w-full py-3 px-6 text-gray-500 font-medium hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        onclick={decline}
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .bg-primary {
        background-color: var(--accent-color, #3b82f6);
    }
    .shadow-primary\/25 {
        box-shadow:
            0 10px 15px -3px var(--tw-shadow-color),
            0 4px 6px -4px var(--tw-shadow-color);
        --tw-shadow-color: rgb(var(--accent-color-rgb, 59 130 246) / 0.25);
    }
</style>
