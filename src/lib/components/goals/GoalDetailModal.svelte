<script lang="ts">
    import {
        X,
        Target,
        Flag,
        Calendar,
        PenLine,
        Plus,
        Trash2,
        Check,
        ArrowLeft,
        History,
    } from "lucide-svelte";
    import { fade, slide, fly } from "svelte/transition";
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import GoalProgressRing from "./GoalProgressRing.svelte";
    import GoalJournalTimeline from "./GoalJournalTimeline.svelte";
    import GoalLogModal from "./GoalLogModal.svelte";

    let {
        isOpen = $bindable(false),
        goal,
        onClose,
        onEdit,
    } = $props<{
        isOpen: boolean;
        goal: Goal;
        onClose: () => void;
        onEdit: (goal: Goal) => void;
    }>();

    let activeTab = $state<"execution" | "reflection">("execution");
    let showLogModal = $state(false);
    let newTaskTitle = $state("");

    const progress = $derived(goalsStore.getGoalProgress(goal.id));
    const health = $derived(goalsStore.getGoalHealth(goal.id));
    const tasks = $derived(
        tasksStore.tasks.filter((t) => t.goalId === goal.id),
    );
    const children = $derived(goalsStore.getGoalChildren(goal.id));

    function addTask() {
        if (!newTaskTitle.trim()) return;
        tasksStore.add({
            title: newTaskTitle.trim(),
            goalId: goal.id,
            projectId: goal.area,
            priority: goal.priority === "high" ? "high" : "medium",
            deadline: null,
            link: null,
            scheduled: null,
        });
        newTaskTitle = "";
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
        transition:fade={{ duration: 200 }}
        onclick={onClose}
        onkeydown={(e) => (e.key === "Escape" || e.key === " ") && onClose()}
        role="presentation"
    >
        <div
            class="bg-surface border border-line w-full max-w-4xl h-[85vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
        >
            <!-- Sidebar: Vision & Stats -->
            <div
                class="w-full lg:w-80 bg-background/50 border-b lg:border-b-0 lg:border-r border-line p-8 flex flex-col shrink-0"
            >
                <div class="flex items-center justify-between mb-8">
                    <button
                        onclick={onClose}
                        class="p-2 hover:bg-surface rounded-full text-muted"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onclick={() => onEdit(goal)}
                        class="p-2 hover:bg-surface rounded-full text-primary"
                    >
                        <PenLine size={20} />
                    </button>
                </div>

                <div class="flex flex-col items-center text-center mb-8">
                    <GoalProgressRing {progress} {health} size="lg" />
                    <h2 class="text-xl font-bold text-white mt-4 leading-tight">
                        {goal.title}
                    </h2>
                    <span
                        class="px-2 py-0.5 rounded-full bg-primary/10 text-[9px] font-black text-primary border border-primary/20 uppercase tracking-widest mt-2"
                    >
                        {goal.horizon} • {goal.area}
                    </span>
                </div>

                <div class="space-y-6 flex-1 overflow-y-auto scrollbar-hide">
                    {#if goal.vision}
                        <div>
                            <span
                                class="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-2 block"
                                >The Core Vision</span
                            >
                            <p
                                class="text-sm text-white/80 font-serif italic italic leading-relaxed"
                            >
                                "{goal.vision}"
                            </p>
                        </div>
                    {/if}

                    {#if goal.description}
                        <div>
                            <span
                                class="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-2 block"
                                >Strategic Notes</span
                            >
                            <p class="text-xs text-muted leading-relaxed">
                                {goal.description}
                            </p>
                        </div>
                    {/if}

                    <div class="pt-4 border-t border-line">
                        <div
                            class="flex items-center justify-between text-[10px] font-bold text-muted mb-2"
                        >
                            <span>HEALTH</span>
                            <span
                                class={health === "on-track"
                                    ? "text-emerald-500"
                                    : "text-rose-500"}
                                >{health.toUpperCase()}</span
                            >
                        </div>
                        <div
                            class="h-1.5 w-full bg-line rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-primary transition-all duration-1000"
                                style="width: {progress}%"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="flex-1 flex flex-col min-w-0 bg-surface/40">
                <!-- Tab Header -->
                <div
                    class="flex items-center gap-6 px-8 h-16 border-b border-line"
                >
                    <button
                        class="text-sm font-bold transition-all relative {activeTab ===
                        'execution'
                            ? 'text-white'
                            : 'text-muted hover:text-white'}"
                        onclick={() => (activeTab = "execution")}
                    >
                        Execution Board
                        {#if activeTab === "execution"}
                            <div
                                class="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_var(--color-primary-low)]"
                            ></div>
                        {/if}
                    </button>
                    <button
                        class="text-sm font-bold transition-all relative {activeTab ===
                        'reflection'
                            ? 'text-white'
                            : 'text-muted hover:text-white'}"
                        onclick={() => (activeTab = "reflection")}
                    >
                        Reflection Journal
                        {#if activeTab === "reflection"}
                            <div
                                class="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_var(--color-primary-low)]"
                            ></div>
                        {/if}
                    </button>

                    <div class="flex-1"></div>

                    <button
                        onclick={() => (showLogModal = true)}
                        class="hidden md:flex items-center gap-2 px-4 py-1.5 bg-surface hover:bg-background border border-line text-white rounded-xl text-xs font-bold transition-all"
                    >
                        <History size={14} />
                        Log Reflection
                    </button>
                </div>

                <!-- Tab Content -->
                <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {#if activeTab === "execution"}
                        <div in:fade={{ duration: 200 }}>
                            <!-- Quick Add Task -->
                            <div
                                class="mb-8 p-1 bg-surface/50 border border-line rounded-2xl flex items-center focus-within:border-primary/50 transition-all"
                            >
                                <div class="px-4 text-muted">
                                    <Plus size={18} />
                                </div>
                                <input
                                    bind:value={newTaskTitle}
                                    onkeydown={(e) =>
                                        e.key === "Enter" && addTask()}
                                    placeholder="Add an atomic task to this goal..."
                                    class="flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-muted/30"
                                />
                                <button
                                    onclick={addTask}
                                    class="px-4 py-2 bg-primary hover:opacity-90 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all mr-1 shadow-lg shadow-primary/10"
                                    >Add Task</button
                                >
                            </div>

                            <!-- Tasks List -->
                            <div class="space-y-2">
                                {#each tasks as task (task.id)}
                                    <div
                                        class="group flex items-center gap-4 p-4 bg-surface/30 border border-line/30 rounded-2xl hover:border-line transition-all"
                                    >
                                        <button
                                            onclick={() =>
                                                tasksStore.toggle(task.id)}
                                            class="w-5 h-5 rounded-md border-2 transition-all {task.status ===
                                            'completed'
                                                ? 'bg-primary border-primary flex items-center justify-center text-black'
                                                : 'border-line hover:border-muted'}"
                                        >
                                            {#if task.status === "completed"}<Check
                                                    size={12}
                                                    strokeWidth={4}
                                                />{/if}
                                        </button>
                                        <div class="flex-1 min-w-0">
                                            <p
                                                class="text-sm font-medium transition-all {task.status ===
                                                'completed'
                                                    ? 'text-muted/50 line-through'
                                                    : 'text-white'}"
                                            >
                                                {task.title}
                                            </p>
                                        </div>
                                        <button
                                            onclick={() =>
                                                tasksStore.remove(task.id)}
                                            class="opacity-0 group-hover:opacity-100 p-2 text-muted hover:text-rose-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {:else}
                        <div in:fade={{ duration: 200 }}>
                            <GoalJournalTimeline goalId={goal.id} />
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<GoalLogModal
    bind:isOpen={showLogModal}
    {goal}
    onClose={() => (showLogModal = false)}
/>

<style>
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
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
</style>
