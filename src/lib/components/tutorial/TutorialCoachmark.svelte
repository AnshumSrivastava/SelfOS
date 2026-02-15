<script lang="ts">
    import { onMount, tick } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { tutorialEngine } from "../../tutorial/engine";
    import { tutorialStore } from "../../stores/tutorial.svelte";

    let step = $derived(tutorialEngine.currentStep);
    let targetSelector = $derived(step?.targetSelector);
    let placement = $derived(step?.placement || "center");

    let coachmarkEl = $state<HTMLDivElement | null>(null);
    let position = $state({ top: 0, left: 0 });
    let isVisible = $state(false);

    async function updatePosition() {
        if (!step) {
            isVisible = false;
            return;
        }

        if (!targetSelector || placement === "center") {
            isVisible = true;
            return;
        }

        const target = document.querySelector(targetSelector);
        if (!target) {
            isVisible = true; // Show as center if target is missing
            return;
        }

        const targetRect = target.getBoundingClientRect();
        const coachmarkRect = coachmarkEl?.getBoundingClientRect() || {
            width: 320,
            height: 200,
        };

        let top = 0;
        let left = 0;

        const offset = 16;

        switch (placement) {
            case "top":
                top = targetRect.top - coachmarkRect.height - offset;
                left =
                    targetRect.left +
                    targetRect.width / 2 -
                    coachmarkRect.width / 2;
                break;
            case "bottom":
                top = targetRect.bottom + offset;
                left =
                    targetRect.left +
                    targetRect.width / 2 -
                    coachmarkRect.width / 2;
                break;
            case "left":
                top =
                    targetRect.top +
                    targetRect.height / 2 -
                    coachmarkRect.height / 2;
                left = targetRect.left - coachmarkRect.width - offset;
                break;
            case "right":
                top =
                    targetRect.top +
                    targetRect.height / 2 -
                    coachmarkRect.height / 2;
                left = targetRect.right + offset;
                break;
        }

        // Boundary checks
        const padding = 16;
        left = Math.max(
            padding,
            Math.min(left, window.innerWidth - coachmarkRect.width - padding),
        );
        top = Math.max(
            padding,
            Math.min(top, window.innerHeight - coachmarkRect.height - padding),
        );

        position = { top, left };
        isVisible = true;
    }

    $effect(() => {
        if (step) {
            tick().then(updatePosition);
        }
    });

    onMount(() => {
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    });

    const isFirstStep = $derived(tutorialStore.state.progress?.stepIndex === 0);
</script>

{#if step && isVisible}
    <div
        bind:this={coachmarkEl}
        class="fixed z-[9999] w-[calc(100vw-32px)] md:w-[360px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4 overflow-hidden"
        class:centered={!targetSelector || placement === "center"}
        style={targetSelector && placement !== "center"
            ? `top: ${position.top}px; left: ${position.left}px;`
            : ""}
        transition:fly={{ y: 20, duration: 400 }}
    >
        <div class="space-y-2">
            <h3
                class="text-xl font-bold text-gray-900 dark:text-white leading-tight"
            >
                {step.title}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                {step.body}
            </p>
        </div>

        <div class="flex items-center justify-between mt-4">
            <button
                class="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                onclick={() => tutorialEngine.stop()}
            >
                Exit
            </button>

            <div class="flex gap-2">
                {#if tutorialStore.state.progress && tutorialStore.state.progress.stepIndex > 0}
                    <button
                        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        onclick={() => tutorialEngine.prevStep()}
                    >
                        Back
                    </button>
                {/if}
                <button
                    class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    onclick={() => tutorialEngine.nextStep()}
                >
                    {isFirstStep ? "Start" : "Next"}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"><path d="m9 18 6-6-6-6" /></svg
                    >
                </button>
            </div>
        </div>

        <div class="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
            <div
                class="h-full bg-primary transition-all duration-500"
                style="width: {((tutorialStore.state.progress?.stepIndex ?? 0) +
                    1) *
                    10}%"
            ></div>
        </div>
    </div>
{/if}

<style>
    .bg-primary {
        background-color: var(--accent-color, #3b82f6);
    }
    .centered {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>
