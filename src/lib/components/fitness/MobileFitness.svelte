<script lang="ts">
    import {
        Dumbbell,
        Activity,
        Play,
        Timer,
        Flame,
        Plus,
        ChevronRight,
        Footprints,
        Droplets,
        Moon,
    } from "lucide-svelte";
    import { fitnessStore } from "$lib/stores/fitness.svelte";
    import LogWorkoutModal from "./LogWorkoutModal.svelte";
    import UpdateStatsModal from "./UpdateStatsModal.svelte";

    let isLogWorkoutOpen = $state(false);
    let isUpdateStatsOpen = $state(false);

    let stats = $derived(fitnessStore.stats);
    let workouts = $derived(fitnessStore.workouts);

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }
</script>

<div class="page-container h-full relative">
    <div class="module-header mb-8">
        <h1 class="text-3xl font-light text-white">Fitness</h1>
        <button
            onclick={() => (isLogWorkoutOpen = true)}
            class="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <div class="space-y-10">
        <!-- Daily Activity Rings-style -->
        <div class="grid grid-cols-2 gap-4">
            <button
                onclick={() => (isUpdateStatsOpen = true)}
                class="card-subtle aspect-square flex flex-col justify-between relative overflow-hidden group active:scale-[0.98] transition-all"
            >
                <div
                    class="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity"
                >
                    <Footprints size={80} />
                </div>
                <Footprints class="text-primary relative z-10" size={24} />
                <div class="relative z-10">
                    <span class="text-2xl font-bold text-white block"
                        >{stats.todaySteps.toLocaleString()}</span
                    >
                    <span
                        class="text-xs text-muted uppercase tracking-wider font-bold"
                        >Steps today</span
                    >
                </div>
            </button>

            <div class="flex flex-col gap-4">
                <button
                    onclick={() => (isUpdateStatsOpen = true)}
                    class="flex-1 card-subtle flex items-center gap-3 p-4 active:scale-[0.98] transition-all"
                >
                    <div
                        class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary"
                    >
                        <Droplets size={20} />
                    </div>
                    <div>
                        <span
                            class="text-xs text-muted block uppercase tracking-tighter font-bold"
                            >Water</span
                        >
                        <span class="text-lg font-bold text-white block"
                            >{stats.todayWater.toFixed(1)}L</span
                        >
                    </div>
                </button>
                <button
                    onclick={() => (isUpdateStatsOpen = true)}
                    class="flex-1 card-subtle flex items-center gap-3 p-4 active:scale-[0.98] transition-all"
                >
                    <div
                        class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"
                    >
                        <Moon size={20} />
                    </div>
                    <div>
                        <span
                            class="text-xs text-muted block uppercase tracking-tighter font-bold"
                            >Sleep</span
                        >
                        <span class="text-lg font-bold text-white block"
                            >{fitnessStore.latestSleep}h</span
                        >
                    </div>
                </button>
            </div>
        </div>

        <!-- Today's Plan -->
        <div
            class="card-subtle bg-gradient-to-br from-primary/5 to-transparent border-primary/20"
        >
            <div class="flex justify-between items-center mb-6">
                <h3 class="font-light text-white text-lg">Next Session</h3>
                <span
                    class="text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full font-black uppercase tracking-widest"
                    >Strength</span
                >
            </div>
            <div class="flex items-center gap-4 mb-6">
                <div
                    class="w-14 h-14 rounded-2xl bg-surface border border-line flex items-center justify-center text-primary shadow-inner"
                >
                    <Dumbbell size={28} />
                </div>
                <div>
                    <h4 class="font-bold text-white">Pull Day (Back & Bi)</h4>
                    <p class="text-xs text-muted">
                        45-60 mins • Hard Difficulty
                    </p>
                </div>
            </div>
            <button
                class="w-full py-4 rounded-2xl bg-primary text-black font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
            >
                Start Workout
            </button>
        </div>

        <!-- Recent Activity -->
        <div class="space-y-6">
            <div class="flex items-center justify-between px-1">
                <h3 class="text-lg font-light text-white">Recent Workouts</h3>
                <button
                    class="text-xs text-muted font-bold uppercase tracking-wider"
                    >All Workouts</button
                >
            </div>

            <div class="space-y-3">
                {#each workouts as w (w.id)}
                    <div
                        class="card-subtle flex items-center justify-between p-4 active:bg-surface/50 transition-colors"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="w-12 h-12 rounded-xl bg-surface border border-line flex items-center justify-center text-primary shadow-sm"
                            >
                                <Activity size={20} />
                            </div>
                            <div>
                                <p class="font-bold text-white text-sm">
                                    {w.title}
                                </p>
                                <p
                                    class="text-[10px] text-muted uppercase tracking-wider font-medium"
                                >
                                    {formatDate(w.date)} • {w.type}
                                </p>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="block text-white font-bold text-sm"
                                >{w.calories} kcal</span
                            >
                            <span
                                class="block text-[10px] text-muted uppercase tracking-widest font-black"
                                >{w.duration}</span
                            >
                        </div>
                    </div>
                {/each}

                {#if workouts.length === 0}
                    <div
                        class="py-10 text-center opacity-40 italic text-sm text-muted"
                    >
                        No activity recorded yet.
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<LogWorkoutModal bind:isOpen={isLogWorkoutOpen} />
<UpdateStatsModal bind:isOpen={isUpdateStatsOpen} />
