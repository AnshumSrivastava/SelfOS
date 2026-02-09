<script>
    import MobileFitness from "$lib/components/fitness/MobileFitness.svelte";
    import DesktopFitness from "$lib/components/fitness/DesktopFitness.svelte";
</script>

<svelte:head>
    <title>Fitness | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileFitness />
</div>

<div class="hidden md:block">
    <DesktopFitness />
</div>
