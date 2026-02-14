<script lang="ts">
    import {
        Calendar as CalendarIcon,
        Clock,
        MapPin,
        AlertCircle,
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
        if (diff < 0) return "Started";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) return `In ${hours}h ${mins}m`;
        return `In ${mins}m`;
    }
</script>

<div class="card-subtle p-6 flex flex-col h-full overflow-hidden">
    <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-rose-400/10 text-rose-400">
                <CalendarIcon size={20} />
            </div>
            <h2 class="text-xl font-semibold text-white">Daily Timeline</h2>
        </div>
        <span
            class="text-[9px] font-bold uppercase tracking-[0.2em] text-muted"
        >
            {todayEvents.length} Sessions
        </span>
    </div>

    <div class="flex-1 space-y-5">
        {#if todayEvents.length === 0}
            <div
                class="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-line rounded-3xl opacity-40 bg-surface/30"
            >
                <Clock size={32} class="mb-3 text-rose-400/50" />
                <p
                    class="text-[11px] font-bold uppercase tracking-widest text-white"
                >
                    Timeline Clear
                </p>
                <p class="text-[10px] text-muted mt-1">
                    No scheduled commitments
                </p>
            </div>
        {:else}
            {#each todayEvents as event, i}
                <div
                    transition:fade={{ delay: i * 50 }}
                    class="relative pl-6 border-l-2 border-rose-400/20 group hover:border-rose-400 transition-all"
                >
                    <!-- Dot on the timeline -->
                    <div
                        class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border border-rose-400 bg-background group-hover:scale-125 transition-transform shadow-[0_0_8px_rgba(251,113,133,0.3)]"
                    ></div>

                    <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between gap-4">
                            <h3
                                class="text-sm font-bold text-white group-hover:text-rose-400 transition-colors truncate"
                            >
                                {event.title}
                            </h3>
                            <span
                                class="text-[9px] font-mono text-rose-400/60 font-bold whitespace-nowrap"
                            >
                                {event.startTime
                                    ? getTimeUntil(event.startTime)
                                    : "All Day"}
                            </span>
                        </div>

                        <div
                            class="flex items-center gap-4 text-[10px] font-bold text-muted uppercase tracking-tighter"
                        >
                            <span
                                class="flex items-center gap-1.5 text-white/70"
                            >
                                <Clock size={11} class="text-rose-400/60" />
                                {event.startTime || "All Day"}
                            </span>
                            {#if event.location}
                                <span
                                    class="flex items-center gap-1.5 truncate max-w-[120px]"
                                >
                                    {#if isVideoCall(event.location)}
                                        <Video
                                            size={11}
                                            class="text-blue-400/60"
                                        />
                                        <span class="text-blue-400/80"
                                            >Digital</span
                                        >
                                    {:else}
                                        <Navigation
                                            size={11}
                                            class="text-emerald-400/60"
                                        />
                                        <span class="text-emerald-400/80"
                                            >Physical</span
                                        >
                                    {/if}
                                </span>
                            {/if}
                        </div>

                        {#if isVideoCall(event.location)}
                            <a
                                href={event.location}
                                target="_blank"
                                class="mt-1 flex items-center gap-2 text-[10px] text-primary hover:underline font-bold uppercase tracking-tight"
                            >
                                <ExternalLink size={10} />
                                Join Meeting
                            </a>
                        {/if}
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <div
        class="mt-8 pt-6 border-t border-line/50 flex items-center justify-between"
    >
        <button
            class="text-[10px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors"
        >
            Month View
        </button>
        <button
            class="text-[10px] font-bold text-rose-400 hover:text-rose-300 uppercase tracking-widest transition-colors"
        >
            Add Event
        </button>
    </div>
</div>
