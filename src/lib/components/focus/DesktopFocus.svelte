<script>
    import { Play, Pause, RotateCcw, Volume2, Maximize } from "lucide-svelte";
    import { focusStore } from "$lib/stores/focus.svelte";

    let { timeLeft, isRunning, formattedTime, mode } = $derived(focusStore);
</script>

<div class="flex flex-col items-center justify-center h-[80vh] relative">
    <!-- Ambient Background -->
    <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"
    >
        <div
            class="w-[500px] h-[500px] bg-primary rounded-full blur-[150px] animate-pulse"
            style="animation-duration: 4s;"
        ></div>
    </div>

    <div class="relative z-10 text-center">
        <div class="mb-12">
            <h2 class="text-muted tracking-widest uppercase font-medium mb-2">
                {focusStore.mode === "shortBreak"
                    ? "Short Break"
                    : focusStore.mode === "longBreak"
                      ? "Long Break"
                      : "Deep Work Session"}
            </h2>
            <span
                class="text-[120px] md:text-[180px] font-bold text-white tabular-nums leading-none tracking-tighter drop-shadow-[0_0_30px_rgba(0,255,157,0.3)]"
            >
                {focusStore.formattedTime}
            </span>
        </div>

        <div class="flex items-center justify-center gap-8">
            <button
                class="p-4 rounded-full bg-surface border border-line hover:border-white hover:bg-white/10 transition-all text-white"
                aria-label="Reset"
                onclick={() => focusStore.reset()}
            >
                <RotateCcw size={24} />
            </button>

            <button
                class="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                onclick={() => focusStore.toggle()}
            >
                {#if focusStore.isRunning}
                    <Pause size={40} fill="currentColor" />
                {:else}
                    <Play size={40} fill="currentColor" class="ml-1" />
                {/if}
            </button>

            <button
                class="p-4 rounded-full bg-surface border border-line hover:border-white hover:bg-white/10 transition-all text-white"
                aria-label="Sound"
            >
                <Volume2 size={24} />
            </button>
        </div>

        <div class="mt-12 flex gap-4 justify-center">
            <button
                class="px-4 py-1.5 rounded-full text-sm cursor-pointer transition-colors border {focusStore.mode ===
                'focus'
                    ? 'bg-surface border-primary text-white'
                    : 'bg-transparent border-transparent text-muted hover:text-white'}"
                onclick={() => focusStore.setMode("focus")}
            >
                Pomodoro
            </button>
            <button
                class="px-4 py-1.5 rounded-full text-sm cursor-pointer transition-colors border {focusStore.mode ===
                'shortBreak'
                    ? 'bg-surface border-primary text-white'
                    : 'bg-transparent border-transparent text-muted hover:text-white'}"
                onclick={() => focusStore.setMode("shortBreak")}
            >
                Short Break
            </button>
            <button
                class="px-4 py-1.5 rounded-full text-sm cursor-pointer transition-colors border {focusStore.mode ===
                'longBreak'
                    ? 'bg-surface border-primary text-white'
                    : 'bg-transparent border-transparent text-muted hover:text-white'}"
                onclick={() => focusStore.setMode("longBreak")}
            >
                Long Break
            </button>
        </div>
    </div>
</div>
