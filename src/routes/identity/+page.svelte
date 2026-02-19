<script lang="ts">
    import MobileIdentity from "$lib/components/identity/MobileIdentity.svelte";
    import DesktopIdentity from "$lib/components/identity/DesktopIdentity.svelte";
</script>

<svelte:head>
    <title>Identity | SelfOS</title>
</svelte:head>

<div class="md:hidden">
    <MobileIdentity />
</div>

<div class="hidden md:block">
    <DesktopIdentity />
</div>
