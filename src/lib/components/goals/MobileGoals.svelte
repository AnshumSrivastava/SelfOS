<script lang="ts">
    import {
        Target,
        Plus,
        Calendar,
        ChevronDown,
        ChevronUp,
        Loader2,
        ExternalLink,
    } from "lucide-svelte";
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte";
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
            return { text: `${diffDays}d`, color: "text-yellow-500" };
        return {
            text: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            color: "text-muted",
        };
    }
</script>

<div class="page-container h-full">
    <!-- Header -->
    <div class="module-header">
        <div>
            <h1 class="text-3xl font-light text-white">Goals</h1>
            <p class="text-sm text-muted">Set direction. Achieve.</p>
        </div>
        <button
            onclick={() => openGoalModal()}
            class="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            aria-label="New Goal"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Goals List -->
    {#if goals.length === 0}
        <div class="text-center py-16 card-subtle">
            <Target size={64} class="text-muted mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-white mb-2">No goals yet</h3>
            <p class="text-muted mb-6">Create your first goal</p>
            <button
                onclick={() => openGoalModal()}
                class="px-6 py-3 bg-primary text-black font-semibold rounded-full active:scale-95 transition-transform"
            >
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

                <div class="card-subtle">
                    <!-- Goal Header -->
                    <div
                        class="flex items-start justify-between cursor-pointer"
                        onclick={() => toggleGoal(goal.id)}
                        onkeydown={(e) =>
                            e.key === "Enter" && toggleGoal(goal.id)}
                        role="button"
                        tabindex="0"
                    >
                        <div class="flex-1">
                            <h3 class="text-lg font-bold text-white mb-1">
                                {goal.title}
                            </h3>

                            {#if goal.description}
                                <p class="text-sm text-muted mb-2">
                                    {goal.description}
                                </p>
                            {/if}

                            <div
                                class="flex items-center gap-3 text-xs text-muted"
                            >
                                {#if tasks.length > 0}
                                    <span
                                        >{tasks.filter((t) => t.completed)
                                            .length}/{tasks.length} done</span
                                    >
                                {/if}
                                {#if deadlineInfo}
                                    <span
                                        class="flex items-center gap-1 {deadlineInfo.color}"
                                    >
                                        <Calendar size={12} />
                                        {deadlineInfo.text}
                                    </span>
                                {/if}
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <span class="text-xl font-bold text-white"
                                >{progress}%</span
                            >
                            {#if isExpanded}
                                <ChevronUp size={20} class="text-muted" />
                            {:else}
                                <ChevronDown size={20} class="text-muted" />
                            {/if}
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div
                        class="mt-3 h-2 w-full bg-background rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-primary transition-all duration-300"
                            style="width: {progress}%"
                        ></div>
                    </div>

                    <!-- Expanded Tasks -->
                    {#if isExpanded}
                        <div
                            class="mt-4 space-y-2 pt-4 border-t border-neutral-800"
                        >
                            <!-- Task List -->
                            {#each tasks as task}
                                <div class="flex items-center gap-3">
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
                                                class="w-5 h-5 rounded-full border-2 border-gray-600"
                                            ></div>
                                        {/if}
                                    </button>

                                    <span
                                        class="flex-1 text-white text-sm {task.completed
                                            ? 'line-through opacity-50'
                                            : ''}"
                                    >
                                        {task.title}
                                    </span>

                                    {#if task.link}
                                        <a
                                            href={task.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="p-1 rounded active:bg-neutral-800 transition-colors"
                                            onclick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink
                                                size={16}
                                                class="text-white"
                                            />
                                        </a>
                                    {/if}
                                </div>
                            {/each}

                            <!-- Add Task Input -->
                            <div class="space-y-2 pt-2">
                                <textarea
                                    bind:value={newTaskInputs[goal.id]}
                                    placeholder="Add tasks or paste YouTube playlist...&#10;Include links: Task name https://link.com"
                                    rows="2"
                                    class="w-full bg-neutral-800 border-0 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-white resize-none"
                                ></textarea>
                                <button
                                    onclick={() => addTask(goal.id)}
                                    disabled={isProcessing}
                                    class="w-full px-3 py-2 bg-white text-black rounded-lg text-sm font-medium active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
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

                            <!-- Edit Button -->
                            <button
                                onclick={() => openGoalModal(goal)}
                                class="text-xs text-gray-500 hover:text-white transition-colors pt-2"
                            >
                                Edit goal
                            </button>
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
