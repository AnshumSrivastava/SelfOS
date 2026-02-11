<script lang="ts">
    import { X } from "lucide-svelte";
    import {
        goalsStore,
        type Goal,
        type Priority,
    } from "$lib/stores/goals.svelte.ts";

    interface Props {
        isOpen: boolean;
        onClose: () => void;
        goal?: Goal | null;
    }

    let { isOpen = $bindable(false), onClose, goal = null }: Props = $props();

    // Form state
    let title = $state("");
    let description = $state("");
    let deadline = $state("");
    let priority: Priority = $state("normal");

    // Initialize form when goal changes
    $effect(() => {
        if (goal) {
            title = goal.title;
            description = goal.description || "";
            deadline = goal.deadline?.split("T")[0] || "";
            priority = goal.priority;
        } else {
            resetForm();
        }
    });

    function resetForm() {
        title = "";
        description = "";
        deadline = "";
        priority = "normal";
    }

    function handleSubmit() {
        if (!title.trim()) return;

        const goalData = {
            title: title.trim(),
            description: description.trim() || undefined,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
            priority,
        };

        if (goal) {
            goalsStore.updateGoal(goal.id, goalData);
        } else {
            goalsStore.addGoal(goalData);
        }

        resetForm();
        onClose();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            onClose();
        }
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onclick={onClose}
        onkeydown={handleKeyDown}
        role="button"
        tabindex="-1"
    >
        <div
            class="bg-surface border border-line rounded-2xl w-full max-w-md"
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
        >
            <!-- Header -->
            <div
                class="p-6 border-b border-line flex items-center justify-between"
            >
                <h2 class="text-2xl font-bold text-white">
                    {goal ? "Edit Goal" : "New Goal"}
                </h2>
                <button
                    onclick={onClose}
                    class="p-2 hover:bg-background rounded-lg transition-colors"
                >
                    <X size={24} class="text-muted" />
                </button>
            </div>

            <!-- Form -->
            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                class="p-6 space-y-4"
            >
                <!-- Title -->
                <div>
                    <label class="block text-sm font-medium text-muted mb-2"
                        >What do you want to achieve? *</label
                    >
                    <input
                        type="text"
                        bind:value={title}
                        placeholder="e.g., Launch my product"
                        class="w-full bg-background border border-line rounded-lg px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary"
                        required
                        autofocus
                    />
                </div>

                <!-- Description -->
                <div>
                    <label class="block text-sm font-medium text-muted mb-2"
                        >Why does this matter? (optional)</label
                    >
                    <textarea
                        bind:value={description}
                        placeholder="Add context or motivation..."
                        rows="2"
                        class="w-full bg-background border border-line rounded-lg px-4 py-3 text-white placeholder-muted focus:outline-none focus:border-primary resize-none"
                    ></textarea>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <!-- Priority -->
                    <div>
                        <label class="block text-sm font-medium text-muted mb-2"
                            >Priority</label
                        >
                        <select
                            bind:value={priority}
                            class="w-full bg-background border border-line rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        >
                            <option value="high">High</option>
                            <option value="normal">Normal</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    <!-- Deadline -->
                    <div>
                        <label class="block text-sm font-medium text-muted mb-2"
                            >Deadline (optional)</label
                        >
                        <input
                            type="date"
                            bind:value={deadline}
                            class="w-full bg-background border border-line rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-4">
                    <button
                        type="submit"
                        class="flex-1 bg-primary text-black font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        {goal ? "Save" : "Create Goal"}
                    </button>
                    <button
                        type="button"
                        onclick={onClose}
                        class="px-6 bg-surface border border-line text-white font-semibold py-3 rounded-lg hover:bg-background transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
