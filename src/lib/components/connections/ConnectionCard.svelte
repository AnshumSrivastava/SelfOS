<script lang="ts">
    import { connections } from "$lib/stores/connections.svelte";
    import {
        User,
        Phone,
        Mail,
        Calendar,
        CheckCircle,
        AlertCircle,
        Tag,
        MoreVertical,
    } from "lucide-svelte";
    import type { Connection } from "$lib/types/connections";
    import { fade } from "svelte/transition";

    let { connection } = $props<{ connection: Connection }>();

    let isNeglected = $derived(() => {
        if (!connection.lastContactedAt) return true;
        const threshold = new Date();
        threshold.setDate(threshold.getDate() - 14);
        return new Date(connection.lastContactedAt) < threshold;
    });

    async function logContact() {
        await connections.logContact(connection.id);
    }

    function formatDate(dateStr: string | null) {
        if (!dateStr) return "Never";
        return new Date(dateStr).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
        });
    }
</script>

<div class="connection-card card-subtle group" in:fade>
    <div class="card-header">
        <div class="avatar">
            <User size={20} />
            {#if isNeglected()}
                <div class="neglect-indicator" title="Long time no contact">
                    <AlertCircle size={10} />
                </div>
            {/if}
        </div>
        <div class="info">
            <h4>{connection.name}</h4>
            <div class="categories">
                {#each connection.categories as category}
                    <span class="category-tag">{category}</span>
                {/each}
            </div>
        </div>
        <button
            class="btn-icon btn-ghost opacity-0 group-hover:opacity-100 transition-opacity"
        >
            <MoreVertical size={16} />
        </button>
    </div>

    {#if connection.relationshipGoals}
        <p class="goals">{connection.relationshipGoals}</p>
    {/if}

    <div class="card-footer">
        <div class="last-contact">
            <Calendar size={14} />
            <span>Last: {formatDate(connection.lastContactedAt)}</span>
        </div>
        <button class="btn btn-ghost btn-sm" onclick={logContact}>
            <CheckCircle size={14} />
            <span>Log Contact</span>
        </button>
    </div>
</div>

<style>
    .connection-card {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        padding: var(--space-4);
        position: relative;
    }

    .card-header {
        display: flex;
        gap: var(--space-3);
        align-items: flex-start;
    }

    .avatar {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-subtle);
        background: var(--theme-surface-subtle);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--theme-text-secondary);
        position: relative;
        flex-shrink: 0;
    }

    .neglect-indicator {
        position: absolute;
        top: -4px;
        right: -4px;
        background: var(--theme-danger);
        color: white;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--theme-surface);
    }

    .info {
        flex: 1;
    }

    .info h4 {
        margin: 0 0 4px 0;
        font-size: var(--text-base);
        color: var(--theme-text-strong);
    }

    .categories {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }

    .category-tag {
        font-size: 0.65rem;
        background: var(--theme-surface-subtle);
        color: var(--theme-text-muted);
        padding: 1px 6px;
        border-radius: 4px;
        border: 1px solid var(--theme-line);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .goals {
        font-size: var(--text-sm);
        color: var(--theme-text-secondary);
        margin: 0;
        font-style: italic;
        line-height: 1.4;
    }

    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--space-2);
        padding-top: var(--space-2);
        border-top: 1px solid var(--theme-line-soft);
    }

    .last-contact {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--text-xs);
        color: var(--theme-text-muted);
    }

    .btn-icon {
        padding: 4px;
        border-radius: 4px;
        background: none;
        border: none;
        color: var(--theme-text-muted);
        cursor: pointer;
    }

    .btn-sm {
        font-size: 0.75rem;
        padding: 4px 8px;
    }
</style>
