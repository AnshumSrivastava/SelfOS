<script lang="ts">
    import { identityActions } from "$lib/stores/identity.svelte";
    import StatCard from "$lib/components/ui/StatCard.svelte";
    import { Compass, Zap, ZapOff, Activity } from "lucide-svelte";

    const stats = $derived(identityActions.weeklyStats);
    const alignmentColor = $derived(
        stats.score >= 80
            ? "primary"
            : stats.score >= 50
              ? "warning"
              : "danger",
    );
</script>

<div class="analytics-container">
    <div class="stats-grid">
        <StatCard
            title="Alignment Score"
            animatedValue={stats.score}
            suffix="%"
            icon={Compass}
            color={alignmentColor}
            subtext="Last 7 days"
        />
        <StatCard
            title="Aligned Actions"
            value={stats.aligned}
            icon={Zap}
            color="primary"
        />
        <StatCard
            title="Against Identity"
            value={stats.misaligned}
            icon={ZapOff}
            color="danger"
        />
        <StatCard
            title="Total Logged"
            value={stats.total}
            icon={Activity}
            color="secondary"
        />
    </div>

    {#if stats.total > 0}
        <div class="progress-detailed card-subtle">
            <div class="progress-bar-wrapper">
                <div class="progress-labels">
                    <span>Alignment Progress</span>
                    <span>{stats.score}%</span>
                </div>
                <div class="progress-track">
                    <div
                        class="progress-fill"
                        style="width: {stats.score}%; background-color: var(--theme-{alignmentColor})"
                    ></div>
                </div>
            </div>
            <p class="insight-text">
                {#if stats.score >= 90}
                    Excellent alignment. Your actions are perfectly matching
                    your ideal self.
                {:else if stats.score >= 70}
                    Good consistency. Stay focused on the small daily choices.
                {:else if stats.score >= 50}
                    Moderate alignment. Review your misaligned reflections to
                    identify patterns.
                {:else}
                    Significant drift detected. Use your reflections to
                    recalibrate.
                {/if}
            </p>
        </div>
    {/if}
</div>

<style>
    .analytics-container {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-3);
    }

    .progress-detailed {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
    }

    .progress-bar-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .progress-labels {
        display: flex;
        justify-content: space-between;
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--theme-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .progress-track {
        height: 8px;
        background: var(--theme-surface-subtle);
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        transition: width 1s var(--easing-premium);
    }

    .insight-text {
        font-size: var(--text-sm);
        color: var(--theme-text-muted);
        margin: 0;
        line-height: 1.5;
    }
</style>
