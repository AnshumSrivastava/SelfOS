<script>
    import MobileLibrary from "$lib/components/library/MobileLibrary.svelte";
    import DesktopLibrary from "$lib/components/library/DesktopLibrary.svelte";
</script>

<svelte:head>
    <title>Library | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileLibrary />
</div>

<div class="hidden md:block">
    <DesktopLibrary />
</div>
