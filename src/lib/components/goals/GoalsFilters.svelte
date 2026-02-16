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
    class="flex items-center gap-6 {isMobile ? 'flex-col p-4' : 'h-full px-4'}"
    in:fade
>
    <!-- Horizon -->
    <div class="flex items-center gap-3">
        <span
            class="text-[9px] font-black text-muted uppercase tracking-[0.2em] whitespace-nowrap"
            >Horizon</span
        >
        <div class="flex p-1 bg-background/30 rounded-lg border border-line/50">
            {#each horizons as h}
                <button
                    onclick={() => (filters.horizon = h.id)}
                    class="px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 {filters.horizon ===
                    h.id
                        ? 'bg-primary text-black'
                        : 'text-muted hover:text-white'}"
                >
                    <h.icon size={12} />
                    {#if !isMobile || filters.horizon === h.id}
                        <span>{h.name}</span>
                    {/if}
                </button>
            {/each}
        </div>
    </div>

    <!-- Status -->
    <div class="flex items-center gap-3">
        <span
            class="text-[9px] font-black text-muted uppercase tracking-[0.2em] whitespace-nowrap"
            >Status</span
        >
        <div class="flex p-1 bg-background/30 rounded-lg border border-line/50">
            {#each statuses as s}
                <button
                    onclick={() => (filters.status = s.id)}
                    class="px-2.5 py-1 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 {filters.status ===
                    s.id
                        ? 'bg-primary text-black'
                        : 'text-muted hover:text-white'}"
                >
                    <s.icon size={12} />
                    {#if !isMobile || filters.status === s.id}
                        <span>{s.label}</span>
                    {/if}
                </button>
            {/each}
        </div>
    </div>

    <!-- Areas Dropdown-like select -->
    <div class="flex items-center gap-3 flex-1 min-w-[150px]">
        <span
            class="text-[9px] font-black text-muted uppercase tracking-[0.2em] whitespace-nowrap"
            >Area</span
        >
        <select
            bind:value={filters.area}
            class="bg-background/30 border border-line/50 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-widest outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
        >
            {#each areas as area}
                <option value={area.id}>{area.id}</option>
            {/each}
        </select>
    </div>
</div>
