<script>
    import MobileNotes from "$lib/components/notes/MobileNotes.svelte";
    import DesktopNotes from "$lib/components/notes/DesktopNotes.svelte";
</script>

<svelte:head>
    <title>Notes | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileNotes />
</div>

<div class="hidden md:block">
    <DesktopNotes />
</div>
