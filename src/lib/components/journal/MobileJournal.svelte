<script lang="ts">
    import {
        PenTool,
        Smile,
        Cloud,
        Sun,
        Plus,
        X,
        Check,
        Trash2,
        ChevronLeft,
        Frown,
        Meh,
        CloudRain,
        Zap,
        Snowflake,
        Save,
        ArrowLeft,
    } from "lucide-svelte";
    import {
        journalStore,
        type JournalEntry,
    } from "$lib/stores/journal.svelte";
    import { uiState } from "$lib/stores/ui.svelte";

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

    let EditingMoodIcon = $derived(
        editingEntry ? getMoodIcon(editingEntry.mood) : null,
    );
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="page-container h-full pb-20">
    {#if view === "list"}
        <div class="module-header flex justify-between items-center mb-6">
            <div>
                <h1 class="text-3xl font-light text-white">Journal</h1>
                <p class="text-xs text-muted">Your personal space.</p>
            </div>
            <button
                onclick={createNewEntry}
                class="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg active:scale-95 transition-all"
            >
                <Plus size={24} />
            </button>
        </div>

        <!-- Entries List -->
        <div class="space-y-4">
            {#if journalStore.entries.length === 0}
                <div class="card-subtle text-center py-12 opacity-60">
                    <PenTool size={40} class="mx-auto mb-4 text-muted/20" />
                    <p class="text-sm">No entries yet.</p>
                </div>
            {:else}
                {#each [...journalStore.entries].reverse() as entry}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        onclick={() => editEntry(entry)}
                        class="card-subtle active:scale-[0.98] transition-all relative overflow-hidden"
                    >
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-bold text-primary"
                                    >{entry.date}</span
                                >
                                {#if entry.mood}
                                    {@const MoodIcon = getMoodIcon(entry.mood)}
                                    <MoodIcon
                                        size={12}
                                        style="color: {getMoodColor(
                                            entry.mood,
                                        )}"
                                    />
                                {/if}
                            </div>
                            <button
                                onclick={(e) => {
                                    e.stopPropagation();
                                    removeEntry(entry.id);
                                }}
                                class="p-1 text-muted/40"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <h3 class="text-white font-medium mb-1 line-clamp-1">
                            {entry.title || "Untitled"}
                        </h3>
                        <p class="text-sm text-muted line-clamp-2">
                            {entry.content}
                        </p>
                    </div>
                {/each}
            {/if}
        </div>
    {:else if editingEntry}
        <!-- MOBILE SCRATCHPAD -->
        <div
            class="fixed inset-0 z-[100] bg-background flex flex-col animate-in slide-in-from-bottom duration-300"
        >
            <!-- Header -->
            <div
                class="px-6 py-4 flex items-center justify-between border-b border-line bg-surface/20"
            >
                <button
                    onclick={() => (view = "list")}
                    class="p-2 -ml-2 text-muted"
                >
                    <ArrowLeft size={24} />
                </button>
                <div class="flex gap-4">
                    <button
                        onclick={() => removeEntry(editingEntry!.id)}
                        class="p-2 text-muted hover:text-red-500"
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        onclick={saveEntry}
                        class="btn btn-primary px-4 py-2 flex items-center gap-2"
                    >
                        <Check size={18} /> Done
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto px-6 py-8">
                <div class="space-y-6">
                    <div class="flex items-center justify-between">
                        <input
                            type="date"
                            bind:value={editingEntry.date}
                            class="bg-transparent border-none text-muted text-sm focus:outline-none"
                        />
                        <div
                            class="flex items-center gap-2 px-3 py-1 bg-surface rounded-full border border-line"
                        >
                            {#if EditingMoodIcon}
                                <EditingMoodIcon
                                    size={14}
                                    style="color: {getMoodColor(
                                        editingEntry.mood,
                                    )}"
                                />
                            {/if}
                            <span
                                class="text-[10px] uppercase font-bold text-muted"
                                >{editingEntry.mood}</span
                            >
                        </div>
                    </div>

                    <textarea
                        bind:value={editingEntry.title}
                        placeholder="Title..."
                        rows="1"
                        class="w-full bg-transparent border-none text-3xl font-light text-white focus:outline-none placeholder:text-muted/20 resize-none"
                    ></textarea>

                    <div class="h-px w-full bg-line"></div>

                    <textarea
                        bind:value={editingEntry.content}
                        placeholder="What's on your mind?"
                        class="w-full bg-transparent border-none text-lg font-light text-muted leading-relaxed min-h-[50vh] focus:outline-none placeholder:text-muted/10 resize-none"
                    ></textarea>
                </div>
            </div>

            <!-- Mood Picker / Toolbar -->
            <div class="px-6 py-4 border-t border-line bg-surface/40 pb-safe">
                <div class="flex justify-between items-center">
                    <div class="flex gap-4">
                        {#each moods as m}
                            {@const MoodIcon = m.icon}
                            <button
                                onclick={() => (editingEntry!.mood = m.name)}
                                class="transition-all {editingEntry.mood ===
                                m.name
                                    ? 'scale-125'
                                    : 'opacity-30'}"
                            >
                                <MoodIcon size={24} style="color: {m.color}" />
                            </button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
