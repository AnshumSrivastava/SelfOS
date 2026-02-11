<script>
    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let { isLoading = $bindable(true) } = $props();

    // Simulate loading progress
    let progress = $state(0);

    $effect(() => {
        if (isLoading) {
            progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        isLoading = false;
                    }, 300);
                }
            }, 200);

            return () => clearInterval(interval);
        }
    });
</script>

{#if isLoading}
    <div
        class="loading-screen"
        transition:fade={{ duration: 300, easing: cubicOut }}
    >
        <div class="loading-content">
            <!-- Logo/Icon -->
            <div class="logo-container">
                <div class="logo-pulse">
                    <svg
                        width="60"
                        height="60"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                        <path
                            d="M12 6v6l4 2"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                        />
                    </svg>
                </div>
            </div>

            <!-- App Name -->
            <h1 class="app-name">SelfOS</h1>

            <!-- Loading Bar -->
            <div class="progress-container">
                <div class="progress-bar" style="width: {progress}%"></div>
            </div>

            <!-- Loading Text -->
            <p class="loading-text">
                {#if progress < 30}
                    Initializing...
                {:else if progress < 60}
                    Loading your data...
                {:else if progress < 90}
                    Almost ready...
                {:else}
                    Welcome back!
                {/if}
            </p>
        </div>
    </div>
{/if}

<style>
    .loading-screen {
        position: fixed;
        inset: 0;
        background: var(--color-background);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        max-width: 400px;
        padding: 2rem;
    }

    .logo-container {
        position: relative;
    }

    .logo-pulse {
        color: var(--color-primary);
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.7;
            transform: scale(1.05);
        }
    }

    .app-name {
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--color-text);
        margin: 0;
    }

    .progress-container {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 2px;
        overflow: hidden;
    }

    .progress-bar {
        height: 100%;
        background: var(--color-primary);
        border-radius: 2px;
        transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .loading-text {
        font-size: 0.875rem;
        color: var(--color-muted);
        margin: 0;
        animation: fadeInOut 2s ease-in-out infinite;
    }

    @keyframes fadeInOut {
        0%,
        100% {
            opacity: 0.5;
        }
        50% {
            opacity: 1;
        }
    }
</style>
