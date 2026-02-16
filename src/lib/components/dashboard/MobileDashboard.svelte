<script lang="ts">
    import {
        Zap,
        Search,
        Calendar as CalendarIcon,
        Trophy,
        Flame,
        Plus,
    } from "lucide-svelte";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { auth } from "$lib/stores/auth.svelte";
    import { userStore } from "$lib/stores/user.svelte";
    import { uiState } from "$lib/stores/ui.svelte";
    import { searchStore } from "$lib/stores/search.svelte";
    import TodayDecisions from "./TodayDecisions.svelte";
    import CalendarSnapshot from "./CalendarSnapshot.svelte";
    import MomentumSnapshot from "./MomentumSnapshot.svelte";
    import FinancialPulse from "./FinancialPulse.svelte";
    import GoalPulse from "./GoalPulse.svelte";
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import FloatingActionButton from "$lib/components/mobile/FloatingActionButton.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";

    let showQuickCapture = $state(false);
    let now = new Date();
    let formattedDate = $derived(
        now.toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
        }),
    );

    $effect(() => {
        if (auth.isAuthenticated) {
            dashboardStore.fetchData();
        }
    });
</script>

<div class="page-container relative pb-36">
    <MobileHeader
        title={userStore.currentUser?.displayName?.split(" ")[0] || "Explorer"}
    />

    <FloatingActionButton
        onclick={() => (showQuickCapture = true)}
        ariaLabel="Quick Capture"
    />

    {#if dashboardStore.error}
        <div
            class="mx-6 mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400"
        >
            <div class="flex items-center gap-3 mb-2">
                <div
                    class="w-2 h-2 rounded-full bg-red-500 animate-pulse"
                ></div>
                <p class="text-xs font-bold uppercase tracking-widest">
                    System Error
                </p>
            </div>
            <p class="text-sm mb-3">{dashboardStore.error}</p>
            <button
                onclick={() => dashboardStore.fetchData()}
                class="w-full py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
            >
                Re-initialize Dashboard
            </button>
        </div>
    {/if}

    <!-- Pinned Decision (Highest Impact) -->
    {#if dashboardStore.todayDecisions.length > 0}
        <div class="px-6 py-10">
            <div class="mb-5 flex items-center gap-2.5">
                <div class="w-1 h-3.5 bg-primary rounded-full"></div>
                <span
                    class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary"
                    >Primary Directive</span
                >
            </div>
            <TodayDecisions />
        </div>
    {/if}

    <!-- Stacked Card Feed -->
    <div class="px-6 space-y-10 mt-2">
        <section class="space-y-4">
            <div class="flex items-center gap-2 px-1">
                <span
                    class="text-[9px] font-bold uppercase tracking-[0.2em] text-muted/40"
                    >Timeline</span
                >
            </div>
            <CalendarSnapshot />
        </section>

        <section class="space-y-4">
            <div class="flex items-center gap-2 px-1">
                <span
                    class="text-[9px] font-bold uppercase tracking-[0.2em] text-muted/40"
                    >Momentum</span
                >
            </div>
            <MomentumSnapshot />
        </section>

        <section class="space-y-4">
            <div class="flex items-center gap-2 px-1">
                <span
                    class="text-[9px] font-bold uppercase tracking-[0.2em] text-muted/40"
                    >Strategic Pulse</span
                >
            </div>
            <GoalPulse />
        </section>

        <section class="space-y-4">
            <div class="flex items-center gap-2 px-1">
                <span
                    class="text-[9px] font-bold uppercase tracking-[0.2em] text-muted/40"
                    >Resilience</span
                >
            </div>
            <FinancialPulse />
        </section>
    </div>

    <!-- Quick Capture Modal -->
    <QuickCapture bind:isOpen={showQuickCapture} />
</div>
