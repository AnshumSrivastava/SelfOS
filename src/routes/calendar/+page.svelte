<script>
    import MobileCalendar from "$lib/components/calendar/MobileCalendar.svelte";
    import DesktopCalendar from "$lib/components/calendar/DesktopCalendar.svelte";
</script>

<svelte:head>
    <title>Calendar | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileCalendar />
</div>

<div class="hidden md:block">
    <DesktopCalendar />
</div>
