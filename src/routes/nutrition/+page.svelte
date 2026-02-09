<script>
    import MobileNutrition from "$lib/components/nutrition/MobileNutrition.svelte";
    import DesktopNutrition from "$lib/components/nutrition/DesktopNutrition.svelte";
</script>

<svelte:head>
    <title>Nutrition | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileNutrition />
</div>

<div class="hidden md:block">
    <DesktopNutrition />
</div>
