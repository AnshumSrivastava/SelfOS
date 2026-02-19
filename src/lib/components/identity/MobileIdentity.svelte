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
    import { Fingerprint, Activity, BarChart3, Settings2 } from "lucide-svelte";

    let activeTab = $state("log"); // log, stats, traits

    onMount(() => {
        identityTraits.init();
        identityActions.init();
    });
</script>

<div class="page-container mobile-page">
    <PageHeader title="Identity" icon={Fingerprint} />

    <div class="mobile-tabs">
        <button
            class:active={activeTab === "log"}
            onclick={() => (activeTab = "log")}
        >
            <Activity size={18} />
            <span>Log</span>
        </button>
        <button
            class:active={activeTab === "stats"}
            onclick={() => (activeTab = "stats")}
        >
            <BarChart3 size={18} />
            <span>Stats</span>
        </button>
        <button
            class:active={activeTab === "traits"}
            onclick={() => (activeTab = "traits")}
        >
            <Settings2 size={18} />
            <span>Traits</span>
        </button>
    </div>

    <div class="mobile-content">
        {#if activeTab === "log"}
            <div class="view-section">
                <IdentityActionLogger />
                <div class="divider"></div>
                <IdentityFeed />
            </div>
        {:else if activeTab === "stats"}
            <div class="view-section">
                <IdentityAnalytics />
            </div>
        {:else if activeTab === "traits"}
            <div class="view-section">
                <TraitManager />
            </div>
        {/if}
    </div>
</div>

<style>
    .mobile-page {
        padding-bottom: var(--space-24); /* Space for bottom nav */
    }

    .mobile-tabs {
        display: flex;
        background: var(--theme-surface-subtle);
        padding: 4px;
        border-radius: var(--radius-subtle);
        margin-bottom: var(--space-4);
        border: 1px solid var(--theme-line);
    }

    .mobile-tabs button {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px;
        border: none;
        background: transparent;
        color: var(--theme-text-muted);
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 600;
        border-radius: 8px;
        transition: all 0.2s ease;
    }

    .mobile-tabs button.active {
        background: var(--theme-surface-strong);
        color: var(--theme-primary);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .mobile-content {
        display: flex;
        flex-direction: column;
    }

    .view-section {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
    }

    .divider {
        height: 1px;
        background: var(--theme-line-soft);
        margin: var(--space-2) 0;
    }
</style>
