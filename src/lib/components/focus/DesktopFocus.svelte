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
        Timer,
        ArrowRight,
        Sparkles,
    } from "lucide-svelte";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import { focusStore } from "$lib/stores/focus.svelte";
    import { tasksStore, type Task } from "$lib/stores/tasks.svelte";
    import { fade, slide, scale } from "svelte/transition";
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
            if (isSoundEnabled) toggleSound();
        }
    });

    $effect(() => {
        if (!isRunning && isSoundEnabled) {
            toggleSound();
        }
    });

    function toggleTask(taskId: string) {
        selectedTaskId = selectedTaskId === taskId ? null : taskId;
    }

    // --- Ambient Sound Architecture (Brown Noise) ---
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)();
        }
    }

    function createBrownNoise() {
        if (!audioContext) return;
        const bufferSize = audioContext.sampleRate * 2;
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
            data[i] *= 3.5;
        }

        noiseNode = audioContext.createBufferSource();
        noiseNode.buffer = buffer;
        noiseNode.loop = true;

        gainNode = audioContext.createGain();
        gainNode.gain.value = 0.03;

        noiseNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        noiseNode.start();
    }

    function toggleSound() {
        initAudio();
        if (isSoundEnabled) {
            if (noiseNode) {
                noiseNode.stop();
                noiseNode.disconnect();
                noiseNode = null;
            }
            isSoundEnabled = false;
        } else {
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
    <PageHeader
        title="Focus Horizon"
        subtitle="Transmute attention into peak performance."
    >
        <button
            class="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-white hover:border-white/10 transition-all"
            onclick={() => (showTaskSelector = !showTaskSelector)}
        >
            {showTaskSelector ? "Dismiss Targets" : "Select Target"}
        </button>
    </PageHeader>
{/if}

<div
    class="flex relative overflow-hidden transition-all duration-700 rounded-[40px] {zenMode
        ? 'fixed inset-0 z-50 bg-[#080808] h-screen w-screen rounded-none'
        : 'h-[calc(100vh-200px)] border border-white/5 bg-white/5 shadow-2xl'}"
>
    <!-- Cognitive Control Sidebar -->
    {#if showTaskSelector && !zenMode}
        <div
            class="w-96 border-r border-white/5 bg-[#0a0a0a]/80 backdrop-blur-3xl p-10 flex flex-col gap-8"
            transition:slide={{ axis: "x", duration: 500 }}
        >
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <Target size={16} class="text-primary" />
                    <h3
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                    >
                        Deployment Logic
                    </h3>
                </div>
                <button
                    onclick={() => (showTaskSelector = false)}
                    class="p-2 hover:bg-white/5 rounded-xl transition-all text-muted/30 hover:text-white"
                >
                    <X size={16} />
                </button>
            </div>

            <div class="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar">
                {#each pendingTasks as task}
                    <button
                        onclick={() => toggleTask(task.id)}
                        class="w-full text-left p-6 rounded-3xl border transition-all active:scale-[0.98] {selectedTaskId ===
                        task.id
                            ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                            : 'bg-white/5 border-white/5 hover:border-white/10'}"
                    >
                        <div class="space-y-3">
                            <h4
                                class="text-sm font-bold text-white tracking-tight leading-tight"
                            >
                                {task.title}
                            </h4>
                            <div class="flex items-center gap-2">
                                <span
                                    class="px-2 py-0.5 rounded bg-black/40 text-[8px] font-black uppercase tracking-widest text-muted/60 border border-white/5"
                                >
                                    {task.projectId || "Direct Focus"}
                                </span>
                            </div>
                        </div>
                    </button>
                {/each}
                {#if pendingTasks.length === 0}
                    <div
                        class="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/5"
                    >
                        <p
                            class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                        >
                            Zero Missions Active
                        </p>
                    </div>
                {/if}
            </div>
        </div>
    {/if}

    <div
        class="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-b from-transparent to-primary/[0.02]"
    >
        {#if !showTaskSelector && !zenMode}
            <button
                onclick={() => (showTaskSelector = true)}
                class="absolute left-10 top-1/2 -translate-y-1/2 w-14 h-14 bg-neutral-900 border border-white/10 rounded-full flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 transition-all shadow-2xl"
                transition:fade
            >
                <ChevronRight size={24} />
            </button>
        {/if}

        {#if zenMode}
            <button
                onclick={() => focusStore.toggleZenMode()}
                class="absolute top-10 right-10 w-12 h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-muted/20 hover:text-white transition-all opacity-0 hover:opacity-100"
            >
                <Minimize size={20} />
            </button>
        {/if}

        <!-- Immersive Pulse -->
        <div
            class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
            <div
                class="w-[600px] h-[600px] bg-primary rounded-full blur-[180px] transition-all duration-[3000ms] {isRunning
                    ? 'opacity-20 scale-110'
                    : 'opacity-10 scale-90'}"
            ></div>
            {#if isRunning}
                <div
                    class="absolute w-[800px] h-[800px] border border-primary/5 rounded-full animate-ping pointer-events-none"
                    style="animation-duration: 4s;"
                ></div>
            {/if}
        </div>

        <div class="relative z-10 text-center space-y-12">
            {#if selectedTask}
                <div
                    in:scale={{ duration: 600, start: 0.9 }}
                    class="inline-flex items-center gap-3 px-6 py-3 bg-primary/[0.08] border border-primary/20 rounded-[28px] text-primary shadow-2xl shadow-primary/10"
                >
                    <Sparkles size={14} />
                    <span
                        class="text-[10px] font-black uppercase tracking-[0.2em]"
                        >Mission Control: {selectedTask.title}</span
                    >
                </div>
            {/if}

            <div
                class="relative cursor-pointer group px-12"
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
                {#if !zenMode && !isEditing}
                    <h2
                        class="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-4"
                    >
                        {focusStore.mode === "shortBreak"
                            ? "Restoration"
                            : focusStore.mode === "longBreak"
                              ? "Synthesis"
                              : "Peak Performance"}
                    </h2>
                {/if}

                {#if isEditing}
                    <div
                        class="flex items-center justify-center gap-8"
                        transition:scale
                    >
                        <input
                            type="number"
                            bind:value={editMinutes}
                            min="1"
                            max="180"
                            class="text-[160px] font-light text-white tabular-nums leading-none tracking-tighter bg-transparent border-b border-primary/50 w-[320px] text-center focus:outline-none focus:border-primary transition-all pb-4"
                            onclick={(e) => e.stopPropagation()}
                            onkeydown={(e) =>
                                e.key === "Enter" && saveDuration()}
                        />
                        <button
                            class="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-black hover:scale-110 transition-all shadow-xl shadow-primary/20"
                            onclick={(e) => {
                                e.stopPropagation();
                                saveDuration();
                            }}
                        >
                            <Check size={32} strokeWidth={3} />
                        </button>
                    </div>
                {:else}
                    <div class="relative inline-block">
                        <span
                            class="text-[180px] md:text-[240px] font-light text-white tabular-nums leading-none tracking-tighter transition-all duration-700 {isRunning
                                ? 'text-primary drop-shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]'
                                : 'text-white'}"
                        >
                            {focusStore.formattedTime}
                        </span>
                    </div>
                {/if}
            </div>

            <!-- Orchestration Controls -->
            <div class="flex items-center justify-center gap-10">
                <button
                    class="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-muted hover:text-white hover:border-white/10 hover:bg-white/10 transition-all active:scale-90"
                    onclick={() => focusStore.reset()}
                >
                    <RotateCcw size={20} />
                </button>

                <button
                    class="w-28 h-28 rounded-[40px] bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10"
                    onclick={() => focusStore.toggle()}
                >
                    {#if focusStore.isRunning}
                        <Pause
                            size={36}
                            fill="currentColor"
                            strokeWidth={2.5}
                        />
                    {:else}
                        <Play
                            size={36}
                            fill="currentColor"
                            strokeWidth={2.5}
                            class="ml-1"
                        />
                    {/if}
                </button>

                <div class="flex flex-col gap-4">
                    <button
                        class="w-14 h-14 rounded-2xl border transition-all active:scale-90 {isSoundEnabled
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-white/5 border-white/5 text-muted'}"
                        onclick={toggleSound}
                    >
                        <Volume2
                            size={20}
                            class={isSoundEnabled ? "" : "opacity-30"}
                        />
                    </button>
                    <button
                        class="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 text-muted hover:text-white transition-all active:scale-90"
                        onclick={() => focusStore.toggleZenMode()}
                    >
                        <Maximize size={20} />
                    </button>
                </div>
            </div>

            {#if !zenMode && !isEditing}
                <div class="pt-10 flex gap-4 justify-center">
                    {#each [{ id: "focus", label: "Pomodoro" }, { id: "shortBreak", label: "Rest" }, { id: "longBreak", label: "Deep Rest" }] as phase}
                        <button
                            class="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 border {focusStore.mode ===
                            phase.id
                                ? 'bg-white text-black border-white shadow-xl'
                                : 'bg-transparent border-white/10 text-muted hover:text-white hover:border-white/20'}"
                            onclick={() => focusStore.setMode(phase.id as any)}
                        >
                            {phase.label}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
```

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
