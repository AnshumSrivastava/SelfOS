<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { fade, fly } from "svelte/transition";
    import {
        goalsStore,
        type Goal,
        type GoalArea,
        type GoalHorizon,
        type GoalStatus,
    } from "$lib/stores/goals.svelte";
    import GoalsFilters from "./GoalsFilters.svelte";
    import GoalsTodayView from "./GoalsTodayView.svelte";
    import DesktopGoals from "./DesktopGoals.svelte";
    import MobileGoals from "./MobileGoals.svelte";
    import GoalsReviewView from "./GoalsReviewView.svelte";
    import { uiState } from "$lib/stores/ui.svelte";

    // Shared UI State
    let activeTab = $state<"today" | "plan" | "review">("today");
    let selectedGoalId = $state<string | null>(null);
    let filters = $state({
        horizon: "all" as GoalHorizon | "all",
        area: "All" as GoalArea | "All",
        status: "active" as GoalStatus | "all",
        timeScope: "this-week" as "this-week" | "this-month" | "quarter",
    });

    // Provide state to children
    setContext("goalsUX", {
        get activeTab() {
            return activeTab;
        },
        set activeTab(v) {
            activeTab = v;
        },
        get selectedGoalId() {
            return selectedGoalId;
        },
        set selectedGoalId(v) {
            selectedGoalId = v;
        },
        get filters() {
            return filters;
        },
        set filters(v) {
            filters = v;
        },
    });

    let isMobile = $state(false);

    onMount(() => {
        const checkMobile = () => {
            isMobile = window.innerWidth < 768;
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    });

    const selectedGoal = $derived(
        selectedGoalId
            ? goalsStore.goals.find((g) => g.id === selectedGoalId)
            : null,
    );
</script>

<div class="h-full flex flex-col bg-background overflow-hidden">
    <!-- Main Shell -->
    <div class="flex-1 flex flex-col overflow-hidden">
        {#if isMobile}
            <MobileGoals
                {activeTab}
                onTabChange={(tab) => (activeTab = tab)}
                {filters}
                {selectedGoalId}
            />
        {:else}
            <DesktopGoals
                {activeTab}
                onTabChange={(tab) => (activeTab = tab)}
                {filters}
                {selectedGoalId}
            />
        {/if}
    </div>
</div>
