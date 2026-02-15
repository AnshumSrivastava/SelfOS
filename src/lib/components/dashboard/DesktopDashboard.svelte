<script lang="ts">
    import { Settings2 } from "lucide-svelte";
    import { slide } from "svelte/transition";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import WelcomeWidget from "./WelcomeWidget.svelte";
    import HabitsWidget from "./HabitsWidget.svelte";
    import TasksWidget from "./TasksWidget.svelte";
    import TodayDecisions from "./TodayDecisions.svelte";
    import NowNextLater from "./NowNextLater.svelte";
    import CalendarSnapshot from "./CalendarSnapshot.svelte";
    import MomentumSnapshot from "./MomentumSnapshot.svelte";
    import FinancialPulse from "./FinancialPulse.svelte";
    import GoalPulse from "./GoalPulse.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";

    let showSettings = $state(false);
</script>

<div class="page-container h-full">
    <div class="module-header mb-10">
        <div>
            <div class="flex items-center gap-4 mb-2">
                <h1 class="text-3xl font-light text-white leading-none">
                    Dashboard
                </h1>
                <button
                    onclick={() => (showSettings = !showSettings)}
                    class="p-1.5 rounded-lg hover:bg-surface transition-colors text-muted hover:text-white"
                    aria-label="Dashboard settings"
                >
                    <Settings2 size={18} />
                </button>
            </div>
            <p class="text-muted">Welcome back. Here's your focus for today.</p>
        </div>
    </div>

    <!-- Settings Panel -->
    {#if showSettings}
        <div
            class="card-subtle border-primary/20 animate-slide-up"
            transition:slide={{ duration: 200 }}
        >
            <h3 class="text-lg font-semibold text-white mb-4">
                Customize Dashboard
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                {#each dashboardStore.widgets as widget}
                    <button
                        onclick={() => dashboardStore.toggleWidget(widget.id)}
                        class="p-3 rounded-lg border transition-all {widget.enabled
                            ? 'border-primary bg-primary/10 text-white'
                            : 'border-line bg-surface text-muted hover:border-primary/50'}"
                    >
                        <span class="text-sm font-medium capitalize"
                            >{widget.type}</span
                        >
                    </button>
                {/each}
            </div>
            <div class="mt-4 pt-4 border-t border-line flex justify-end gap-2">
                <button
                    onclick={() => dashboardStore.resetToDefaults()}
                    class="btn btn-secondary text-sm"
                >
                    Reset to Defaults
                </button>
                <button
                    onclick={() => (showSettings = false)}
                    class="btn btn-primary text-sm"
                >
                    Done
                </button>
            </div>
        </div>
    {/if}

    <!-- Dynamic Dashboard Layout -->
    <div class="flex flex-col gap-10">
        <!-- Top Tier: Welcome & Critical Quick Capture -->
        <div class="w-full">
            <WelcomeWidget />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Main Content: Direct Execution and Decisions -->
            <div class="lg:col-span-2 space-y-10">
                <section class="space-y-4">
                    <div class="flex items-center gap-2 px-1">
                        <div class="w-1 h-4 bg-primary rounded-full"></div>
                        <h2
                            class="text-xs font-bold uppercase tracking-widest text-muted"
                        >
                            Daily Precision
                        </h2>
                    </div>
                    <div class="space-y-8">
                        <TodayDecisions />
                        <NowNextLater />
                    </div>
                </section>

                <section class="space-y-4">
                    <div class="flex items-center gap-2 px-1">
                        <div class="w-1 h-4 bg-secondary rounded-full"></div>
                        <h2
                            class="text-xs font-bold uppercase tracking-widest text-muted"
                        >
                            Execution Flow
                        </h2>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <HabitsWidget />
                        <TasksWidget />
                    </div>
                </section>
            </div>

            <!-- Sidebar: Context & Snapshots -->
            <div class="space-y-10">
                <section class="space-y-4">
                    <div class="flex items-center gap-2 px-1">
                        <h2
                            class="text-xs font-bold uppercase tracking-widest text-muted"
                        >
                            Timeline
                        </h2>
                    </div>
                    <CalendarSnapshot />
                </section>

                <section class="space-y-4">
                    <div class="flex items-center gap-2 px-1">
                        <h2
                            class="text-xs font-bold uppercase tracking-widest text-muted"
                        >
                            Momentum
                        </h2>
                    </div>
                    <MomentumSnapshot />
                </section>

                <section class="space-y-4">
                    <div class="flex items-center gap-2 px-1">
                        <h2
                            class="text-xs font-bold uppercase tracking-widest text-muted"
                        >
                            Strategic Pulse
                        </h2>
                    </div>
                    <div class="space-y-6">
                        <GoalPulse />
                        <FinancialPulse />
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>

<style>
    /* Drag and drop styles */
    :global(.dnd-action-draggable-wrapper) {
        cursor: grab;
    }

    :global(.dnd-action-draggable-wrapper:active) {
        cursor: grabbing;
    }
</style>
