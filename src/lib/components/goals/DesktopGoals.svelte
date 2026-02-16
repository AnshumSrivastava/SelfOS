<script lang="ts">
    import { getContext } from "svelte";
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
        Map,
        Upload,
        Search,
        PanelRightClose,
        PanelRightOpen,
        PanelLeftClose,
        PanelLeftOpen,
        TrendingUp,
        BookOpen,
    } from "lucide-svelte";
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte";
    import GoalModal from "./GoalModal.svelte";
    import GoalBoard from "./GoalBoard.svelte";
    import GoalHierarchyTree from "./GoalHierarchyTree.svelte";
    import GoalRoadmap from "./GoalRoadmap.svelte";
    import PlaylistImporter from "./PlaylistImporter.svelte";
    import GoalsFilters from "./GoalsFilters.svelte";
    import GoalsTodayView from "./GoalsTodayView.svelte";
    import GoalsReviewView from "./GoalsReviewView.svelte";
    import GoalContextPanel from "./GoalContextPanel.svelte";
    import { fade, slide } from "svelte/transition";

    let { activeTab, onTabChange, filters, selectedGoalId } = $props<{
        activeTab: "today" | "plan" | "review";
        onTabChange: (tab: "today" | "plan" | "review") => void;
        filters: any;
        selectedGoalId: string | null;
    }>();

    const ux = getContext<{
        selectedGoalId: string | null;
        activeTab: string;
    }>("goalsUX") as any;

    let showGoalModal = $state(false);
    let editingGoal = $state<Goal | null>(null);
    let leftPaneOpen = $state(true);
    let rightPaneOpen = $state(true);

    let planViewMode = $state<"tree" | "board" | "roadmap" | "importer">(
        "tree",
    );

    function openGoalModal(goal: Goal | null = null) {
        editingGoal = goal;
        showGoalModal = true;
    }

    const tabs = [
        { id: "today", label: "Today", icon: Zap, color: "text-amber-400" },
        { id: "plan", label: "Plan", icon: Network, color: "text-primary" },
        {
            id: "review",
            label: "Review",
            icon: TrendingUp,
            color: "text-purple-400",
        },
    ];
</script>

<div class="h-full flex flex-col overflow-hidden bg-background">
    <!-- 1. UNIFIED HEADER -->
    <header
        class="h-20 flex-shrink-0 border-b border-line flex items-center justify-between px-8 bg-background/50 backdrop-blur-md z-20"
    >
        <div class="flex items-center gap-10">
            <div class="flex items-center gap-3">
                <div class="p-2 rounded-xl bg-primary/10 text-primary">
                    <Target size={24} />
                </div>
                <h1 class="text-xl font-bold text-white tracking-tight">
                    Vision
                </h1>
            </div>

            <!-- Main Tabs -->
            <div
                class="flex bg-surface/50 p-1.5 rounded-2xl border border-line shadow-inner"
            >
                {#each tabs as tab}
                    <button
                        onclick={() => onTabChange(tab.id as any)}
                        class="px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 {activeTab ===
                        tab.id
                            ? 'bg-primary text-black shadow-lg shadow-primary/20'
                            : 'text-muted hover:text-white'}"
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                {/each}
            </div>
        </div>

        <div class="flex items-center gap-4">
            <div class="relative group hidden lg:block">
                <Search
                    size={14}
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors"
                />
                <input
                    type="text"
                    placeholder="Search vision..."
                    class="w-64 bg-surface/30 border border-line rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:bg-surface/50 transition-all"
                />
            </div>

            <div class="h-8 w-px bg-line mx-2"></div>

            <button
                onclick={() => openGoalModal()}
                class="flex items-center gap-2 px-6 py-2.5 bg-primary text-black rounded-xl font-bold active:scale-95 transition-all shadow-lg shadow-primary/10"
            >
                <Plus size={18} />
                <span class="text-xs uppercase tracking-widest">New Goal</span>
            </button>

            <button
                onclick={() => (rightPaneOpen = !rightPaneOpen)}
                class="p-2.5 rounded-xl border border-line text-muted hover:text-white hover:bg-surface transition-all"
                title={rightPaneOpen ? "Close Context" : "Open Context"}
            >
                {#if rightPaneOpen}
                    <PanelRightClose size={18} />
                {:else}
                    <PanelRightOpen size={18} />
                {/if}
            </button>
        </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
        <!-- 2. MAIN WORKSPACE -->
        <main
            class="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative"
        >
            <!-- Sub-navigation for Plan view -->
            {#if activeTab === "plan"}
                <div
                    class="h-14 flex-shrink-0 border-b border-line/30 flex items-center justify-between px-8 bg-surface/5"
                >
                    <GoalsFilters bind:filters />

                    <div class="flex items-center gap-2">
                        <button
                            class="p-2 rounded-lg text-muted hover:text-white hover:bg-surface transition-all {planViewMode ===
                            'tree'
                                ? 'text-primary'
                                : ''}"
                            onclick={() => (planViewMode = "tree")}
                            title="Tree View"
                        >
                            <Network size={18} />
                        </button>
                        <button
                            class="p-2 rounded-lg text-muted hover:text-white hover:bg-surface transition-all {planViewMode ===
                            'board'
                                ? 'text-primary'
                                : ''}"
                            onclick={() => (planViewMode = "board")}
                            title="Board View"
                        >
                            <Columns size={18} />
                        </button>
                        <button
                            class="p-2 rounded-lg text-muted hover:text-white hover:bg-surface transition-all {planViewMode ===
                            'roadmap'
                                ? 'text-primary'
                                : ''}"
                            onclick={() => (planViewMode = "roadmap")}
                            title="Roadmap View"
                        >
                            <Map size={18} />
                        </button>
                        <div class="w-px h-4 bg-line mx-1"></div>
                        <button
                            onclick={() => (planViewMode = "importer")}
                            class="p-2 rounded-lg text-muted hover:text-white hover:bg-surface transition-all"
                            title="Import"
                        >
                            <Upload size={18} />
                        </button>
                    </div>
                </div>
            {:else if activeTab === "today"}
                <div
                    class="h-14 flex-shrink-0 border-b border-line/30 flex items-center px-8 bg-surface/5"
                >
                    <span
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                        >Prioritized Strategic Operations</span
                    >
                </div>
            {/if}

            <div class="flex-1 overflow-hidden flex flex-col">
                {#if activeTab === "today"}
                    <GoalsTodayView />
                {:else if activeTab === "plan"}
                    <div class="flex-1 overflow-auto custom-scrollbar">
                        {#if planViewMode === "tree"}
                            <div class="p-8 max-w-5xl mx-auto">
                                <GoalHierarchyTree
                                    horizon={filters.horizon}
                                    onGoalClick={(g) =>
                                        (ux.selectedGoalId = g.id)}
                                />
                            </div>
                        {:else if planViewMode === "board"}
                            <div class="h-full p-8">
                                <GoalBoard
                                    activeArea={filters.area}
                                    focusedGoalId={ux.selectedGoalId}
                                    onOpenModal={openGoalModal}
                                />
                            </div>
                        {:else if planViewMode === "roadmap"}
                            <div class="p-8">
                                <GoalRoadmap />
                            </div>
                        {:else if planViewMode === "importer"}
                            <div class="p-8 max-w-2xl mx-auto">
                                <PlaylistImporter
                                    onComplete={(id) => {
                                        ux.selectedGoalId = id;
                                        planViewMode = "tree";
                                    }}
                                />
                            </div>
                        {/if}
                    </div>
                {:else if activeTab === "review"}
                    <div class="flex-1 overflow-auto custom-scrollbar p-8">
                        <GoalsReviewView {filters} />
                    </div>
                {/if}
            </div>
        </main>

        <!-- 3. CONTEXT PANEL -->
        {#if rightPaneOpen}
            <aside
                class="w-96 flex-shrink-0 border-l border-line bg-surface/5"
                in:slide={{ axis: "x" }}
            >
                <GoalContextPanel
                    goalId={ux.selectedGoalId}
                    onEdit={openGoalModal}
                />
            </aside>
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
</style>
