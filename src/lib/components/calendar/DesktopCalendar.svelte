<script lang="ts">
    import {
        ChevronLeft,
        ChevronRight,
        Calendar as CalendarIcon,
        Clock,
        Plus,
        Bell,
        Trash2,
        Check,
        Timer,
        ArrowRight,
    } from "lucide-svelte";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import Modal from "$lib/components/ui/Modal.svelte";
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
        calendarStore.events
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

    async function handleAddEvent() {
        if (!newEvent.title) return;
        await calendarStore.add({ ...newEvent });
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

    async function handleDeleteEvent(id: string) {
        if (
            await confirmState.confirm(
                "Purge Event",
                "Are you sure you want to remove this event from your schedule?",
            )
        ) {
            calendarStore.remove(id);
        }
    }

    // Schedule slots for Day View (hardcoded hours for now)
    const hours = Array.from(
        { length: 24 },
        (_, i) => `${String(i).padStart(2, "0")}:00`,
    );

    const typeColors: Record<string, string> = {
        event: "text-primary bg-primary/10 border-primary/20",
        meeting: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        reminder: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        task: "text-secondary bg-secondary/10 border-secondary/20",
    };
</script>

<div class="page-container flex flex-col h-full gap-8 pb-24">
    <PageHeader
        title="Temporal Horizon"
        subtitle="Sovereign management of your most finite resource."
    >
        <div class="flex items-center gap-6">
            <div class="bg-white/5 border border-white/5 rounded-2xl p-1 flex">
                {#each ["month", "day"] as v}
                    <button
                        onclick={() => (view = v)}
                        class="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all {view ===
                        v
                            ? 'bg-primary text-black shadow-lg'
                            : 'text-muted hover:text-white'}"
                    >
                        {v === "month" ? "Structure" : "Flow"}
                    </button>
                {/each}
            </div>
            <button
                onclick={() => (showAddModal = true)}
                class="btn btn-primary px-6 h-[46px] flex items-center gap-2"
            >
                <Plus size={18} /> New Event
            </button>
        </div>
    </PageHeader>

    {#if view === "month"}
        <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-12">
            <!-- Calendar Grid -->
            <div class="space-y-8">
                <div class="flex items-center justify-between px-2">
                    <h2
                        class="text-3xl font-light text-theme-text-strong tracking-tighter"
                    >
                        {formatMonthYear(currentMonthDate)}
                    </h2>
                    <div class="flex gap-2">
                        <button
                            onclick={() => changeMonth(-1)}
                            class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-muted hover:text-white hover:border-primary/30 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onclick={() => changeMonth(1)}
                            class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-muted hover:text-white hover:border-primary/30 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div
                    class="grid grid-cols-7 gap-px rounded-3xl overflow-hidden border border-white/10 bg-white/10 shadow-2xl"
                >
                    {#each days as day}
                        <div
                            class="bg-neutral-900 py-4 text-center text-[10px] font-black text-muted/40 uppercase tracking-[0.2em]"
                        >
                            {day}
                        </div>
                    {/each}

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
                                    e.preventDefault();
                                    selectDate(day.date);
                                }
                            }}
                            class="min-h-[120px] bg-neutral-900 p-4 transition-all relative hover:bg-white/5 group {day.date &&
                            isSameDay(day.date, selectedDate)
                                ? 'ring-2 ring-inset ring-primary'
                                : ''}"
                        >
                            {#if day.date}
                                <span
                                    class="text-xs font-black {isSameDay(
                                        day.date,
                                        getToday(),
                                    )
                                        ? 'text-primary'
                                        : 'text-muted/40 group-hover:text-white/60'}"
                                >
                                    {day.dayNumber}
                                </span>

                                <div class="mt-4 space-y-1.5">
                                    {#each calendarStore
                                        .getEventsByDate(formatDateISO(day.date))
                                        .slice(0, 3) as event}
                                        <div
                                            class="flex items-center gap-2 group/item"
                                        >
                                            <div
                                                class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                style="background-color: {event.color ||
                                                    'var(--primary)'}"
                                            ></div>
                                            <span
                                                class="text-[9px] font-bold text-theme-text-strong/70 truncate uppercase tracking-widest"
                                                >{event.title}</span
                                            >
                                        </div>
                                    {/each}
                                    {#if calendarStore.getEventsByDate(formatDateISO(day.date)).length > 3}
                                        <div
                                            class="text-[8px] font-black text-primary/40 uppercase tracking-[0.2em] pl-3"
                                        >
                                            + {calendarStore.getEventsByDate(
                                                formatDateISO(day.date),
                                            ).length - 3} more
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-10">
                <div class="space-y-6">
                    <div class="flex items-center gap-2">
                        <Bell size={16} class="text-primary" />
                        <h3
                            class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                        >
                            Upcoming Sequence
                        </h3>
                    </div>
                    <div class="space-y-4">
                        {#each upcomingEvents as event}
                            <button
                                onclick={() => selectDate(new Date(event.date))}
                                class="w-full flex items-start gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all text-left group"
                            >
                                <div
                                    class="w-12 h-12 flex flex-col items-center justify-center rounded-2xl bg-white/5 group-hover:bg-primary transition-all"
                                >
                                    <span
                                        class="text-[8px] font-black uppercase text-muted group-hover:text-black line-clamp-1"
                                    >
                                        {new Date(event.date).toLocaleString(
                                            "default",
                                            { month: "short" },
                                        )}
                                    </span>
                                    <span
                                        class="text-lg font-light text-white group-hover:text-black"
                                    >
                                        {new Date(event.date).getDate()}
                                    </span>
                                </div>
                                <div class="flex-1 space-y-1 pt-1">
                                    <h4
                                        class="text-xs font-black text-theme-text-strong uppercase tracking-widest truncate"
                                    >
                                        {event.title}
                                    </h4>
                                    <div
                                        class="flex items-center gap-2 text-[9px] text-muted/60 font-bold uppercase tracking-widest"
                                    >
                                        <Clock size={10} />
                                        {event.startTime || "All Day"}
                                    </div>
                                </div>
                            </button>
                        {/each}
                    </div>
                </div>

                <div
                    class="p-8 rounded-[32px] bg-primary/5 border border-primary/20 space-y-4"
                >
                    <div class="flex items-center gap-2">
                        <Timer size={16} class="text-primary" />
                        <h4
                            class="text-[10px] font-black text-primary uppercase tracking-[0.2em]"
                        >
                            Time Architecture
                        </h4>
                    </div>
                    <p class="text-[11px] text-muted leading-relaxed">
                        Allocation optimization detected. Your cognitive
                        performance is highest in the <span
                            class="text-primary font-bold">mornings</span
                        >. Consider early deep work blocks.
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <!-- Day View -->
        <div
            class="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-12 items-start"
        >
            <div
                class="space-y-8 bg-neutral-900 rounded-[40px] border border-white/5 p-10 shadow-2xl"
            >
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center text-primary border border-white/5 shadow-xl"
                        >
                            <Clock size={28} />
                        </div>
                        <div>
                            <h2
                                class="text-3xl font-light text-theme-text-strong tracking-tighter"
                            >
                                Daily Flow
                            </h2>
                            <p
                                class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                            >
                                {selectedDate.toLocaleDateString(undefined, {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                    <button
                        onclick={() => (showAddModal = true)}
                        class="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-muted uppercase tracking-[0.2em] hover:text-primary hover:border-primary/20 transition-all"
                    >
                        Block Time
                    </button>
                </div>

                <div
                    class="relative max-h-[70vh] overflow-y-auto pr-6 custom-scrollbar scroll-smooth"
                >
                    <div
                        class="relative border-l border-white/10 ml-20 space-y-0 pb-12"
                    >
                        {#each hours as hour}
                            {@const eventsAtHour = dayEvents.filter((e) =>
                                e.startTime?.startsWith(hour.slice(0, 2)),
                            )}
                            <div
                                class="h-24 relative border-t border-white/5 group"
                            >
                                <span
                                    class="absolute -left-16 top-0 text-[10px] text-muted/40 font-mono tracking-tighter w-12 text-right"
                                    >{hour}</span
                                >

                                {#if eventsAtHour.length > 0}
                                    <div class="flex flex-col gap-2 p-2 h-full">
                                        {#each eventsAtHour as event}
                                            <div
                                                class="flex-1 rounded-2xl border p-4 shadow-xl transition-all relative group/event hover:-translate-y-0.5 overflow-hidden"
                                                style="background-color: {event.color}08; border-color: {event.color}20;"
                                            >
                                                <div
                                                    class="absolute left-0 top-0 bottom-0 w-1"
                                                    style="background-color: {event.color}"
                                                ></div>
                                                <div
                                                    class="flex justify-between items-start"
                                                >
                                                    <div>
                                                        <div
                                                            class="flex items-center gap-2 mb-1"
                                                        >
                                                            <div
                                                                class="px-2 py-0.5 rounded bg-white/5 text-[8px] font-black uppercase tracking-widest text-muted/60 border border-white/5"
                                                            >
                                                                {event.type}
                                                            </div>
                                                            <span
                                                                class="text-[9px] font-bold text-muted/30"
                                                            >
                                                                {event.startTime}
                                                                — {event.endTime}
                                                            </span>
                                                        </div>
                                                        <h4
                                                            class="text-sm font-bold text-white tracking-tight leading-tight"
                                                        >
                                                            {event.title}
                                                        </h4>
                                                    </div>
                                                    <button
                                                        onclick={() =>
                                                            handleDeleteEvent(
                                                                event.id,
                                                            )}
                                                        class="opacity-0 group-hover/event:opacity-100 p-2 text-muted hover:text-red-400 transition-all bg-black/40 backdrop-blur-md rounded-xl"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                {:else}
                                    <button
                                        onclick={() => {
                                            newEvent.startTime = hour;
                                            showAddModal = true;
                                        }}
                                        class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/[0.02] transition-opacity flex items-center justify-center"
                                    >
                                        <Plus
                                            size={16}
                                            class="text-primary/20"
                                        />
                                    </button>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <div class="space-y-8 sticky top-8">
                <div
                    class="card-subtle p-10 bg-white/5 space-y-8 rounded-[40px] border border-white/5"
                >
                    <h3
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                    >
                        Intensity Profile
                    </h3>
                    <div class="grid grid-cols-2 gap-6">
                        {#each [{ label: "Deep Focus", value: "4.5h", icon: Timer, color: "text-primary" }, { label: "Coordination", value: "1.2h", icon: ArrowRight, color: "text-blue-400" }, { label: "Reflection", value: "0.8h", icon: Bell, color: "text-emerald-400" }, { label: "Restoration", value: "2.4h", icon: Clock, color: "text-secondary" }] as stat}
                            <div class="space-y-2 group">
                                <stat.icon
                                    size={16}
                                    class="{stat.color} opacity-40 group-hover:opacity-100 transition-opacity"
                                />
                                <div
                                    class="text-2xl font-light text-theme-text-strong tracking-tighter"
                                >
                                    {stat.value}
                                </div>
                                <div
                                    class="text-[9px] font-black text-muted uppercase tracking-widest"
                                >
                                    {stat.label}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <div
                    class="card-subtle p-10 bg-primary/[0.02] border border-primary/10 rounded-[40px]"
                >
                    <div class="flex items-center gap-2 mb-4">
                        <Timer size={16} class="text-primary" />
                        <h4
                            class="text-[10px] font-black text-primary uppercase tracking-[0.2em]"
                        >
                            Active Block
                        </h4>
                    </div>
                    {#if dayEvents.length > 0}
                        <div class="space-y-2">
                            <h5
                                class="text-lg font-light text-white leading-tight"
                            >
                                {dayEvents[0].title}
                            </h5>
                            <button
                                class="btn btn-primary w-full mt-4 flex items-center justify-center gap-2 text-[10px] h-11 tracking-widest font-black uppercase"
                            >
                                Enter Focus Mode <ArrowRight size={14} />
                            </button>
                        </div>
                    {:else}
                        <p class="text-xs text-muted leading-relaxed">
                            No active time blocks detected for this period.
                            Design your focus session to maximize cognitive ROI.
                        </p>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

<Modal bind:isOpen={showAddModal} title="Configure Temporal Block">
    <div class="space-y-8">
        <div class="space-y-2">
            <label
                for="title"
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                >Event Definition</label
            >
            <input
                type="text"
                id="title"
                bind:value={newEvent.title}
                placeholder="Briefly define the objective..."
                class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/30 transition-all placeholder:text-muted/20"
            />
        </div>

        <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
                <label
                    for="date"
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                    >Horizon Date</label
                >
                <input
                    type="date"
                    id="date"
                    bind:value={newEvent.date}
                    class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/30 transition-all"
                />
            </div>
            <div class="space-y-2">
                <label
                    for="type"
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                    >Archetype</label
                >
                <select
                    id="type"
                    bind:value={newEvent.type}
                    class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/30 transition-all appearance-none"
                >
                    <option value="event">Event</option>
                    <option value="meeting">Meeting</option>
                    <option value="reminder">Reminder</option>
                    <option value="task">Task</option>
                </select>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
                <label
                    for="start"
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                    >Inception</label
                >
                <input
                    type="time"
                    id="start"
                    bind:value={newEvent.startTime}
                    class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/30 transition-all"
                />
            </div>
            <div class="space-y-2">
                <label
                    for="end"
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                    >Conclusion</label
                >
                <input
                    type="time"
                    id="end"
                    bind:value={newEvent.endTime}
                    class="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-primary/30 transition-all"
                />
            </div>
        </div>

        <div class="space-y-4">
            <span
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1 block"
                >Visual Resonance</span
            >
            <div class="flex gap-4">
                {#each ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"] as color}
                    <button
                        onclick={() => (newEvent.color = color)}
                        class="w-10 h-10 rounded-2xl border-2 transition-all hover:scale-110 {newEvent.color ===
                        color
                            ? 'border-primary ring-4 ring-primary/20'
                            : 'border-transparent'}"
                        style="background-color: {color}"
                        aria-label="Select resonance {color}"
                    ></button>
                {/each}
            </div>
        </div>

        <div class="pt-6 flex gap-4">
            <button
                onclick={() => (showAddModal = false)}
                class="flex-1 py-4 rounded-2xl border border-white/5 text-muted font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-xs"
            >
                Dimiss
            </button>
            <button
                onclick={handleAddEvent}
                class="flex-1 py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-xs"
            >
                Confirm Allocation
            </button>
        </div>
    </div>
</Modal>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    :global(
            input[type="date"]::-webkit-calendar-picker-indicator,
            input[type="time"]::-webkit-calendar-picker-indicator
        ) {
        filter: invert(1);
        opacity: 0.3;
        cursor: pointer;
    }
</style>
