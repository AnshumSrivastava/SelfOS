<script lang="ts">
    import {
        ChevronLeft,
        ChevronRight,
        Calendar as CalendarIcon,
        Clock,
        Plus,
        Bell,
    } from "lucide-svelte";

    let view = $state("month"); // 'month' or 'day'
    let selectedDate = $state(new Date());

    const appointments = [
        {
            id: 1,
            title: "Dentist Appointment",
            date: "2026-10-15",
            time: "10:00 AM",
            type: "Health",
        },
        {
            id: 2,
            title: "Team Meeting",
            date: "2026-10-15",
            time: "2:00 PM",
            type: "Work",
        },
        {
            id: 3,
            title: "Dinner with Sarah",
            date: "2026-10-16",
            time: "7:00 PM",
            type: "Personal",
        },
        {
            id: 4,
            title: "Project Deadline",
            date: "2026-10-20",
            time: "5:00 PM",
            type: "Work",
        },
    ];

    const schedule = [
        { time: "06:00", task: "Wake up & Gym", type: "Health" },
        { time: "08:00", task: "Deep Work: Coding", type: "Work" },
        { time: "12:00", task: "Lunch & Reading", type: "Personal" },
        { time: "13:00", task: "Team Calls", type: "Work" },
        { time: "17:00", task: "Wrap up & Planning", type: "Work" },
        { time: "18:00", task: "Dinner", type: "Health" },
        { time: "20:00", task: "Side Project / Learning", type: "Growth" },
    ];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentMonth = "October 2026";

    // Generate calendar grid (simple mock for Oct 2026)
    // Oct 1 2026 is a Thursday
    const calendarDays = Array.from({ length: 35 }, (_, i) => {
        const day = i - 3; // Start from previous month
        return {
            date: day > 0 && day <= 31 ? day : "",
            isToday: day === 10,
            hasEvent: [15, 16, 20].includes(day),
        };
    });

    function toggleView(v: "month" | "day") {
        view = v;
    }
</script>

<div class="space-y-8 pb-12">
    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-3xl font-bold text-[var(--color-text)] mb-2">
                Calendar & Schedule
            </h1>
            <p class="text-muted">Manage your time effectively.</p>
        </div>
        <div class="flex gap-3">
            <div class="bg-surface p-1 rounded-lg border border-line flex">
                <button
                    onclick={() => toggleView("month")}
                    class="px-4 py-1.5 rounded-md text-sm font-medium transition-all {view ===
                    'month'
                        ? 'bg-primary text-black shadow-sm'
                        : 'text-muted hover:text-[var(--color-text)]'}"
                >
                    Month
                </button>
                <button
                    onclick={() => toggleView("day")}
                    class="px-4 py-1.5 rounded-md text-sm font-medium transition-all {view ===
                    'day'
                        ? 'bg-primary text-black shadow-sm'
                        : 'text-muted hover:text-[var(--color-text)]'}"
                >
                    Day
                </button>
            </div>
            <button class="btn btn-primary flex items-center gap-2">
                <Plus size={18} /> New Event
            </button>
        </div>
    </div>

    {#if view === "month"}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 card">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-[var(--color-text)]">
                        {currentMonth}
                    </h2>
                    <div class="flex gap-2">
                        <button
                            class="p-1 hover:bg-surface rounded text-[var(--color-text)]"
                            ><ChevronLeft size={20} /></button
                        >
                        <button
                            class="p-1 hover:bg-surface rounded text-[var(--color-text)]"
                            ><ChevronRight size={20} /></button
                        >
                    </div>
                </div>

                <div class="grid grid-cols-7 gap-4 mb-4 text-center">
                    {#each days as day}
                        <div
                            class="text-sm font-bold text-muted uppercase tracking-wider"
                        >
                            {day}
                        </div>
                    {/each}
                </div>

                <div class="grid grid-cols-7 gap-4">
                    {#each calendarDays as day}
                        <div
                            class="aspect-square border border-line/30 rounded-xl p-2 relative hover:bg-surface/50 transition-colors cursor-pointer group {day.isToday
                                ? 'bg-primary/5 border-primary/30'
                                : ''}"
                        >
                            {#if day.date}
                                <span
                                    class="text-sm font-medium {day.isToday
                                        ? 'text-primary'
                                        : 'text-[var(--color-text)]'}"
                                    >{day.date}</span
                                >
                                {#if day.hasEvent}
                                    <div
                                        class="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-primary"
                                    ></div>
                                {/if}
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>

            <div class="space-y-6">
                <div class="card bg-surface/50 border-primary/20">
                    <h3
                        class="font-bold text-[var(--color-text)] mb-4 flex items-center gap-2"
                    >
                        <Bell size={18} class="text-primary" /> Upcoming Events
                    </h3>
                    <div class="space-y-4">
                        {#each appointments as appt}
                            <div
                                class="flex items-start gap-3 p-3 rounded-lg hover:bg-surface transition-colors"
                            >
                                <div class="w-12 text-center">
                                    <span
                                        class="block text-xs text-muted uppercase font-bold"
                                        >{new Date(appt.date).toLocaleString(
                                            "default",
                                            { month: "short" },
                                        )}</span
                                    >
                                    <span
                                        class="block text-lg font-bold text-[var(--color-text)]"
                                        >{new Date(appt.date).getDate()}</span
                                    >
                                </div>
                                <div>
                                    <h4
                                        class="font-bold text-[var(--color-text)] text-sm"
                                    >
                                        {appt.title}
                                    </h4>
                                    <p class="text-xs text-muted">
                                        {appt.time} • {appt.type}
                                    </p>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <!-- DAY VIEW (Time Blocking) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 card">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-2">
                        <h2 class="text-xl font-bold text-[var(--color-text)]">
                            Today
                        </h2>
                        <span class="text-muted text-sm">Oct 10, 2026</span>
                    </div>
                    <button
                        class="text-xs bg-surface border border-line px-3 py-1 rounded-full text-[var(--color-text)]"
                        >Edit Schedule</button
                    >
                </div>

                <div class="relative space-y-4 pl-4 border-l border-line ml-4">
                    {#each schedule as slot}
                        <div class="relative pl-6 pb-2">
                            <div
                                class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-surface border-2 border-primary"
                            ></div>
                            <span
                                class="absolute -left-[60px] top-0 text-xs text-muted font-mono"
                                >{slot.time}</span
                            >

                            <div
                                class="p-3 rounded-lg bg-surface/30 border border-line hover:border-primary/50 transition-colors group cursor-pointer flex justify-between items-center"
                            >
                                <div>
                                    <h4
                                        class="font-bold text-[var(--color-text)]"
                                    >
                                        {slot.task}
                                    </h4>
                                    <span
                                        class="text-xs text-muted px-2 py-0.5 rounded-full bg-surface border border-line mt-1 inline-block"
                                        >{slot.type}</span
                                    >
                                </div>
                                <Clock
                                    size={16}
                                    class="text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="space-y-6">
                <div class="card">
                    <h3 class="font-bold text-[var(--color-text)] mb-4">
                        Quick Stats
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-4 rounded-xl bg-surface text-center">
                            <span class="block text-2xl font-bold text-primary"
                                >6h</span
                            >
                            <span class="text-xs text-muted">Deep Work</span>
                        </div>
                        <div class="p-4 rounded-xl bg-surface text-center">
                            <span class="block text-2xl font-bold text-blue-400"
                                >2h</span
                            >
                            <span class="text-xs text-muted">Meetings</span>
                        </div>
                        <div class="p-4 rounded-xl bg-surface text-center">
                            <span
                                class="block text-2xl font-bold text-green-400"
                                >1h</span
                            >
                            <span class="text-xs text-muted">Health</span>
                        </div>
                        <div class="p-4 rounded-xl bg-surface text-center">
                            <span
                                class="block text-2xl font-bold text-purple-400"
                                >2h</span
                            >
                            <span class="text-xs text-muted">Learning</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
