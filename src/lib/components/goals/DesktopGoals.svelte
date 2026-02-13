<script lang="ts">
    import {
        Target,
        Plus,
        Columns,
        Network,
        Zap,
        LayoutGrid,
        ArrowLeft,
        Compass,
        Clock,
        Calendar,
        Flame,
        ArrowUpRight,
        Map,
        Upload,
    } from "lucide-svelte";
    import {
        goalsStore,
        type Goal,
        type GoalArea,
        type GoalHorizon,
    } from "$lib/stores/goals.svelte";
    import GoalModal from "./GoalModal.svelte";
    import GoalBoard from "./GoalBoard.svelte";
    import GoalHierarchyTree from "./GoalHierarchyTree.svelte";
    import GoalProgressRing from "./GoalProgressRing.svelte";
    import NextStepPanel from "./NextStepPanel.svelte";
    import GoalDetailModal from "./GoalDetailModal.svelte";
    import GoalRoadmap from "./GoalRoadmap.svelte";
    import PlaylistImporter from "./PlaylistImporter.svelte";
    import { fade, slide } from "svelte/transition";

    let showGoalModal = $state(false);
    let showDetailModal = $state(false);
    let editingGoal = $state<Goal | null>(null);
    let selectedGoal = $state<Goal | null>(null);
    let viewMode = $state<"strategic" | "board" | "roadmap" | "importer">(
        "strategic",
    );
    let activeHorizon = $state<GoalHorizon | "all">("all");
    let activeArea = $state<GoalArea | "All">("All");

    const horizons: { id: GoalHorizon | "all"; name: string; icon: any }[] = [
        { id: "all", name: "All Horizons", icon: Compass },
        { id: "life", name: "Life Goals", icon: Flame },
        { id: "long", name: "Long Term", icon: Calendar },
        { id: "mid", name: "Mid Term", icon: Clock },
        { id: "short", name: "Short Term", icon: Zap },
    ];

    function openGoalModal(goal: Goal | null = null) {
        editingGoal = goal;
        showGoalModal = true;
    }

    const topGoals = $derived(
        goalsStore.goals
            .filter((g) => !g.parentId && g.status === "active")
            .sort((a, b) => (a.priority === "high" ? -1 : 1))
            .slice(0, 3),
    );
</script>

<div class="page-container h-full max-w-[1400px] mx-auto px-6 py-8">
    <!-- War Room Header -->
    <div
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12"
    >
        <div class="flex-1">
            <h1 class="text-4xl font-light text-white mb-2 tracking-tight">
                Strategic <span class="text-primary font-medium">Dashboard</span
                >
            </h1>
            <p class="text-muted text-sm max-w-lg">
                Your mission control for long-term vision and daily execution.
                Architecting future trajectories via intentional action.
            </p>

            <!-- Quick Stats -->
            <div class="flex gap-6 mt-6">
                {#each topGoals as goal}
                    <div
                        class="flex items-center gap-3 bg-surface border border-line p-3 rounded-2xl"
                    >
                        <GoalProgressRing
                            progress={goalsStore.getGoalProgress(goal.id)}
                            health={goalsStore.getGoalHealth(goal.id)}
                            size="sm"
                        />
                        <div class="min-w-0 max-w-[120px]">
                            <p
                                class="text-[10px] font-bold text-muted uppercase tracking-wider truncate"
                            >
                                {goal.title}
                            </p>
                            <p
                                class="text-xs text-white/70 font-medium truncate"
                            >
                                {goalsStore.getGoalProgress(goal.id)}% Complete
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <div class="flex items-center gap-4 self-end lg:self-center">
            <div class="flex bg-surface p-1 rounded-2xl border border-line">
                <button
                    class="p-2 px-4 rounded-xl transition-all flex items-center gap-2 text-sm {viewMode ===
                    'strategic'
                        ? 'bg-primary text-black shadow-lg shadow-primary/10'
                        : 'text-muted hover:text-white'}"
                    onclick={() => (viewMode = "strategic")}
                >
                    <Network size={16} />
                    <span class="font-medium">Strategic</span>
                </button>
                <button
                    class="p-2 px-4 rounded-xl transition-all flex items-center gap-2 text-sm {viewMode ===
                    'board'
                        ? 'bg-primary text-black shadow-lg shadow-primary/10'
                        : 'text-muted hover:text-white'}"
                    onclick={() => (viewMode = "board")}
                >
                    <LayoutGrid size={16} />
                    <span class="font-medium">Board</span>
                </button>
                <button
                    class="p-2 px-4 rounded-xl transition-all flex items-center gap-2 text-sm {viewMode ===
                    'roadmap'
                        ? 'bg-primary text-black shadow-lg shadow-primary/10'
                        : 'text-muted hover:text-white'}"
                    onclick={() => (viewMode = "roadmap")}
                >
                    <Map size={16} />
                    <span class="font-medium">Roadmap</span>
                </button>
                <button
                    class="p-2 px-4 rounded-xl transition-all flex items-center gap-2 text-sm {viewMode ===
                    'importer'
                        ? 'bg-primary text-black shadow-lg shadow-primary/10'
                        : 'text-muted hover:text-white'}"
                    onclick={() => (viewMode = "importer")}
                >
                    <Upload size={16} />
                    <span class="font-medium">Import</span>
                </button>
            </div>

            <button
                onclick={() => openGoalModal()}
                class="flex items-center gap-2 px-6 py-2.5 bg-primary hover:opacity-90 text-black rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/10"
            >
                <Plus size={20} />
                New Initiative
            </button>
        </div>
    </div>

    <!-- Horizon Tabs -->
    <div
        class="flex gap-2 overflow-x-auto pb-6 scrollbar-hide border-b border-line mb-8"
    >
        {#each horizons as horizon}
            <button
                class="flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all border shrink-0 {activeHorizon ===
                horizon.id
                    ? 'bg-primary/10 border-primary/30 text-primary font-bold'
                    : 'bg-transparent border-transparent text-muted hover:text-white hover:bg-surface'}"
                onclick={() => (activeHorizon = horizon.id)}
            >
                <horizon.icon size={18} />
                <span class="text-sm tracking-wide">{horizon.name}</span>
            </button>
        {/each}
    </div>

    <!-- Execution Intelligence -->
    {#if !activeHorizon || activeHorizon === "all"}
        <div class="mb-10" in:slide>
            <NextStepPanel />
        </div>
    {/if}

    <!-- Main Content -->
    <div class="min-h-[500px]">
        {#if viewMode === "strategic"}
            <div in:fade class="text-white">
                <GoalHierarchyTree
                    horizon={activeHorizon}
                    onGoalClick={(g: Goal) => {
                        selectedGoal = g;
                        showDetailModal = true;
                    }}
                />
            </div>
        {:else if viewMode === "board"}
            <div in:fade>
                <GoalBoard
                    {activeArea}
                    focusedGoalId={null}
                    onOpenModal={openGoalModal}
                />
            </div>
        {:else if viewMode === "roadmap"}
            <div in:fade>
                <GoalRoadmap />
            </div>
        {:else if viewMode === "importer"}
            <div in:fade>
                <PlaylistImporter
                    onComplete={(id) => {
                        const goal = goalsStore.goals.find((g) => g.id === id);
                        if (goal) {
                            selectedGoal = goal;
                            showDetailModal = true;
                            viewMode = "strategic";
                        }
                    }}
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
    }}
    goal={editingGoal}
/>

{#if selectedGoal}
    <GoalDetailModal
        bind:isOpen={showDetailModal}
        goal={selectedGoal}
        onClose={() => {
            showDetailModal = false;
            selectedGoal = null;
        }}
        onEdit={(g) => {
            selectedGoal = null;
            showDetailModal = false;
            editingGoal = g;
            showGoalModal = true;
        }}
    />
{/if}

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
