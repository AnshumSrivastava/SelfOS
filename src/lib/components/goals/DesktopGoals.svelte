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

<div class="h-full flex overflow-hidden">
    <!-- 1. LEFT PANE: Navigator -->
    {#if leftPaneOpen}
        <aside
            class="w-80 flex-shrink-0 border-r border-line bg-surface/10 flex flex-col overflow-hidden"
            in:slide={{ axis: "x" }}
        >
            <div
                class="p-6 border-b border-line flex items-center justify-between"
            >
                <span
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                    >Goal Navigator</span
                >
                <button
                    onclick={() => (leftPaneOpen = false)}
                    class="text-muted hover:text-white"
                >
                    <PanelLeftClose size={16} />
                </button>
            </div>

            <div class="p-4 space-y-4">
                <div class="relative">
                    <Search
                        size={14}
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                        type="text"
                        placeholder="Search vision..."
                        class="w-full bg-surface/50 border border-line rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-muted/50 outline-none focus:border-primary/50"
                    />
                </div>

                <div class="flex flex-col gap-1">
                    {#each tabs as tab}
                        <button
                            onclick={() => onTabChange(tab.id as any)}
                            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all {activeTab ===
                            tab.id
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'text-muted hover:bg-surface border border-transparent'}"
                        >
                            <tab.icon
                                size={18}
                                class={activeTab === tab.id ? tab.color : ""}
                            />
                            <span
                                class="font-bold text-xs uppercase tracking-widest"
                                >{tab.label}</span
                            >
                        </button>
                    {/each}
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
                <GoalHierarchyTree
                    horizon={filters.horizon}
                    onGoalClick={(g) => (ux.selectedGoalId = g.id)}
                />
            </div>

            <div class="p-4 border-t border-line">
                <button
                    onclick={() => openGoalModal()}
                    class="w-full flex items-center justify-center gap-2 py-3 bg-primary text-black rounded-xl font-bold active:scale-95 transition-all shadow-lg shadow-primary/10"
                >
                    <Plus size={18} />
                    New Goal
                </button>
            </div>
        </aside>
    {:else}
        <div class="p-4 border-r border-line flex flex-col bg-surface/10">
            <button
                onclick={() => (leftPaneOpen = true)}
                class="text-muted hover:text-white mb-4"
            >
                <PanelLeftOpen size={18} />
            </button>
        </div>
    {/if}

    <!-- 2. CENTER PANE: Work Area -->
    <main
        class="flex-1 flex flex-col min-w-0 bg-background overflow-hidden relative"
    >
        <header
            class="h-16 flex-shrink-0 border-b border-line flex items-center justify-between px-8 bg-background/50 backdrop-blur-md z-10"
        >
            <div class="flex items-center gap-4">
                <h1 class="text-xl font-bold text-white capitalize">
                    {activeTab}
                </h1>
                {#if activeTab === "plan"}
                    <div
                        class="flex bg-surface p-1 rounded-xl border border-line ml-4 shadow-inner"
                    >
                        <button
                            class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all {planViewMode ===
                            'tree'
                                ? 'bg-primary text-black'
                                : 'text-muted'}"
                            onclick={() => (planViewMode = "tree")}>Tree</button
                        >
                        <button
                            class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all {planViewMode ===
                            'board'
                                ? 'bg-primary text-black'
                                : 'text-muted'}"
                            onclick={() => (planViewMode = "board")}
                            >Board</button
                        >
                        <button
                            class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all {planViewMode ===
                            'roadmap'
                                ? 'bg-primary text-black'
                                : 'text-muted'}"
                            onclick={() => (planViewMode = "roadmap")}
                            >Roadmap</button
                        >
                    </div>
                {/if}
            </div>

            <div class="flex items-center gap-4">
                {#if activeTab === "plan"}
                    <button
                        onclick={() => (planViewMode = "importer")}
                        class="flex items-center gap-2 px-4 py-2 border border-line rounded-xl text-xs font-bold text-muted hover:text-white hover:bg-surface transition-all"
                    >
                        <Upload size={14} />
                        Import
                    </button>
                {/if}
                <button
                    onclick={() => (rightPaneOpen = !rightPaneOpen)}
                    class="text-muted hover:text-white ml-2"
                >
                    {#if rightPaneOpen}
                        <PanelRightClose size={18} />
                    {:else}
                        <PanelRightOpen size={18} />
                    {/if}
                </button>
            </div>
        </header>

        <!-- Filters Section -->
        <GoalsFilters bind:filters />

        <div class="flex-1 overflow-hidden flex flex-col">
            {#if activeTab === "today"}
                <GoalsTodayView />
            {:else if activeTab === "plan"}
                <div class="flex-1 overflow-auto p-8 custom-scrollbar">
                    {#if planViewMode === "tree"}
                        <GoalHierarchyTree
                            horizon={filters.horizon}
                            onGoalClick={(g) => (ux.selectedGoalId = g.id)}
                        />
                    {:else if planViewMode === "board"}
                        <GoalBoard
                            activeArea={filters.area}
                            focusedGoalId={ux.selectedGoalId}
                            onOpenModal={openGoalModal}
                        />
                    {:else if planViewMode === "roadmap"}
                        <GoalRoadmap />
                    {:else if planViewMode === "importer"}
                        <PlaylistImporter
                            onComplete={(id) => {
                                ux.selectedGoalId = id;
                                planViewMode = "tree";
                            }}
                        />
                    {/if}
                </div>
            {:else if activeTab === "review"}
                <GoalsReviewView {filters} />
            {/if}
        </div>
    </main>

    <!-- 3. RIGHT PANE: Context Panel -->
    {#if rightPaneOpen}
        <aside class="w-96 flex-shrink-0" in:slide={{ axis: "x" }}>
            <GoalContextPanel
                goalId={ux.selectedGoalId}
                onEdit={openGoalModal}
            />
        </aside>
    {/if}
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
