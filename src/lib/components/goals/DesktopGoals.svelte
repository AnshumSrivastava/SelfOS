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
        { id: "today", label: "Today", icon: Zap, color: "text-amber-400" },
        { id: "goals", label: "Goals", icon: Network, color: "text-primary" },
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
    <PageHeader title="Vision" subtitle="Strategic Operations" icon={Target}>
        <div class="flex items-center gap-6">
            <!-- Tabs -->
            <div class="flex bg-white/5 p-1 rounded-xl border border-white/5">
                {#each tabs as tab}
                    <button
                        onclick={() => onTabChange(tab.id as any)}
                        class="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 {activeTab ===
                        tab.id
                            ? 'bg-primary text-black shadow-lg shadow-primary/20'
                            : 'text-muted hover:text-white'}"
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                {/each}
            </div>

            <div class="h-6 w-px bg-line"></div>

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
                class="p-2 rounded-xl border border-line text-muted hover:text-text hover:bg-white/5 transition-all"
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
            class="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative"
        >
            <!-- Sub-navigation for Goals view -->
            {#if activeTab === "goals"}
                <div
                    class="h-14 flex-shrink-0 border-b border-line flex items-center justify-between px-8 bg-white/2"
                >
                    <GoalsFilters bind:filters />

                    <div class="flex items-center gap-1">
                        {#each [{ id: "tree", icon: Network, title: "Network" }, { id: "board", icon: Columns, title: "Board" }, { id: "roadmap", icon: Map, title: "Map" }] as mode}
                            <button
                                class="p-2 rounded-xl text-muted hover:text-text hover:bg-white/5 transition-all {planViewMode ===
                                mode.id
                                    ? 'text-primary'
                                    : ''}"
                                onclick={() => (planViewMode = mode.id as any)}
                                title={mode.title}
                            >
                                <mode.icon size={16} />
                            </button>
                        {/each}
                        <div class="w-px h-4 bg-line mx-2"></div>
                        <button
                            onclick={() => (planViewMode = "importer")}
                            class="p-2 rounded-xl text-muted hover:text-text hover:bg-white/5 transition-all {planViewMode ===
                            'importer'
                                ? 'text-primary'
                                : ''}"
                            title="Import"
                        >
                            <Upload size={16} />
                        </button>
                    </div>
                </div>
            {:else if activeTab === "today"}
                <div
                    class="h-12 flex-shrink-0 border-b border-line flex items-center px-8 bg-white/1"
                >
                    <span
                        class="text-[10px] font-bold text-muted uppercase tracking-[0.2em]"
                        >Prioritized Strategic Operations</span
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
