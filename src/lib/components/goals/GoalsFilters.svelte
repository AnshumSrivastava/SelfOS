<script lang="ts">
    import {
        Compass,
        Flame,
        Calendar,
        Clock,
        Zap,
        Briefcase,
        User,
        Heart,
        Users,
        PartyPopper,
        Box,
        Filter,
        CheckCircle,
        PauseCircle,
        PlayCircle,
    } from "lucide-svelte";
    import type {
        GoalArea,
        GoalHorizon,
        GoalStatus,
    } from "$lib/stores/goals.svelte";
    import { fade } from "svelte/transition";

    let { filters = $bindable(), isMobile = false } = $props();

    const horizons: { id: GoalHorizon | "all"; name: string; icon: any }[] = [
        { id: "all", name: "All", icon: Compass },
        { id: "life", name: "Life", icon: Flame },
        { id: "long", name: "Long", icon: Calendar },
        { id: "mid", name: "Mid", icon: Clock },
        { id: "short", name: "Short", icon: Zap },
    ];

    const areas: { id: GoalArea | "All"; icon: any }[] = [
        { id: "All", icon: Box },
        { id: "Professional", icon: Briefcase },
        { id: "Personal", icon: User },
        { id: "Health", icon: Heart },
        { id: "Family", icon: Users },
        { id: "Fun", icon: PartyPopper },
        { id: "Spiritual", icon: Flame },
    ];

    const statuses: { id: GoalStatus | "all"; label: string; icon: any }[] = [
        { id: "all", label: "All", icon: Filter },
        { id: "active", label: "Active", icon: PlayCircle },
        { id: "paused", label: "Paused", icon: PauseCircle },
        { id: "completed", label: "Done", icon: CheckCircle },
    ];

    const timeScopes = [
        { id: "this-week", label: "Week" },
        { id: "this-month", label: "Month" },
        { id: "quarter", label: "Quarter" },
    ];
</script>

<div
    class="flex flex-col gap-4 p-4 {isMobile
        ? ''
        : 'bg-surface/30 border-b border-line'}"
    in:fade
>
    <div class="flex flex-wrap items-center gap-6">
        <!-- Horizon -->
        <div class="flex flex-col gap-1.5">
            <span
                class="text-[9px] font-bold text-muted uppercase tracking-widest pl-1"
                >Horizon</span
            >
            <div
                class="flex p-1 bg-background/50 rounded-xl border border-line"
            >
                {#each horizons as h}
                    <button
                        onclick={() => (filters.horizon = h.id)}
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 {filters.horizon ===
                        h.id
                            ? 'bg-primary text-black shadow-lg shadow-primary/10'
                            : 'text-muted hover:text-white'}"
                    >
                        <h.icon size={12} />
                        {#if !isMobile || filters.horizon === h.id}
                            <span transition:fade>{h.name}</span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Status -->
        <div class="flex flex-col gap-1.5">
            <span
                class="text-[9px] font-bold text-muted uppercase tracking-widest pl-1"
                >Status</span
            >
            <div
                class="flex p-1 bg-background/50 rounded-xl border border-line"
            >
                {#each statuses as s}
                    <button
                        onclick={() => (filters.status = s.id)}
                        class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 {filters.status ===
                        s.id
                            ? 'bg-primary text-black shadow-lg shadow-primary/10'
                            : 'text-muted hover:text-white'}"
                    >
                        <s.icon size={12} />
                        {#if !isMobile || filters.status === s.id}
                            <span transition:fade>{s.label}</span>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Areas (Chips) -->
        <div class="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <span
                class="text-[9px] font-bold text-muted uppercase tracking-widest pl-1"
                >Area of Focus</span
            >
            <div class="flex flex-wrap gap-2">
                {#each areas as area}
                    <button
                        onclick={() => (filters.area = area.id)}
                        class="px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all {filters.area ===
                        area.id
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-surface border-line text-muted hover:text-white hover:border-white/20'}"
                    >
                        {area.id}
                    </button>
                {/each}
            </div>
        </div>
    </div>
</div>
