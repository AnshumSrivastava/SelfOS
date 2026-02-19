<script lang="ts">
    import {
        Calendar as CalendarIcon,
        Clock,
        Video,
        ExternalLink,
        Navigation,
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

    function isVideoCall(location: string = "") {
        return /zoom|meet|teams|youtube|http/.test(
            (location || "").toLowerCase(),
        );
    }

    function getTimeUntil(startTime: string) {
        if (!startTime) return "";
        const now = new Date();
        const [h, m] = startTime.split(":").map(Number);
        const eventDate = new Date();
        eventDate.setHours(h, m, 0, 0);

        const diff = eventDate.getTime() - now.getTime();
        if (diff < 0) return "Active Now";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) return `${hours}h ${mins}m`;
        return `${mins}m`;
    }
</script>

<div class="space-y-4">
    <div class="flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
            <Clock size={14} class="text-primary/60" />
            <h3
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
            >
                Temporal Sequence
            </h3>
        </div>
        <span
            class="text-[9px] font-black text-primary/40 uppercase tracking-[0.1em]"
            >{todayEvents.length} Committed</span
        >
    </div>

    <div class="space-y-6">
        {#if todayEvents.length === 0}
            <div
                class="p-6 rounded-3xl border border-dashed border-white/5 text-center"
            >
                <p
                    class="text-[9px] font-black text-muted/30 uppercase tracking-widest"
                >
                    Chronos Unbound
                </p>
            </div>
        {:else}
            {#each todayEvents as event, i}
                <div
                    transition:fade={{ delay: i * 50 }}
                    class="relative pl-6 border-l border-white/5 group hover:border-primary/30 transition-all"
                >
                    <div
                        class="absolute -left-[3.5px] top-1.5 w-[6px] h-[6px] rounded-full bg-white/10 group-hover:bg-primary transition-all"
                    ></div>

                    <div class="space-y-1">
                        <div class="flex items-center justify-between gap-4">
                            <h4
                                class="text-sm font-bold text-white group-hover:text-primary transition-colors truncate"
                            >
                                {event.title}
                            </h4>
                            <span
                                class="text-[10px] font-black font-mono text-primary/60"
                            >
                                {event.startTime
                                    ? getTimeUntil(event.startTime)
                                    : "All Day"}
                            </span>
                        </div>

                        <div
                            class="flex items-center gap-3 text-[9px] font-black text-muted uppercase tracking-tighter"
                        >
                            <span class="flex items-center gap-1">
                                {event.startTime || "00:00"}
                            </span>
                            {#if event.location}
                                <span
                                    class="flex items-center gap-1 truncate max-w-[100px]"
                                >
                                    {isVideoCall(event.location)
                                        ? "Digital"
                                        : "Physical"}
                                </span>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>
</div>
