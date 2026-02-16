<script lang="ts">
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import FloatingActionButton from "$lib/components/mobile/FloatingActionButton.svelte";
    import {
        Activity,
        Dumbbell,
        Trophy,
        History,
        TrendingUp,
        Calendar,
        Footprints,
        Droplets,
        Moon,
        Clock,
    } from "lucide-svelte";
    import { fitnessStore } from "$lib/stores/fitness.svelte";
    import LogWorkoutModal from "./LogWorkoutModal.svelte";
    import UpdateStatsModal from "./UpdateStatsModal.svelte";

    import { onMount } from "svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";

    let isLogWorkoutOpen = $state(false);
    let isUpdateStatsOpen = $state(false);
    let isLoading = $state(true);

    onMount(() => {
        const timer = setTimeout(() => {
            isLoading = false;
        }, 800);
        return () => clearTimeout(timer);
    });

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

<div class="page-container h-full relative pb-24">
    <MobileHeader title="Fitness" />

    <FloatingActionButton
        onclick={() => (isLogWorkoutOpen = true)}
        ariaLabel="Log Workout"
    />

    {#if isLoading}
        <div class="px-6 space-y-10">
            <div class="grid grid-cols-2 gap-4">
                <div
                    class="card-subtle aspect-square p-6 flex flex-col justify-between"
                >
                    <SkeletonLoader circle width="w-10" height="h-10" />
                    <SkeletonLoader lines={1} height="h-8" width="w-3/4" />
                </div>
                <div class="flex flex-col gap-4">
                    <div class="card-subtle flex-1 p-4 flex items-center gap-3">
                        <SkeletonLoader circle width="w-10" height="h-10" />
                        <SkeletonLoader lines={1} height="h-4" width="w-12" />
                    </div>
                    <div class="card-subtle flex-1 p-4 flex items-center gap-3">
                        <SkeletonLoader circle width="w-10" height="h-10" />
                        <SkeletonLoader lines={1} height="h-4" width="w-12" />
                    </div>
                </div>
            </div>

            <div class="card-subtle p-6 space-y-4">
                <div class="flex justify-between items-center">
                    <SkeletonLoader lines={1} width="w-24" />
                    <SkeletonLoader lines={1} width="w-16" />
                </div>
                <div class="flex items-center gap-4">
                    <SkeletonLoader circle width="w-14" height="h-14" />
                    <div class="flex-1 space-y-2">
                        <SkeletonLoader lines={1} width="w-3/4" />
                        <SkeletonLoader lines={1} width="w-1/2" />
                    </div>
                </div>
                <SkeletonLoader lines={1} height="h-12" />
            </div>

            <div class="space-y-4">
                <SkeletonLoader lines={1} width="w-32" />
                <div class="space-y-3">
                    {#each Array(3) as _}
                        <div class="card-subtle p-4 flex items-center gap-4">
                            <SkeletonLoader circle width="w-12" height="h-12" />
                            <div class="flex-1 space-y-2">
                                <SkeletonLoader lines={1} width="w-1/3" />
                                <SkeletonLoader lines={1} width="w-1/4" />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <div class="px-6 space-y-8">
            <!-- Daily Stats Grid -->
            <div class="grid grid-cols-2 gap-3">
                <button
                    onclick={() => (isUpdateStatsOpen = true)}
                    class="relative overflow-hidden rounded-[24px] p-5 flex flex-col justify-between aspect-square group active:scale-[0.98] transition-all bg-gradient-to-br from-surface to-background border border-white/5 shadow-xl"
                >
                    <div
                        class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    ></div>

                    <div
                        class="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
                    >
                        <Footprints size={20} />
                    </div>

                    <div>
                        <div
                            class="text-3xl font-light text-white tracking-tight leading-none mb-1"
                        >
                            {(stats.todaySteps / 1000).toFixed(1)}<span
                                class="text-lg text-muted/60">k</span
                            >
                        </div>
                        <span
                            class="text-[10px] font-black text-muted/60 uppercase tracking-widest"
                            >Steps</span
                        >
                    </div>
                </button>

                <div class="flex flex-col gap-3">
                    <button
                        onclick={() => (isUpdateStatsOpen = true)}
                        class="flex-1 rounded-[20px] p-4 flex items-center gap-3 active:scale-[0.98] transition-all bg-surface/40 hover:bg-surface/60 border border-white/5"
                    >
                        <div
                            class="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"
                        >
                            <Droplets size={16} />
                        </div>
                        <div>
                            <span
                                class="text-lg font-bold text-white leading-none block"
                                >{stats.todayWater.toFixed(1)}L</span
                            >
                            <span
                                class="text-[9px] font-bold text-muted/60 uppercase tracking-wider"
                                >Water</span
                            >
                        </div>
                    </button>

                    <button
                        onclick={() => (isUpdateStatsOpen = true)}
                        class="flex-1 rounded-[20px] p-4 flex items-center gap-3 active:scale-[0.98] transition-all bg-surface/40 hover:bg-surface/60 border border-white/5"
                    >
                        <div
                            class="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"
                        >
                            <Moon size={16} />
                        </div>
                        <div>
                            <span
                                class="text-lg font-bold text-white leading-none block"
                                >{fitnessStore.latestSleep}h</span
                            >
                            <span
                                class="text-[9px] font-bold text-muted/60 uppercase tracking-wider"
                                >Sleep</span
                            >
                        </div>
                    </button>
                </div>
            </div>

            <!-- Focus Workout Card -->
            <div
                class="relative overflow-hidden rounded-[24px] p-6 border border-primary/20 bg-primary/5"
            >
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <span
                            class="text-[9px] font-black text-primary uppercase tracking-[0.2em]"
                            >Up Next</span
                        >
                        <h3 class="text-xl font-bold text-white mt-1">
                            Pull Day
                        </h3>
                    </div>
                    <div
                        class="w-12 h-12 rounded-2xl bg-primary text-black flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                        <Dumbbell size={24} />
                    </div>
                </div>

                <div class="flex items-center gap-4 mb-6">
                    <div class="flex items-center gap-2">
                        <Clock size={14} class="text-primary" />
                        <span class="text-xs font-bold text-white/80">45m</span>
                    </div>
                    <div class="w-1 h-1 rounded-full bg-white/20"></div>
                    <div class="flex items-center gap-2">
                        <Activity size={14} class="text-primary" />
                        <span class="text-xs font-bold text-white/80"
                            >High Intensity</span
                        >
                    </div>
                </div>

                <button
                    class="w-full py-4 rounded-2xl bg-primary text-black font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                >
                    Start Session
                </button>
            </div>

            <!-- Recent Activity List -->
            <div class="space-y-4">
                <div class="flex items-center justify-between px-1">
                    <h3
                        class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
                    >
                        History
                    </h3>
                    <button
                        class="text-[10px] font-bold text-primary uppercase tracking-widest"
                        >View All</button
                    >
                </div>

                <div class="space-y-2">
                    {#each workouts as w (w.id)}
                        <div
                            class="group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 active:scale-[0.99] transition-all"
                        >
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 rounded-full bg-surface/50 border border-white/5 flex items-center justify-center text-primary"
                                >
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <p class="font-bold text-white text-sm">
                                        {w.title}
                                    </p>
                                    <p
                                        class="text-[10px] text-muted/60 font-bold uppercase tracking-wider"
                                    >
                                        {formatDate(w.date)} • {w.type}
                                    </p>
                                </div>
                            </div>
                            <div class="text-right">
                                <span class="block text-white font-bold text-sm"
                                    >{w.calories} kcal</span
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
    {/if}
</div>

<LogWorkoutModal bind:isOpen={isLogWorkoutOpen} />
<UpdateStatsModal bind:isOpen={isUpdateStatsOpen} />
