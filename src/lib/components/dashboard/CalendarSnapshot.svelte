<script lang="ts">
    import {
        Calendar as CalendarIcon,
        Clock,
        MapPin,
        AlertCircle,
    } from "lucide-svelte";
    import { calendarStore } from "$lib/stores/calendar.svelte";
    import { fade } from "svelte/transition";

    const today = new Date().toISOString().split("T")[0];
    const todayEvents = $derived(
        calendarStore.events
            .filter((e) => e.date === today)
            .sort((a, b) =>
                (a.startTime || "").localeCompare(b.startTime || ""),
            ),
    );
    const conflicts = $derived(calculateConflicts(todayEvents));

    function calculateConflicts(events: any[]) {
        // Simple overlap detection for morning/afternoon/evening slots
        return false; // Placeholder
    }
</script>

<div class="card-subtle p-6 flex flex-col h-full overflow-hidden">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-rose-400/10 text-rose-400">
                <CalendarIcon size={20} />
            </div>
            <h2 class="text-xl font-semibold text-white">Daily Timeline</h2>
        </div>
        {#if conflicts}
            <div class="flex items-center gap-1.5 text-rose-400">
                <AlertCircle size={14} />
                <span class="text-[10px] font-bold uppercase tracking-widest"
                    >Conflict</span
                >
            </div>
        {/if}
    </div>

    <div class="flex-1 space-y-4">
        {#if todayEvents.length === 0}
            <div
                class="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-line rounded-2xl opacity-50"
            >
                <CalendarIcon size={24} class="mb-2" />
                <p class="text-[10px] font-bold uppercase tracking-widest">
                    No meetings
                </p>
            </div>
        {:else}
            {#each todayEvents as event, i}
                <div
                    transition:fade={{ delay: i * 50 }}
                    class="relative pl-4 border-l-2 border-rose-400/30 group hover:border-rose-400 transition-all"
                >
                    <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0">
                            <h3
                                class="text-sm font-bold text-white group-hover:text-rose-400 transition-colors truncate"
                            >
                                {event.title}
                            </h3>
                            <div
                                class="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-muted uppercase tracking-tighter"
                            >
                                <span class="flex items-center gap-1">
                                    <Clock size={10} />
                                    {event.startTime || "All Day"}
                                </span>
                                {#if event.location}
                                    <span
                                        class="flex items-center gap-1 truncate max-w-[100px]"
                                    >
                                        <MapPin size={10} />
                                        {event.location}
                                    </span>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <div class="mt-6 pt-4 border-t border-line">
        <p
            class="text-[10px] font-bold text-muted uppercase tracking-[0.2em] text-center"
        >
            {todayEvents.length} Commitments Today
        </p>
    </div>
</div>
