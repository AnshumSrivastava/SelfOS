<script lang="ts">
    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { onMount } from "svelte";
    import Logo from "./Logo.svelte";
    import { settings } from "$lib/stores/settings.svelte";

    let { isLoading = $bindable(true) } = $props();

    let statusIndex = $state(0);
    const statuses = ["Initializing...", "Ready"];

    $effect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                statusIndex = 1;
                const exitTimer = setTimeout(() => {
                    isLoading = false;
                }, 800);
                return () => clearTimeout(exitTimer);
            }, 1200);
            return () => clearTimeout(timer);
        }
    });

    let colors = $derived.by(() => {
        // Pure luminance contrast only
        if (settings.theme === "light") {
            return {
                bg: "#FFFFFF",
                logo: "#0A0A0A",
                text: "#222222",
                secondary: "#666666",
            };
        } else {
            return {
                bg: "#0A0A0A",
                logo: "#FFFFFF",
                text: "#EDEDED",
                secondary: "#8A8A8A",
            };
        }
    });
</script>

{#if isLoading}
    <div
        class="loading-screen"
        style="background-color: {colors.bg};"
        transition:fade={{ duration: 400, easing: cubicOut }}
    >
        <div class="content">
            <div class="logo-container" style="color: {colors.logo};">
                <Logo size={120} />
            </div>

            <div class="brand">
                <h1 class="title" style="color: {colors.text};">SelfOS</h1>
                <p class="status" style="color: {colors.secondary};">
                    {statuses[statusIndex]}
                </p>
            </div>
        </div>
    </div>
{/if}

<style>
    .loading-screen {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: background-color 0.3s ease;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .logo-container {
        margin-bottom: 32px; /* Increased from 24px */
        animation: fadeIn 0.3s ease-out forwards;
    }

    .brand {
        display: flex;
        flex-direction: column;
        gap: 16px; /* Increased from 12px */
    }

    .title {
        font-family: "Roboto", sans-serif;
        font-size: 2.5rem; /* Increased from 1.5rem */
        font-weight: 500;
        letter-spacing: 0.04em;
        line-height: 1.2;
        margin: 0;
        text-transform: uppercase;
    }

    .status {
        font-family: "Roboto", sans-serif;
        font-size: 1.125rem; /* Increased from 0.875rem */
        font-weight: 400;
        letter-spacing: 0.02em;
        line-height: 1.3;
        margin: 0;
        opacity: 1;
        animation: breathe 2.4s ease-in-out infinite;
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

    @keyframes breathe {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.85;
        }
    }
</style>
