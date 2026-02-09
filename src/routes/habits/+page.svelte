<script>
    import MobileHabits from "$lib/components/habits/MobileHabits.svelte";
    import DesktopHabits from "$lib/components/habits/DesktopHabits.svelte";
</script>

<svelte:head>
    <title>Habits | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileHabits />
</div>

<div class="hidden md:block">
    <DesktopHabits />
</div>
