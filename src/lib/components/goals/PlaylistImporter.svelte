<script lang="ts">
    import {
        Youtube,
        Search,
        ArrowRight,
        Loader2,
        Sparkles,
        Check,
    } from "lucide-svelte";
    import { goalsStore, parseBatchTasks } from "$lib/stores/goals.svelte";
    import { fade, slide, fly } from "svelte/transition";

    let { onComplete } = $props<{ onComplete: (goalId: string) => void }>();

    let url = $state("");
    let isParsing = $state(false);
    let error = $state("");
    let previewData = $state<{
        tasks: Array<{ title: string; link?: string }>;
        playlistTitle?: string;
    } | null>(null);

    async function handleParse() {
        if (!url.trim()) return;
        isParsing = true;
        error = "";

        try {
            const data = await parseBatchTasks(url);
            if (data.tasks.length === 0) {
                error = "Could not find any videos in this playlist or text.";
            } else {
                previewData = data;
            }
        } catch (e) {
            error = "Failed to process input. Please check the URL or text.";
        } finally {
            isParsing = false;
        }
    }

    function createGoal() {
        if (!previewData) return;

        const newGoal = goalsStore.addGoal({
            title: previewData.playlistTitle || "New Learning Path",
            horizon: "short",
            area: "Personal",
            priority: "medium",
            vision: `Learning path from: ${url}`,
        });

        // Add tasks
        import("$lib/stores/tasks.svelte").then(({ tasksStore }) => {
            if (!previewData) return;
            previewData.tasks.forEach((t, i) => {
                tasksStore.add({
                    title: t.title,
                    goalId: newGoal.id,
                    project: "Personal",
                    priority: "medium",
                    link: t.link || null,
                    deadline: null,
                    scheduled: null,
                });
            });
        });

        onComplete(newGoal.id);
    }
</script>

<div
    class="bg-surface border border-line rounded-3xl p-8 shadow-2xl overflow-hidden relative"
>
    <!-- Icon Glow -->
    <div
        class="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full"
    ></div>

    <div class="relative z-10">
        <div class="flex items-center gap-4 mb-8">
            <div
                class="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20"
            >
                <Youtube size={24} />
            </div>
            <div>
                <h2 class="text-xl font-bold text-white">
                    Playlist to Progress
                </h2>
                <p class="text-xs text-muted">
                    Transform a YouTube playlist into a structured goal.
                </p>
            </div>
        </div>

        {#if !previewData}
            <div class="space-y-4" in:fade>
                <div class="flex gap-2">
                    <div class="flex-1 relative">
                        <input
                            bind:value={url}
                            onkeydown={(e) =>
                                e.key === "Enter" && handleParse()}
                            placeholder="Paste YouTube Playlist URL..."
                            class="w-full bg-background border border-line rounded-2xl px-5 py-4 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/30"
                        />
                        {#if isParsing}
                            <div
                                class="absolute right-4 top-4 text-primary animate-spin"
                            >
                                <Loader2 size={20} />
                            </div>
                        {/if}
                    </div>
                    <button
                        onclick={handleParse}
                        disabled={isParsing || !url.trim()}
                        class="px-6 py-4 bg-primary hover:opacity-90 text-black rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                        Scan
                    </button>
                </div>

                {#if error}
                    <p
                        class="text-[10px] font-bold text-rose-500 uppercase tracking-widest px-2"
                        in:slide
                    >
                        {error}
                    </p>
                {/if}

                <div class="grid grid-cols-2 gap-4 mt-8 opacity-50">
                    <div
                        class="p-4 bg-background/50 border border-line rounded-2xl border-dashed flex flex-col items-center text-center"
                    >
                        <Sparkles class="text-muted/50 mb-2" size={20} />
                        <p
                            class="text-[10px] text-muted/60 leading-relaxed font-bold uppercase tracking-widest"
                        >
                            Auto-Fetch Titles
                        </p>
                    </div>
                    <div
                        class="p-4 bg-background/50 border border-line rounded-2xl border-dashed flex flex-col items-center text-center"
                    >
                        <Check class="text-muted/50 mb-2" size={20} />
                        <p
                            class="text-[10px] text-muted/60 leading-relaxed font-bold uppercase tracking-widest"
                        >
                            Atomic Tasks
                        </p>
                    </div>
                </div>
            </div>
        {:else}
            <div in:fly={{ y: 20 }} class="space-y-6">
                <div class="bg-background border border-line rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-white leading-tight">
                            {previewData.playlistTitle ||
                                "Collection Scan Completed"}
                        </h3>
                        <span
                            class="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-md"
                            >{previewData.tasks.length} Modules</span
                        >
                    </div>

                    <div
                        class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2"
                    >
                        {#each previewData.tasks as t, i}
                            <div
                                class="flex items-center gap-3 text-xs text-muted p-2 border-b border-line/30 last:border-0 truncate"
                            >
                                <span class="text-muted/30 font-mono w-4"
                                    >{(i + 1).toString().padStart(2, "0")}</span
                                >
                                {t.title}
                            </div>
                        {/each}
                    </div>
                </div>

                <div class="flex gap-3">
                    <button
                        onclick={() => (previewData = null)}
                        class="px-6 py-3 border border-line text-muted font-bold rounded-xl hover:bg-background transition-all"
                    >
                        Try Another
                    </button>
                    <button
                        onclick={createGoal}
                        class="flex-1 px-6 py-3 bg-primary hover:opacity-90 text-black font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                        Import learning path
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>

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
</style>
