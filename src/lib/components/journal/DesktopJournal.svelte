<script lang="ts">
    import {
        PenTool,
        Calendar,
        ChevronLeft,
        ChevronRight,
        Smile,
        Frown,
        Meh,
        Sun,
        Cloud,
        Moon,
        Trash2,
        Save,
        X,
        ArrowLeft,
        Wind,
        CloudRain,
        Zap,
        Snowflake,
    } from "lucide-svelte";
    import {
        journalStore,
        type JournalEntry,
    } from "$lib/stores/journal.svelte";
    import { uiState } from "$lib/stores/ui.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        journalStore.init();
    });

    let view = $state("list"); // 'list' or 'edit'
    let editingEntry = $state<JournalEntry | null>(null);
    let isNewEntry = $state(false);

    $effect(() => {
        if (view === "edit") {
            uiState.showChrome = false;
        } else {
            uiState.showChrome = true;
        }
    });

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape" && view === "edit") {
            saveEntry();
        }
    }

    const moods = [
        { name: "Angry", icon: Frown, color: "#ef4444" },
        { name: "Sad", icon: Frown, color: "#3b82f6" },
        { name: "Neutral", icon: Meh, color: "#94a3b8" },
        { name: "Good", icon: Smile, color: "#10b981" },
        { name: "Great", icon: Smile, color: "#f59e0b" },
    ] as const;

    const weatherIcons = {
        Sunny: Sun,
        Cloudy: Cloud,
        Rainy: CloudRain,
        Stormy: Zap,
        Snowy: Snowflake,
    } as const;

    const weatherOptions = Object.keys(
        weatherIcons,
    ) as (keyof typeof weatherIcons)[];

    function createNewEntry() {
        const today = new Date().toISOString().split("T")[0];
        editingEntry = {
            id: "",
            title: "",
            date: today,
            mood: "Neutral",
            content: "",
            weather: "Sunny",
        };
        isNewEntry = true;
        view = "edit";
    }

    function editEntry(entry: JournalEntry) {
        editingEntry = { ...entry };
        isNewEntry = false;
        view = "edit";
    }

    function saveEntry() {
        if (!editingEntry) return;
        if (isNewEntry) {
            journalStore.addEntry(editingEntry);
        } else {
            journalStore.updateEntry(editingEntry.id, editingEntry);
        }
        view = "list";
        editingEntry = null;
    }

    function removeEntry(id: string) {
        journalStore.removeEntry(id);
    }

    function getMoodIcon(moodName: string) {
        return moods.find((m) => m.name === moodName)?.icon || Smile;
    }

    function getMoodColor(moodName: string) {
        return moods.find((m) => m.name === moodName)?.color || "var(--muted)";
    }

    let stats = $derived({
        total: journalStore.entries.length,
        moodDistribution: moods.map((m) => ({
            name: m.name,
            count: journalStore.entries.filter(
                (e: JournalEntry) => e.mood === m.name,
            ).length,
            percent:
                journalStore.entries.length > 0
                    ? (journalStore.entries.filter(
                          (e: JournalEntry) => e.mood === m.name,
                      ).length /
                          journalStore.entries.length) *
                      100
                    : 0,
        })),
    });

    let EditingMoodIcon = $derived(
        editingEntry ? getMoodIcon(editingEntry.mood) : null,
    );
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="page-container h-full">
    <div class="module-header" style="margin-bottom: var(--space-4)">
        <div>
            <h1>Journal</h1>
            <p class="text-sm text-muted mt-1">Reflect, Learn, Grow.</p>
        </div>
        {#if view === "list"}
            <button
                onclick={createNewEntry}
                class="btn btn-primary flex items-center gap-2"
            >
                <PenTool size={16} /> New Entry
            </button>
        {/if}
    </div>

    {#if view === "list"}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Mood Stats -->
                <div
                    class="card-subtle flex flex-col !p-6"
                    style="border-radius: var(--card-radius)"
                >
                    <h3 class="text-white mb-8 flex items-center gap-3">
                        <div class="w-1 h-5 bg-primary rounded-full"></div>
                        Moods
                    </h3>
                    <div class="space-y-5">
                        {#each stats.moodDistribution as mood}
                            <div class="space-y-2">
                                <div
                                    class="flex justify-between text-[10px] uppercase font-bold tracking-widest"
                                >
                                    <span
                                        style="color: {getMoodColor(mood.name)}"
                                        >{mood.name}</span
                                    >
                                    <span class="text-muted"
                                        >{mood.percent.toFixed(0)}%</span
                                    >
                                </div>
                                <div
                                    class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5"
                                >
                                    <div
                                        class="h-full transition-all duration-1000"
                                        style="width: {mood.percent}%; background-color: {getMoodColor(
                                            mood.name,
                                        )}"
                                    ></div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Streak stats -->
                <div
                    class="card-subtle !p-6"
                    style="border-radius: var(--card-radius)"
                >
                    <h3 class="text-white mb-4 flex items-center gap-3">
                        <div class="w-1 h-5 bg-primary rounded-full"></div>
                        Consistency
                    </h3>
                    <div class="flex items-center gap-5">
                        <div class="text-3xl font-light text-text">12</div>
                        <div
                            class="text-[10px] text-muted uppercase tracking-tight font-bold"
                        >
                            Days journaling streak. Keep reflecting.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Entries List -->
            <div class="lg:col-span-2 space-y-4">
                {#if journalStore.entries.length === 0}
                    <div class="card-subtle text-center py-12">
                        <PenTool size={48} class="mx-auto text-muted/20 mb-4" />
                        <h3 class="text-xl font-light text-muted">
                            No entries yet
                        </h3>
                        <p class="text-sm text-muted/60 mb-6">
                            Start your journey today.
                        </p>
                        <button onclick={createNewEntry} class="btn btn-primary"
                            >Create First Entry</button
                        >
                    </div>
                {:else}
                    {#each [...journalStore.entries].reverse() as entry}
                        <div
                            onclick={() => editEntry(entry)}
                            onkeydown={(e) =>
                                e.key === "Enter" && editEntry(entry)}
                            class="card-subtle hover:!bg-white/2 transition-all cursor-pointer group relative !p-6"
                            style="border-radius: var(--radius-subtle)"
                            role="button"
                            tabindex="0"
                        >
                            <div class="flex justify-between items-start mb-4">
                                <div class="flex items-center gap-3">
                                    <span
                                        class="text-[10px] uppercase tracking-widest font-bold text-primary"
                                        >{entry.date}</span
                                    >
                                    <span class="w-1 h-1 rounded-full bg-line"
                                    ></span>
                                    <div
                                        class="flex items-center gap-2 text-[10px] text-muted uppercase tracking-tight font-bold"
                                    >
                                        {#if entry.weather}
                                            {@const WeatherIcon =
                                                weatherIcons[
                                                    entry.weather as keyof typeof weatherIcons
                                                ]}
                                            <WeatherIcon
                                                size={12}
                                                class="opacity-50"
                                            />
                                            {entry.weather}
                                        {/if}
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div
                                        class="flex items-center gap-2 text-[9px] px-2 py-0.5 rounded-full bg-white/3 border border-white/5 text-muted uppercase tracking-widest font-bold"
                                        style="border-color: {getMoodColor(
                                            entry.mood,
                                        )}40"
                                    >
                                        {#if true}
                                            {@const MoodIcon = getMoodIcon(
                                                entry.mood,
                                            )}
                                            <MoodIcon
                                                size={10}
                                                style="color: {getMoodColor(
                                                    entry.mood,
                                                )}"
                                            />
                                        {/if}
                                        {entry.mood}
                                    </div>
                                    <button
                                        onclick={(e) => {
                                            e.stopPropagation();
                                            removeEntry(entry.id);
                                        }}
                                        class="opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-red-400 transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <h3
                                class="text-xl font-light text-text mb-2 group-hover:text-primary transition-colors"
                            >
                                {entry.title || "Untitled Entry"}
                            </h3>
                            <p
                                class="text-muted text-sm line-clamp-2 leading-relaxed opacity-70"
                            >
                                {entry.content}
                            </p>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    {:else if editingEntry}
        <!-- SCRATCHPAD EDITOR -->
        <div
            class="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in duration-300"
        >
            <!-- Editor Header -->
            <div
                class="border-b border-line bg-background/50 backdrop-blur-xl px-12 py-6 flex items-center justify-between"
            >
                <div class="flex items-center gap-8">
                    <button
                        onclick={() => (view = "list")}
                        class="p-3 hover:bg-white/5 rounded-full text-muted hover:text-text transition-all"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div class="h-6 w-px bg-line"></div>
                    <div class="flex items-center gap-6">
                        <input
                            type="date"
                            bind:value={editingEntry.date}
                            class="bg-transparent border-none text-muted text-xs font-bold uppercase tracking-widest focus:outline-none focus:text-primary transition-colors"
                        />
                        <select
                            bind:value={editingEntry.weather}
                            class="bg-transparent border-none text-muted text-xs font-bold uppercase tracking-widest focus:outline-none focus:text-primary appearance-none cursor-pointer"
                        >
                            {#each weatherOptions as w}
                                <option value={w} class="bg-surface">{w}</option
                                >
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <!-- Mood Switcher -->
                    <div
                        class="flex bg-white/3 rounded-2xl p-1 border border-white/5"
                    >
                        {#each moods as m}
                            {@const MoodIcon = m.icon}
                            <button
                                onclick={() => (editingEntry!.mood = m.name)}
                                class="p-2.5 rounded-xl transition-all {editingEntry.mood ===
                                m.name
                                    ? 'bg-primary text-black shadow-lg'
                                    : 'hover:bg-white/5 opacity-40 hover:opacity-100'}"
                                title={m.name}
                            >
                                <MoodIcon
                                    size={16}
                                    style={editingEntry.mood === m.name
                                        ? ""
                                        : `color: ${m.color}`}
                                />
                            </button>
                        {/each}
                    </div>

                    <button
                        onclick={saveEntry}
                        class="btn btn-primary flex items-center gap-2 px-6 h-10"
                    >
                        <Save size={16} />
                        <span
                            class="text-[10px] uppercase font-bold tracking-widest"
                            >Save Entry</span
                        >
                    </button>
                </div>
            </div>

            <!-- Editor Content -->
            <div
                class="flex-1 overflow-y-auto p-12 lg:p-32 bg-scratchpad bg-fixed"
            >
                <div class="max-w-3xl mx-auto space-y-12">
                    <input
                        type="text"
                        bind:value={editingEntry.title}
                        placeholder="Untitled Reflection"
                        class="w-full bg-transparent border-none text-6xl font-light text-text focus:outline-none placeholder:text-muted/10 tracking-tight"
                    />
                    <div
                        class="h-1 w-16 bg-primary opacity-30 rounded-full"
                    ></div>
                    <textarea
                        bind:value={editingEntry.content}
                        placeholder="Begin your dialogue with self..."
                        class="w-full bg-transparent border-none text-xl font-light text-text/80 leading-relaxed min-h-[60vh] focus:outline-none placeholder:text-muted/5 resize-none selection:bg-primary/20"
                    ></textarea>
                </div>
            </div>

            <!-- Editor Footer / Meta -->
            <div
                class="border-t border-line bg-surface/10 px-8 py-3 flex justify-between items-center text-[10px] text-muted font-mono uppercase tracking-widest"
            >
                <div class="flex gap-4">
                    <span>Characters: {editingEntry.content.length}</span>
                    <span
                        >Words: {editingEntry.content
                            .split(/\s+/)
                            .filter(Boolean).length}</span
                    >
                </div>
                <div>Scratchpad Mode Active</div>
            </div>
        </div>
    {/if}
</div>
