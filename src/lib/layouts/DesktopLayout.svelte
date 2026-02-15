<script lang="ts">
    import Sidebar from "$lib/components/layout/Sidebar.svelte";
    import Header from "$lib/components/layout/Header.svelte";
    import { uiState } from "$lib/stores/ui.svelte";
    let { children } = $props();
</script>

<div
    class="flex min-h-screen bg-background text-text font-sans selection:bg-primary selection:text-black overflow-hidden"
>
    {#if uiState.showChrome}
        <Sidebar />
    {/if}

    <div
        class="flex-1 flex flex-col relative transition-all duration-300 {uiState.showChrome
            ? uiState.isCollapsed
                ? 'ml-16'
                : 'ml-64'
            : 'ml-0'}"
    >
        {#if uiState.showChrome}
            <Header />
        {/if}

        <main class="flex-1 overflow-y-auto p-8 relative scroll-smooth">
            <div
                class="relative z-10 max-w-full mx-auto w-full animate-fade-in px-4"
            >
                {@render children()}
            </div>
        </main>
    </div>
</div>
