<script lang="ts">
    import {
        ChevronLeft,
        ChevronRight,
        Plus,
        Calendar as CalendarIcon,
        Clock,
        X,
        Check,
        Trash2,
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
    } from "$lib/utils/dateUtils";

    let view = $state("schedule"); // 'schedule' or 'month'
    let selectedDate = $state(getToday());
    let currentMonthDate = $state(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
    );

    // Event Modal State
    let showAddModal = $state(false);
    let newEvent = $state<Omit<CalendarEvent, "id">>({
        title: "",
        description: "",
        date: formatDateISO(selectedDate),
        startTime: "09:00",
        endTime: "10:00",
        type: "event",
        color: "#3b82f6",
    });

    // Reactive grid and events
    let calendarDays = $derived(
        getDaysInMonth(
            currentMonthDate.getFullYear(),
            currentMonthDate.getMonth(),
        ),
    );
    let dayEvents = $derived(
        calendarStore.getEventsByDate(formatDateISO(selectedDate)),
    );

    let upcomingEvents = $derived(
        [...calendarStore.events]
            .filter((e) => new Date(e.date) >= new Date())
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
            )
            .slice(0, 10),
    );

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
</script>

<div class="page-container relative h-full">
    <div class="module-header">
        <h1 class="text-3xl font-light text-white">
            {view === "schedule" ? "Schedule" : "Calendar"}
        </h1>
        <button
            onclick={() => (showAddModal = true)}
            class="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- View Switcher -->
    <div class="bg-surface p-1 rounded-lg border border-line flex">
        <button
            onclick={() => (view = "schedule")}
            class="flex-1 py-1.5 rounded-md text-sm font-medium transition-all {view ===
            'schedule'
                ? 'bg-primary text-black shadow-sm'
                : 'text-muted'}"
        >
            Today
        </button>
        <button
            onclick={() => (view = "month")}
            class="flex-1 py-1.5 rounded-md text-sm font-medium transition-all {view ===
            'month'
                ? 'bg-primary text-black shadow-sm'
                : 'text-muted'}"
        >
            Calendar
        </button>
    </div>

    {#if view === "schedule"}
        <div class="space-y-4">
            <div
                class="flex items-center justify-between text-muted text-sm mb-2"
            >
                <div class="flex items-center gap-2">
                    <Clock size={14} />
                    {selectedDate.toLocaleDateString("default", {
                        month: "short",
                        day: "numeric",
                    })}
                </div>
                {#if !isSameDay(selectedDate, getToday())}
                    <button
                        onclick={() => selectDate(getToday())}
                        class="text-primary text-xs">Go to Today</button
                    >
                {/if}
            </div>

            <div class="space-y-4">
                {#if dayEvents.length === 0}
                    <div class="card-subtle text-center py-8">
                        <p class="text-muted text-sm mb-4">
                            No events scheduled for this day
                        </p>
                        <button
                            onclick={() => (showAddModal = true)}
                            class="text-primary text-sm font-bold"
                            >+ Add Something</button
                        >
                    </div>
                {:else}
                    {#each dayEvents.sort( (a, b) => (a.startTime || "").localeCompare(b.startTime || ""), ) as slot}
                        <div
                            class="card-subtle flex items-center gap-4 relative group"
                        >
                            <div
                                class="w-16 border-r border-line text-center pr-3"
                            >
                                <span class="text-xs font-mono text-muted block"
                                    >{slot.startTime || "--:--"}</span
                                >
                                <span class="text-[10px] text-muted/50 block"
                                    >{slot.endTime || ""}</span
                                >
                            </div>
                            <div class="flex-1">
                                <span class="font-medium text-white block"
                                    >{slot.title}</span
                                >
                                <span
                                    class="text-[10px] uppercase tracking-wider text-muted"
                                    >{slot.type}</span
                                >
                            </div>
                            <button
                                onclick={() => removeEvent(slot.id)}
                                class="p-2 text-muted hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div
                                class="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                                style="background-color: {slot.color ||
                                    'var(--primary)'}"
                            ></div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    {:else}
        <div class="space-y-4">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold text-white">
                    {formatMonthYear(currentMonthDate)}
                </h2>
                <div class="flex gap-2">
                    <button onclick={() => changeMonth(-1)} class="p-1">
                        <ChevronLeft size={20} class="text-muted" />
                    </button>
                    <button onclick={() => changeMonth(1)} class="p-1">
                        <ChevronRight size={20} class="text-muted" />
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-7 gap-1 text-center mb-6">
                {#each ["S", "M", "T", "W", "T", "F", "S"] as d}
                    <span class="text-xs font-bold text-muted">{d}</span>
                {/each}
                {#each calendarDays as day}
                    <div
                        onclick={() => {
                            if (day.date) {
                                selectDate(day.date);
                                view = "schedule";
                            }
                        }}
                        class="aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative {day.date &&
                        isSameDay(day.date, selectedDate)
                            ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20'
                            : day.date && isSameDay(day.date, getToday())
                              ? 'text-primary border border-primary/30'
                              : 'text-white'}"
                    >
                        {day.dayNumber || ""}
                        {#if day.date && calendarStore.getEventsByDate(formatDateISO(day.date)).length > 0 && !isSameDay(day.date, selectedDate)}
                            <div
                                class="absolute bottom-1 w-1 h-1 rounded-full bg-primary"
                            ></div>
                        {/if}
                    </div>
                {/each}
            </div>

            <div class="space-y-3 pb-20">
                <h3 class="font-bold text-white text-sm">Upcoming</h3>
                {#if upcomingEvents.length === 0}
                    <p class="text-muted text-xs">No upcoming events</p>
                {:else}
                    {#each upcomingEvents as appt}
                        <div
                            onclick={() => selectDate(new Date(appt.date))}
                            class="card-subtle flex items-center gap-4 transition-transform active:scale-95"
                        >
                            <div
                                class="w-12 text-center border-r border-line pr-3"
                            >
                                <span
                                    class="block text-[10px] text-muted uppercase font-bold"
                                    >{new Date(appt.date).toLocaleString(
                                        "default",
                                        { month: "short" },
                                    )}</span
                                >
                                <span class="block text-lg font-bold text-white"
                                    >{new Date(appt.date).getDate()}</span
                                >
                            </div>
                            <div class="flex-1">
                                <h4 class="font-bold text-white text-sm">
                                    {appt.title}
                                </h4>
                                <p class="text-xs text-muted">
                                    {appt.startTime || "All day"}
                                </p>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    {/if}
</div>

{#if showAddModal}
    <div class="fixed inset-0 z-[100] flex items-end justify-center">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onclick={() => (showAddModal = false)}
        ></div>

        <div
            class="relative w-full bg-surface border-t border-line rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
        >
            <div
                class="w-12 h-1.5 bg-line rounded-full mx-auto mt-3 mb-2"
            ></div>

            <div class="p-6 pt-2 space-y-4">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-xl font-bold text-white">New Event</h3>
                    <button
                        onclick={() => (showAddModal = false)}
                        class="text-muted"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div class="space-y-2">
                    <label
                        for="m-title"
                        class="text-xs font-bold text-muted uppercase tracking-wider"
                        >Title</label
                    >
                    <input
                        type="text"
                        id="m-title"
                        bind:value={newEvent.title}
                        placeholder="What's happening?"
                        class="w-full bg-background border border-line rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label
                            for="m-date"
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >Date</label
                        >
                        <input
                            type="date"
                            id="m-date"
                            bind:value={newEvent.date}
                            class="w-full bg-background border border-line rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            for="m-type"
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >Type</label
                        >
                        <select
                            id="m-type"
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
                            for="m-start"
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >Start Time</label
                        >
                        <input
                            type="time"
                            id="m-start"
                            bind:value={newEvent.startTime}
                            class="w-full bg-background border border-line rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            for="m-end"
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >End Time</label
                        >
                        <input
                            type="time"
                            id="m-end"
                            bind:value={newEvent.endTime}
                            class="w-full bg-background border border-line rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <label
                        class="text-xs font-bold text-muted uppercase tracking-wider"
                        >Color Accent</label
                    >
                    <div class="flex justify-between px-2">
                        {#each ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"] as color}
                            <button
                                onclick={() => (newEvent.color = color)}
                                class="w-10 h-10 rounded-full border-2 transition-transform active:scale-120 {newEvent.color ===
                                color
                                    ? 'border-white'
                                    : 'border-transparent'}"
                                style="background-color: {color}"
                            ></button>
                        {/each}
                    </div>
                </div>

                <div class="pt-4 pb-6 flex gap-3">
                    <button
                        onclick={addEvent}
                        class="w-full py-4 rounded-2xl bg-primary text-black font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <Check size={20} /> Create Event
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
