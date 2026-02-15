<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let { targetSelector = "" } = $props();

    let targetRect = $state<DOMRect | null>(null);

    function updateRect() {
        if (targetSelector) {
            const el = document.querySelector(targetSelector);
            if (el) {
                targetRect = el.getBoundingClientRect();
            } else {
                targetRect = null;
            }
        } else {
            targetRect = null;
        }
    }

    $effect(() => {
        updateRect();
        const interval = setInterval(updateRect, 100);
        window.addEventListener("resize", updateRect);
        window.addEventListener("scroll", updateRect, true);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("scroll", updateRect, true);
        };
    });
</script>

<div
    class="fixed inset-0 z-[9998] pointer-events-none bg-black/60 backdrop-blur-[2px]"
    transition:fade={{ duration: 300 }}
    style="
    clip-path: {targetRect
        ? `polygon(
      0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%,
      ${targetRect.left - 8}px ${targetRect.top - 8}px,
      ${targetRect.right + 8}px ${targetRect.top - 8}px,
      ${targetRect.right + 8}px ${targetRect.bottom + 8}px,
      ${targetRect.left - 8}px ${targetRect.bottom + 8}px,
      ${targetRect.left - 8}px ${targetRect.top - 8}px
    )`
        : 'none'}
  "
></div>

<style>
    div {
        transition: clip-path 0.3s ease-in-out;
    }
</style>
