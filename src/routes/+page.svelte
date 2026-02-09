<script>
    import MobileDashboard from "$lib/components/dashboard/MobileDashboard.svelte";
    import DesktopDashboard from "$lib/components/dashboard/DesktopDashboard.svelte";
</script>

<svelte:head>
    <title>Dashboard | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileDashboard />
</div>

<div class="hidden md:block">
    <DesktopDashboard />
</div>
