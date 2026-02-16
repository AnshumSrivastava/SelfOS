<script lang="ts">
    import MobileNav from "$lib/components/mobile/MobileNav.svelte";
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import { uiState } from "$lib/stores/ui.svelte";

    let { children } = $props();
</script>

<div
    class="relative flex flex-col min-h-screen w-full bg-background text-foreground font-sans"
>
    {#if uiState.showChrome}
        <!-- Top Padding/Header space is handled by the content spacing or the header itself now -->
    {/if}

    <main
        class="flex-1 w-full relative z-0 {uiState.showChrome ? 'pb-24' : ''}"
        style="padding-bottom: calc({uiState.showChrome
            ? '5rem'
            : '0px'} + env(safe-area-inset-bottom));"
    >
        {@render children()}
    </main>

    {#if uiState.showChrome}
        <div class="fixed bottom-0 left-0 right-0 z-50">
            <MobileNav />
        </div>
    {/if}
</div>
