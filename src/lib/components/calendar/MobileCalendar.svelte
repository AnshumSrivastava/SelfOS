<script lang="ts">
    import {
        ChevronLeft,
        ChevronRight,
        Plus,
        Calendar as CalendarIcon,
        Clock,
        X, // Keeping X as it's used in the modal
        Check,
        Trash2,
        Bell,
        Timer,
        ArrowRight,
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
    import { confirmState } from "$lib/stores/confirm.svelte";
    import { fly, fade } from "svelte/transition";

    let view = $state("schedule"); // 'schedule' or 'month'
    let selectedDate = $state(getToday());
    let currentMonthDate = $state(
        new Date(getToday().getFullYear(), getToday().getMonth(), 1),
    );

    // Event Modal State
    let showAddModal = $state(false);
    let newEvent = $state<Omit<CalendarEvent, "id">>({
        title: "",
        description: "",
        date: formatDateISO(new Date()),
        startTime: "09:00",
        endTime: "10:00",
        type: "event",
        color: "#3b82f6",
    });

    $effect(() => {
        newEvent.date = formatDateISO(selectedDate);
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
        calendarStore.events
            .filter((e) => new Date(e.date) >= new Date())
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
            )
            .slice(0, 8),
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

    async function handleAddEvent() {
        if (!newEvent.title) return;
        await calendarStore.add({ ...newEvent });
        showAddModal = false;
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

    async function handleDeleteEvent(id: string) {
        if (
            await confirmState.confirm(
                "Purge Event",
                "Remove this from your horizon?",
            )
        ) {
            calendarStore.remove(id);
        }
    }
</script>

<div class="page-container relative h-full flex flex-col gap-6 pb-24">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-theme-text-strong tracking-tighter">
            {view === "schedule" ? "Sequence" : "Chronos"}
        </h1>
        <button
            onclick={() => (showAddModal = true)}
            class="w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- View Switcher -->
    <div class="bg-white/5 p-1 rounded-2xl border border-white/5 flex">
        <button
            onclick={() => (view = "schedule")}
            class="flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all {view ===
            'schedule'
                ? 'bg-primary text-black'
                : 'text-muted'}"
        >
            Flow
        </button>
        <button
            onclick={() => (view = "month")}
            class="flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all {view ===
            'month'
                ? 'bg-primary text-black'
                : 'text-muted'}"
        >
            Horizon
        </button>
    </div>

    {#if view === "schedule"}
        <div class="space-y-6 flex-1 overflow-y-auto pr-1">
            <div
                class="flex items-center justify-between text-muted text-[10px] font-black uppercase tracking-[0.2em] px-1"
            >
                <div class="flex items-center gap-2">
                    <Clock size={12} class="text-primary" />
                    {selectedDate.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                    })}
                </div>
                {#if !isSameDay(selectedDate, getToday())}
                    <button
                        onclick={() => selectDate(getToday())}
                        class="text-primary">Present</button
                    >
                {/if}
            </div>

            <div class="space-y-4">
                {#if dayEvents.length === 0}
                    <div
                        class="p-12 text-center rounded-[32px] border border-dashed border-white/5 bg-white/[0.02]"
                    >
                        <p class="text-xs text-muted/60 mb-6 font-medium">
                            Temporal clarity achieved.
                        </p>
                        <button
                            onclick={() => (showAddModal = true)}
                            class="text-[10px] font-black text-primary uppercase tracking-[0.2em]"
                            >+ Block Time</button
                        >
                    </div>
                {:else}
                    {#each dayEvents.sort( (a, b) => (a.startTime || "").localeCompare(b.startTime || ""), ) as event (event.id)}
                        <div
                            class="relative group"
                            in:fly={{ y: 20, duration: 400 }}
                        >
                            <div
                                class="flex items-center gap-5 p-6 rounded-[28px] bg-white/5 border border-white/5 active:bg-white/10 transition-all"
                            >
                                <div
                                    class="w-16 border-r border-white/5 flex flex-col items-center gap-1"
                                >
                                    <span
                                        class="text-[10px] font-mono text-white/40"
                                        >{event.startTime || "--:--"}</span
                                    >
                                    <span
                                        class="text-[8px] font-mono text-muted/20 uppercase tracking-tighter"
                                        >{event.endTime || ""}</span
                                    >
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4
                                        class="text-sm font-bold text-white tracking-tight truncate mb-1"
                                    >
                                        {event.title}
                                    </h4>
                                    <span
                                        class="text-[8px] font-black uppercase tracking-[0.2em] text-muted/40"
                                        >{event.type}</span
                                    >
                                </div>
                                <button
                                    onclick={() => handleDeleteEvent(event.id)}
                                    class="p-3 text-muted/20 active:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <div
                                    class="absolute left-0 top-6 bottom-6 w-1 rounded-full"
                                    style="background-color: {event.color ||
                                        'var(--primary)'}"
                                ></div>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    {:else}
        <div class="space-y-8 flex-1 overflow-y-auto pr-1">
            <div class="flex items-center justify-between px-2">
                <h2
                    class="text-2xl font-light text-theme-text-strong tracking-tighter"
                >
                    {formatMonthYear(currentMonthDate)}
                </h2>
                <div class="flex gap-2">
                    <button
                        onclick={() => changeMonth(-1)}
                        class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-muted"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onclick={() => changeMonth(1)}
                        class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-muted"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-7 gap-1 text-center mb-8">
                {#each ["S", "M", "T", "W", "T", "F", "S"] as d}
                    <span
                        class="text-[10px] font-black text-muted/20 uppercase tracking-[0.2em] py-2"
                        >{d}</span
                    >
                {/each}
                {#each calendarDays as day}
                    <button
                        onclick={() => {
                            if (day.date) {
                                selectDate(day.date);
                                view = "schedule";
                            }
                        }}
                        class="aspect-square flex flex-col items-center justify-center rounded-2xl text-xs relative transition-all active:scale-90 {day.date &&
                        isSameDay(day.date, selectedDate)
                            ? 'bg-primary text-black font-black shadow-lg shadow-primary/20'
                            : day.date && isSameDay(day.date, getToday())
                              ? 'text-primary border border-primary/20'
                              : 'text-muted/60'}"
                    >
                        {day.dayNumber || ""}
                        {#if day.date && calendarStore.getEventsByDate(formatDateISO(day.date)).length > 0 && !isSameDay(day.date, selectedDate)}
                            <div
                                class="absolute bottom-2 w-1 h-1 rounded-full bg-primary/40"
                            ></div>
                        {/if}
                    </button>
                {/each}
            </div>

            <div class="space-y-4 pb-12">
                <h3
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-2 flex items-center gap-2"
                >
                    <Bell size={12} class="text-primary" /> Upcoming Sequence
                </h3>
                <div class="space-y-3">
                    {#each upcomingEvents as event (event.id)}
                        <button
                            onclick={() => {
                                selectDate(new Date(event.date));
                                view = "schedule";
                            }}
                            class="w-full flex items-center gap-4 p-5 rounded-[28px] bg-white/5 border border-white/5 active:bg-white/10 transition-all text-left group"
                        >
                            <div
                                class="w-11 h-11 flex flex-col items-center justify-center rounded-xl bg-white/5"
                            >
                                <span
                                    class="text-[8px] font-black uppercase text-muted/40"
                                    >{new Date(event.date).toLocaleString(
                                        "default",
                                        { month: "short" },
                                    )}</span
                                >
                                <span class="text-base font-light text-white"
                                    >{new Date(event.date).getDate()}</span
                                >
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4
                                    class="text-sm font-bold text-white tracking-tight truncate"
                                >
                                    {event.title}
                                </h4>
                                <p
                                    class="text-[9px] font-black uppercase tracking-widest text-muted/40"
                                >
                                    {event.startTime || "All Day"}
                                </p>
                            </div>
                            <ArrowRight
                                size={14}
                                class="text-muted/10 group-active:text-primary transition-colors"
                            />
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

{#if showAddModal}
    <div class="fixed inset-0 z-[100] flex items-end justify-center">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="fixed inset-0 bg-black/80 backdrop-blur-md"
            transition:fade
            onclick={() => (showAddModal = false)}
        ></div>

        <div
            class="relative w-full bg-neutral-900 border-t border-white/5 rounded-t-[40px] shadow-2xl overflow-hidden p-8 pb-12 space-y-8"
            transition:fly={{ y: 400, duration: 450, opacity: 1 }}
        >
            <div class="w-12 h-1.5 bg-white/5 rounded-full mx-auto -mt-2"></div>

            <div class="flex justify-between items-center">
                <h3
                    class="text-2xl font-light text-theme-text-strong tracking-tighter"
                >
                    New Block
                </h3>
                <button
                    onclick={() => (showAddModal = false)}
                    class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted"
                >
                    <X size={20} />
                </button>
            </div>

            <div class="space-y-6">
                <div class="space-y-2">
                    <label
                        for="m-title"
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                        >Event Definition</label
                    >
                    <input
                        type="text"
                        id="m-title"
                        bind:value={newEvent.title}
                        placeholder="What is the objective?"
                        class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/20 transition-all placeholder:text-muted/20"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label
                            for="m-date"
                            class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                            >Date</label
                        >
                        <input
                            type="date"
                            id="m-date"
                            bind:value={newEvent.date}
                            class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/20 transition-all"
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            for="m-type"
                            class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                            >Archetype</label
                        >
                        <select
                            id="m-type"
                            bind:value={newEvent.type}
                            class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:border-primary/20 transition-all appearance-none"
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
                            class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                            >Start</label
                        >
                        <input
                            type="time"
                            id="m-start"
                            bind:value={newEvent.startTime}
                            class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/20 transition-all"
                        />
                    </div>
                    <div class="space-y-2">
                        <label
                            for="m-end"
                            class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                            >End</label
                        >
                        <input
                            type="time"
                            id="m-end"
                            bind:value={newEvent.endTime}
                            class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/20 transition-all"
                        />
                    </div>
                </div>

                <div class="space-y-4">
                    <span
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1 block"
                        >Visual Resonance</span
                    >
                    <div class="flex justify-between px-2">
                        {#each ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"] as color}
                            <button
                                onclick={() => (newEvent.color = color)}
                                class="w-12 h-12 rounded-2xl border-2 transition-all active:scale-120 {newEvent.color ===
                                color
                                    ? 'border-primary ring-4 ring-primary/20'
                                    : 'border-transparent'}"
                                style="background-color: {color}"
                            ></button>
                        {/each}
                    </div>
                </div>

                <button
                    onclick={handleAddEvent}
                    class="w-full py-5 rounded-[28px] bg-primary text-black font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
                >
                    <Check size={24} /> Confirm Horizon
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    :global(
            input[type="date"]::-webkit-calendar-picker-indicator,
            input[type="time"]::-webkit-calendar-picker-indicator
        ) {
        filter: invert(1);
        opacity: 0.3;
        cursor: pointer;
    }
</style>
