<script lang="ts">
    import { identityTraits } from "$lib/stores/identity.svelte";
    import { slide } from "svelte/transition";
    import { Plus, Trash2, Shield, Target, BookOpen } from "lucide-svelte";

    let newTraitName = $state("");
    let newTraitDescription = $state("");
    let isAdding = $state(false);

    async function addTrait() {
        if (!newTraitName.trim()) return;
        await identityTraits.insert({
            name: newTraitName,
            description: newTraitDescription,
        });
        newTraitName = "";
        newTraitDescription = "";
        isAdding = false;
    }

    async function removeTrait(id: string) {
        if (confirm("Are you sure you want to remove this trait?")) {
            await identityTraits.delete(id);
        }
    }
</script>

<div class="trait-manager">
    <div class="section-header">
        <div>
            <h2>Identity Traits</h2>
            <p class="subtitle">Who do you want to be?</p>
        </div>
        <button class="btn btn-ghost" onclick={() => (isAdding = !isAdding)}>
            <Plus size={18} />
            <span>Add Trait</span>
        </button>
    </div>

    {#if isAdding}
        <div class="add-form card-subtle" transition:slide>
            <div class="form-group">
                <input
                    type="text"
                    placeholder="Trait Name (e.g., Disciplined, Builder)"
                    bind:value={newTraitName}
                    class="input"
                />
            </div>
            <div class="form-group">
                <textarea
                    placeholder="Description / Philosophy"
                    bind:value={newTraitDescription}
                    class="input"
                ></textarea>
            </div>
            <div class="form-actions">
                <button class="btn btn-ghost" onclick={() => (isAdding = false)}
                    >Cancel</button
                >
                <button
                    class="btn btn-primary"
                    onclick={addTrait}
                    disabled={!newTraitName}>Save Trait</button
                >
            </div>
        </div>
    {/if}

    <div class="traits-grid">
        {#each identityTraits.value as trait}
            <div class="trait-card card-subtle">
                <div class="trait-icon">
                    {#if trait.name.toLowerCase().includes("discipline")}
                        <Shield size={20} />
                    {:else if trait.name.toLowerCase().includes("build")}
                        <Plus size={20} />
                    {:else if trait.name.toLowerCase().includes("read")}
                        <BookOpen size={20} />
                    {:else}
                        <Target size={20} />
                    {/if}
                </div>
                <div class="trait-content">
                    <h3>{trait.name}</h3>
                    {#if trait.description}
                        <p>{trait.description}</p>
                    {/if}
                </div>
                <button
                    class="delete-btn"
                    onclick={() => removeTrait(trait.id)}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        {/each}
    </div>
</div>

<style>
    .trait-manager {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: var(--space-2);
    }

    .subtitle {
        color: var(--theme-text-muted);
        font-size: var(--text-sm);
    }

    .add-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
        margin-bottom: var(--space-4);
    }

    .form-group textarea {
        min-height: 80px;
        resize: vertical;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-2);
    }

    .traits-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: var(--space-3);
    }

    .trait-card {
        display: flex;
        gap: var(--space-3);
        align-items: flex-start;
        position: relative;
        padding-right: var(--space-8);
    }

    .trait-icon {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-subtle);
        background: var(--theme-surface-subtle);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--theme-primary);
        flex-shrink: 0;
    }

    .trait-content h3 {
        font-size: var(--text-base);
        margin: 0 0 4px 0;
        color: var(--theme-text-strong);
    }

    .trait-content p {
        font-size: var(--text-sm);
        color: var(--theme-text-secondary);
        margin: 0;
        line-height: 1.4;
    }

    .delete-btn {
        position: absolute;
        top: var(--space-3);
        right: var(--space-3);
        color: var(--theme-text-muted);
        background: none;
        border: none;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .trait-card:hover .delete-btn {
        opacity: 1;
    }

    .delete-btn:hover {
        color: var(--theme-danger);
    }
</style>
