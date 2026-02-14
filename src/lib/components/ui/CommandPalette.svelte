<script lang="ts">
    let { isOpen = $bindable(false), onClose = () => {} } = $props();

    import { Search, X } from "lucide-svelte";
    import { fly, fade } from "svelte/transition";

    let searchQuery = $state("");
    let selectedIndex = $state(0);

    // Mock commands - will be populated with actual actions
    const commands = [
        { id: "new-task", label: "New Task", icon: "plus", category: "Create" },
        {
            id: "new-habit",
            label: "New Habit",
            icon: "plus",
            category: "Create",
        },
        { id: "new-goal", label: "New Goal", icon: "plus", category: "Create" },
        {
            id: "nav-dashboard",
            label: "Go to Dashboard",
            icon: "home",
            category: "Navigate",
        },
        {
            id: "nav-goals",
            label: "Go to Goals",
            icon: "target",
            category: "Navigate",
        },
        {
            id: "nav-habits",
            label: "Go to Habits",
            icon: "check",
            category: "Navigate",
        },
        {
            id: "nav-tasks",
            label: "Go to Tasks",
            icon: "list",
            category: "Navigate",
        },
        {
            id: "nav-finance",
            label: "Go to Finance",
            icon: "dollar",
            category: "Navigate",
        },
    ];

    let filteredCommands = $derived(
        searchQuery
            ? commands.filter((cmd) =>
                  cmd.label.toLowerCase().includes(searchQuery.toLowerCase()),
              )
            : commands,
    );

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = Math.min(
                selectedIndex + 1,
                filteredCommands.length - 1,
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
        } else if (e.key === "Enter") {
            e.preventDefault();
            executeCommand(filteredCommands[selectedIndex]);
        } else if (e.key === "Escape") {
            close();
        }
    }

    function executeCommand(command: any) {
        console.log("Executing:", command);
        // Will implement actual command execution
        close();
    }

    function close() {
        isOpen = false;
        searchQuery = "";
        selectedIndex = 0;
        onClose();
    }

    // Global keyboard shortcut
    $effect(() => {
        function handleGlobalKeydown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                isOpen = !isOpen;
            }
        }

        window.addEventListener("keydown", handleGlobalKeydown);
        return () => window.removeEventListener("keydown", handleGlobalKeydown);
    });
</script>

{#if isOpen}
    <!-- Backdrop -->
    <button
        class="command-backdrop"
        onclick={close}
        transition:fade={{ duration: 200 }}
        aria-label="Close command palette"
    ></button>

    <!-- Command Palette -->
    <div
        class="command-palette"
        transition:fly={{ y: -20, duration: 300 }}
        onkeydown={handleKeydown}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        tabindex="-1"
    >
        <!-- Search Input -->
        <div class="search-container">
            <Search size={20} class="search-icon" />
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Type a command or search..."
                class="search-input"
            />
            <button onclick={close} class="close-btn">
                <X size={18} />
            </button>
        </div>

        <!-- Results -->
        <div class="results-container">
            {#if filteredCommands.length > 0}
                {#each filteredCommands as command, i}
                    <button
                        class="command-item {i === selectedIndex
                            ? 'selected'
                            : ''}"
                        onclick={() => executeCommand(command)}
                        onmouseenter={() => (selectedIndex = i)}
                    >
                        <span class="command-label">{command.label}</span>
                        <span class="command-category">{command.category}</span>
                    </button>
                {/each}
            {:else}
                <div class="no-results">No commands found</div>
            {/if}
        </div>

        <!-- Footer -->
        <div class="command-footer">
            <div class="footer-hint">
                <kbd>↑↓</kbd> Navigate
                <kbd>↵</kbd> Select
                <kbd>esc</kbd> Close
            </div>
        </div>
    </div>
{/if}

<style>
    .command-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 9998;
        border: none;
        cursor: pointer;
    }

    .command-palette {
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 640px;
        background: var(--color-surface);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        z-index: 9999;
        overflow: hidden;
    }

    .search-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .search-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--color-text);
        font-size: 1rem;
    }

    .search-input::placeholder {
        color: var(--color-muted);
    }

    .close-btn {
        background: transparent;
        border: none;
        color: var(--color-muted);
        cursor: pointer;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .close-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--color-text);
    }

    .results-container {
        max-height: 400px;
        overflow-y: auto;
        padding: 0.5rem;
    }

    .command-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background: transparent;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s;
        text-align: left;
    }

    .command-item:hover,
    .command-item.selected {
        background: rgba(255, 255, 255, 0.05);
    }

    .command-label {
        color: var(--color-text);
        font-size: 0.875rem;
    }

    .command-category {
        color: var(--color-muted);
        font-size: 0.75rem;
    }

    .no-results {
        padding: 2rem;
        text-align: center;
        color: var(--color-muted);
        font-size: 0.875rem;
    }

    .command-footer {
        padding: 0.75rem 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        background: rgba(0, 0, 0, 0.2);
    }

    .footer-hint {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 0.75rem;
        color: var(--color-muted);
    }

    kbd {
        padding: 0.125rem 0.375rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.75rem;
    }
</style>
