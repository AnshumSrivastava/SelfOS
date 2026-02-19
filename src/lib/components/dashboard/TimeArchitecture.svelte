<script lang="ts">
    import { focusStore } from "$lib/stores/focus.svelte";
    import { Activity, Zap, Info, Clock } from "lucide-svelte";
    import { fade } from "svelte/transition";

    const TOTAL_CAPACITY = 480; // 8 hours total cognitive budget
    const PEAK_DEEP_WORK = 180; // 3 hours limit for extreme deep focus

    const consumed = $derived(focusStore.todayFocusMinutes);
    const progress = $derived(Math.min((consumed / TOTAL_CAPACITY) * 100, 100));
    const remaining = $derived(Math.max(TOTAL_CAPACITY - consumed, 0));
    const hoursRemaining = $derived((remaining / 60).toFixed(1));

    const stateLabel = $derived.by(() => {
        if (progress < 30) return "Fresh / High Capacity";
        if (progress < 60) return "Optimal / Flow State";
        if (progress < 80) return "Moderated / Tactical focus";
        return "Exhausted / Low Depth";
    });
</script>

<div
    class="p-8 rounded-[40px] bg-primary/[0.03] border border-primary/10 group hover:border-primary/20 transition-all duration-700"
>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Activity size={14} class="text-primary" />
                <h3
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                >
                    Cognitive Architecture
                </h3>
            </div>
            <span
                class="text-[9px] font-black uppercase tracking-[0.1em] text-primary/60"
                >{hoursRemaining}h Budget Left</span
            >
        </div>

        <div class="space-y-2">
            <div class="flex items-center justify-between mb-1">
                <span
                    class="text-xs font-bold text-white transition-colors group-hover:text-primary"
                    >{stateLabel}</span
                >
                <span class="text-[10px] font-black font-mono text-muted"
                    >{Math.round(progress)}% Spent</span
                >
            </div>
            <div
                class="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5"
            >
                <div
                    class="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                    style="width: {progress}%"
                ></div>
            </div>
        </div>

        <div class="pt-4 border-t border-white/5 flex items-start gap-3">
            <div
                class="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5"
            >
                <Info size={12} />
            </div>
            <p class="text-[10px] text-muted leading-relaxed italic">
                {consumed > PEAK_DEEP_WORK
                    ? "Peak depth exceeded. Shift to low-leverage coordination or restoration tasks."
                    : "Neuro-plasticity remains high. Prioritize architecting and deep synthesis."}
            </p>
        </div>
    </div>
</div>
