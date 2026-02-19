<script lang="ts">
    import { onMount } from "svelte";
    import {
        identityTraits,
        identityActions,
    } from "$lib/stores/identity.svelte";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import TraitManager from "./TraitManager.svelte";
    import IdentityActionLogger from "./IdentityActionLogger.svelte";
    import IdentityAnalytics from "./IdentityAnalytics.svelte";
    import IdentityFeed from "./IdentityFeed.svelte";
    import { Fingerprint } from "lucide-svelte";

    onMount(() => {
        identityTraits.init();
        identityActions.init();
    });
</script>

<div class="page-container">
    <PageHeader
        title="Identity"
        subtitle="Core Philosophy Engine"
        icon={Fingerprint}
    />

    <div class="identity-layout">
        <!-- Left Pane: Controls & Analytics -->
        <div class="pane left-pane">
            <IdentityAnalytics />
            <div class="divider"></div>
            <IdentityActionLogger />
        </div>

        <!-- Right Pane: Management & Feed -->
        <div class="pane right-pane">
            <TraitManager />
            <div class="divider"></div>
            <IdentityFeed />
        </div>
    </div>
</div>

<style>
    .identity-layout {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: var(--space-8);
        align-items: flex-start;
    }

    .pane {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .divider {
        height: 1px;
        background: var(--theme-line-soft);
        margin: var(--space-4) 0;
    }

    @media (max-width: 1200px) {
        .identity-layout {
            grid-template-columns: 1fr;
            gap: var(--space-12);
        }
    }
</style>
