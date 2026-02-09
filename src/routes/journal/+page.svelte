<script>
    import MobileJournal from "$lib/components/journal/MobileJournal.svelte";
    import DesktopJournal from "$lib/components/journal/DesktopJournal.svelte";
</script>

<svelte:head>
    <title>Journal | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileJournal />
</div>

<div class="hidden md:block">
    <DesktopJournal />
</div>
