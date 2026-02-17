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
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
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
    import { onMount } from "svelte";

    onMount(() => {
        goalsStore.init();
    });

    let { activeTab, onTabChange, filters, selectedGoalId } = $props<{
        activeTab: "today" | "goals" | "review";
        onTabChange: (tab: "today" | "goals" | "review") => void;
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
        { id: "today", label: "Today", icon: Zap, color: "text-theme-warning" },
        {
            id: "goals",
            label: "Goals",
            icon: Network,
            color: "text-theme-primary",
        },
        {
            id: "review",
            label: "Review",
            icon: TrendingUp,
            color: "text-theme-secondary",
        },
    ];
</script>

<div class="h-full flex flex-col overflow-hidden bg-background">
    <!-- 1. UNIFIED HEADER -->
    <PageHeader title="Goals" subtitle="Manage your long-term objectives.">
        <div class="flex items-center gap-6">
            <!-- Tabs -->
            <div
                class="flex bg-theme-surface-subtle p-1 rounded-xl border border-theme-line"
            >
                {#each tabs as tab}
                    <button
                        onclick={() => onTabChange(tab.id as any)}
                        class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 {activeTab ===
                        tab.id
                            ? 'bg-theme-primary text-theme-text-inverse shadow-lg shadow-theme-primary/20'
                            : 'text-theme-text-muted hover:text-theme-text-strong'}"
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                {/each}
            </div>

            <div class="h-6 w-px bg-theme-line"></div>

            <button
                onclick={() => openGoalModal()}
                class="btn btn-primary flex items-center gap-2 h-9 px-4"
            >
                <Plus size={16} />
                <span
                    class="text-[10px] uppercase tracking-widest font-bold hidden sm:inline"
                    >New Goal</span
                >
            </button>

            <button
                onclick={() => (rightPaneOpen = !rightPaneOpen)}
                class="p-2 rounded-xl border border-theme-line text-theme-text-muted hover:text-theme-text-strong hover:bg-theme-surface transition-all"
                title={rightPaneOpen ? "Close Context" : "Open Context"}
            >
                {#if rightPaneOpen}
                    <PanelRightClose size={18} />
                {:else}
                    <PanelRightOpen size={18} />
                {/if}
            </button>
        </div>
    </PageHeader>

    <div class="flex-1 flex overflow-hidden">
        <!-- 2. MAIN WORKSPACE -->
        <main
            class="flex-1 flex flex-col min-w-0 bg-theme-background overflow-hidden relative"
        >
            <!-- Sub-navigation for Goals view -->
            {#if activeTab === "goals"}
                <div
                    class="h-14 flex-shrink-0 border-b border-theme-line flex items-center justify-between px-8 bg-theme-surface-subtle"
                >
                    <GoalsFilters bind:filters />

                    <div class="flex items-center gap-1">
                        {#each [{ id: "tree", icon: Network, title: "Tree" }, { id: "board", icon: Columns, title: "Board" }, { id: "roadmap", icon: Map, title: "Roadmap" }] as mode}
                            <button
                                class="p-2 rounded-xl text-theme-text-muted hover:text-theme-text-strong hover:bg-theme-surface transition-all {planViewMode ===
                                mode.id
                                    ? 'text-theme-primary'
                                    : ''}"
                                onclick={() => (planViewMode = mode.id as any)}
                                title={mode.title}
                            >
                                <mode.icon size={16} />
                            </button>
                        {/each}
                        <div class="w-px h-4 bg-theme-line mx-2"></div>
                        <button
                            onclick={() => (planViewMode = "importer")}
                            class="p-2 rounded-xl text-theme-text-muted hover:text-theme-text-strong hover:bg-theme-surface transition-all {planViewMode ===
                            'importer'
                                ? 'text-theme-primary'
                                : ''}"
                            title="Import"
                        >
                            <Upload size={16} />
                        </button>
                    </div>
                </div>
            {:else if activeTab === "today"}
                <div
                    class="h-12 flex-shrink-0 border-b border-theme-line flex items-center px-8 bg-theme-background-glass"
                >
                    <span
                        class="text-[10px] font-bold text-theme-text-muted uppercase tracking-[0.2em]"
                        >Today's Priorities</span
                    >
                </div>
            {/if}

            <div class="flex-1 overflow-hidden flex flex-col">
                {#if activeTab === "today"}
                    <GoalsTodayView />
                {:else if activeTab === "goals"}
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
                class="w-96 flex-shrink-0 border-l border-theme-line bg-theme-surface-subtle"
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
        background: var(--theme-line);
        border-radius: 10px;
    }
</style>
