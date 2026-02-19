<script lang="ts">
    import { onMount } from "svelte";
    import { connections } from "$lib/stores/connections.svelte";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import ConnectionManager from "$lib/components/connections/ConnectionManager.svelte";
    import { Users } from "lucide-svelte";

    onMount(() => {
        connections.init();
    });
</script>

<svelte:head>
    <title>Connections | SelfOS</title>
</svelte:head>

<div class="page-container">
    <PageHeader
        title="Connections"
        subtitle="Social Capital & Network Management"
        icon={Users}
    />

    <ConnectionManager />
</div>
