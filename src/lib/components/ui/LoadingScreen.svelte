<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import Logo from "./Logo.svelte";

    let { isLoading = $bindable(true), dependenciesLoaded = false } = $props<{
        isLoading: boolean;
        dependenciesLoaded: boolean;
    }>();

    let statusText = $state("INITIALIZING");
    let progress = $state(0);

    // Minimum display time to prevent flickering
    let minTimeElapsed = $state(false);

    $effect(() => {
        if (isLoading) {
            // Start progress animation
            const progressInterval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.random() * 5;
                }
            }, 100);

            // Enforce minimum time
            const minTimer = setTimeout(() => {
                minTimeElapsed = true;
            }, 1500);

            // Failsafe: Force entry after 8 seconds if auth hangs
            const failsafeTimer = setTimeout(() => {
                console.warn("Loading screen failsafe triggered");
                progress = 100;
                statusText = "READY";
                isLoading = false;
            }, 8000);

            return () => {
                clearInterval(progressInterval);
                clearTimeout(minTimer);
                clearTimeout(failsafeTimer);
            };
        }
    });

    // Watch for completion conditions
    $effect(() => {
        if (minTimeElapsed && dependenciesLoaded && isLoading) {
            progress = 100;
            statusText = "READY";

            // Short delay to show 100% and Ready state
            const finishTimer = setTimeout(() => {
                isLoading = false;
            }, 500);

            return () => clearTimeout(finishTimer);
        }
    });
</script>

{#if isLoading}
    <div
        class="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-8 cursor-wait"
        transition:fade={{ duration: 500, easing: cubicOut }}
    >
        <div
            class="flex flex-col items-center gap-12 md:scale-[2.4] transition-transform duration-500"
        >
            <!-- Logo with Pulse -->
            <div class="relative">
                <div
                    class="absolute inset-0 bg-white/5 blur-xl rounded-full animate-pulse-slow"
                ></div>
                <div class="relative text-white">
                    <Logo size={80} />
                </div>
            </div>

            <!-- Typography & Status -->
            <div class="flex flex-col items-center gap-6">
                <h1
                    class="text-3xl font-light text-white tracking-[0.3em] uppercase"
                >
                    SelfOS
                </h1>

                <div class="flex flex-col items-center gap-3 w-48">
                    <!-- Progress Bar -->
                    <div
                        class="w-full h-[2px] bg-white/10 rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-white transition-all duration-300 ease-out"
                            style="width: {progress}%"
                        ></div>
                    </div>

                    <div
                        class="h-4 overflow-hidden relative w-full flex justify-center"
                    >
                        {#key statusText}
                            <span
                                class="text-[10px] font-bold text-white/50 uppercase tracking-[0.3em] absolute"
                                in:fly={{ y: 10, duration: 300, delay: 150 }}
                                out:fly={{ y: -10, duration: 300 }}
                            >
                                {statusText}
                            </span>
                        {/key}
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer / Version -->
        <div
            class="absolute bottom-12 text-[10px] font-mono text-white/20 tracking-widest uppercase"
        >
            v2.0 // System Active
        </div>
    </div>
{/if}

<style>
    :global(body) {
        background-color: #000; /* Prevent flash of white during load */
    }
</style>
