<script>
    import MobilePara from "$lib/components/para/MobilePara.svelte";
    import DesktopPara from "$lib/components/para/DesktopPara.svelte";
</script>

<svelte:head>
    <title>PARA | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobilePara />
</div>

<div class="hidden md:block">
    <DesktopPara />
</div>
