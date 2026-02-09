<script>
    import MobileTasks from "$lib/components/tasks/MobileTasks.svelte";
    import DesktopTasks from "$lib/components/tasks/DesktopTasks.svelte";
</script>

<svelte:head>
    <title>Tasks | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileTasks />
</div>

<div class="hidden md:block">
    <DesktopTasks />
</div>
