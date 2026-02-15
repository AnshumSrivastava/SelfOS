<script lang="ts">
    import MobileNav from "$lib/components/mobile/MobileNav.svelte";
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import { uiState } from "$lib/stores/ui.svelte";

    let { children } = $props();
</script>

<div
    class="flex flex-col h-[100dvh] bg-black text-white font-sans overflow-hidden"
>
    {#if uiState.showChrome}
        <!-- Top Padding/Header space -->
    {/if}

    <main
        class="flex-1 px-4 overflow-y-auto scrollbar-hide relative z-0 {uiState.showChrome
            ? 'pt-4 pb-24'
            : 'py-2'}"
        style="padding-top: calc({uiState.showChrome
            ? '1rem'
            : '0.5rem'} + env(safe-area-inset-top)); padding-bottom: calc({uiState.showChrome
            ? '6rem'
            : '0.5rem'} + env(safe-area-inset-bottom));"
    >
        {@render children()}
    </main>

    {#if uiState.showChrome}
        <MobileNav />
    {/if}
</div>
