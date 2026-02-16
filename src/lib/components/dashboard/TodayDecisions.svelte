<script lang="ts">
    import {
        Check,
        Calendar,
        ArrowRight,
        Zap,
        Clock,
        Activity,
    } from "lucide-svelte";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { calendarStore } from "$lib/stores/calendar.svelte";
    import { fade } from "svelte/transition";

    const decisions = $derived(dashboardStore.todayDecisions.slice(0, 3));

    function getPriorityColor(priority: string) {
        switch (priority) {
            case "high":
                return "text-red-400 bg-red-400/10 border-red-400/20";
            case "medium":
                return "text-orange-400 bg-orange-400/10 border-orange-400/20";
            default:
                return "text-blue-400 bg-blue-400/10 border-blue-400/20";
        }
    }

    async function handleComplete(decision: any) {
        if (decision.type === "task") {
            await tasksStore.toggle(decision.id);
            await dashboardStore.fetchData();
        }
    }
</script>

<div class="card-subtle p-6 h-full flex flex-col">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
                <Zap size={20} />
            </div>
            <h2 class="text-xl font-semibold text-white">Today's Decisions</h2>
        </div>
        <span class="text-xs font-medium text-muted uppercase tracking-widest"
            >Decision Pulse</span
        >
    </div>

    {#if dashboardStore.loading}
        <div class="flex-1 flex flex-col gap-4">
            <div class="h-24 bg-surface animate-pulse rounded-2xl"></div>
            <div class="h-24 bg-surface animate-pulse rounded-2xl"></div>
            <div class="h-24 bg-surface animate-pulse rounded-2xl"></div>
        </div>
    {:else if decisions.length === 0}
        <div
            class="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-line rounded-3xl"
        >
            <div class="p-4 rounded-full bg-surface mb-4">
                <Check size={32} class="text-primary opacity-50" />
            </div>
            <p class="text-white font-medium mb-1">Clear Horizon</p>
            <p class="text-sm text-muted">
                No high-impact decisions pending. Great job staying ahead.
            </p>
        </div>
    {:else}
        <div class="flex-1 flex flex-col gap-3">
            {#each decisions as decision, i (decision.id)}
                <div
                    transition:fade={{ delay: i * 50 }}
                    class="group relative overflow-hidden p-5 rounded-2xl bg-surface border border-line hover:border-primary/30 transition-all active:scale-[0.98] shadow-sm hover:shadow-primary/5"
                >
                    <div class="flex items-start gap-4">
                        <button
                            onclick={() => handleComplete(decision)}
                            class="mt-1 w-6 h-6 rounded-full border-2 border-line hover:border-primary flex items-center justify-center transition-all shrink-0 bg-background"
                        >
                            <Check
                                size={14}
                                class="opacity-0 group-hover:opacity-100 text-primary transition-opacity"
                            />
                        </button>

                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between mb-2">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="text-[10px] font-bold uppercase tracking-widest {getPriorityColor(
                                            decision.priority,
                                        )} px-2 py-0.5 rounded border"
                                    >
                                        {decision.priority}
                                    </span>
                                    {#if decision.context_label}
                                        <span
                                            class="text-[10px] font-bold uppercase tracking-tighter text-muted bg-surface px-2 py-0.5 rounded border border-line"
                                        >
                                            {decision.context_label}
                                        </span>
                                    {/if}
                                </div>
                                <span
                                    class="text-[9px] font-mono text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    S:{decision.score}
                                </span>
                            </div>

                            <h3
                                class="text-base font-bold text-white leading-snug mb-3 group-hover:text-primary transition-colors"
                            >
                                {decision.label}
                            </h3>

                            <div
                                class="grid grid-cols-2 gap-4 pt-3 border-t border-line/30 text-[10px] font-bold uppercase tracking-widest text-muted"
                            >
                                <div class="flex items-center gap-2">
                                    <Clock size={12} class="text-primary/60" />
                                    <span class="text-white/80"
                                        >{decision.focus_time
                                            ? new Date(
                                                  decision.focus_time,
                                              ).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : "ASAP"}</span
                                    >
                                </div>
                                <div class="flex items-center gap-2">
                                    <Activity
                                        size={12}
                                        class="text-primary/60"
                                    />
                                    <span class="text-white/80"
                                        >{decision.type}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Focus Glow -->
                    <div
                        class="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    ></div>
                </div>
            {/each}
        </div>
    {/if}

    <button
        class="mt-6 w-full py-3 text-sm font-bold text-muted hover:text-white transition-colors border-t border-line"
    >
        View Full Strategy Hierarchy
    </button>
</div>
