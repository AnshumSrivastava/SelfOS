<script>
    import MobileFinance from "$lib/components/finance/MobileFinance.svelte";
    import DesktopFinance from "$lib/components/finance/DesktopFinance.svelte";
</script>

<svelte:head>
    <title>Finance | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileFinance />
</div>

<div class="hidden md:block">
    <DesktopFinance />
</div>
