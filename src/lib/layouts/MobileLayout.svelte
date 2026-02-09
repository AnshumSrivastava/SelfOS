<script>
    import MobileNav from "$lib/components/mobile/MobileNav.svelte";
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    let { children } = $props();
</script>

<div class="flex flex-col min-h-screen bg-black text-white font-sans pb-24">
    <MobileHeader />
    <main class="flex-1 px-4 py-2 overflow-y-auto scrollbar-hide">
        {@render children()}
    </main>
    <MobileNav />
</div>
