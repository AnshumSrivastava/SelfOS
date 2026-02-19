<script lang="ts">
    import {
        Save,
        Footprints,
        Droplets,
        TrendingUp,
        Moon,
        Plus,
    } from "lucide-svelte";
    import { fitnessStore } from "$lib/stores/fitness.svelte";
    import Modal from "$lib/components/ui/Modal.svelte";

    let { isOpen = $bindable(), onSave = () => {} } = $props();

    let steps = $state(fitnessStore.stats.todaySteps);
    let waterChange = $state(0.25); // Amount to add
    let weight = $state(fitnessStore.latestWeight);
    let sleep = $state(fitnessStore.latestSleep);

    function saveSteps() {
        fitnessStore.updateSteps(steps);
        // We don't necessarily want to close the modal after every single update if they want to update multiple things
    }

    function addWater(amount: number) {
        fitnessStore.addWater(amount);
    }

    function saveWeight() {
        fitnessStore.logWeight(weight);
    }

    function saveSleep() {
        fitnessStore.logSleep(sleep);
    }
</script>

<Modal bind:isOpen title="Daily Metrics">
    <div class="space-y-8">
        <!-- Quick Actions Grid -->
        <div class="grid grid-cols-1 gap-4">
            <!-- Hydration Quick Boost -->
            <div
                class="p-6 rounded-2xl bg-secondary/5 border border-secondary/10"
            >
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <Droplets class="text-secondary" size={18} />
                        <span
                            class="text-[10px] font-black text-white uppercase tracking-[0.2em]"
                            >Hydration Boost</span
                        >
                    </div>
                    <span class="text-xs font-bold text-secondary"
                        >{fitnessStore.stats.todayWater.toFixed(1)}L / {fitnessStore
                            .stats.waterGoal}L</span
                    >
                </div>
                <div class="flex gap-3">
                    <button
                        onclick={() => addWater(0.25)}
                        class="flex-1 py-3 rounded-xl bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all"
                        >+ 250ml</button
                    >
                    <button
                        onclick={() => addWater(0.5)}
                        class="flex-1 py-3 rounded-xl bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all"
                        >+ 500ml</button
                    >
                </div>
            </div>
        </div>

        <!-- Metric Inputs -->
        <div class="space-y-6">
            <!-- Steps -->
            <div class="space-y-2">
                <label
                    for="steps-input"
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                    >Current Step Count</label
                >
                <div class="flex gap-2">
                    <div class="relative flex-1">
                        <Footprints
                            size={14}
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                        />
                        <input
                            id="steps-input"
                            type="number"
                            bind:value={steps}
                            class="input w-full pl-11 bg-white/5 border-transparent focus:border-primary/30"
                        />
                    </div>
                    <button
                        onclick={saveSteps}
                        class="px-6 rounded-xl bg-primary text-black font-bold hover:scale-[1.02] transition-all"
                    >
                        <Save size={16} />
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <!-- Weight -->
                <div class="space-y-2">
                    <label
                        for="weight-input"
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                        >Weight (kg)</label
                    >
                    <div class="flex gap-2">
                        <div class="relative flex-1">
                            <TrendingUp
                                size={14}
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"
                            />
                            <input
                                id="weight-input"
                                type="number"
                                step="0.1"
                                bind:value={weight}
                                class="input w-full pl-11 bg-white/5 border-transparent focus:border-emerald-500/30"
                            />
                        </div>
                        <button
                            onclick={saveWeight}
                            class="px-4 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </div>

                <!-- Sleep -->
                <div class="space-y-2">
                    <label
                        for="sleep-input"
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                        >Sleep (hrs)</label
                    >
                    <div class="flex gap-2">
                        <div class="relative flex-1">
                            <Moon
                                size={14}
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                            />
                            <input
                                id="sleep-input"
                                type="number"
                                step="0.5"
                                bind:value={sleep}
                                class="input w-full pl-11 bg-white/5 border-transparent focus:border-purple-500/30"
                            />
                        </div>
                        <button
                            onclick={saveSleep}
                            class="px-4 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="pt-4 border-t border-white/5">
            <button
                onclick={() => (isOpen = false)}
                class="w-full py-4 bg-white/5 text-muted font-bold rounded-2xl hover:text-white hover:bg-white/10 transition-all uppercase text-[10px] tracking-[0.2em]"
            >
                Finish Updating
            </button>
        </div>
    </div>
</Modal>
