<script lang="ts">
    import { getContext } from "svelte";
    import {
        Target,
        Plus,
        Calendar,
        Clock,
        Zap,
        ChevronRight,
        TrendingUp,
        BookOpen,
        Filter,
        Settings2,
        ArrowLeft,
        MoreHorizontal,
        CheckCircle2,
        Play,
        Archive,
        Network,
    } from "lucide-svelte";
    import {
        goalsStore,
        type Goal,
        type GoalArea,
    } from "$lib/stores/goals.svelte";
    import GoalModal from "./GoalModal.svelte";
    import GoalContextPanel from "./GoalContextPanel.svelte";
    import GoalsTodayView from "./GoalsTodayView.svelte";
    import GoalsReviewView from "./GoalsReviewView.svelte";
    import GoalHierarchyTree from "./GoalHierarchyTree.svelte";
    import { slide, fade, fly } from "svelte/transition";
    import { swipe } from "$lib/utils/swipe";

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
    let showFilterSheet = $state(false);

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

    const areas: { id: GoalArea; name: string; icon: any; color: string }[] = [
        {
            id: "Professional",
            name: "Prof",
            icon: Archive,
            color: "text-primary",
        },
        { id: "Personal", name: "Pers", icon: Target, color: "text-green-500" },
        { id: "Health", name: "Health", icon: Target, color: "text-red-500" },
    ];

    const goalsByArea = $derived(
        goalsStore.goals.filter(
            (g) =>
                !g.parentId &&
                (filters.area === "All" || g.area === filters.area),
        ),
    );

    function nextTab() {
        if (activeTab === "today") onTabChange("plan");
        else if (activeTab === "plan") onTabChange("review");
    }

    function prevTab() {
        if (activeTab === "review") onTabChange("plan");
        else if (activeTab === "plan") onTabChange("today");
    }
</script>

<div
    class="flex flex-col bg-background relative"
    use:swipe={{ onSwipeLeft: nextTab, onSwipeRight: prevTab }}
>
    <!-- 1. Header Area -->
    <header
        class="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-line bg-background/80 backdrop-blur-xl sticky top-0 z-20"
    >
        <div class="flex flex-col">
            <span
                class="text-[9px] font-black text-primary uppercase tracking-[0.2em]"
                >Strategy</span
            >
            <h1 class="text-xl font-bold text-white tracking-tight">
                {activeTab === "today"
                    ? "Daily Focus"
                    : activeTab === "plan"
                      ? "Global Plan"
                      : "Performance"}
            </h1>
        </div>

        <div class="flex items-center gap-3">
            <button
                onclick={() => (showFilterSheet = !showFilterSheet)}
                class="p-2 rounded-xl bg-surface/50 border border-line/50 text-muted active:scale-95 transition-all"
            >
                <Filter size={18} />
            </button>
            <button
                onclick={() => openGoalModal()}
                class="w-10 h-10 bg-primary text-black rounded-full flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform"
            >
                <Plus size={22} />
            </button>
        </div>
    </header>

    <!-- 2. Main Content -->
    <main class="flex flex-col pt-2">
        {#if activeTab === "today"}
            <div in:fade>
                <GoalsTodayView isMobile={true} />
            </div>
        {:else if activeTab === "plan"}
            <div class="p-4 space-y-6" in:fade>
                <!-- Area Chips -->
                <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {#each ["All", "Professional", "Personal", "Health", "Family", "Fun"] as area}
                        <button
                            onclick={() => (filters.area = area as any)}
                            class="px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap {filters.area ===
                            area
                                ? 'bg-primary border-primary text-black'
                                : 'bg-surface border-line text-muted'}"
                        >
                            {area}
                        </button>
                    {/each}
                </div>

                <div class="space-y-3">
                    {#each goalsByArea as goal (goal.id)}
                        <button
                            onclick={() => (ux.selectedGoalId = goal.id)}
                            class="w-full card-subtle p-5 flex items-center justify-between border-l-4 group active:scale-[0.98] transition-all"
                            style="border-left-color: var(--color-primary)"
                        >
                            <div class="flex flex-col items-start gap-1">
                                <span
                                    class="text-[9px] font-black text-muted uppercase tracking-widest"
                                    >{goal.horizon} • {goal.area}</span
                                >
                                <span
                                    class="text-base font-bold text-white group-active:text-primary transition-colors"
                                    >{goal.title}</span
                                >
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="text-right">
                                    <div class="text-lg font-black text-white">
                                        {goalsStore.getGoalProgress(goal.id)}%
                                    </div>
                                </div>
                                <ChevronRight size={18} class="text-muted" />
                            </div>
                        </button>
                    {/each}
                </div>

                <div class="pt-4">
                    <h3
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4 px-2"
                    >
                        Visual Hierarchy
                    </h3>
                    <GoalHierarchyTree
                        horizon={filters.horizon}
                        onGoalClick={(g) => (ux.selectedGoalId = g.id)}
                    />
                </div>
            </div>
        {:else if activeTab === "review"}
            <div in:fade>
                <GoalsReviewView {filters} />
            </div>
        {/if}
    </main>

    <!-- 3. Bottom Tabs (Action Bar) -->
    <nav
        class="h-20 flex-shrink-0 flex items-center justify-around px-4 border-t border-line bg-background/80 backdrop-blur-xl pb-6"
    >
        {#each tabs as tab}
            <button
                onclick={() => onTabChange(tab.id as any)}
                class="flex flex-col items-center gap-1.5 px-6 py-2 transition-all relative {activeTab ===
                tab.id
                    ? 'text-primary'
                    : 'text-muted opacity-60'}"
            >
                <div class="relative">
                    <tab.icon
                        size={20}
                        class={activeTab === tab.id ? "animate-pulse" : ""}
                    />
                    {#if activeTab === tab.id}
                        <div
                            class="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full blur-[4px]"
                        ></div>
                    {/if}
                </div>
                <span class="text-[9px] font-black uppercase tracking-widest"
                    >{tab.label}</span
                >
                {#if activeTab === tab.id}
                    <div
                        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                        in:slide={{ axis: "x" }}
                    ></div>
                {/if}
            </button>
        {/each}
    </nav>

    <!-- 4. Goal Detail Sheet (Progressive Disclosure) -->
    {#if ux.selectedGoalId}
        <div
            class="fixed inset-0 z-[100] bg-background lg:hidden flex flex-col"
            in:fly={{ y: "100%", duration: 400, opacity: 1 }}
            out:fly={{ y: "100%", duration: 300, opacity: 1 }}
        >
            <header
                class="h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-line"
            >
                <button
                    onclick={() => (ux.selectedGoalId = null)}
                    class="p-2 -ml-2 text-muted hover:text-white"
                >
                    <ArrowLeft size={22} />
                </button>
                <span
                    class="text-xs font-bold text-white uppercase tracking-widest"
                    >Goal Dynamics</span
                >
                <button class="p-2 -mr-2 text-muted">
                    <MoreHorizontal size={22} />
                </button>
            </header>

            <div class="flex-1 overflow-hidden">
                <GoalContextPanel
                    goalId={ux.selectedGoalId}
                    onEdit={openGoalModal}
                />
            </div>
        </div>
    {/if}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#if showFilterSheet}
        <div
            class="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onclick={() => (showFilterSheet = false)}
            transition:fade
        ></div>
        <div
            class="fixed left-0 right-0 bottom-0 z-[70] bg-surface rounded-t-[2.5rem] border-t border-line p-8 pb-12 space-y-8 shadow-2xl"
            transition:fly={{ y: "100%" }}
        >
            <div class="w-12 h-1.5 bg-line rounded-full mx-auto -mt-2"></div>

            <div class="space-y-6">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-bold text-white">Refine Logic</h3>
                    <button
                        onclick={() => (showFilterSheet = false)}
                        class="text-xs font-bold text-primary uppercase"
                        >Done</button
                    >
                </div>

                <!-- Horizon -->
                <div class="space-y-3">
                    <span
                        class="text-[10px] font-black text-muted uppercase tracking-widest"
                        >Active Horizon</span
                    >
                    <div class="flex flex-wrap gap-2">
                        {#each ["all", "life", "long", "mid", "short"] as h}
                            <button
                                onclick={() => (filters.horizon = h as any)}
                                class="px-5 py-2.5 rounded-2xl text-xs font-bold border transition-all {filters.horizon ===
                                h
                                    ? 'bg-primary border-primary text-black'
                                    : 'bg-background border-line text-muted'}"
                                >{h}</button
                            >
                        {/each}
                    </div>
                </div>

                <!-- Status -->
                <div class="space-y-3">
                    <span
                        class="text-[10px] font-black text-muted uppercase tracking-widest"
                        >Fulfillment Status</span
                    >
                    <div class="flex flex-wrap gap-2">
                        {#each ["active", "paused", "completed"] as s}
                            <button
                                onclick={() => (filters.status = s as any)}
                                class="px-5 py-2.5 rounded-2xl text-xs font-bold border transition-all {filters.status ===
                                s
                                    ? 'bg-primary border-primary text-black'
                                    : 'bg-background border-line text-muted'}"
                                >{s}</button
                            >
                        {/each}
                    </div>
                </div>
            </div>
        </div>
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
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
