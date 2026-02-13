<script lang="ts">
    import {
        Target,
        Plus,
        Trash2,
        ChevronDown,
        ChevronRight,
        Network,
        Columns,
        Sparkles,
        Zap,
        LayoutGrid,
        Briefcase,
        User,
        Heart,
        Users,
        PartyPopper,
        Flame,
        Box,
        Type,
        Check,
        ArrowLeft,
    } from "lucide-svelte";
    import {
        goalsStore,
        type Goal,
        type GoalArea,
    } from "$lib/stores/goals.svelte";
    import GoalModal from "./GoalModal.svelte";
    import GoalBoard from "./GoalBoard.svelte";
    import ProgressBar from "$lib/components/ui/ProgressBar.svelte";
    import { fade, slide } from "svelte/transition";

    let showGoalModal = $state(false);
    let editingGoal = $state<Goal | null>(null);
    let selectionParentId = $state<string | undefined>(undefined);
    let expandedGoals = $state<Set<string>>(new Set());
    let viewMode = $state<"tree" | "board">("tree");
    let focusedGoalId = $state<string | null>(null);

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
            name: "Professional",
            icon: Briefcase,
            color: "text-blue-500",
            bg: "bg-blue-500",
        },
        {
            id: "Personal",
            name: "Personal",
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
            name: "Family",
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
            name: "Spiritual",
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

    const goals = $derived.by(() => {
        if (focusedGoalId) {
            const focused = goalsStore.goals.find(
                (g) => g.id === focusedGoalId,
            );
            return focused ? [focused] : [];
        }
        return goalsStore.activeGoals
            .filter((g) => activeArea === "All" || g.area === activeArea)
            .filter((g) => !g.parentId);
    });

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

    function formatDeadline(deadline?: string) {
        if (!deadline) return null;
        const date = new Date(deadline);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }

    const priorityColors = {
        high: "text-red-500",
        normal: "text-blue-500",
        low: "text-gray-500",
    };
</script>

<div class="page-container h-full max-w-[1400px] mx-auto px-6">
    <!-- Header with View Switcher -->
    <div class="flex items-end justify-between mb-8">
        <div>
            <div class="flex items-center gap-3 mb-2">
                {#if focusedGoalId}
                    <button
                        onclick={() => (focusedGoalId = null)}
                        class="p-2 hover:bg-surface/40 rounded-lg text-muted hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                {/if}
                <h1 class="text-3xl font-light text-white">
                    {focusedGoalId ? "Goal Focus" : "Goals & Ambition"}
                </h1>
            </div>
            <p class="text-muted text-sm px-1">
                {focusedGoalId
                    ? "Deep diving into a specific trajectory."
                    : "Architect your future, one atom at a time."}
            </p>
        </div>

        <div class="flex items-center gap-4">
            <div
                class="flex bg-surface/40 p-1 rounded-xl border border-line/20"
            >
                <button
                    class="p-2 px-4 rounded-lg transition-all flex items-center gap-2 text-sm {viewMode ===
                    'tree'
                        ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20'
                        : 'text-muted hover:text-white'}"
                    onclick={() => (viewMode = "tree")}
                >
                    <Network size={16} />
                    <span>Tree</span>
                </button>
                <button
                    class="p-2 px-4 rounded-lg transition-all flex items-center gap-2 text-sm {viewMode ===
                    'board'
                        ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20'
                        : 'text-muted hover:text-white'}"
                    onclick={() => (viewMode = "board")}
                >
                    <Columns size={16} />
                    <span>Board</span>
                </button>
            </div>

            <button
                onclick={() => openGoalModal()}
                class="btn btn-primary flex items-center gap-2 group active:scale-95"
            >
                <Plus
                    size={20}
                    class="group-hover:rotate-90 transition-transform"
                />
                New Goal
            </button>
        </div>
    </div>

    <!-- Top Bar: Life Balance Summary -->
    {#if !focusedGoalId}
        <div class="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {#each areas as area}
                {@const progress = goalsStore.getAreaProgress(area.id)}
                <button
                    class="flex-shrink-0 group p-3 px-5 rounded-2xl transition-all border {activeArea ===
                    area.id
                        ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/5'
                        : 'bg-surface/30 border-transparent hover:border-line/20'}"
                    onclick={() =>
                        (activeArea = activeArea === area.id ? "All" : area.id)}
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="p-2 rounded-xl bg-background/50 {area.color} border border-line/10"
                        >
                            <area.icon size={18} />
                        </div>
                        <div class="text-left">
                            <div
                                class="text-[10px] font-bold text-muted uppercase tracking-widest mb-0.5"
                            >
                                {area.name}
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-sm font-black text-white"
                                    >{progress}%</span
                                >
                                <div class="w-20">
                                    <ProgressBar
                                        value={progress}
                                        color={area.bg.replace("bg-", "")}
                                        height="h-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            {/each}
        </div>
    {/if}

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-20">
        {#if viewMode === "tree"}
            {#if goals.length === 0}
                <div
                    class="flex flex-col items-center justify-center h-[400px] text-center"
                >
                    <div
                        class="w-16 h-16 rounded-full bg-surface/40 flex items-center justify-center mb-6 group"
                    >
                        <Target
                            size={32}
                            class="text-primary opacity-20 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                    <h2 class="text-xl font-bold text-white mb-2">
                        No goals in sight
                    </h2>
                    <p class="text-muted text-sm max-w-sm mb-8">
                        Every great achievement starts with the decision to try.
                    </p>
                    <button
                        onclick={() => openGoalModal()}
                        class="btn btn-primary px-8"
                        >Calculate Trajectory</button
                    >
                </div>
            {:else}
                <div class="space-y-4">
                    {#each goals as goal (goal.id)}
                        {@render GoalItem({ goal, onOpenModal: openGoalModal })}
                    {/each}
                </div>
            {/if}
        {:else}
            <div in:fade>
                <GoalBoard
                    {activeArea}
                    {focusedGoalId}
                    onOpenModal={openGoalModal}
                />
            </div>
        {/if}
    </div>
</div>

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

{#snippet GoalItem({ goal, depth = 0, onOpenModal })}
    {@const tasks = goalsStore.getGoalTasks(goal.id)}
    {@const children = goalsStore.getGoalChildren(goal.id)}
    {@const progress = goalsStore.getGoalProgress(goal.id)}
    {@const isExpanded = expandedGoals.has(goal.id)}
    {@const deadline = formatDeadline(goal.deadline)}

    <div class="relative">
        <!-- Connector Line for Hierarchy -->
        {#if depth > 0}
            <div
                class="absolute left-[-20px] top-[-10px] bottom-0 w-[1.5px] bg-line/20"
                style="height: {isExpanded &&
                (children.length > 0 || tasks.length > 0)
                    ? '100%'
                    : '32px'}"
            ></div>
            <div
                class="absolute left-[-20px] top-[22px] w-5 h-[1.5px] bg-line/20"
            ></div>
        {/if}

        <div
            class="card-subtle overflow-hidden transition-all {depth > 0
                ? 'ml-6'
                : ''} {isExpanded
                ? 'ring-1 ring-primary/20 shadow-lg'
                : ''} {focusedGoalId === goal.id ? 'border-primary/50' : ''}"
        >
            <!-- Compact Goal Header -->
            <div
                class="p-3 px-4 cursor-pointer hover:bg-surface/30 transition-colors"
                onclick={() => toggleGoal(goal.id)}
                onkeydown={(e) => e.key === "Enter" && toggleGoal(goal.id)}
                role="button"
                tabindex="0"
            >
                <div class="flex items-center gap-4">
                    <!-- Smaller Icon -->
                    <div
                        class="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center text-primary border border-line/10 flex-shrink-0"
                    >
                        <Target
                            size={18}
                            class={progress === 100
                                ? "text-primary"
                                : "opacity-30"}
                        />
                    </div>

                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-0.5">
                            <span
                                class="text-[9px] font-black uppercase tracking-widest {priorityColors[
                                    goal.priority
                                ]}">{goal.priority}</span
                            >
                            <span
                                class="text-[8px] text-muted-foreground opacity-50"
                                >•</span
                            >
                            <span
                                class="text-[9px] text-muted font-bold uppercase"
                                >{goal.area}</span
                            >
                            {#if deadline}
                                <span
                                    class="text-[8px] text-muted-foreground opacity-50"
                                    >•</span
                                >
                                <span
                                    class="text-[9px] text-muted font-bold flex items-center gap-1"
                                >
                                    <Box size={10} />
                                    {deadline}
                                </span>
                            {/if}
                        </div>
                        <h3
                            class="text-base font-bold text-white truncate transition-colors group-hover:text-primary"
                        >
                            {goal.title}
                        </h3>
                    </div>

                    <div class="flex items-center gap-6">
                        <!-- Tiny Progress Bar -->
                        <div class="flex flex-col items-end gap-1">
                            <span class="text-xs font-black text-white"
                                >{progress}%</span
                            >
                            <div class="w-16">
                                <ProgressBar
                                    value={progress}
                                    height="h-1"
                                    showValue={false}
                                />
                            </div>
                        </div>

                        <!-- Consolidated Actions -->
                        <div
                            class="flex gap-0.5 opacity-0 group-hover/goal:opacity-100 transition-opacity"
                        >
                            <button
                                onclick={(e) => {
                                    e.stopPropagation();
                                    onOpenModal(goal);
                                }}
                                class="p-1.5 hover:bg-background rounded-lg text-muted hover:text-white transition-colors"
                                title="Edit"
                            >
                                <Type size={14} />
                            </button>
                            {#if goal.type !== "short"}
                                <button
                                    onclick={(e) => {
                                        e.stopPropagation();
                                        onOpenModal(null, goal.id);
                                    }}
                                    class="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                                    title="Add Sub"
                                >
                                    <Plus size={14} />
                                </button>
                            {/if}
                            <button
                                onclick={(e) => {
                                    e.stopPropagation();
                                    focusedGoalId = goal.id;
                                }}
                                class="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-colors"
                                title="Focus"
                            >
                                <Zap size={14} />
                            </button>
                            <button
                                onclick={(e) => {
                                    e.stopPropagation();
                                    if (confirm("Delete?"))
                                        goalsStore.deleteGoal(goal.id);
                                }}
                                class="p-1.5 hover:bg-red-500/10 rounded-lg text-muted hover:text-red-500 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <!-- Toggle -->
                        <div class="text-muted p-1">
                            {#if isExpanded}
                                <ChevronDown size={18} />
                            {:else}
                                <ChevronRight size={18} />
                            {/if}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Expanded Content (Very Minimal) -->
            {#if isExpanded}
                <div
                    class="p-4 pt-0 space-y-4 border-t border-line/5 bg-surface/5"
                    transition:slide
                >
                    <!-- Sub-goals -->
                    {#if children.length > 0}
                        <div class="space-y-3 pt-3">
                            {#each children as child (child.id)}
                                {@render GoalItem({
                                    goal: child,
                                    depth: depth + 1,
                                    onOpenModal,
                                })}
                            {/each}
                        </div>
                    {/if}

                    <!-- Atomic Tasks (Grid of 3) -->
                    {#if tasks.length > 0}
                        <div class="pt-2 border-t border-line/5">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {#each tasks as task (task.id)}
                                    <div
                                        class="flex items-center gap-2 p-2 bg-background/20 rounded-lg border border-line/5 group/task"
                                    >
                                        <button
                                            onclick={() =>
                                                goalsStore.toggleTask(task.id)}
                                            class="flex-shrink-0"
                                        >
                                            <div
                                                class="w-4 h-4 rounded border transition-all {task.completed
                                                    ? 'bg-primary border-primary flex items-center justify-center text-black'
                                                    : 'border-muted'}"
                                            >
                                                {#if task.completed}<Check
                                                        size={10}
                                                        strokeWidth={4}
                                                    />{/if}
                                            </div>
                                        </button>
                                        <span
                                            class="text-[11px] flex-1 truncate {task.completed
                                                ? 'text-muted line-through opacity-50'
                                                : 'text-white/80'}"
                                        >
                                            {task.title}
                                        </span>
                                        <button
                                            onclick={() =>
                                                goalsStore.deleteTask(task.id)}
                                            class="opacity-0 group-hover/task:opacity-100 p-1 text-muted hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <!-- Tiny Quick Add -->
                    <div class="flex items-center gap-2 pt-2">
                        <input
                            type="text"
                            placeholder="Add instant task..."
                            class="flex-1 bg-background/30 border border-line/5 rounded-lg px-3 py-1.5 text-[11px] text-white outline-none focus:border-primary/20 transition-all"
                            onkeydown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    e.currentTarget.value.trim()
                                ) {
                                    goalsStore.addTask({
                                        goalId: goal.id,
                                        title: e.currentTarget.value.trim(),
                                    });
                                    e.currentTarget.value = "";
                                }
                            }}
                        />
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/snippet}

<style>
    :global(.group-hover\/goal:hover .group-hover\/goal\:opacity-100) {
        opacity: 1 !important;
    }

    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
</style>
