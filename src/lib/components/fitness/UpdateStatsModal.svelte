<script lang="ts">
    import {
        X,
        Save,
        Footprints,
        Droplets,
        TrendingUp,
        Moon,
    } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";
    import { fitnessStore } from "$lib/stores/fitness.svelte";

    let { isOpen = $bindable(), onSave = () => {} } = $props();

    let steps = $state(fitnessStore.stats.todaySteps);
    let waterChange = $state(0.25); // Amount to add
    let weight = $state(fitnessStore.latestWeight);
    let sleep = $state(fitnessStore.latestSleep);

    function saveSteps() {
        console.log("UpdateStatsModal: Saving steps", steps);
        fitnessStore.updateSteps(steps);
        isOpen = false;
        onSave();
    }

    function addWater() {
        console.log("UpdateStatsModal: Adding water", waterChange);
        fitnessStore.addWater(waterChange);
        isOpen = false;
        onSave();
    }

    function saveWeight() {
        console.log("UpdateStatsModal: Logging weight", weight);
        fitnessStore.logWeight(weight);
        isOpen = false;
        onSave();
    }

    function saveSleep() {
        console.log("UpdateStatsModal: Logging sleep", sleep);
        fitnessStore.logSleep(sleep);
        isOpen = false;
        onSave();
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        transition:fade={{ duration: 200 }}
        role="button"
        tabindex="0"
        onclick={() => (isOpen = false)}
        onkeydown={(e) => {
            if (e.key === "Escape") isOpen = false;
        }}
    >
        <div
            class="card-subtle w-full max-w-md shadow-2xl relative overflow-hidden"
            transition:scale={{ duration: 200, start: 0.95 }}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
        >
            <div
                class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary"
            ></div>

            <div class="flex justify-between items-center mb-8">
                <div>
                    <h3 class="text-2xl font-light text-white">
                        Daily Metrics
                    </h3>
                    <p
                        class="text-xs text-muted mt-1 uppercase tracking-widest"
                    >
                        Keep your progress updated
                    </p>
                </div>
                <button
                    onclick={() => (isOpen = false)}
                    class="p-2 rounded-full hover:bg-surface transition-colors text-muted hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            <div class="space-y-8">
                <!-- Water Shortcut -->
                <div
                    class="p-4 rounded-2xl bg-secondary/5 border border-secondary/20 block"
                >
                    <div class="flex items-center gap-3 mb-4">
                        <Droplets class="text-secondary" size={20} />
                        <span
                            class="text-sm font-bold text-white uppercase tracking-wider"
                            >Hydration</span
                        >
                    </div>
                    <div class="flex gap-2">
                        <button
                            onclick={() => {
                                waterChange = 0.25;
                                addWater();
                            }}
                            class="flex-1 btn btn-secondary text-xs py-2"
                            >+250ml</button
                        >
                        <button
                            onclick={() => {
                                waterChange = 0.5;
                                addWater();
                            }}
                            class="flex-1 btn btn-secondary text-xs py-2"
                            >+500ml</button
                        >
                    </div>
                </div>

                <!-- Steps -->
                <div class="space-y-3">
                    <div
                        class="flex items-center gap-2 text-xs font-bold text-muted uppercase ml-1"
                    >
                        <Footprints size={14} class="text-primary" /> Steps Today
                    </div>
                    <div class="flex gap-2">
                        <input
                            type="number"
                            bind:value={steps}
                            class="input flex-1"
                        />
                        <button onclick={saveSteps} class="btn btn-primary px-4"
                            ><Save size={18} /></button
                        >
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6">
                    <!-- Weight -->
                    <div class="space-y-3">
                        <div
                            class="flex items-center gap-2 text-xs font-bold text-muted uppercase ml-1"
                        >
                            <TrendingUp size={14} class="text-emerald-500" /> Weight
                            (kg)
                        </div>
                        <div class="flex gap-2">
                            <input
                                type="number"
                                step="0.1"
                                bind:value={weight}
                                class="input flex-1"
                            />
                            <button
                                onclick={saveWeight}
                                class="btn btn-ghost px-3 border-line"
                                ><Save size={18} /></button
                            >
                        </div>
                    </div>

                    <!-- Sleep -->
                    <div class="space-y-3">
                        <div
                            class="flex items-center gap-2 text-xs font-bold text-muted uppercase ml-1"
                        >
                            <Moon size={14} class="text-purple-400" /> Sleep (hrs)
                        </div>
                        <div class="flex gap-2">
                            <input
                                type="number"
                                step="0.5"
                                bind:value={sleep}
                                class="input flex-1"
                            />
                            <button
                                onclick={saveSleep}
                                class="btn btn-ghost px-3 border-line"
                                ><Save size={18} /></button
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <button
                    onclick={() => (isOpen = false)}
                    class="w-full btn btn-ghost"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}
