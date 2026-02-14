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
    import { userStore } from "$lib/stores/user.svelte";
    import { uiState } from "$lib/stores/ui.svelte";
    import TodayDecisions from "./TodayDecisions.svelte";
    import CalendarSnapshot from "./CalendarSnapshot.svelte";
    import MomentumSnapshot from "./MomentumSnapshot.svelte";
    import FinancialPulse from "./FinancialPulse.svelte";
    import GoalPulse from "./GoalPulse.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";
    import { fade, fly } from "svelte/transition";

    let showQuickCapture = $state(false);
    let now = new Date();
    let formattedDate = $derived(
        now.toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
        }),
    );
</script>

<div class="page-container relative pb-36">
    <!-- Sticky Top Navigation -->
    <div
        class="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-line px-6 py-4"
    >
        <div class="flex items-center justify-between">
            <div class="flex flex-col">
                <span
                    class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted opacity-80"
                    >{formattedDate}</span
                >
                <h1 class="text-lg font-bold text-white tracking-tight">
                    {userStore.currentUser?.displayName?.split(" ")[0] ||
                        "Explorer"}
                </h1>
            </div>
            <div class="flex items-center gap-3">
                <button
                    onclick={() => uiState.toggleSearch()}
                    class="p-2.5 rounded-xl bg-surface border border-line text-muted active:scale-95 transition-all"
                >
                    <Search size={18} />
                </button>
                <button
                    onclick={() => (showQuickCapture = true)}
                    class="p-2.5 rounded-xl bg-primary text-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                    <Plus size={18} strokeWidth={3} />
                </button>
            </div>
        </div>
    </div>

    <!-- Pinned Decision (Highest Impact) -->
    {#if dashboardStore.todayDecisions.length > 0}
        <div class="px-6 py-8 bg-gradient-to-b from-primary/5 to-transparent">
            <div class="mb-4 flex items-center gap-2">
                <Zap size={14} class="text-primary" />
                <span
                    class="text-[10px] font-bold uppercase tracking-widest text-primary"
                    >Priority Zero</span
                >
            </div>
            <TodayDecisions />
        </div>
    {/if}

    <!-- Stacked Card Feed -->
    <div class="px-6 space-y-8 mt-4">
        <section class="space-y-4">
            <div class="flex items-center gap-2 opacity-50">
                <CalendarIcon size={14} />
                <span class="text-[10px] font-bold uppercase tracking-widest"
                    >Timeline</span
                >
            </div>
            <CalendarSnapshot />
        </section>

        <section class="space-y-4">
            <div class="flex items-center gap-2 opacity-50">
                <Flame size={14} />
                <span class="text-[10px] font-bold uppercase tracking-widest"
                    >Momentum</span
                >
            </div>
            <MomentumSnapshot />
        </section>

        <section class="space-y-4">
            <div class="flex items-center gap-2 opacity-50">
                <Plus size={14} />
                <span class="text-[10px] font-bold uppercase tracking-widest"
                    >Strategic Pulse</span
                >
            </div>
            <GoalPulse />
        </section>

        <section class="space-y-4">
            <div class="flex items-center gap-2 opacity-50">
                <Plus size={14} />
                <span class="text-[10px] font-bold uppercase tracking-widest"
                    >Internal Resilience</span
                >
            </div>
            <FinancialPulse />
        </section>
    </div>

    <!-- Quick Capture Modal -->
    <QuickCapture bind:isOpen={showQuickCapture} />
</div>
