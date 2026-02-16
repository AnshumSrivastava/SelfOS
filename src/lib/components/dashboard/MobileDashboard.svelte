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
    import { searchStore } from "$lib/stores/search.svelte";
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
    <div class="sticky top-0 z-50 bg-background/40 backdrop-blur-3xl px-6 py-4">
        <div class="flex items-center justify-between">
            <div class="flex flex-col">
                <span
                    class="text-[9px] font-bold uppercase tracking-[0.15em] text-muted/60"
                    >{formattedDate}</span
                >
                <h1 class="text-lg font-bold text-white/95 tracking-tight">
                    {userStore.currentUser?.displayName?.split(" ")[0] ||
                        "Explorer"}
                </h1>
            </div>
            <div class="flex items-center gap-2">
                <button
                    onclick={() => searchStore.open()}
                    class="p-2.5 rounded-2xl bg-white/5 text-muted/60 active:scale-95 transition-all"
                >
                    <Search size={18} />
                </button>
                <button
                    onclick={() => (showQuickCapture = true)}
                    class="p-2.5 rounded-2xl bg-primary text-black shadow-[0_8px_20px_-5px_rgba(0,255,157,0.3)] active:scale-95 transition-all"
                >
                    <Plus size={18} strokeWidth={3} />
                </button>
            </div>
        </div>
    </div>

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
