<script lang="ts">
    import { connections } from "$lib/stores/connections.svelte";
    import ConnectionCard from "./ConnectionCard.svelte";
    import { Plus, Search, Filter, AlertCircle, QrCode } from "lucide-svelte";
    import { slide } from "svelte/transition";

    let searchQuery = $state("");
    let activeFilter = $state<"all" | "neglected">("all");
    let isAdding = $state(false);

    let newName = $state("");
    let newContact = $state("");
    let newGoals = $state("");
    let newCategory = $state("");
    let categories = $state<string[]>([]);

    const filteredConnections = $derived(() => {
        let list =
            activeFilter === "neglected"
                ? connections.neglectedConnections
                : connections.value;
        if (searchQuery.trim()) {
            list = list.filter((c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }
        return list;
    });

    function addCategory() {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            categories = [...categories, newCategory.trim()];
            newCategory = "";
        }
    }

    async function saveConnection() {
        if (!newName.trim()) return;
        await connections.insert({
            name: newName,
            contactInfo: newContact,
            relationshipGoals: newGoals,
            categories,
        });
        resetForm();
    }

    function resetForm() {
        newName = "";
        newContact = "";
        newGoals = "";
        categories = [];
        isAdding = false;
    }
</script>

<div class="connection-manager">
    <div class="manager-controls">
        <div class="search-bar card-subtle">
            <Search size={18} class="text-theme-text-muted" />
            <input
                type="text"
                placeholder="Search connections..."
                bind:value={searchQuery}
            />
        </div>

        <div class="action-buttons">
            <button
                class="btn btn-ghost"
                onclick={() => (isAdding = !isAdding)}
            >
                <Plus size={18} />
                <span>Add Person</span>
            </button>
            <button class="btn btn-ghost btn-qr">
                <QrCode size={18} />
                <span class="md:inline hidden">Scan QR</span>
            </button>
        </div>
    </div>

    <div class="filter-tabs">
        <button
            class:active={activeFilter === "all"}
            onclick={() => (activeFilter = "all")}
        >
            All Contacts ({connections.value.length})
        </button>
        <button
            class:active={activeFilter === "neglected"}
            onclick={() => (activeFilter = "neglected")}
        >
            Needs Attention ({connections.neglectedConnections.length})
            {#if connections.neglectedConnections.length > 0}
                <span class="badge">!</span>
            {/if}
        </button>
    </div>

    {#if isAdding}
        <div class="add-form card-subtle" transition:slide>
            <div class="form-grid">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        bind:value={newName}
                        class="input"
                        placeholder="Name"
                    />
                </div>
                <div class="form-group">
                    <label for="contact">Contact Info (Link/Number)</label>
                    <input
                        id="contact"
                        type="text"
                        bind:value={newContact}
                        class="input"
                        placeholder="https://..."
                    />
                </div>
                <div class="form-group span-2">
                    <label for="goals">Relationship Goals</label>
                    <textarea
                        id="goals"
                        bind:value={newGoals}
                        class="input"
                        placeholder="e.g. Weekly catchup, Professional mentorship..."
                    ></textarea>
                </div>
                <div class="form-group span-2">
                    <label for="cats">Categories</label>
                    <div class="category-input">
                        <input
                            id="cats"
                            type="text"
                            bind:value={newCategory}
                            class="input"
                            placeholder="Press enter to add"
                            onkeydown={(e) =>
                                e.key === "Enter" && addCategory()}
                        />
                        <button class="btn btn-ghost" onclick={addCategory}
                            >Add</button
                        >
                    </div>
                    <div class="category-tags">
                        {#each categories as cat}
                            <span class="tag"
                                >{cat}
                                <button
                                    onclick={() =>
                                        (categories = categories.filter(
                                            (c) => c !== cat,
                                        ))}>×</button
                                ></span
                            >
                        {/each}
                    </div>
                </div>
            </div>
            <div class="form-actions">
                <button class="btn btn-ghost" onclick={resetForm}>Cancel</button
                >
                <button class="btn btn-primary" onclick={saveConnection}
                    >Save Connection</button
                >
            </div>
        </div>
    {/if}

    {#if filteredConnections().length === 0}
        <div class="empty-state">
            <AlertCircle size={48} />
            <p>No connections found.</p>
        </div>
    {:else}
        <div class="connections-grid">
            {#each filteredConnections() as conn (conn.id)}
                <ConnectionCard connection={conn} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .connection-manager {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
    }

    .manager-controls {
        display: flex;
        justify-content: space-between;
        gap: var(--space-4);
    }

    .search-bar {
        flex: 1;
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: 0 var(--space-4);
        height: 48px;
    }

    .search-bar input {
        background: none;
        border: none;
        color: var(--theme-text);
        width: 100%;
        outline: none;
        font-size: var(--text-base);
    }

    .action-buttons {
        display: flex;
        gap: var(--space-2);
    }

    .filter-tabs {
        display: flex;
        gap: var(--space-1);
        border-bottom: 1px solid var(--theme-line-soft);
        padding-bottom: 2px;
    }

    .filter-tabs button {
        background: none;
        border: none;
        color: var(--theme-text-muted);
        padding: 8px 16px;
        font-size: var(--text-sm);
        cursor: pointer;
        position: relative;
        transition: color 0.2s;
    }

    .filter-tabs button.active {
        color: var(--theme-primary);
    }

    .filter-tabs button.active::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--theme-primary);
    }

    .badge {
        background: var(--theme-danger);
        color: white;
        font-size: 10px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 4px;
        vertical-align: top;
    }

    .add-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
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
    }

    .category-input {
        display: flex;
        gap: 8px;
    }

    .category-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
    }

    .tag {
        background: var(--theme-surface-subtle);
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--theme-line);
    }

    .tag button {
        background: none;
        border: none;
        color: var(--theme-text-muted);
        cursor: pointer;
        font-size: 14px;
        padding: 0;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }

    .connections-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: var(--space-4);
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--space-12);
        color: var(--theme-text-muted);
        text-align: center;
        gap: var(--space-4);
    }

    @media (max-width: 768px) {
        .form-grid {
            grid-template-columns: 1fr;
        }
        .span-2 {
            grid-column: span 1;
        }
        .manager-controls {
            flex-direction: column;
        }
    }
</style>
