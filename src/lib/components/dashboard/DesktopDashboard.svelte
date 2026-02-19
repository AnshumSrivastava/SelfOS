<script lang="ts">
    import {
        Settings2,
        LayoutDashboard,
        Sparkles,
        Navigation,
    } from "lucide-svelte";
    import { slide, fade } from "svelte/transition";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { auth } from "$lib/stores/auth.svelte";

    // Core Zen Components
    import PrimaryDirective from "./PrimaryDirective.svelte";
    import FocusStatus from "./FocusStatus.svelte";
    import HabitsWidget from "./HabitsWidget.svelte";
    import NetworkAlerts from "./NetworkAlerts.svelte";
    import IntellectualMomentum from "./IntellectualMomentum.svelte";
    import CalendarSnapshot from "./CalendarSnapshot.svelte";
    import NowNextQueue from "./NowNextQueue.svelte";
    import TimeArchitecture from "./TimeArchitecture.svelte";

    import PageHeader from "$lib/components/ui/PageHeader.svelte";

    let showSettings = $state(false);

    $effect(() => {
        if (auth.isAuthenticated) {
            dashboardStore.fetchData();
        }
    });

    function getFriendlyError(error: string) {
        if (error.includes("fetch"))
            return "Connection failed. Please check your internet.";
        if (error.includes("auth")) return "Please sign in again.";
        return "Something went wrong. Please try again.";
    }
</script>

<div class="page-container h-full overflow-hidden">
    {#if !showSettings}
        <PageHeader
            title="Sovereign Horizon"
            subtitle="An objective overview of your temporal and cognitive state."
        >
            <button
                onclick={() => (showSettings = !showSettings)}
                class="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-white hover:border-white/10 transition-all font-mono"
            >
                Orchestrate
            </button>
        </PageHeader>
    {/if}

    {#if dashboardStore.error}
        <div
            class="p-4 mx-8 mb-8 rounded-[24px] bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 backdrop-blur-xl"
        >
            <div
                class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"
            ></div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em]">
                {getFriendlyError(dashboardStore.error)}
            </p>
            <button
                onclick={() => dashboardStore.fetchData()}
                class="ml-auto underline text-[10px] font-black uppercase tracking-[0.2em] hover:text-white"
            >
                Retry
            </button>
        </div>
    {/if}

    <!-- Orchestration Panel -->
    {#if showSettings}
        <div
            class="mx-8 p-10 rounded-[40px] bg-white/[0.03] border border-white/5 shadow-2xl animate-slide-up"
            transition:slide={{ duration: 400 }}
        >
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                    <Navigation size={18} class="text-primary" />
                    <h3
                        class="text-[10px] font-black text-white uppercase tracking-[0.3em]"
                    >
                        Module Orchestration
                    </h3>
                </div>
                <button
                    onclick={() => (showSettings = false)}
                    class="px-6 py-2.5 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all"
                >
                    Save Configuration
                </button>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each dashboardStore.widgets as widget}
                    <button
                        onclick={() => dashboardStore.toggleWidget(widget.id)}
                        class="p-5 rounded-3xl border transition-all text-left group {widget.enabled
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-white/5 bg-white/5 text-muted hover:border-white/20'}"
                    >
                        <span
                            class="text-[10px] font-black uppercase tracking-[0.2em] group-hover:tracking-[0.25em] transition-all"
                            >{widget.type}</span
                        >
                    </button>
                {/each}
            </div>
        </div>
    {/if}

    <div class="px-8 pb-10 h-full overflow-y-auto custom-scrollbar">
        <div class="grid grid-cols-12 gap-10">
            <!-- Narrative Column (Left) -->
            <div class="col-span-12 lg:col-span-3 space-y-12">
                <HabitsWidget />
                <NetworkAlerts />
                <IntellectualMomentum />
            </div>

            <!-- The Present (Center) -->
            <div class="col-span-12 lg:col-span-6 space-y-10">
                <PrimaryDirective />
                <FocusStatus />
                <TimeArchitecture />
            </div>

            <!-- The Immediate (Right) -->
            <div class="col-span-12 lg:col-span-3 space-y-12">
                <CalendarSnapshot />
                <NowNextQueue />
            </div>
        </div>
    </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.1);
    }
</style>
