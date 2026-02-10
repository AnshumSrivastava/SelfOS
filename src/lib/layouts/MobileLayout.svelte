<script lang="ts">
    import MobileNav from "$lib/components/mobile/MobileNav.svelte";
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import { uiState } from "$lib/stores/ui.svelte";
    let { children } = $props();

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Tab") {
            const active = document.activeElement as HTMLElement | null;
            const isInput =
                active &&
                (active.tagName === "INPUT" ||
                    active.tagName === "TEXTAREA" ||
                    active.isContentEditable);

            if (!isInput) {
                e.preventDefault();
                uiState.toggleChrome();
            }
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
    class="flex flex-col min-h-screen bg-black text-white font-sans {uiState.showChrome
        ? 'pb-24'
        : 'pb-0'}"
>
    {#if uiState.showChrome}
        <MobileHeader />
    {/if}

    <main class="flex-1 px-4 py-2 overflow-y-auto scrollbar-hide">
        {@render children()}
    </main>

    {#if uiState.showChrome}
        <MobileNav />
    {/if}
</div>
