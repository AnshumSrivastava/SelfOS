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
        LayoutGrid,
        Link,
        Type,
        Briefcase,
        User,
        Heart,
        Users,
        PartyPopper,
        Flame,
        Box,
    } from "lucide-svelte";
    import {
        goalsStore,
        type Goal,
        type GoalArea,
    } from "$lib/stores/goals.svelte";
    import GoalModal from "./GoalModal.svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
    import { slide } from "svelte/transition";

    let showGoalModal = $state(false);
    let editingGoal = $state<Goal | null>(null);
    let selectionParentId = $state<string | undefined>(undefined);
    let expandedGoals = $state<Set<string>>(new Set());
    let newTaskInputs = $state<Record<string, string>>({});
    let processingBatch = $state<Record<string, boolean>>({});

    // Filtering
    let activeArea = $state<GoalArea | "All">("All");

    const areas: {
        id: GoalArea;
        name: string;
        icon: any;
        color: string;
        bg: string;
    }[] = [
        {
            id: "Professional",
            name: "Prof",
            icon: Briefcase,
            color: "text-blue-500",
            bg: "bg-blue-500",
        },
        {
            id: "Personal",
            name: "Pers",
            icon: User,
            color: "text-green-500",
            bg: "bg-green-500",
        },
        {
            id: "Health",
            name: "Health",
            icon: Heart,
            color: "text-red-500",
            bg: "bg-red-500",
        },
        {
            id: "Family",
            name: "Fam",
            icon: Users,
            color: "text-indigo-500",
            bg: "bg-indigo-500",
        },
        {
            id: "Fun",
            name: "Fun",
            icon: PartyPopper,
            color: "text-yellow-500",
            bg: "bg-yellow-500",
        },
        {
            id: "Spiritual",
            name: "Spirit",
            icon: Flame,
            color: "text-purple-500",
            bg: "bg-purple-500",
        },
        {
            id: "Other",
            name: "Other",
            icon: Box,
            color: "text-gray-500",
            bg: "bg-gray-500",
        },
    ];

    const goals = $derived(
        goalsStore.activeGoals
            .filter((g) => activeArea === "All" || g.area === activeArea)
            .filter((g) => !g.parentId),
    );

    function openGoalModal(goal: Goal | null = null, parentId?: string) {
        editingGoal = goal;
        selectionParentId = parentId;
        showGoalModal = true;
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

        processingBatch[goalId] = true;
        try {
            await goalsStore.addTasksBatch(goalId, input);
            newTaskInputs[goalId] = "";
            if (!expandedGoals.has(goalId)) {
                expandedGoals.add(goalId);
                expandedGoals = new Set(expandedGoals);
            }
            setTimeout(() => {
                processingBatch[goalId] = false;
            }, 800);
        } catch (error) {
            console.error("Failed to add tasks:", error);
            processingBatch[goalId] = false;
        }
    }

    function formatDeadline(deadline?: string) {
        if (!deadline) return null;
        const date = new Date(deadline);
        const diffDays = Math.ceil(
            (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays < 0) return { text: "Late", color: "text-red-500" };
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

    const priorityColors = {
        high: "text-red-500",
        normal: "text-blue-500",
        low: "text-gray-500",
    };
</script>

<div class="p-4 pb-24 space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-white">Goals</h1>
            <p class="text-xs text-muted">Set & track your ambitions</p>
        </div>
        <button
            onclick={() => openGoalModal()}
            class="w-10 h-10 bg-primary text-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Balance Overview (Horizontal Scroll) -->
    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {#each areas as area}
            {@const progress = goalsStore.getAreaProgress(area.id)}
            <button
                class="flex-shrink-0 card-subtle p-3 min-w-[100px] transition-all {activeArea ===
                area.id
                    ? 'border-primary bg-primary/5'
                    : ''}"
                onclick={() =>
                    (activeArea = activeArea === area.id ? "All" : area.id)}
            >
                <div class="flex flex-col gap-2">
                    <span
                        class="text-[10px] font-bold text-muted uppercase tracking-wider"
                        >{area.name}</span
                    >
                    <span class="text-lg font-black text-white"
                        >{progress}%</span
                    >
                    <ProgressBar
                        value={progress}
                        color={area.bg.replace("bg-", "")}
                        label={area.name}
                    />
                </div>
            </button>
        {/each}
    </div>

    <!-- Goals List -->
    {#if goals.length === 0}
        <div class="card-subtle text-center py-12">
            <Target size={48} class="text-muted mx-auto mb-4 opacity-50" />
            <p class="text-muted">No goals found here</p>
        </div>
    {:else}
        <div class="space-y-4">
            {#each goals as goal (goal.id)}
                {@render GoalCardItem({ goal })}
            {/each}
        </div>
    {/if}
</div>

<!-- Modal -->
<GoalModal
    bind:isOpen={showGoalModal}
    onClose={() => {
        showGoalModal = false;
        editingGoal = null;
        selectionParentId = undefined;
    }}
    goal={editingGoal}
    initialParentId={selectionParentId}
/>

<!-- Snippet -->
{#snippet GoalCardItem({ goal, depth = 0 }: { goal: Goal; depth?: number })}
    {@const tasks = goalsStore.getGoalTasks(goal.id)}
    {@const children = goalsStore.getGoalChildren(goal.id)}
    {@const progress = goalsStore.getGoalProgress(goal.id)}
    {@const isExpanded = expandedGoals.has(goal.id)}
    {@const deadlineInfo = formatDeadline(goal.deadline)}
    {@const isProcessing = processingBatch[goal.id]}
    {@const areaInfo = areas.find((a) => a.id === goal.area)}

    <div
        class="card-subtle overflow-hidden {depth > 0 ? 'mt-3 border-l-2' : ''}"
        style="border-left-color: var(--color-primary)"
    >
        <div
            class="p-4 active:bg-surface/50 transition-colors"
            onclick={() => toggleGoal(goal.id)}
            onkeydown={(e) => e.key === "Enter" && toggleGoal(goal.id)}
            role="button"
            tabindex="0"
        >
            <div class="flex items-start gap-4">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <span
                            class="text-xs font-bold {priorityColors[
                                goal.priority
                            ]} uppercase">{goal.priority}</span
                        >
                        <span class="text-[10px] text-muted">•</span>
                        <span class="text-[10px] text-muted uppercase"
                            >{goal.type}</span
                        >
                        <span class="text-[10px] text-muted">•</span>
                        <span class="text-[10px] text-muted">{goal.area}</span>
                    </div>
                    <h3 class="text-lg font-bold text-white truncate mb-1">
                        {goal.title}
                    </h3>
                    {#if goal.reason}
                        <p
                            class="text-xs text-primary font-medium line-clamp-1 mb-2"
                        >
                            {goal.reason}
                        </p>
                    {/if}

                    <div class="flex items-center gap-3 text-[10px] text-muted">
                        <span class="flex items-center gap-1"
                            ><LayoutGrid size={10} />
                            {tasks.length + children.length} items</span
                        >
                        {#if deadlineInfo}
                            <span
                                class="flex items-center gap-1 {deadlineInfo.color}"
                                ><Calendar size={10} />
                                {deadlineInfo.text}</span
                            >
                        {/if}
                    </div>
                </div>
                <div class="text-right flex flex-col items-end gap-1">
                    <div class="text-2xl font-black text-white">
                        {progress}%
                    </div>
                    <div class="flex items-center gap-2">
                        {#if goal.type !== "short"}
                            <button
                                class="p-2 text-muted active:text-primary transition-colors"
                                onclick={(e) => {
                                    e.stopPropagation();
                                    openGoalModal(null, goal.id);
                                }}
                            >
                                <Plus size={18} />
                            </button>
                        {/if}
                        <div class="text-muted">
                            {#if isExpanded}
                                <ChevronDown size={18} />
                            {:else}
                                <ChevronRight size={18} />
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="mt-3 h-1 w-full bg-background rounded-full overflow-hidden"
            >
                <div
                    class="h-full bg-primary transition-all duration-300"
                    style="width: {progress}%"
                ></div>
            </div>
        </div>

        {#if isExpanded}
            <div
                class="p-4 pt-0 space-y-4 border-t border-line/50 bg-surface/10"
                transition:slide
            >
                <div class="flex justify-between items-center pt-3">
                    <button
                        onclick={(e) => {
                            e.stopPropagation();
                            openGoalModal(goal);
                        }}
                        class="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"
                    >
                        <Type size={10} /> Edit Details
                    </button>
                    <button
                        onclick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete goal?"))
                                goalsStore.deleteGoal(goal.id);
                        }}
                        class="text-[10px] font-bold text-red-500/50 uppercase flex items-center gap-1"
                    >
                        <Trash2 size={10} /> Delete
                    </button>
                </div>

                {#if children.length > 0 || goal.type !== "short"}
                    <div class="space-y-3 pt-1 border-t border-line/10">
                        <div class="flex items-center justify-between">
                            <h4
                                class="text-[10px] font-bold text-muted uppercase tracking-widest"
                            >
                                Sub-Goals
                            </h4>
                            {#if goal.type !== "short"}
                                <button
                                    onclick={() => openGoalModal(null, goal.id)}
                                    class="text-[9px] font-black text-primary uppercase"
                                >
                                    + Add
                                </button>
                            {/if}
                        </div>
                        {#each children as child (child.id)}
                            {@render GoalCardItem({
                                goal: child,
                                depth: depth + 1,
                            })}
                        {/each}
                    </div>
                {/if}

                <div class="space-y-2 pt-3 border-t border-line/10">
                    <h4
                        class="text-[10px] font-bold text-muted uppercase tracking-widest"
                    >
                        Tasks
                    </h4>
                    {#each tasks as task (task.id)}
                        <div class="flex items-center gap-3 py-1 group">
                            <button
                                onclick={() => goalsStore.toggleTask(task.id)}
                                class="flex-shrink-0"
                            >
                                <div
                                    class="w-5 h-5 rounded border-2 {task.completed
                                        ? 'bg-primary border-primary flex items-center justify-center text-black'
                                        : 'border-muted'}"
                                >
                                    {#if task.completed}
                                        <svg
                                            class="w-3.5 h-3.5"
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
                                    {/if}
                                </div>
                            </button>
                            <span
                                class="text-sm text-white flex-1 truncate {task.completed
                                    ? 'opacity-30 line-through'
                                    : ''}">{task.title}</span
                            >
                            <div
                                class="flex items-center gap-2 opacity-0 group-active:opacity-100 transition-opacity"
                            >
                                {#if task.link}
                                    <a
                                        href={task.link}
                                        target="_blank"
                                        class="text-primary p-2"
                                        ><ExternalLink size={14} /></a
                                    >
                                {/if}
                                <button
                                    onclick={() =>
                                        goalsStore.deleteTask(task.id)}
                                    class="text-red-500/50 p-2"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    {/each}
                </div>

                <!-- Task Scratchpad -->
                <div class="pt-3">
                    <div
                        class="bg-background/60 border border-line rounded-xl p-3 shadow-inner"
                    >
                        <div class="flex items-center justify-between mb-2">
                            <h5
                                class="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"
                            >
                                <span
                                    class="w-1 h-1 rounded-full bg-primary animate-pulse"
                                ></span>
                                Goal Scratchpad
                            </h5>
                            <button
                                onclick={() => addTask(goal.id)}
                                disabled={processingBatch[goal.id]}
                                class="text-[9px] font-black text-primary uppercase disabled:opacity-50"
                            >
                                {processingBatch[goal.id]
                                    ? "Adding..."
                                    : "Add Tasks"}
                            </button>
                        </div>

                        <textarea
                            bind:value={newTaskInputs[goal.id]}
                            placeholder="Add tasks (one per line) or YouTube URL..."
                            rows="2"
                            class="w-full bg-transparent border-none p-0 text-sm text-white placeholder-muted/50 resize-none focus:ring-0 outline-none leading-relaxed"
                        ></textarea>
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/snippet}

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
