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
        <div class="flex-none z-40 relative">
            <MobileHeader />
        </div>
    {/if}

    <main
        class="flex-1 px-4 py-2 overflow-y-auto scrollbar-hide relative z-0 {uiState.showChrome
            ? 'pb-24'
            : ''}"
    >
        {@render children()}
    </main>

    {#if uiState.showChrome}
        <MobileNav />
    {/if}
</div>
