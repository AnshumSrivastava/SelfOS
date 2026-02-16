<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import Logo from "./Logo.svelte";

    let { isLoading = $bindable(true), dependenciesLoaded = false } = $props<{
        isLoading: boolean;
        dependenciesLoaded: boolean;
    }>();

    // Minimum display time to prevent flickering
    let minTimeElapsed = $state(false);

    $effect(() => {
        if (isLoading) {
            // Enforce minimum time
            const minTimer = setTimeout(() => {
                minTimeElapsed = true;
            }, 1200);

            // Failsafe
            const failsafeTimer = setTimeout(() => {
                isLoading = false;
            }, 5000);

            return () => {
                clearTimeout(minTimer);
                clearTimeout(failsafeTimer);
            };
        }
    });

    // Watch for completion conditions
    $effect(() => {
        if (minTimeElapsed && dependenciesLoaded && isLoading) {
            // Short delay for smooth exit
            const finishTimer = setTimeout(() => {
                isLoading = false;
            }, 300);

            return () => clearTimeout(finishTimer);
        }
    });
</script>

{#if isLoading}
    <div
        class="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-8 cursor-wait"
        transition:fade={{ duration: 800, easing: cubicOut }}
    >
        <div
            class="relative flex flex-col items-center justify-center scale-100 opacity-0 animate-fade-in"
        >
            <!-- Logo Container -->
            <div class="relative overflow-hidden rounded-2xl">
                <!-- Shine Effect -->
                <div
                    class="absolute inset-0 z-10 w-full h-full bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-shine"
                ></div>

                <!-- Logo -->
                <div class="relative z-0 text-white">
                    <Logo size={64} />
                </div>
            </div>

            <!-- Subtle Glow behind -->
            <div
                class="absolute inset-0 bg-primary/20 blur-[50px] rounded-full animate-pulse-slow z-[-1]"
            ></div>
        </div>
    </div>
{/if}

<style>
    :global(body) {
        background-color: #000;
    }

    @keyframes shine {
        0% {
            transform: translateX(-150%) skewX(-15deg);
        }
        50%,
        100% {
            transform: translateX(150%) skewX(-15deg);
        }
    }

    .animate-shine {
        animation: shine 2s infinite ease-in-out;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .animate-fade-in {
        animation: fadeIn 0.8s ease-out forwards;
    }
</style>
