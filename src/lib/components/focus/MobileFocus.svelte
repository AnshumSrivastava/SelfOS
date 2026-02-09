<script>
    import { Play, Pause, RotateCcw, Volume2 } from "lucide-svelte";
    import { focusStore } from "$lib/stores/focus.svelte";

    let { timeLeft, isRunning, formattedTime, mode } = $derived(focusStore);
</script>

<div class="flex flex-col items-center justify-between h-[70vh] py-8">
    <div class="text-center mt-12">
        <h2 class="text-gray-500 uppercase tracking-widest text-sm mb-4">
            {focusStore.mode === "shortBreak"
                ? "Short Break"
                : focusStore.mode === "longBreak"
                  ? "Long Break"
                  : "Focus"}
        </h2>
        <div
            class="text-[90px] font-bold text-white leading-none tracking-tighter"
        >
            {focusStore.formattedTime}
        </div>
    </div>

    <!-- Minimal Controls -->
    <div class="flex items-center gap-8">
        <button
            class="p-4 text-gray-500 hover:text-white transition-colors"
            onclick={() => focusStore.reset()}
        >
            <RotateCcw size={24} />
        </button>

        <button
            class="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
            onclick={() => focusStore.toggle()}
        >
            {#if focusStore.isRunning}
                <Pause size={32} fill="currentColor" />
            {:else}
                <Play size={32} fill="currentColor" class="ml-1" />
            {/if}
        </button>

        <button class="p-4 text-gray-500 hover:text-white transition-colors">
            <Volume2 size={24} />
        </button>
    </div>

    <!-- Modes -->
    <div class="flex gap-2">
        <button
            class="px-4 py-2 rounded-full text-xs font-medium border transition-colors {focusStore.mode ===
            'focus'
                ? 'bg-white/10 text-white border-white/20'
                : 'text-gray-500 border-transparent hover:text-white'}"
            onclick={() => focusStore.setMode("focus")}
        >
            Focus
        </button>
        <button
            class="px-4 py-2 rounded-full text-xs font-medium border transition-colors {focusStore.mode ===
            'shortBreak'
                ? 'bg-white/10 text-white border-white/20'
                : 'text-gray-500 border-transparent hover:text-white'}"
            onclick={() => focusStore.setMode("shortBreak")}
        >
            Short Break
        </button>
        <button
            class="px-4 py-2 rounded-full text-xs font-medium border transition-colors {focusStore.mode ===
            'longBreak'
                ? 'bg-white/10 text-white border-white/20'
                : 'text-gray-500 border-transparent hover:text-white'}"
            onclick={() => focusStore.setMode("longBreak")}
        >
            Long Break
        </button>
    </div>
</div>
