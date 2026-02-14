<script lang="ts">
    import {
        ChevronLeft,
        ChevronRight,
        Calendar as CalendarIcon,
        Clock,
        Plus,
        Bell,
        X,
        Trash2,
        Check,
    } from "lucide-svelte";
    import {
        calendarStore,
        type CalendarEvent,
    } from "$lib/stores/calendar.svelte";
    import {
        getDaysInMonth,
        formatMonthYear,
        formatDateISO,
        isSameDay,
        getToday,
        getTimeString,
    } from "$lib/utils/dateUtils";

    let view = $state("month"); // 'month' or 'day'
    let selectedDate = $state(getToday());
    let currentMonthDate = $state(
        new Date(getToday().getFullYear(), getToday().getMonth(), 1),
    );

    // Event Modal State
    let showAddModal = $state(false);
    let newEvent = $state<Omit<CalendarEvent, "id">>({
        title: "",
        description: "",
        date: formatDateISO(getToday()),
        startTime: "09:00",
        endTime: "10:00",
        type: "event",
        color: "#3b82f6",
    });

    $effect(() => {
        newEvent.date = formatDateISO(selectedDate);
    });

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Reactive grid and events
    let calendarDays = $derived(
        getDaysInMonth(
            currentMonthDate.getFullYear(),
            currentMonthDate.getMonth(),
        ),
    );
    let upcomingEvents = $derived(
        [...calendarStore.events]
            .filter((e) => new Date(e.date) >= new Date())
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
            )
            .slice(0, 5),
    );

    let dayEvents = $derived(
        calendarStore.getEventsByDate(formatDateISO(selectedDate)),
    );

    function toggleView(v: "month" | "day") {
        view = v;
    }

    function changeMonth(delta: number) {
        currentMonthDate = new Date(
            currentMonthDate.getFullYear(),
            currentMonthDate.getMonth() + delta,
            1,
        );
    }

    function selectDate(date: Date) {
        selectedDate = date;
        newEvent.date = formatDateISO(date);
    }

    function addEvent() {
        if (!newEvent.title) return;
        calendarStore.add({ ...newEvent });
        showAddModal = false;
        // Reset modal
        newEvent = {
            title: "",
            description: "",
            date: formatDateISO(selectedDate),
            startTime: "09:00",
            endTime: "10:00",
            type: "event",
            color: "#3b82f6",
        };
    }

    function removeEvent(id: string) {
        calendarStore.remove(id);
    }

    // Schedule slots for Day View (hardcoded hours for now)
    const hours = Array.from(
        { length: 24 },
        (_, i) => `${String(i).padStart(2, "0")}:00`,
    );
</script>

<div class="page-container h-full">
    <div class="module-header">
        <div>
            <h1 class="text-3xl font-light text-white">Calendar & Schedule</h1>
            <p class="text-muted">Manage your time effectively.</p>
        </div>
        <div class="flex gap-3">
            <div class="bg-surface p-1 rounded-lg border border-line flex">
                <button
                    onclick={() => toggleView("month")}
                    class="px-4 py-1.5 rounded-md text-sm font-medium transition-all {view ===
                    'month'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-muted hover:text-white'}"
                >
                    Month
                </button>
                <button
                    onclick={() => toggleView("day")}
                    class="px-4 py-1.5 rounded-md text-sm font-medium transition-all {view ===
                    'day'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-muted hover:text-white'}"
                >
                    Day
                </button>
            </div>
            <button
                onclick={() => (showAddModal = true)}
                class="btn btn-primary flex items-center gap-2"
            >
                <Plus size={18} /> New Event
            </button>
        </div>
    </div>

    {#if view === "month"}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 card-subtle">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white">
                        {formatMonthYear(currentMonthDate)}
                    </h2>
                    <div class="flex gap-2">
                        <button
                            onclick={() => changeMonth(-1)}
                            class="p-1 hover:bg-surface rounded text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onclick={() => changeMonth(1)}
                            class="p-1 hover:bg-surface rounded text-white"
                        >
                            <ChevronRight size={20} />
                        </button>
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
                            role="button"
                            tabindex="0"
                            onclick={() => {
                                if (day.date) selectDate(day.date);
                            }}
                            onkeydown={(e) => {
                                if (
                                    (e.key === "Enter" || e.key === " ") &&
                                    day.date
                                ) {
                                    selectDate(day.date);
                                }
                            }}
                            class="aspect-square border border-line/30 rounded-xl p-2 relative hover:bg-surface/50 transition-colors cursor-pointer group {day.date &&
                            isSameDay(day.date, selectedDate)
                                ? 'bg-primary/10 border-primary/50'
                                : day.date && isSameDay(day.date, getToday())
                                  ? 'bg-primary/5 border-primary/30'
                                  : ''}"
                        >
                            {#if day.date}
                                <span
                                    class="text-sm font-medium {isSameDay(
                                        day.date,
                                        getToday(),
                                    )
                                        ? 'text-primary'
                                        : 'text-white'}">{day.dayNumber}</span
                                >
                                <div class="mt-1 space-y-1">
                                    {#each calendarStore
                                        .getEventsByDate(formatDateISO(day.date))
                                        .slice(0, 2) as event}
                                        <div
                                            class="h-1 rounded-full w-full"
                                            style="background-color: {event.color ||
                                                'var(--primary)'}"
                                        ></div>
                                    {/each}
                                    {#if calendarStore.getEventsByDate(formatDateISO(day.date)).length > 2}
                                        <div class="text-[10px] text-muted">
                                            +{calendarStore.getEventsByDate(
                                                formatDateISO(day.date),
                                            ).length - 2}
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>

            <div class="space-y-6">
                <div class="card-subtle bg-surface/30">
                    <h3
                        class="font-medium text-white mb-4 flex items-center gap-2"
                    >
                        <Bell size={18} class="text-primary" /> Upcoming Events
                    </h3>
                    <div class="space-y-4">
                        {#if upcomingEvents.length === 0}
                            <p class="text-muted text-sm text-center py-4">
                                No upcoming events
                            </p>
                        {:else}
                            {#each upcomingEvents as appt}
                                <div
                                    class="flex items-start gap-3 p-3 rounded-lg hover:bg-surface transition-colors group relative"
                                >
                                    <div class="w-12 text-center">
                                        <span
                                            class="block text-xs text-muted uppercase font-bold"
                                            >{new Date(
                                                appt.date,
                                            ).toLocaleString("default", {
                                                month: "short",
                                            })}</span
                                        >
                                        <span
                                            class="block text-lg font-bold text-white"
                                            >{new Date(
                                                appt.date,
                                            ).getDate()}</span
                                        >
                                    </div>
                                    <div class="flex-1">
                                        <h4
                                            class="font-bold text-white text-sm"
                                        >
                                            {appt.title}
                                        </h4>
                                        <p class="text-xs text-muted">
                                            {appt.startTime || ""}
                                            {appt.endTime
                                                ? " - " + appt.endTime
                                                : ""} • {appt.type}
                                        </p>
                                    </div>
                                    <button
                                        onclick={() => removeEvent(appt.id)}
                                        class="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-muted transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <!-- DAY VIEW (Time Blocking) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 card-subtle">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-2">
                        <h2 class="text-xl font-bold text-white">Schedule</h2>
                        <span class="text-muted text-sm"
                            >{selectedDate.toLocaleDateString("default", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}</span
                        >
                    </div>
                    <button
                        onclick={() => (showAddModal = true)}
                        class="text-xs bg-surface border border-line px-3 py-1 rounded-full text-white hover:border-primary transition-colors"
                        >+ Add Task</button
                    >
                </div>

                <div
                    class="relative max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                >
                    <div class="relative border-l border-line ml-16 space-y-0">
                        {#each hours as hour}
                            <div
                                class="h-16 relative border-t border-line/30 group"
                            >
                                <span
                                    class="absolute -left-14 -top-2.5 text-[10px] text-muted font-mono"
                                    >{hour}</span
                                >

                                {#each dayEvents.filter((e) => e.startTime === hour) as event}
                                    <div
                                        class="absolute left-2 right-2 p-2 rounded-lg border-l-4 shadow-sm z-10 hover:brightness-110 transition-all group"
                                        style="border-color: {event.color}; background-color: {event.color}15; min-height: 48px;"
                                    >
                                        <div
                                            class="flex justify-between items-start"
                                        >
                                            <div>
                                                <h4
                                                    class="text-xs font-bold text-white"
                                                >
                                                    {event.title}
                                                </h4>
                                                {#if event.startTime && event.endTime}
                                                    <p
                                                        class="text-[10px] text-muted opacity-80"
                                                    >
                                                        {event.startTime} - {event.endTime}
                                                    </p>
                                                {/if}
                                            </div>
                                            <button
                                                onclick={() =>
                                                    removeEvent(event.id)}
                                                class="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 text-muted transition-all"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="card-subtle">
                    <h3 class="font-bold text-white mb-4">Quick Stats</h3>
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

{#if showAddModal}
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onclick={() => (showAddModal = false)}
        ></div>

        <div
            class="relative w-full max-w-md bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        >
            <div
                class="p-6 border-b border-line flex justify-between items-center"
            >
                <h3 class="text-xl font-bold text-white">New Calendar Event</h3>
                <button
                    onclick={() => (showAddModal = false)}
                    class="text-muted hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div class="p-6 space-y-4">
                <div class="space-y-2">
                    <label
                        for="title"
                        class="text-xs font-bold text-muted uppercase tracking-wider"
                        >Title</label
                    >
                    <input
                        type="text"
                        id="title"
                        bind:value={newEvent.title}
                        placeholder="Project deadline, Gym session..."
                        class="w-full bg-background border border-line rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label
                            for="date"
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >Date</label
                        >
                        <input
                            type="date"
                            id="date"
                            bind:value={newEvent.date}
                            class="w-full bg-background border border-line rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            for="type"
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >Type</label
                        >
                        <select
                            id="type"
                            bind:value={newEvent.type}
                            class="w-full bg-background border border-line rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                        >
                            <option value="event">Event</option>
                            <option value="meeting">Meeting</option>
                            <option value="reminder">Reminder</option>
                            <option value="task">Task</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label
                            for="start"
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >Start Time</label
                        >
                        <input
                            type="time"
                            id="start"
                            bind:value={newEvent.startTime}
                            class="w-full bg-background border border-line rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            for="end"
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >End Time</label
                        >
                        <input
                            type="time"
                            id="end"
                            bind:value={newEvent.endTime}
                            class="w-full bg-background border border-line rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <span
                        class="text-xs font-bold text-muted uppercase tracking-wider block"
                        >Color Accent</span
                    >
                    <div class="flex gap-3">
                        {#each ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"] as color}
                            <button
                                onclick={() => (newEvent.color = color)}
                                class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 {newEvent.color ===
                                color
                                    ? 'border-white'
                                    : 'border-transparent'}"
                                style="background-color: {color}"
                                aria-label="Select color {color}"
                            ></button>
                        {/each}
                    </div>
                </div>
            </div>

            <div class="p-6 bg-surface/50 border-t border-line flex gap-3">
                <button
                    onclick={() => (showAddModal = false)}
                    class="flex-1 py-3 rounded-xl border border-line text-white font-medium hover:bg-surface transition-colors"
                >
                    Cancel
                </button>
                <button
                    onclick={addEvent}
                    class="flex-1 py-3 rounded-xl bg-primary text-black font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                    <Check size={18} /> Save Event
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: var(--line);
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: var(--muted);
    }
</style>
