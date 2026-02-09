<script>
    import MobileFocus from "$lib/components/focus/MobileFocus.svelte";
    import DesktopFocus from "$lib/components/focus/DesktopFocus.svelte";
</script>

<svelte:head>
    <title>Focus Room | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileFocus />
</div>

<div class="hidden md:block">
    <DesktopFocus />
</div>
