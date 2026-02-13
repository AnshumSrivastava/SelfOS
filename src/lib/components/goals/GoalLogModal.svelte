<script lang="ts">
    import { X, Check, Brain, Trophy, MessageSquare } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { goalsStore, type Goal } from "$lib/stores/goals.svelte";

    let {
        isOpen = $bindable(false),
        goal,
        onClose,
    } = $props<{
        isOpen: boolean;
        goal: Goal;
        onClose: () => void;
    }>();

    let workDone = $state("");
    let lessons = $state("");
    let nextStep = $state("");
    let mood = $state(3); // 1-5
    let difficulty = $state(3); // 1-5

    function reset() {
        workDone = "";
        lessons = "";
        nextStep = "";
        mood = 3;
        difficulty = 3;
    }

    function handleSubmit() {
        if (!workDone.trim()) return;

        goalsStore.addLog({
            goalId: goal.id,
            workDone: workDone.trim(),
            lessons: lessons.trim(),
            nextStep: nextStep.trim(),
            mood,
            difficulty,
        });

        reset();
        onClose();
    }

    const moodIcons = ["Empty", "😔", "😐", "🙂", "😊", "🔥"];
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
        transition:fade={{ duration: 200 }}
        onclick={onClose}
        onkeydown={(e) => (e.key === "Escape" || e.key === " ") && onClose()}
        role="presentation"
    >
        <div
            class="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
        >
            <div
                class="p-6 border-b border-slate-800/50 flex items-center justify-between"
            >
                <div>
                    <h2 class="text-lg font-bold text-white">Log Progress</h2>
                    <p
                        class="text-[10px] font-bold text-blue-500 uppercase tracking-widest"
                    >
                        {goal.title}
                    </p>
                </div>
                <button
                    onclick={onClose}
                    class="p-2 hover:bg-slate-800 rounded-full text-slate-500"
                >
                    <X size={20} />
                </button>
            </div>

            <div
                class="p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[70vh]"
            >
                <!-- Work Done -->
                <div>
                    <label class="block">
                        <span
                            class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2"
                            >What did you achieve today?</span
                        >
                        <textarea
                            bind:value={workDone}
                            placeholder="Captured the core logic... Fixed the bug... Drafted the vision..."
                            rows="3"
                            class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/10 outline-none transition-all resize-none"
                        ></textarea>
                    </label>
                </div>

                <!-- Lessons & Next Step -->
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block">
                            <span
                                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5"
                            >
                                <Brain size={12} class="text-blue-500" />
                                Lessons Learned
                            </span>
                            <input
                                bind:value={lessons}
                                placeholder="Don't underestimate CSS grid..."
                                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500/50 outline-none transition-all"
                            />
                        </label>
                    </div>
                    <div>
                        <label class="block">
                            <span
                                class="text-[10px) font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5"
                            >
                                <Trophy size={12} class="text-amber-500" />
                                Immediate Next Step
                            </span>
                            <input
                                bind:value={nextStep}
                                placeholder="Connect the API..."
                                class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500/50 outline-none transition-all"
                            />
                        </label>
                    </div>
                </div>

                <!-- Mood & Difficulty -->
                <div class="grid grid-cols-2 gap-6 pt-2">
                    <div>
                        <label
                            class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4"
                            >Mood / Energy</label
                        >
                        <div class="flex items-center justify-between">
                            {#each [1, 2, 3, 4, 5] as m}
                                <button
                                    onclick={() => (mood = m)}
                                    class="text-xl grayscale hover:grayscale-0 transition-all transform hover:scale-125 {mood ===
                                    m
                                        ? 'grayscale-0 scale-125'
                                        : 'opacity-40'}"
                                >
                                    {moodIcons[m]}
                                </button>
                            {/each}
                        </div>
                    </div>
                    <div>
                        <label
                            class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4"
                            >Effort Level</label
                        >
                        <div class="flex gap-1.5">
                            {#each [1, 2, 3, 4, 5] as d}
                                <button
                                    onclick={() => (difficulty = d)}
                                    class="h-2 flex-1 rounded-full transition-all {difficulty >=
                                    d
                                        ? 'bg-blue-500'
                                        : 'bg-slate-800'}"
                                ></button>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-6 border-t border-slate-800/50">
                <button
                    onclick={handleSubmit}
                    disabled={!workDone.trim()}
                    class="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                >
                    <Check size={18} />
                    Submit Entry
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(59, 130, 246, 0.1);
        border-radius: 10px;
    }
</style>
