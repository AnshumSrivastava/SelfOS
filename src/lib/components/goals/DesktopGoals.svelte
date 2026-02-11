<script lang="ts">
    import {
        Target,
        Plus,
        Trash2,
        Calendar,
        ChevronDown,
        ChevronRight,
        Loader2,
        ExternalLink,
    } from "lucide-svelte";
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte.ts";
    import GoalModal from "./GoalModal.svelte";

    let showGoalModal = $state(false);
    let editingGoal = $state<Goal | null>(null);
    let expandedGoals = $state<Set<string>>(new Set());
    let newTaskInputs = $state<Record<string, string>>({});
    let processingBatch = $state<Record<string, boolean>>({});

    const goals = $derived(goalsStore.activeGoals);

    function openGoalModal(goal: Goal | null = null) {
        editingGoal = goal;
        showGoalModal = true;
    }

    function closeGoalModal() {
        showGoalModal = false;
        editingGoal = null;
    }

    function toggleGoal(goalId: string) {
        if (expandedGoals.has(goalId)) {
            expandedGoals.delete(goalId);
        } else {
            expandedGoals.add(goalId);
        }
        expandedGoals = new Set(expandedGoals);
    }

    async function addTask(goalId: string) {
        const input = newTaskInputs[goalId]?.trim();
        if (!input) return;

        // Check if it's a batch input (multiple lines or YouTube URL)
        const lines = input.split("\n").filter((l) => l.trim());
        const isYouTubeUrl =
            /youtube\.com\/playlist\?list=|youtu\.be\/.*\?list=/.test(input);

        if (lines.length > 1 || isYouTubeUrl) {
            // Batch mode
            processingBatch[goalId] = true;
            try {
                await goalsStore.addTasksBatch(goalId, input);
                newTaskInputs[goalId] = "";

                // Show success message briefly
                setTimeout(() => {
                    processingBatch[goalId] = false;
                }, 1000);
            } catch (error) {
                console.error("Failed to add batch tasks:", error);
                processingBatch[goalId] = false;
            }
        } else {
            // Single task - parse for inline link
            const urlMatch = input.match(/(https?:\/\/[^\s]+)/);
            if (urlMatch) {
                const url = urlMatch[1];
                const title = input.replace(url, "").trim();
                goalsStore.addTask({ goalId, title: title || url, link: url });
            } else {
                goalsStore.addTask({ goalId, title: input });
            }
            newTaskInputs[goalId] = "";
        }
    }

    function deleteGoal(goalId: string, event: Event) {
        event.stopPropagation();
        if (confirm("Delete this goal and all its tasks?")) {
            goalsStore.deleteGoal(goalId);
        }
    }

    function deleteTask(taskId: string, event: Event) {
        event.stopPropagation();
        goalsStore.deleteTask(taskId);
    }

    function formatDeadline(deadline?: string) {
        if (!deadline) return null;
        const date = new Date(deadline);
        const now = new Date();
        const diffDays = Math.ceil(
            (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays < 0) return { text: "Overdue", color: "text-red-500" };
        if (diffDays === 0) return { text: "Today", color: "text-orange-500" };
        if (diffDays <= 7)
            return { text: `${diffDays}d left`, color: "text-yellow-500" };
        return {
            text: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            color: "text-muted",
        };
    }

    const priorityColors = {
        high: "text-red-500",
        normal: "text-blue-500",
        low: "text-gray-500",
    };
</script>

<div class="space-y-6 pb-12">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-white">Goals</h1>
        <button
            onclick={() => openGoalModal()}
            class="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
            <Plus size={20} />
            New Goal
        </button>
    </div>

    <!-- Goals List -->
    {#if goals.length === 0}
        <div class="card text-center py-16">
            <Target size={64} class="text-muted mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-white mb-2">No goals yet</h3>
            <p class="text-muted mb-6">Create your first goal to get started</p>
            <button
                onclick={() => openGoalModal()}
                class="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
                <Plus size={20} />
                Create Goal
            </button>
        </div>
    {:else}
        <div class="space-y-4">
            {#each goals as goal}
                {@const tasks = goalsStore.getGoalTasks(goal.id)}
                {@const progress = goalsStore.getGoalProgress(goal.id)}
                {@const isExpanded = expandedGoals.has(goal.id)}
                {@const deadlineInfo = formatDeadline(goal.deadline)}
                {@const isProcessing = processingBatch[goal.id]}

                <div class="card">
                    <!-- Goal Header -->
                    <div
                        class="flex items-start gap-4 cursor-pointer"
                        onclick={() => toggleGoal(goal.id)}
                    >
                        <div class="p-3 rounded-lg bg-primary/10 text-primary">
                            <Target size={24} />
                        </div>

                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-2">
                                <h3 class="text-xl font-bold text-white">
                                    {goal.title}
                                </h3>
                                <span
                                    class="px-2 py-1 rounded text-xs font-medium {priorityColors[
                                        goal.priority
                                    ]} bg-current/10"
                                >
                                    {goal.priority}
                                </span>
                            </div>

                            {#if goal.description}
                                <p class="text-sm text-muted mb-3">
                                    {goal.description}
                                </p>
                            {/if}

                            <div
                                class="flex items-center gap-4 text-sm text-muted"
                            >
                                {#if tasks.length > 0}
                                    <span
                                        >{tasks.filter((t) => t.completed)
                                            .length}/{tasks.length} tasks</span
                                    >
                                {/if}
                                {#if deadlineInfo}
                                    <span
                                        class="flex items-center gap-1 {deadlineInfo.color}"
                                    >
                                        <Calendar size={14} />
                                        {deadlineInfo.text}
                                    </span>
                                {/if}
                            </div>
                        </div>

                        <div class="flex items-center gap-3">
                            <div class="text-right">
                                <span class="text-3xl font-bold text-white"
                                    >{progress}%</span
                                >
                            </div>
                            <button
                                class="p-2 hover:bg-surface rounded-lg transition-colors"
                            >
                                {#if isExpanded}
                                    <ChevronDown size={20} class="text-muted" />
                                {:else}
                                    <ChevronRight
                                        size={20}
                                        class="text-muted"
                                    />
                                {/if}
                            </button>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div
                        class="mt-4 h-2 w-full bg-background rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-primary transition-all duration-300"
                            style="width: {progress}%"
                        ></div>
                    </div>

                    <!-- Expanded Tasks -->
                    {#if isExpanded}
                        <div class="mt-6 space-y-3 border-t border-line pt-6">
                            <!-- Task List -->
                            {#each tasks as task}
                                <div class="flex items-center gap-3 group">
                                    <button
                                        onclick={() =>
                                            goalsStore.toggleTask(task.id)}
                                        class="flex-shrink-0"
                                    >
                                        {#if task.completed}
                                            <div
                                                class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                                            >
                                                <svg
                                                    class="w-3 h-3 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="3"
                                                        d="M5 13l4 4L19 7"
                                                    ></path>
                                                </svg>
                                            </div>
                                        {:else}
                                            <div
                                                class="w-5 h-5 rounded-full border-2 border-muted hover:border-primary transition-colors"
                                            ></div>
                                        {/if}
                                    </button>

                                    <span
                                        class="flex-1 text-white {task.completed
                                            ? 'line-through opacity-50'
                                            : ''}"
                                    >
                                        {task.title}
                                    </span>

                                    <div class="flex items-center gap-1">
                                        {#if task.link}
                                            <a
                                                href={task.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="p-1 hover:bg-surface rounded transition-all opacity-0 group-hover:opacity-100"
                                                onclick={(e) =>
                                                    e.stopPropagation()}
                                            >
                                                <ExternalLink
                                                    size={16}
                                                    class="text-primary"
                                                />
                                            </a>
                                        {/if}
                                        <button
                                            onclick={(e) =>
                                                deleteTask(task.id, e)}
                                            class="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface rounded transition-all"
                                        >
                                            <Trash2
                                                size={16}
                                                class="text-muted hover:text-red-500"
                                            />
                                        </button>
                                    </div>
                                </div>
                            {/each}

                            <!-- Add Task Input -->
                            <div class="space-y-2 pt-2">
                                <textarea
                                    bind:value={newTaskInputs[goal.id]}
                                    placeholder="Add tasks (one per line) or paste YouTube playlist URL...&#10;You can include links: Task name https://example.com"
                                    rows="3"
                                    class="w-full bg-background border border-line rounded-lg px-3 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-primary resize-none"
                                    onkeydown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            (e.metaKey || e.ctrlKey)
                                        ) {
                                            e.preventDefault();
                                            addTask(goal.id);
                                        }
                                    }}
                                ></textarea>
                                <div class="flex items-center justify-between">
                                    <span class="text-xs text-muted">
                                        💡 Paste multiple lines, YouTube
                                        playlist, or add links inline
                                    </span>
                                    <button
                                        onclick={() => addTask(goal.id)}
                                        disabled={isProcessing}
                                        class="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {#if isProcessing}
                                            <Loader2
                                                size={16}
                                                class="animate-spin"
                                            />
                                            Processing...
                                        {:else}
                                            Add
                                        {/if}
                                    </button>
                                </div>
                            </div>

                            <!-- Goal Actions -->
                            <div
                                class="flex items-center gap-2 pt-4 border-t border-line/50"
                            >
                                <button
                                    onclick={() => openGoalModal(goal)}
                                    class="text-sm text-primary hover:text-primary/80 transition-colors"
                                >
                                    Edit Goal
                                </button>
                                <button
                                    onclick={(e) => deleteGoal(goal.id, e)}
                                    class="text-sm text-muted hover:text-red-500 transition-colors ml-auto"
                                >
                                    Delete Goal
                                </button>
                            </div>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Modal -->
<GoalModal
    bind:isOpen={showGoalModal}
    onClose={closeGoalModal}
    goal={editingGoal}
/>
