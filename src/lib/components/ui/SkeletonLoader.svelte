<script>
    let {
        lines = 3,
        width = "w-full",
        height = "h-4",
        circle = false,
        shimmer = true,
        class: className = "",
    } = $props();
</script>

<div class="skeleton-container {className}">
    {#if circle}
        <div class="skeleton-circle {width} {height}"></div>
    {:else}
        {#each Array(lines) as _, i}
            <div
                class="skeleton-line {width} {height} {shimmer
                    ? 'shimmer'
                    : ''}"
                style="width: {i === lines - 1 ? '70%' : '100%'}"
            ></div>
        {/each}
    {/if}
</div>

<style>
    .skeleton-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .skeleton-line,
    .skeleton-circle {
        background: rgba(255, 255, 255, 0.03);
        border-radius: var(--radius-subtle, 12px);
        position: relative;
        overflow: hidden;
    }

    .skeleton-circle {
        border-radius: 50%;
    }

    .shimmer::after {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
        );
        animation: shimmer 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    @keyframes shimmer {
        0% {
            left: -100%;
        }
        50% {
            left: 100%;
        }
        100% {
            left: 100%;
        }
    }
</style>
