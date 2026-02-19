<script lang="ts">
    import {
        identityActions,
        identityTraits,
    } from "$lib/stores/identity.svelte";
    import { CheckCircle2, XCircle, MessageSquare, Clock } from "lucide-svelte";
    import { fade } from "svelte/transition";

    function getTraitName(id: string | null) {
        if (!id) return null;
        return identityTraits.value.find((t) => t.id === id)?.name;
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
</script>

<div class="identity-feed">
    <div class="feed-header">
        <h3>Recent Reflections</h3>
    </div>

    {#if identityActions.value.length === 0}
        <div class="empty-state card-subtle">
            <Clock size={32} class="text-theme-text-muted" />
            <p>
                No activity logged yet. Start aligning your actions with your
                identity.
            </p>
        </div>
    {:else}
        <div class="feed-items">
            {#each identityActions.value as action (action.id)}
                <div class="feed-item card" in:fade>
                    <div class="item-main">
                        <div
                            class="item-status"
                            class:misaligned={!action.isAligned}
                        >
                            {#if action.isAligned}
                                <CheckCircle2 size={18} />
                            {:else}
                                <XCircle size={18} />
                            {/if}
                        </div>
                        <div class="item-content">
                            <div class="content-header">
                                <span class="action-desc"
                                    >{action.description}</span
                                >
                                <span class="action-date"
                                    >{formatDate(action.createdAt)}</span
                                >
                            </div>

                            <div class="content-meta">
                                {#if getTraitName(action.traitId)}
                                    <span class="trait-tag">
                                        {getTraitName(action.traitId)}
                                    </span>
                                {/if}
                                <span
                                    class="alignment-label"
                                    class:misaligned={!action.isAligned}
                                >
                                    {action.isAligned
                                        ? "Aligned"
                                        : "Against Identity"}
                                </span>
                            </div>

                            {#if action.reflection}
                                <div class="reflection-box">
                                    <MessageSquare size={14} />
                                    <p>{action.reflection}</p>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .identity-feed {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
    }

    .feed-header h3 {
        font-size: var(--text-base);
        font-weight: 500;
        margin: 0;
        color: var(--theme-text-strong);
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-6);
        gap: var(--space-2);
        text-align: center;
        color: var(--theme-text-muted);
        font-size: var(--text-sm);
    }

    .feed-items {
        display: flex;
        flex-direction: column;
    }

    .feed-item {
        padding: var(--space-4) 0;
        border-bottom: 1px solid var(--theme-line-soft);
    }

    .feed-item:last-child {
        border-bottom: none;
    }

    .item-main {
        display: flex;
        gap: var(--space-3);
        align-items: flex-start;
    }

    .item-status {
        margin-top: 2px;
        color: var(--theme-primary);
    }

    .item-status.misaligned {
        color: var(--theme-danger);
    }

    .item-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--space-3);
    }

    .action-desc {
        font-size: var(--text-base);
        color: var(--theme-text-strong);
        line-height: 1.4;
    }

    .action-date {
        font-size: var(--text-xs);
        color: var(--theme-text-muted);
        white-space: nowrap;
    }

    .content-meta {
        display: flex;
        gap: var(--space-2);
        align-items: center;
    }

    .trait-tag {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: var(--theme-surface-subtle);
        padding: 2px 8px;
        border-radius: 4px;
        color: var(--theme-text-secondary);
        border: 1px solid var(--theme-line);
    }

    .alignment-label {
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--theme-primary);
    }

    .alignment-label.misaligned {
        color: var(--theme-danger);
    }

    .reflection-box {
        margin-top: 4px;
        padding: var(--space-2) var(--space-3);
        background: var(--theme-surface-subtle);
        border-radius: var(--radius-subtle);
        display: flex;
        gap: var(--space-2);
        align-items: flex-start;
        color: var(--theme-text-secondary);
        border-left: 2px solid var(--theme-danger);
    }

    .reflection-box p {
        margin: 0;
        font-size: var(--text-sm);
        font-style: italic;
        line-height: 1.5;
    }
</style>
