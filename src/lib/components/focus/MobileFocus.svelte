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

<div class="flex flex-col items-center justify-between h-[70vh] py-8">
    <div class="text-center mt-12 relative group">
        <h2 class="text-gray-500 uppercase tracking-widest text-sm mb-4">
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
                    class="text-[90px] font-bold text-white leading-none tracking-tighter bg-transparent border-b-2 border-primary w-[200px] text-center focus:outline-none"
                    autofocus
                />
                <button
                    class="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                    onclick={saveDuration}
                >
                    <Check size={32} />
                </button>
            </div>
        {:else}
            <div class="relative inline-block">
                <div
                    class="text-[90px] font-bold text-white leading-none tracking-tighter"
                >
                    {focusStore.formattedTime}
                </div>
                <button
                    class="absolute -right-12 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    onclick={() => {
                        editMinutes = Math.floor(focusStore.timeLeft / 60);
                        isEditing = true;
                    }}
                >
                    <Pencil size={20} />
                </button>
            </div>
        {/if}
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
