<script lang="ts">
    import { focusStore } from "$lib/stores/focus.svelte";
    import {
        Play,
        Pause,
        RotateCcw,
        Target,
        Sparkles,
        Timer,
    } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";

    const isRunning = $derived(focusStore.isRunning);
    const formattedTime = $derived(focusStore.formattedTime);
    const mode = $derived(focusStore.mode);
</script>

<div
    class="p-8 rounded-[40px] bg-white/[0.03] border border-white/5 relative overflow-hidden group hover:bg-white/[0.05] transition-all duration-500"
>
    <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10"
    >
        <div
            class="w-[300px] h-[300px] bg-primary rounded-full blur-[100px] {isRunning
                ? 'animate-pulse'
                : ''}"
        ></div>
    </div>

    <div class="relative z-10 flex flex-col items-center text-center space-y-6">
        <div class="flex items-center gap-2">
            <Timer size={14} class="text-primary" />
            <h3
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
            >
                {mode === "focus"
                    ? "Deep Work"
                    : mode === "shortBreak"
                      ? "Restoration"
                      : "Synthesis"}
            </h3>
        </div>

        <div class="relative">
            <span
                class="text-[90px] font-light text-white tabular-nums leading-none tracking-tighter transition-all duration-700 {isRunning
                    ? 'text-primary drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]'
                    : ''}"
            >
                {formattedTime}
            </span>
        </div>

        <div class="flex items-center gap-4">
            <button
                onclick={() => focusStore.reset()}
                class="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted hover:text-white transition-all active:scale-90"
            >
                <RotateCcw size={16} />
            </button>

            <button
                onclick={() => focusStore.toggle()}
                class="w-16 h-16 bg-white text-black rounded-[24px] flex items-center justify-center shadow-xl shadow-white/5 hover:scale-105 active:scale-95 transition-all"
            >
                {#if isRunning}
                    <Pause size={24} fill="currentColor" />
                {:else}
                    <Play size={24} fill="currentColor" class="ml-1" />
                {/if}
            </button>
            <a
                href="/focus"
                class="p-3 bg-white/5 border border-white/5 rounded-2xl text-muted hover:text-white transition-all active:scale-90"
            >
                <Target size={16} />
            </a>
        </div>
    </div>
</div>
