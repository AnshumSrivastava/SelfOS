<script lang="ts">
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import { journalStore } from "$lib/stores/journal.svelte";
    import { Plus, Sparkles } from "lucide-svelte";
    import { slide } from "svelte/transition";

    let isWriting = $state(false);
    let selectedMood = $state<string>("neutral");
    let entryText = $state("");

    const moods = [
        { id: "awesome", emoji: "🤩", label: "Awesome" },
        { id: "happy", emoji: "😊", label: "Happy" },
        { id: "neutral", emoji: "😐", label: "Neutral" },
        { id: "sad", emoji: "😔", label: "Sad" },
        { id: "stressed", emoji: "😫", label: "Stressed" },
    ];

    function handleSave() {
        if (!entryText.trim()) return;

        journalStore.addEntry({
            content: entryText,
            mood: selectedMood,
            tags: [],
            date: new Date().toISOString(),
        });

        entryText = "";
        selectedMood = "neutral";
        isWriting = false;
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    }

    function formatTime(dateStr: string) {
        return new Date(dateStr).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    }
</script>

{#snippet headerAction()}
    <button
        onclick={() => (isWriting = true)}
        class="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.3)] active:scale-95 transition-transform"
    >
        <Plus size={18} strokeWidth={3} />
    </button>
{/snippet}

<div class="page-container h-full relative pb-24">
    <MobileHeader title="Journal" action={headerAction} />

    {#if isWriting}
        <div
            class="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom duration-300"
        >
            <div
                class="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-10"
            >
                <button
                    onclick={() => (isWriting = false)}
                    class="text-muted hover:text-white"
                >
                    Cancel
                </button>
                <h3 class="font-bold text-white">New Entry</h3>
                <button
                    onclick={handleSave}
                    class="text-primary font-bold uppercase tracking-widest text-xs"
                >
                    Save
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- Mood Selector -->
                <div class="flex justify-between px-2">
                    {#each moods as mood}
                        <button
                            onclick={() => (selectedMood = mood.id)}
                            class="flex flex-col items-center gap-2 transition-all {selectedMood ===
                            mood.id
                                ? 'scale-110 opacity-100'
                                : 'opacity-40 grayscale'}"
                        >
                            <span class="text-3xl drop-shadow-lg"
                                >{mood.emoji}</span
                            >
                            <span
                                class="text-[9px] font-bold uppercase tracking-widest"
                                >{mood.label}</span
                            >
                        </button>
                    {/each}
                </div>

                <textarea
                    bind:value={entryText}
                    placeholder="How are you feeling today?"
                    class="w-full h-96 bg-transparent text-lg text-white/90 placeholder:text-muted/30 outline-none resize-none leading-relaxed font-light mt-4"
                ></textarea>
            </div>
        </div>
    {/if}

    <div class="px-6 space-y-8">
        <!-- Daily Prompt (Concept) -->
        <div
            class="card-subtle p-5 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20"
        >
            <div class="flex items-center gap-3 mb-2">
                <Sparkles size={16} class="text-purple-400" />
                <span
                    class="text-[10px] font-black text-purple-400 uppercase tracking-widest"
                    >Daily Prompt</span
                >
            </div>
            <p class="text-lg font-light text-white italic">
                "What is one small win you had today that you're proud of?"
            </p>
            <button
                onclick={() => (isWriting = true)}
                class="mt-4 text-xs font-bold text-white hover:text-purple-400 transition-colors uppercase tracking-wider"
            >
                Answer →
            </button>
        </div>

        <div class="space-y-4">
            <h3
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-1"
            >
                Recent Entries
            </h3>

            <div class="relative border-l border-white/10 ml-3 space-y-8 pb-4">
                {#each journalStore.entries as entry}
                    <div class="relative pl-8 group">
                        <!-- Timeline Dot -->
                        <div
                            class="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full bg-surface border border-white/20 group-hover:border-primary group-hover:bg-primary transition-colors"
                        ></div>

                        <div
                            class="bg-surface/30 rounded-2xl p-5 hover:bg-surface/50 transition-colors border border-white/5"
                        >
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <span
                                        class="text-xs font-bold text-white block"
                                    >
                                        {formatDate(entry.date)}
                                    </span>
                                    <span
                                        class="text-[10px] text-muted block mt-0.5"
                                    >
                                        {formatTime(entry.date)}
                                    </span>
                                </div>
                                <span class="text-2xl" title={entry.mood}>
                                    {moods.find((m) => m.id === entry.mood)
                                        ?.emoji || "😐"}
                                </span>
                            </div>
                            <p
                                class="text-white/80 text-sm leading-relaxed font-light whitespace-pre-wrap"
                            >
                                {entry.content}
                            </p>
                        </div>
                    </div>
                {/each}

                {#if journalStore.entries.length === 0}
                    <div class="pl-8 text-muted italic text-sm opacity-50 py-4">
                        No entries yet. Start writing!
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
