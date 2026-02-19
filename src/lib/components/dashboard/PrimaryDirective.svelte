<script lang="ts">
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { Check, Target, Zap, Clock, ArrowRight } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";

    const topDecision = $derived(dashboardStore.todayDecisions[0]);

    async function handleComplete() {
        if (topDecision && topDecision.type === "task") {
            await tasksStore.toggle(topDecision.id);
            await dashboardStore.fetchData();
        }
    }
</script>

<div
    class="relative overflow-hidden p-10 rounded-[48px] bg-primary/[0.03] border border-primary/10 group hover:border-primary/20 transition-all duration-700"
>
    <div
        class="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-all duration-700"
    ></div>

    <div class="relative z-10 space-y-8">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="p-2.5 rounded-2xl bg-primary/10 text-primary">
                    <Zap size={18} />
                </div>
                <h3
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                >
                    Primary Directive
                </h3>
            </div>
            {#if topDecision}
                <span
                    class="text-[9px] font-black uppercase tracking-[0.2em] text-primary/40 bg-primary/5 px-3 py-1 rounded-full border border-primary/10"
                    >Priority: High</span
                >
            {/if}
        </div>

        {#if topDecision}
            <div class="space-y-6">
                <h2
                    class="text-3xl font-light text-white leading-tight tracking-tight group-hover:text-primary transition-colors duration-500"
                >
                    {topDecision.label}
                </h2>

                <div class="flex items-center gap-6">
                    <div
                        class="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                    >
                        <Clock size={12} class="text-primary" />
                        <span
                            >Deadline: {topDecision.focus_time
                                ? new Date(
                                      topDecision.focus_time,
                                  ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  })
                                : "ASAP"}</span
                        >
                    </div>
                </div>

                <div class="flex gap-4 pt-4">
                    <button
                        onclick={handleComplete}
                        class="px-8 py-4 rounded-[28px] bg-primary text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Check size={16} strokeWidth={3} /> Mark Complete
                    </button>
                    <a
                        href="/tasks"
                        class="p-4 rounded-[28px] bg-white/5 border border-white/5 text-muted hover:text-white transition-all active:scale-95 flex items-center gap-2"
                    >
                        <ArrowRight size={18} />
                    </a>
                </div>
            </div>
        {:else}
            <div class="py-12 text-center space-y-4">
                <div
                    class="w-16 h-16 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center mx-auto"
                >
                    <Check size={24} class="text-muted/20" />
                </div>
                <p class="text-xs text-muted/40 font-medium italic">
                    Temporal clarity achieved. No pressing directives.
                </p>
            </div>
        {/if}
    </div>
</div>
