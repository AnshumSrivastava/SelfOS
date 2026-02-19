<script lang="ts">
    import {
        Play,
        Pause,
        RotateCcw,
        Volume2,
        Pencil,
        Check,
        X,
        Sparkles,
        Target,
        Maximize,
        Timer,
    } from "lucide-svelte";
    import { focusStore } from "$lib/stores/focus.svelte";
    import { fade, fly, scale } from "svelte/transition";

    let { timeLeft, isRunning, formattedTime, mode } = $derived(focusStore);

    let isEditing = $state(false);
    let editMinutes = $state(25);

    function saveDuration() {
        if (editMinutes > 0) {
            focusStore.setDuration(editMinutes);
        }
        isEditing = false;
    }
</script>

<div
    class="page-container relative h-full flex flex-col items-center justify-between py-12 pb-24 overflow-hidden"
>
    <!-- Ambient Horizon -->
    <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"
    >
        <div
            class="w-[300px] h-[300px] bg-primary rounded-full blur-[100px] animate-pulse"
        ></div>
    </div>

    <div class="z-10 text-center w-full space-y-12">
        <div class="space-y-2">
            <h2
                class="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-4"
            >
                {focusStore.mode === "shortBreak"
                    ? "Restoration"
                    : focusStore.mode === "longBreak"
                      ? "Synthesis"
                      : "Peak Flow"}
            </h2>

            {#if isEditing}
                <div class="flex flex-col items-center gap-6" in:scale>
                    <input
                        type="number"
                        bind:value={editMinutes}
                        min="1"
                        max="180"
                        class="text-[120px] font-light text-white leading-none tracking-tighter bg-transparent border-b border-primary/30 w-[240px] text-center focus:outline-none focus:border-primary transition-all pb-2"
                    />
                    <button
                        class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-black shadow-xl shadow-primary/20 active:scale-90 transition-all"
                        onclick={saveDuration}
                    >
                        <Check size={28} strokeWidth={3} />
                    </button>
                </div>
            {:else}
                <div
                    class="relative inline-block active:scale-95 transition-all"
                    onclick={() => {
                        editMinutes = Math.floor(focusStore.timeLeft / 60);
                        isEditing = true;
                    }}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === "Enter" && (isEditing = true)}
                >
                    <div
                        class="text-[120px] font-light text-white tabular-nums leading-none tracking-tighter transition-all duration-700 {isRunning
                            ? 'text-primary drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]'
                            : ''}"
                    >
                        {focusStore.formattedTime}
                    </div>
                </div>
            {/if}
        </div>

        <!-- Orchestration controls -->
        <div class="flex items-center justify-center gap-12">
            <button
                class="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-muted/30 active:text-white transition-all flex items-center justify-center"
                onclick={() => focusStore.reset()}
            >
                <RotateCcw size={20} />
            </button>

            <button
                class="w-24 h-24 rounded-[32px] bg-white text-black flex items-center justify-center shadow-2xl active:scale-90 transition-all"
                onclick={() => focusStore.toggle()}
            >
                {#if focusStore.isRunning}
                    <Pause size={32} fill="currentColor" strokeWidth={2.5} />
                {:else}
                    <Play
                        size={32}
                        fill="currentColor"
                        strokeWidth={2.5}
                        class="ml-1"
                    />
                {/if}
            </button>

            <button
                class="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-muted/30 active:text-primary transition-all flex items-center justify-center"
                onclick={() => focusStore.toggleZenMode()}
            >
                <Maximize size={20} />
            </button>
        </div>
    </div>

    <!-- Mode Matrix -->
    <div class="z-10 w-full px-6 space-y-4">
        <div
            class="bg-white/5 p-1 rounded-2xl border border-white/5 flex gap-1"
        >
            {#each [{ id: "focus", label: "Flow" }, { id: "shortBreak", label: "Rest" }, { id: "longBreak", label: "Deep" }] as phase}
                <button
                    class="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all {focusStore.mode ===
                    phase.id
                        ? 'bg-white text-black shadow-lg'
                        : 'text-muted'}"
                    onclick={() => focusStore.setMode(phase.id as any)}
                >
                    {phase.label}
                </button>
            {/each}
        </div>
    </div>
</div>

<style>
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
