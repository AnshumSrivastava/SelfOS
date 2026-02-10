<script lang="ts">
    import {
        ChevronLeft,
        ChevronRight,
        Plus,
        Calendar as CalendarIcon,
        Clock,
    } from "lucide-svelte";

    let view = $state("schedule"); // 'schedule' or 'month'

    const appointments = [
        {
            id: 1,
            title: "Dentist",
            date: "Oct 15",
            time: "10:00 AM",
            color: "bg-blue-500",
        },
        {
            id: 2,
            title: "Meeting",
            date: "Oct 15",
            time: "2:00 PM",
            color: "bg-purple-500",
        },
    ];

    const schedule = [
        { time: "06:00", task: "Gym", type: "Health" },
        { time: "08:00", task: "Work", type: "Work" },
        { time: "12:00", task: "Lunch", type: "Personal" },
        { time: "13:00", task: "Calls", type: "Work" },
    ];
</script>

<div class="pb-24 px-4 pt-6 space-y-6">
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-[var(--color-text)]">Schedule</h1>
        <button
            class="btn btn-icon bg-surface text-[var(--color-text)] border border-line rounded-full w-10 h-10 flex items-center justify-center"
        >
            <Plus size={20} />
        </button>
    </div>

    <!-- View Switcher -->
    <div class="bg-surface p-1 rounded-lg border border-line flex mb-4">
        <button
            onclick={() => (view = "schedule")}
            class="flex-1 py-2 rounded-md text-sm font-medium transition-all {view ===
            'schedule'
                ? 'bg-primary text-black shadow-sm'
                : 'text-muted'}"
        >
            Today
        </button>
        <button
            onclick={() => (view = "month")}
            class="flex-1 py-2 rounded-md text-sm font-medium transition-all {view ===
            'month'
                ? 'bg-primary text-black shadow-sm'
                : 'text-muted'}"
        >
            Calendar
        </button>
    </div>

    {#if view === "schedule"}
        <div class="space-y-4">
            <div class="flex items-center gap-2 text-muted text-sm mb-2">
                <Clock size={14} /> Time Blocked Schedule
            </div>
            <div class="relative border-l border-line ml-3 pl-6 space-y-6">
                {#each schedule as slot}
                    <div class="relative">
                        <div
                            class="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-background border-2 border-primary"
                        ></div>
                        <span class="text-xs text-muted block mb-1"
                            >{slot.time}</span
                        >
                        <div
                            class="p-3 bg-surface rounded-xl border border-line flex justify-between items-center"
                        >
                            <span class="font-medium text-[var(--color-text)]"
                                >{slot.task}</span
                            >
                            <span
                                class="text-[10px] uppercase tracking-wider text-muted border border-line px-2 py-0.5 rounded"
                                >{slot.type}</span
                            >
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <div class="space-y-4">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-[var(--color-text)]">
                    October 2026
                </h2>
                <div class="flex gap-2">
                    <button class="p-1"
                        ><ChevronLeft size={20} class="text-muted" /></button
                    >
                    <button class="p-1"
                        ><ChevronRight size={20} class="text-muted" /></button
                    >
                </div>
            </div>

            <!-- Simple Calendar Grid Mockup for Mobile -->
            <div class="grid grid-cols-7 gap-2 text-center mb-6">
                {#each ["S", "M", "T", "W", "T", "F", "S"] as d}
                    <span class="text-xs font-bold text-muted">{d}</span>
                {/each}
                {#each Array(31) as _, i}
                    <div
                        class="aspect-square flex items-center justify-center rounded-lg text-sm {i ===
                        9
                            ? 'bg-primary text-black font-bold'
                            : 'text-[var(--color-text)]'}"
                    >
                        {i + 1}
                    </div>
                {/each}
            </div>

            <div class="space-y-3">
                <h3 class="font-bold text-[var(--color-text)] text-sm">
                    Upcoming
                </h3>
                {#each appointments as appt}
                    <div
                        class="flex items-center gap-4 p-3 bg-surface rounded-xl border border-line"
                    >
                        <div class="w-10 text-center">
                            <span class="block text-[10px] text-muted uppercase"
                                >{appt.date.split(" ")[0]}</span
                            >
                            <span
                                class="block text-lg font-bold text-[var(--color-text)]"
                                >{appt.date.split(" ")[1]}</span
                            >
                        </div>
                        <div>
                            <h4
                                class="font-bold text-[var(--color-text)] text-sm"
                            >
                                {appt.title}
                            </h4>
                            <p class="text-xs text-muted">{appt.time}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
