<script lang="ts">
    import { fade } from "svelte/transition";
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
            const minTimer = setTimeout(() => {
                minTimeElapsed = true;
            }, 1200);

            const failsafeTimer = setTimeout(() => {
                isLoading = false;
            }, 5000);

            return () => {
                clearTimeout(minTimer);
                clearTimeout(failsafeTimer);
            };
        }
    });

    $effect(() => {
        if (minTimeElapsed && dependenciesLoaded && isLoading) {
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
            class="relative flex flex-col items-center justify-center animate-fade-in"
        >
            <!-- Logo Container with Masked Shine -->
            <div class="relative logo-container">
                <!-- Logo -->
                <div class="relative z-0 text-white">
                    <Logo size={256} />
                </div>

                <!-- Shine Effect Overlay (Masked to Logo) -->
                <div class="absolute inset-0 z-10 shine-overlay"></div>
            </div>
        </div>
    </div>
{/if}

<style>
    .logo-container {
        mask-image: url('data:image/svg+xml;utf8,<svg width="256" height="256" viewBox="0 0 59.52298 59.594643" fill="black" xmlns="http://www.w3.org/2000/svg"><g transform="translate(189.77842,-81.662422)"><path d="m -160.01694,97.315205 -22.38416,34.213415 c 5.2901,4.88467 10.6208,7.93591 17.10696,9.15396 l 0.19844,-3.61114 c -2.35978,-0.28051 -5.9781,-1.2295 -12.91291,-6.32623 l 17.92656,-27.34769 0.0651,0.0987 0.0651,-0.0987 17.92656,27.34769 c -6.93481,5.09673 -10.55313,6.04572 -12.91291,6.32623 l 0.19844,3.61114 c 6.48616,-1.21805 11.81686,-4.26929 17.10696,-9.15396 z" /><path d="m -161.65596,141.25706 3.57188,-0.15647 0.0134,-24.80418 -1.94629,-5.21661 -1.66242,5.21662 z" /><path d="m -160.01694,81.662414 a 29.761417,29.761417 0 0 0 -29.76149,29.761496 29.761417,29.761417 0 0 0 4.74803,16.12614 l 2.10788,-3.22202 a 26.290359,26.290359 0 0 1 -3.3848,-12.90412 26.290359,26.290359 0 0 1 26.29038,-26.29039 26.290359,26.290359 0 0 1 26.29039,26.29039 26.290359,26.290359 0 0 1 -3.38481,12.90412 l 2.10788,3.22202 a 29.761417,29.761417 0 0 0 4.74803,-16.12614 29.761417,29.761417 0 0 0 -29.76149,-29.761496 z" /></g></svg>');
        mask-size: contain;
        mask-repeat: no-repeat;
        mask-position: center;
        -webkit-mask-image: url('data:image/svg+xml;utf8,<svg width="256" height="256" viewBox="0 0 59.52298 59.594643" fill="black" xmlns="http://www.w3.org/2000/svg"><g transform="translate(189.77842,-81.662422)"><path d="m -160.01694,97.315205 -22.38416,34.213415 c 5.2901,4.88467 10.6208,7.93591 17.10696,9.15396 l 0.19844,-3.61114 c -2.35978,-0.28051 -5.9781,-1.2295 -12.91291,-6.32623 l 17.92656,-27.34769 0.0651,0.0987 0.0651,-0.0987 17.92656,27.34769 c -6.93481,5.09673 -10.55313,6.04572 -12.91291,6.32623 l 0.19844,3.61114 c 6.48616,-1.21805 11.81686,-4.26929 17.10696,-9.15396 z" /><path d="m -161.65596,141.25706 3.57188,-0.15647 0.0134,-24.80418 -1.94629,-5.21661 -1.66242,5.21662 z" /><path d="m -160.01694,81.662414 a 29.761417,29.761417 0 0 0 -29.76149,29.761496 29.761417,29.761417 0 0 0 4.74803,16.12614 l 2.10788,-3.22202 a 26.290359,26.290359 0 0 1 -3.3848,-12.90412 26.290359,26.290359 0 0 1 26.29038,-26.29039 26.290359,26.290359 0 0 1 26.29039,26.29039 26.290359,26.290359 0 0 1 -3.38481,12.90412 l 2.10788,3.22202 a 29.761417,29.761417 0 0 0 4.74803,-16.12614 29.761417,29.761417 0 0 0 -29.76149,-29.761496 z" /></g></svg>');
        -webkit-mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center;
    }

    .shine-overlay {
        background: linear-gradient(
            35deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.4) 50%,
            transparent 60%,
            transparent 100%
        );
        background-size: 300% 100%;
        animation: shine-mask 2s infinite ease-in-out;
    }

    @keyframes shine-mask {
        0% {
            background-position: 150% 0;
        }
        100% {
            background-position: -50% 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .animate-fade-in {
        animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
</style>
