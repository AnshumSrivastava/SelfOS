<script lang="ts">
    import {
        Zap,
        Search,
        Calendar as CalendarIcon,
        Plus,
        Sparkles,
    } from "lucide-svelte";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { userStore } from "$lib/stores/user.svelte";

    // Core Zen Components
    import PrimaryDirective from "./PrimaryDirective.svelte";
    import FocusStatus from "./FocusStatus.svelte";
    import HabitsWidget from "./HabitsWidget.svelte";
    import CalendarSnapshot from "./CalendarSnapshot.svelte";
    import NowNextQueue from "./NowNextQueue.svelte";
    import NetworkAlerts from "./NetworkAlerts.svelte";
    import IntellectualMomentum from "./IntellectualMomentum.svelte";
    import TimeArchitecture from "./TimeArchitecture.svelte";

    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import FloatingActionButton from "$lib/components/mobile/FloatingActionButton.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";

    let showQuickCapture = $state(false);
</script>

<div class="page-container relative pb-36 overflow-x-hidden">
    <MobileHeader
        title={userStore.currentUser?.displayName?.split(" ")[0] || "Explorer"}
    />

    <FloatingActionButton
        onclick={() => (showQuickCapture = true)}
        ariaLabel="Quick Capture"
    />

    {#if dashboardStore.error}
        <div
            class="mx-6 mt-4 p-5 rounded-[24px] bg-red-500/10 border border-red-500/20 text-red-400 backdrop-blur-xl"
        >
            <div class="flex items-center gap-3 mb-2">
                <div
                    class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
                ></div>
                <p class="text-[10px] font-black uppercase tracking-[0.2em]">
                    System Divergence
                </p>
            </div>
            <p class="text-xs mb-3 font-medium">{dashboardStore.error}</p>
            <button
                onclick={() => dashboardStore.fetchData()}
                class="w-full py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
            >
                Re-initialize Sequence
            </button>
        </div>
    {/if}

    <div class="px-6 space-y-12 mt-6">
        <!-- The Focal Point -->
        <PrimaryDirective />

        <!-- Temporal Control -->
        <FocusStatus />
        <TimeArchitecture />

        <!-- Vitality & Momentum -->
        <section class="space-y-10">
            <HabitsWidget />
            <CalendarSnapshot />
            <NowNextQueue />
            <NetworkAlerts />
            <IntellectualMomentum />
        </section>
    </div>

    <!-- Quick Capture Modal -->
    <QuickCapture bind:isOpen={showQuickCapture} />
</div>

<style>
    /* Ensure widgets don't overflow on small screens */
    :global(.page-container > div) {
        max-width: 100%;
    }
</style>
