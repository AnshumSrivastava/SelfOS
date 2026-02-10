<script>
    import MobileLifeBalance from "$lib/components/life-balance/MobileLifeBalance.svelte";
    import DesktopLifeBalance from "$lib/components/life-balance/DesktopLifeBalance.svelte";
</script>

<svelte:head>
    <title>Life Balance | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileLifeBalance />
</div>

<div class="hidden md:block">
    <DesktopLifeBalance />
</div>
