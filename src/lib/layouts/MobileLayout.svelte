<script lang="ts">
    import MobileNav from "$lib/components/mobile/MobileNav.svelte";
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import { uiState } from "$lib/stores/ui.svelte";

    let { children } = $props();
</script>

<div
    class="relative flex flex-col h-[100dvh] w-full bg-background text-foreground font-sans overflow-hidden"
>
    {#if uiState.showChrome}
        <!-- Top Padding/Header space is handled by the content spacing or the header itself now -->
    {/if}

    <main
        class="flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-hide relative z-0 {uiState.showChrome
            ? 'pb-24'
            : ''}"
        style="padding-bottom: calc({uiState.showChrome
            ? '5rem'
            : '0px'} + env(safe-area-inset-bottom));"
    >
        {@render children()}
    </main>

    {#if uiState.showChrome}
        <MobileNav />
    {/if}
</div>
