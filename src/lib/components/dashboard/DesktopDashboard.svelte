<script lang="ts">
    import { Settings2, GripVertical } from "lucide-svelte";
    import { slide } from "svelte/transition";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { dndzone } from "svelte-dnd-action";
    import WelcomeWidget from "./WelcomeWidget.svelte";
    import NextActionsWidget from "./NextActionsWidget.svelte";
    import StatsWidget from "./StatsWidget.svelte";
    import HabitsWidget from "./HabitsWidget.svelte";
    import TasksWidget from "./TasksWidget.svelte";

    let showSettings = $state(false);
    let items = $state(dashboardStore.enabledWidgets);

    // Watch for changes in dashboard store
    $effect(() => {
        items = dashboardStore.enabledWidgets;
    });

    function handleDndConsider(e: CustomEvent) {
        items = e.detail.items;
    }

    function handleDndFinalize(e: CustomEvent) {
        items = e.detail.items;
        dashboardStore.reorderWidgets(items);
    }

    function getWidgetComponent(type: string) {
        switch (type) {
            case "welcome":
                return WelcomeWidget;
            case "next-actions":
                return NextActionsWidget;
            case "stats":
                return StatsWidget;
            case "habits":
                return HabitsWidget;
            case "tasks":
                return TasksWidget;
            default:
                return null;
        }
    }

    function getWidgetGridClass(size: string) {
        switch (size) {
            case "small":
                return "col-span-1";
            case "medium":
                return "col-span-1 lg:col-span-1";
            case "large":
                return "col-span-1 lg:col-span-2";
            case "full":
                return "col-span-1 lg:col-span-2";
            default:
                return "col-span-1";
        }
    }
</script>

<div class="space-y-6">
    <!-- Dashboard Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-white">Dashboard</h1>
            <p class="text-sm text-muted">Your personal command center</p>
        </div>
        <button
            onclick={() => (showSettings = !showSettings)}
            class="p-2 rounded-lg hover:bg-surface transition-colors text-muted hover:text-white"
            aria-label="Dashboard settings"
        >
            <Settings2 size={20} />
        </button>
    </div>

    <!-- Settings Panel -->
    {#if showSettings}
        <div
            class="card border-primary/20 animate-slide-up"
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

    <!-- Widgets Grid with Drag and Drop -->
    <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-6"
        use:dndzone={{
            items,
            flipDurationMs: 200,
            dropTargetStyle: {},
        }}
        onconsider={handleDndConsider}
        onfinalize={handleDndFinalize}
    >
        {#each items as widget (widget.id)}
            <div class={getWidgetGridClass(widget.size)} data-id={widget.id}>
                <div class="relative group">
                    <!-- Drag Handle -->
                    <div
                        class="absolute -left-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
                    >
                        <div
                            class="p-1 rounded bg-surface border border-line text-muted"
                        >
                            <GripVertical size={16} />
                        </div>
                    </div>

                    <!-- Widget Content -->
                    <svelte:component this={getWidgetComponent(widget.type)} />
                </div>
            </div>
        {/each}
    </div>

    {#if items.length === 0}
        <div class="card text-center py-12">
            <Settings2 size={48} class="mx-auto mb-4 text-muted opacity-50" />
            <h3 class="text-lg font-semibold text-white mb-2">
                No widgets enabled
            </h3>
            <p class="text-muted mb-4">
                Click the settings icon to customize your dashboard
            </p>
            <button
                onclick={() => (showSettings = true)}
                class="btn btn-primary"
            >
                Customize Dashboard
            </button>
        </div>
    {/if}
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
