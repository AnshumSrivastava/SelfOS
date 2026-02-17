<script lang="ts">
    import { Settings2, LayoutDashboard } from "lucide-svelte";
    import { slide, fade } from "svelte/transition";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { auth } from "$lib/stores/auth.svelte";
    import WelcomeWidget from "./WelcomeWidget.svelte";
    import HabitsWidget from "./HabitsWidget.svelte";
    import TasksWidget from "./TasksWidget.svelte";
    import TodayDecisions from "./TodayDecisions.svelte";
    import NowNextLater from "./NowNextLater.svelte";
    import CalendarSnapshot from "./CalendarSnapshot.svelte";
    import QuickCapture from "$lib/components/ui/QuickCapture.svelte";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";

    let showSettings = $state(false);

    $effect(() => {
        if (auth.isAuthenticated) {
            dashboardStore.fetchData();
        }
    });
</script>

<div class="page-container h-full">
    <PageHeader
        title="Dashboard"
        subtitle="Welcome back. Here's your focus for today."
        icon={LayoutDashboard}
    >
        <button
            onclick={() => (showSettings = !showSettings)}
            class="btn btn-ghost"
            aria-label="Dashboard settings"
        >
            <Settings2 size={18} />
            <span>Customize</span>
        </button>
    </PageHeader>

    {#if dashboardStore.error}
        <div
            class="p-4 mx-8 mb-8 rounded-xl bg-theme-danger/10 border border-theme-danger/20 text-theme-danger flex items-center gap-3"
        >
            <div
                class="w-2 h-2 rounded-full bg-theme-danger animate-pulse"
            ></div>
            <p class="text-sm font-medium">
                Data Error: {dashboardStore.error}
            </p>
            <button
                onclick={() => dashboardStore.fetchData()}
                class="ml-auto underline hover:text-theme-text-strong"
                >Retry</button
            >
        </div>
    {/if}

    <!-- Settings Panel -->
    {#if showSettings}
        <div
            class="card-subtle mx-8 border-theme-primary/20 animate-slide-up"
            transition:slide={{ duration: 200 }}
        >
            <h3 class="text-lg font-semibold text-theme-text-strong mb-4">
                Customize Dashboard
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                {#each dashboardStore.widgets as widget}
                    <button
                        onclick={() => dashboardStore.toggleWidget(widget.id)}
                        class="p-3 rounded-lg border transition-all {widget.enabled
                            ? 'border-theme-primary bg-theme-primary/10 text-theme-text-strong'
                            : 'border-theme-line bg-theme-surface text-theme-text-muted hover:border-theme-primary/50'}"
                    >
                        <span class="text-sm font-medium capitalize"
                            >{widget.type}</span
                        >
                    </button>
                {/each}
            </div>
            <div
                class="mt-4 pt-4 border-t border-theme-line flex justify-end gap-2"
            >
                <button
                    onclick={() => dashboardStore.resetToDefaults()}
                    class="btn btn-ghost text-sm"
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
    <div class="flex flex-col gap-10 px-8 py-4">
        <!-- Top Tier: Welcome & Critical Quick Capture -->
        <WelcomeWidget />

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Main Content: Direct Execution and Decisions -->
            <div class="lg:col-span-2 space-y-10">
                <section class="space-y-4">
                    <div class="flex items-center gap-2 px-1">
                        <div
                            class="w-1 h-4 bg-theme-primary rounded-full"
                        ></div>
                        <h2
                            class="text-xs font-bold uppercase tracking-widest text-theme-text-muted"
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
                        <div
                            class="w-1 h-4 bg-theme-secondary rounded-full"
                        ></div>
                        <h2
                            class="text-xs font-bold uppercase tracking-widest text-theme-text-muted"
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
                            class="text-xs font-bold uppercase tracking-widest text-theme-text-muted"
                        >
                            Timeline
                        </h2>
                    </div>
                    <CalendarSnapshot />
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
