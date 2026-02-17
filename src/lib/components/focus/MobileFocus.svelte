<script>
    import {
        Play,
        Pause,
        RotateCcw,
        Volume2,
        Pencil,
        Check,
    } from "lucide-svelte";
    import { focusStore } from "$lib/stores/focus.svelte";

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

<div class="flex flex-col items-center justify-between h-[60vh] py-4">
    <div class="text-center mt-12 relative group">
        <h2
            class="text-theme-text-muted uppercase tracking-widest text-sm mb-4"
        >
            {focusStore.mode === "shortBreak"
                ? "Short Break"
                : focusStore.mode === "longBreak"
                  ? "Long Break"
                  : "Focus"}
        </h2>

        {#if isEditing}
            <div class="flex items-center justify-center gap-2">
                <input
                    type="number"
                    bind:value={editMinutes}
                    min="1"
                    max="180"
                    class="text-[90px] font-bold text-theme-text-strong leading-none tracking-tighter bg-transparent border-b-2 border-theme-primary w-[200px] text-center focus:outline-none"
                    aria-label="Edit minutes"
                />
                <button
                    class="p-4 bg-theme-surface-subtle border border-theme-line rounded-full hover:bg-theme-surface transition-colors"
                    onclick={saveDuration}
                    aria-label="Save duration"
                >
                    <Check size={32} />
                </button>
            </div>
        {:else}
            <div class="relative inline-block">
                <div
                    class="text-[90px] font-bold text-theme-text-strong leading-none tracking-tighter"
                >
                    {focusStore.formattedTime}
                </div>
                <button
                    class="absolute -right-12 top-1/2 -translate-y-1/2 p-2 text-theme-text-muted hover:text-theme-text-strong transition-colors opacity-0 group-hover:opacity-100"
                    onclick={() => {
                        editMinutes = Math.floor(focusStore.timeLeft / 60);
                        isEditing = true;
                    }}
                    aria-label="Edit duration"
                >
                    <Pencil size={20} />
                </button>
            </div>
        {/if}
    </div>

    <!-- Minimal Controls -->
    <div class="flex items-center gap-8">
        <button
            class="p-4 text-theme-text-muted hover:text-theme-text-strong transition-colors"
            onclick={() => focusStore.reset()}
            aria-label="Reset timer"
        >
            <RotateCcw size={24} />
        </button>

        <button
            class="w-20 h-20 rounded-full bg-theme-text-strong text-theme-text-inverse flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
            onclick={() => focusStore.toggle()}
            aria-label={focusStore.isRunning ? "Pause" : "Start"}
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
            class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 {focusStore.mode ===
            'focus'
                ? 'bg-theme-text-strong text-theme-text-inverse border-theme-text-strong shadow-lg'
                : 'bg-theme-surface text-theme-text-muted border-theme-line'}"
            onclick={() => focusStore.setMode("focus")}
        >
            Focus
        </button>
        <button
            class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 {focusStore.mode ===
            'shortBreak'
                ? 'bg-theme-text-strong text-theme-text-inverse border-theme-text-strong shadow-lg'
                : 'bg-theme-surface text-theme-text-muted border-theme-line'}"
            onclick={() => focusStore.setMode("shortBreak")}
        >
            Short Break
        </button>
        <button
            class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 {focusStore.mode ===
            'longBreak'
                ? 'bg-theme-text-strong text-theme-text-inverse border-theme-text-strong shadow-lg'
                : 'bg-theme-surface text-theme-text-muted border-theme-line'}"
            onclick={() => focusStore.setMode("longBreak")}
        >
            Long Break
        </button>
    </div>
</div>
