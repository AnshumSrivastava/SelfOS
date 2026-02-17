<script lang="ts">
    import {
        Play,
        Pause,
        RotateCcw,
        Volume2,
        VolumeX,
        Maximize,
        Minimize,
        Pencil,
        Check,
        Target,
        ChevronRight,
        X,
        Focus as FocusIcon,
    } from "lucide-svelte";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import { focusStore } from "$lib/stores/focus.svelte";
    import { tasksStore, type Task } from "$lib/stores/tasks.svelte";
    import { fade, slide } from "svelte/transition";
    import { onMount, onDestroy } from "svelte";

    const timeLeft = $derived(focusStore.timeLeft);
    const isRunning = $derived(focusStore.isRunning);
    const formattedTime = $derived(focusStore.formattedTime);
    const mode = $derived(focusStore.mode);
    const sessionComplete = $derived(focusStore.sessionComplete);
    const zenMode = $derived(focusStore.zenMode);

    let isEditing = $state(false);
    let editMinutes = $state(25);
    let selectedTaskId = $state<string | null>(null);
    let showTaskSelector = $state(true);
    let isSoundEnabled = $state(false);
    let audioContext: AudioContext | null = null;
    let noiseNode: AudioBufferSourceNode | null = null;
    let gainNode: GainNode | null = null;

    const selectedTask = $derived(
        tasksStore.tasks.find((t) => t.id === selectedTaskId),
    );

    const pendingTasks = $derived(
        tasksStore.tasks.filter((t) => t.status !== "completed"),
    );

    function saveDuration() {
        if (editMinutes > 0) {
            focusStore.setDuration(editMinutes);
        }
        isEditing = false;
    }

    $effect(() => {
        if (sessionComplete) {
            if (selectedTask) {
                focusStore.logSession(selectedTask.title);
            }
            if (isSoundEnabled) toggleSound(); // Stop sound on complete
        }
    });

    $effect(() => {
        if (!isRunning && isSoundEnabled) {
            // Optional: Pause sound when timer pauses?
            // For now, let's keep it manual or simple.
            // Actually, people usually want silence when paused.
            toggleSound();
        }
    });

    function toggleTask(taskId: string) {
        if (selectedTaskId === taskId) {
            selectedTaskId = null;
        } else {
            selectedTaskId = taskId;
        }
    }

    // --- Sound Generation (Brown Noise) ---
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
        }
    }

    function createBrownNoise() {
        if (!audioContext) return;
        const bufferSize = audioContext.sampleRate * 2; // 2 seconds buffer
        const buffer = audioContext.createBuffer(
            1,
            bufferSize,
            audioContext.sampleRate,
        );
        const data = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Compensate for gain loss
        }

        noiseNode = audioContext.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        gainNode = audioContext.createGain();
        gainNode.gain.value = 0.05; // Low volume

        noiseNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        noiseNode.start();
    }

    function toggleSound() {
        initAudio();
        if (isSoundEnabled) {
            // Stop sound
            if (noiseNode) {
                noiseNode.stop();
                noiseNode.disconnect();
                noiseNode = null;
            }
            isSoundEnabled = false;
        } else {
            // Start sound
            createBrownNoise();
            isSoundEnabled = true;
        }
    }

    onDestroy(() => {
        if (noiseNode) noiseNode.stop();
        if (audioContext) audioContext.close();
    });
</script>

{#if !zenMode}
    <PageHeader title="Focus" subtitle="Deep work and flow state manager.">
        <button
            class="btn btn-ghost"
            onclick={() => (showTaskSelector = !showTaskSelector)}
        >
            {showTaskSelector ? "Hide Tasks" : "Show Tasks"}
        </button>
    </PageHeader>
{/if}

<div
    class="flex relative overflow-hidden transition-all duration-500 {zenMode
        ? 'fixed inset-0 z-50 bg-background h-screen w-screen'
        : 'h-[calc(100vh-80px)]'}"
>
    <!-- Task Selector Sidebar -->
    {#if showTaskSelector && !zenMode}
        <div
            class="w-80 border-r border-theme-line bg-theme-surface/30 backdrop-blur-xl p-6 flex flex-col"
            transition:slide={{ axis: "x", duration: 300 }}
        >
            <div class="flex items-center justify-between mb-6">
                <h3
                    class="text-sm font-bold uppercase tracking-widest text-theme-text-muted"
                >
                    Active Missions
                </h3>
                <button
                    onclick={() => (showTaskSelector = false)}
                    class="p-1 hover:bg-white/10 rounded transition-colors text-muted"
                >
                    <X size={16} />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {#each pendingTasks as task}
                    <button
                        onclick={() => toggleTask(task.id)}
                        class="w-full text-left p-3 rounded-xl border transition-all {selectedTaskId ===
                        task.id
                            ? 'bg-theme-primary-soft border-theme-primary text-theme-primary'
                            : 'bg-theme-background-subtle border-theme-line text-theme-text-secondary hover:border-theme-text-muted'}"
                    >
                        <div class="flex items-start gap-3">
                            <div class="mt-1">
                                <Target size={14} />
                            </div>
                            <div class="min-w-0">
                                <p class="text-sm font-medium truncate">
                                    {task.title}
                                </p>
                                <p
                                    class="text-[10px] opacity-60 uppercase tracking-wider"
                                >
                                    {task.projectId || "Inbox"}
                                </p>
                            </div>
                        </div>
                    </button>
                {/each}
                {#if pendingTasks.length === 0}
                    <div class="text-center py-8">
                        <p class="text-xs text-muted italic">
                            No active tasks found.
                        </p>
                    </div>
                {/if}
            </div>
        </div>
    {/if}

    <div class="flex-1 flex flex-col items-center justify-center relative">
        {#if !showTaskSelector && !zenMode}
            <button
                onclick={() => (showTaskSelector = true)}
                class="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-theme-surface border border-theme-line rounded-full text-theme-text-muted hover:text-theme-text-strong transition-all shadow-lg"
                transition:fade
                aria-label="Show task selector"
            >
                <ChevronRight size={20} />
            </button>
        {/if}

        {#if zenMode}
            <button
                onclick={() => focusStore.toggleZenMode()}
                class="absolute top-6 right-6 p-2 bg-theme-surface/50 hover:bg-theme-surface border border-theme-line/50 rounded-full text-theme-text-muted hover:text-theme-text-strong transition-all opacity-0 hover:opacity-100"
                aria-label="Exit Zen Mode"
            >
                <Minimize size={24} />
            </button>
        {/if}

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
            {#if selectedTask}
                <div
                    class="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-theme-primary-soft border border-theme-primary/20 rounded-full text-theme-primary animate-slide-up"
                    in:fade
                >
                    <Target size={14} />
                    <span class="text-xs font-bold uppercase tracking-widest"
                        >Locked In: {selectedTask.title}</span
                    >
                </div>
            {/if}

            <div
                class="mb-12 cursor-pointer group"
                onclick={() => {
                    if (!isEditing && !focusStore.isRunning) {
                        editMinutes = Math.floor(focusStore.timeLeft / 60);
                        isEditing = true;
                    }
                }}
                onkeydown={(e) => {
                    if (
                        e.key === "Enter" &&
                        !isEditing &&
                        !focusStore.isRunning
                    ) {
                        editMinutes = Math.floor(focusStore.timeLeft / 60);
                        isEditing = true;
                    }
                }}
                role="button"
                tabindex="0"
            >
                {#if !zenMode}
                    <h2
                        class="text-theme-text-muted tracking-widest uppercase font-medium mb-2"
                    >
                        {focusStore.mode === "shortBreak"
                            ? "Short Break"
                            : focusStore.mode === "longBreak"
                              ? "Long Break"
                              : "Deep Work Session"}
                    </h2>
                {/if}

                {#if isEditing}
                    <div class="flex items-center justify-center gap-4">
                        <input
                            type="number"
                            bind:value={editMinutes}
                            min="1"
                            max="180"
                            class="text-[120px] md:text-[180px] font-bold text-theme-text-strong tabular-nums leading-none tracking-tighter drop-shadow-[0_0_30px_var(--theme-primary-soft)] bg-transparent border-b-4 border-theme-primary w-[300px] text-center focus:outline-none"
                            onclick={(e) => e.stopPropagation()}
                            onkeydown={(e) =>
                                e.key === "Enter" && saveDuration()}
                            aria-label="Edit duration minutes"
                        />
                        <button
                            class="p-6 bg-theme-surface-subtle border border-theme-line rounded-full hover:bg-theme-surface transition-colors"
                            onclick={(e) => {
                                e.stopPropagation();
                                saveDuration();
                            }}
                            aria-label="Save duration"
                        >
                            <Check size={48} />
                        </button>
                    </div>
                {:else}
                    <div class="relative inline-block">
                        <span
                            class="text-[120px] md:text-[180px] font-bold text-theme-text-strong tabular-nums leading-none tracking-tighter drop-shadow-[0_0_30px_var(--theme-primary-soft)] group-hover:text-theme-primary transition-colors"
                        >
                            {focusStore.formattedTime}
                        </span>
                        {#if !focusStore.isRunning && !zenMode}
                            <div
                                class="absolute -right-24 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span
                                    class="flex items-center gap-2 text-theme-text-muted text-lg bg-theme-surface-glass px-4 py-2 rounded-full border border-theme-line"
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
                    class="p-4 rounded-full bg-theme-surface border border-theme-line hover:border-theme-text-muted hover:bg-theme-surface-subtle transition-all text-theme-text-strong"
                    aria-label="Reset"
                    onclick={() => focusStore.reset()}
                >
                    <RotateCcw size={24} />
                </button>

                <button
                    class="w-24 h-24 rounded-full bg-theme-text-strong text-theme-text-inverse flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_var(--theme-primary-soft)]"
                    onclick={() => focusStore.toggle()}
                    aria-label={focusStore.isRunning ? "Pause" : "Start"}
                >
                    {#if focusStore.isRunning}
                        <Pause size={40} fill="currentColor" />
                    {:else}
                        <Play size={40} fill="currentColor" class="ml-1" />
                    {/if}
                </button>

                <button
                    class="p-4 rounded-full bg-theme-surface border border-theme-line hover:border-theme-text-muted hover:bg-theme-surface-subtle transition-all {isSoundEnabled
                        ? 'text-theme-primary border-theme-primary'
                        : 'text-theme-text-strong'}"
                    aria-label="Sound"
                    onclick={toggleSound}
                >
                    {#if isSoundEnabled}
                        <Volume2 size={24} />
                    {:else}
                        <VolumeX size={24} />
                    {/if}
                </button>

                <button
                    class="p-4 rounded-full bg-theme-surface border border-theme-line hover:border-theme-text-muted hover:bg-theme-surface-subtle transition-all {zenMode
                        ? 'text-theme-primary border-theme-primary'
                        : 'text-theme-text-strong'}"
                    aria-label="Zen Mode"
                    onclick={() => focusStore.toggleZenMode()}
                >
                    {#if zenMode}
                        <Minimize size={24} />
                    {:else}
                        <Maximize size={24} />
                    {/if}
                </button>
            </div>

            {#if !zenMode}
                <div class="mt-12 flex gap-4 justify-center">
                    <button
                        class="px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 border {focusStore.mode ===
                        'focus'
                            ? 'bg-theme-text-strong text-theme-text-inverse border-theme-text-strong shadow-lg'
                            : 'bg-theme-surface border-theme-line text-theme-text-muted hover:text-theme-text-strong'}"
                        onclick={() => focusStore.setMode("focus")}
                    >
                        Pomodoro
                    </button>
                    <button
                        class="px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 border {focusStore.mode ===
                        'shortBreak'
                            ? 'bg-theme-text-strong text-theme-text-inverse border-theme-text-strong shadow-lg'
                            : 'bg-theme-surface border-theme-line text-theme-text-muted hover:text-theme-text-strong'}"
                        onclick={() => focusStore.setMode("shortBreak")}
                    >
                        Short Break
                    </button>
                    <button
                        class="px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 border {focusStore.mode ===
                        'longBreak'
                            ? 'bg-theme-text-strong text-theme-text-inverse border-theme-text-strong shadow-lg'
                            : 'bg-theme-surface border-theme-line text-theme-text-muted hover:text-theme-text-strong'}"
                        onclick={() => focusStore.setMode("longBreak")}
                    >
                        Long Break
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 3px;
    }
</style>
