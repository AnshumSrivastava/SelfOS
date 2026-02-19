<script lang="ts">
    import {
        identityActions,
        identityTraits,
    } from "$lib/stores/identity.svelte";
    import { CheckCircle2, XCircle, MessageSquare, Tag } from "lucide-svelte";
    import { fade, slide } from "svelte/transition";

    let description = $state("");
    let selectedTraitId = $state<string | null>(null);
    let isAligned = $state(true);
    let reflection = $state("");
    let status = $state<"idle" | "saving">("idle");

    const canSubmit = $derived(
        description.trim() !== "" && (isAligned || reflection.trim() !== ""),
    );

    async function logAction() {
        if (!canSubmit) return;
        status = "saving";
        try {
            await identityActions.insert({
                traitId: selectedTraitId,
                description,
                isAligned,
                reflection: isAligned ? null : reflection,
            });
            description = "";
            reflection = "";
            status = "idle";
        } catch (e) {
            status = "idle";
        }
    }
</script>

<div class="action-logger card-subtle">
    <div class="logger-header">
        <div class="icon-indicator" class:misaligned={!isAligned}>
            {#if isAligned}
                <CheckCircle2 size={24} />
            {:else}
                <XCircle size={24} />
            {/if}
        </div>
        <div>
            <h3>Log Action</h3>
            <p class="subtitle">
                Alignment check: are you becoming who you want to be?
            </p>
        </div>
    </div>

    <div class="form-grid">
        <div class="form-group span-2">
            <label for="desc">What did you do?</label>
            <input
                id="desc"
                type="text"
                placeholder="e.g., Woke up at 5 AM and wrote for 2 hours"
                bind:value={description}
                class="input"
            />
        </div>

        <div class="form-group">
            <label for="trait">Related Trait</label>
            <div class="select-wrapper">
                <select id="trait" bind:value={selectedTraitId} class="input">
                    <option value={null}>General / No specific trait</option>
                    {#each identityTraits.value as trait}
                        <option value={trait.id}>{trait.name}</option>
                    {/each}
                </select>
            </div>
        </div>

        <div class="form-group alignment-toggle-group">
            <label>Was this aligned?</label>
            <div class="toggle-buttons">
                <button
                    class="toggle-btn aligned"
                    class:active={isAligned}
                    onclick={() => (isAligned = true)}
                >
                    Aligned
                </button>
                <button
                    class="toggle-btn misaligned"
                    class:active={!isAligned}
                    onclick={() => (isAligned = false)}
                >
                    Against
                </button>
            </div>
        </div>

        {#if !isAligned}
            <div class="form-group span-2 reflection-area" transition:slide>
                <label for="reflection">Mandatory Reflection</label>
                <textarea
                    id="reflection"
                    placeholder="Why did this happen? How will you correct it next time?"
                    bind:value={reflection}
                    class="input reflection-input"
                ></textarea>
                <p class="reflection-hint">
                    Self-awareness is the first step to correction.
                </p>
            </div>
        {/if}
    </div>

    <div class="logger-footer">
        <button
            class="btn btn-primary log-btn"
            onclick={logAction}
            disabled={!canSubmit || status === "saving"}
        >
            {status === "saving" ? "Logging..." : "Confirm Entry"}
        </button>
    </div>
</div>

<style>
    .action-logger {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        border: 1px solid var(--theme-line);
        background: var(--theme-surface);
    }

    .logger-header {
        display: flex;
        gap: var(--space-3);
        align-items: center;
    }

    .icon-indicator {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--theme-primary-soft);
        color: var(--theme-primary);
        transition: all 0.3s var(--easing-premium);
    }

    .icon-indicator.misaligned {
        background: rgba(239, 68, 68, 0.1);
        color: var(--theme-danger);
    }

    .logger-header h3 {
        margin: 0;
        font-size: var(--text-lg);
        font-weight: 500;
    }

    .subtitle {
        margin: 0;
        font-size: var(--text-xs);
        color: var(--theme-text-muted);
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-4);
    }

    .span-2 {
        grid-column: span 2;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .form-group label {
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--theme-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .toggle-buttons {
        display: flex;
        background: var(--theme-surface-subtle);
        padding: 4px;
        border-radius: var(--input-radius);
        gap: 4px;
    }

    .toggle-btn {
        flex: 1;
        border: none;
        padding: 6px;
        border-radius: 8px;
        font-size: var(--text-xs);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        background: transparent;
        color: var(--theme-text-muted);
    }

    .toggle-btn.active.aligned {
        background: var(--theme-primary);
        color: var(--theme-text-inverse);
    }

    .toggle-btn.active.misaligned {
        background: var(--theme-danger);
        color: var(--theme-text-inverse);
    }

    .reflection-area {
        margin-top: var(--space-2);
    }

    .reflection-input {
        min-height: 100px;
        border-color: rgba(239, 68, 68, 0.3);
    }

    .reflection-hint {
        font-size: var(--text-xs);
        color: var(--theme-text-muted);
        font-style: italic;
        margin-top: 4px;
    }

    .logger-footer {
        display: flex;
        justify-content: flex-end;
    }

    .log-btn {
        width: 100%;
        padding: var(--space-3);
        border-radius: var(--input-radius);
    }

    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
        }
        .span-2 {
            grid-column: span 1;
        }
    }
</style>
