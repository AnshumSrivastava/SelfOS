<script>
    import MobileGoals from "$lib/components/goals/MobileGoals.svelte";
    import DesktopGoals from "$lib/components/goals/DesktopGoals.svelte";
</script>

<svelte:head>
    <title>Goals | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileGoals />
</div>

<div class="hidden md:block">
    <DesktopGoals />
</div>
