<script>
    import {
        Play,
        Pause,
        RotateCcw,
        Volume2,
        Maximize,
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
        <div
            class="mb-12 cursor-pointer group"
            onclick={() => {
                if (!isEditing && !focusStore.isRunning) {
                    editMinutes = Math.floor(focusStore.timeLeft / 60);
                    isEditing = true;
                }
            }}
            onkeydown={(e) => {
                if (e.key === "Enter" && !isEditing && !focusStore.isRunning) {
                    editMinutes = Math.floor(focusStore.timeLeft / 60);
                    isEditing = true;
                }
            }}
            role="button"
            tabindex="0"
        >
            <h2 class="text-muted tracking-widest uppercase font-medium mb-2">
                {focusStore.mode === "shortBreak"
                    ? "Short Break"
                    : focusStore.mode === "longBreak"
                      ? "Long Break"
                      : "Deep Work Session"}
            </h2>

            {#if isEditing}
                <div class="flex items-center justify-center gap-4">
                    <input
                        type="number"
                        bind:value={editMinutes}
                        min="1"
                        max="180"
                        class="text-[120px] md:text-[180px] font-bold text-white tabular-nums leading-none tracking-tighter drop-shadow-[0_0_30px_rgba(0,255,157,0.3)] bg-transparent border-b-4 border-primary w-[400px] text-center focus:outline-none"
                        onclick={(e) => e.stopPropagation()}
                        onkeydown={(e) => e.key === "Enter" && saveDuration()}
                        aria-label="Edit duration minutes"
                    />
                    <button
                        class="p-6 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        onclick={(e) => {
                            e.stopPropagation();
                            saveDuration();
                        }}
                    >
                        <Check size={48} />
                    </button>
                </div>
            {:else}
                <div class="relative inline-block">
                    <span
                        class="text-[120px] md:text-[180px] font-bold text-white tabular-nums leading-none tracking-tighter drop-shadow-[0_0_30px_rgba(0,255,157,0.3)] group-hover:text-primary/90 transition-colors"
                    >
                        {focusStore.formattedTime}
                    </span>
                    {#if !focusStore.isRunning}
                        <div
                            class="absolute -right-24 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <span
                                class="flex items-center gap-2 text-muted text-lg bg-surface/80 px-4 py-2 rounded-full border border-line"
                            >
                                <Pencil size={18} /> Edit
                            </span>
                        </div>
                    {/if}
                </div>
            {/if}
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
                class="px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 border {focusStore.mode ===
                'focus'
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-surface border-line text-muted hover:text-white'}"
                onclick={() => focusStore.setMode("focus")}
            >
                Pomodoro
            </button>
            <button
                class="px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 border {focusStore.mode ===
                'shortBreak'
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-surface border-line text-muted hover:text-white'}"
                onclick={() => focusStore.setMode("shortBreak")}
            >
                Short Break
            </button>
            <button
                class="px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 border {focusStore.mode ===
                'longBreak'
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-surface border-line text-muted hover:text-white'}"
                onclick={() => focusStore.setMode("longBreak")}
            >
                Long Break
            </button>
        </div>
    </div>
</div>
