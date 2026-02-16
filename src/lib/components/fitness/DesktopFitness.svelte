<script lang="ts">
    import StatCard from "$lib/components/ui/StatCard.svelte";
    import {
        Dumbbell,
        Activity,
        Play,
        Timer,
        TrendingUp,
        Plus,
        Trash2,
        Footprints,
        Droplets,
        Moon,
        ChevronRight,
        Calendar,
    } from "lucide-svelte";
    import { fitnessStore } from "$lib/stores/fitness.svelte";
    import LogWorkoutModal from "./LogWorkoutModal.svelte";
    import UpdateStatsModal from "./UpdateStatsModal.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import { syncStore } from "$lib/stores/sync.svelte";

    let isLogWorkoutOpen = $state(false);
    let isUpdateStatsOpen = $state(false);

    function formatDate(dateStr: string) {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7)
            return date.toLocaleDateString("en-US", { weekday: "long" });
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }

    let stats = $derived(fitnessStore.stats);
    let workouts = $derived(fitnessStore.workouts);
</script>

<div class="page-container h-full relative">
    <div class="module-header mb-12">
        <div class="space-y-1">
            <h1 class="text-4xl font-light text-white tracking-tight">
                Fitness <span class="text-primary font-bold">Protocol</span>
            </h1>
            <div class="flex items-center gap-3">
                <p
                    class="text-[10px] uppercase font-bold tracking-[0.3em] text-muted opacity-60"
                >
                    High Performance Lab
                </p>
                <div class="h-px w-8 bg-line"></div>
                <div class="flex items-center gap-2">
                    <div
                        class="w-1.5 h-1.5 rounded-full {syncStore.globalStatus ===
                        'stable'
                            ? 'bg-emerald-500'
                            : 'bg-primary animate-pulse'}"
                    ></div>
                    <span
                        class="text-[9px] font-bold {syncStore.globalStatus ===
                        'stable'
                            ? 'text-emerald-500'
                            : 'text-primary'} tracking-widest uppercase"
                    >
                        {syncStore.globalStatus === "stable"
                            ? "Operational"
                            : syncStore.globalStatus.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
        <div class="flex gap-3">
            <button
                onclick={() => {
                    console.log("DesktopFitness: Opening UpdateStatsModal");
                    isUpdateStatsOpen = true;
                }}
                class="btn btn-ghost border-line flex items-center gap-2"
            >
                <Plus size={18} /> Update Stats
            </button>
            <button
                onclick={() => {
                    console.log("DesktopFitness: Opening LogWorkoutModal");
                    isLogWorkoutOpen = true;
                }}
                class="btn btn-primary flex items-center gap-2"
            >
                <Plus size={18} /> Log Workout
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-10">
            <!-- Daily Overview -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                    class="card-subtle p-6 flex flex-col justify-between h-40 group hover:border-primary transition-all"
                >
                    <div class="flex justify-between items-start">
                        <div
                            class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"
                        >
                            <Footprints size={20} />
                        </div>
                        <span
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >Steps</span
                        >
                    </div>
                    <div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-3xl font-bold text-white"
                                >{stats.todaySteps.toLocaleString()}</span
                            >
                            <span class="text-xs text-muted"
                                >/ {stats.stepGoal.toLocaleString()}</span
                            >
                        </div>
                        <div
                            class="mt-3 h-1.5 w-full bg-background rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-primary transition-all duration-1000"
                                style="width: {Math.min(
                                    (stats.todaySteps / stats.stepGoal) * 100,
                                    100,
                                )}%"
                            ></div>
                        </div>
                    </div>
                </div>

                <div
                    class="card-subtle p-6 flex flex-col justify-between h-40 group hover:border-secondary transition-all"
                >
                    <div class="flex justify-between items-start">
                        <div
                            class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform"
                        >
                            <Droplets size={20} />
                        </div>
                        <span
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >Water</span
                        >
                    </div>
                    <div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-3xl font-bold text-white"
                                >{stats.todayWater.toFixed(1)}L</span
                            >
                            <span class="text-xs text-muted"
                                >/ {stats.waterGoal}L</span
                            >
                        </div>
                        <div
                            class="mt-3 h-1.5 w-full bg-background rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-secondary transition-all duration-1000"
                                style="width: {Math.min(
                                    (stats.todayWater / stats.waterGoal) * 100,
                                    100,
                                )}%"
                            ></div>
                        </div>
                    </div>
                </div>

                <div
                    class="card-subtle p-6 flex flex-col justify-between h-40 group hover:border-orange-500 transition-all"
                >
                    <div class="flex justify-between items-start">
                        <div
                            class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform"
                        >
                            <Activity size={20} />
                        </div>
                        <span
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                            >Activity</span
                        >
                    </div>
                    <div>
                        <div class="flex items-baseline gap-2">
                            <span class="text-3xl font-bold text-white"
                                >450</span
                            >
                            <span class="text-xs text-muted">kcal today</span>
                        </div>
                        <div
                            class="mt-3 text-xs text-muted flex items-center gap-1"
                        >
                            <TrendingUp size={12} class="text-emerald-500" />
                            <span>12% more than yesterday</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-light text-white">
                        Recent Workouts
                    </h3>
                    <button
                        class="text-xs text-muted hover:text-white transition-colors flex items-center gap-1"
                    >
                        View History <ChevronRight size={14} />
                    </button>
                </div>

                <div class="space-y-4">
                    {#if fitnessStore.loading}
                        {#each Array(3) as _}
                            <div class="card-subtle p-6 space-y-4">
                                <SkeletonLoader lines={2} />
                            </div>
                        {/each}
                    {:else}
                        {#each workouts as w (w.id)}
                            <div
                                class="flex items-center justify-between p-5 rounded-2xl bg-surface/30 backdrop-blur-xl border border-white/5 hover:border-primary/50 hover:bg-surface/50 transition-all group"
                            >
                                <div class="flex items-center gap-5">
                                    <div
                                        class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/5"
                                    >
                                        <Dumbbell size={28} />
                                    </div>
                                    <div class="space-y-1">
                                        <h4
                                            class="font-bold text-white group-hover:text-primary transition-colors text-lg"
                                        >
                                            {w.title}
                                        </h4>
                                        <div
                                            class="flex gap-4 text-[10px] text-muted font-bold tracking-wider items-center uppercase"
                                        >
                                            <span
                                                class="flex items-center gap-1.5"
                                            >
                                                <Timer
                                                    size={12}
                                                    class="text-primary/60"
                                                />
                                                {w.duration}M
                                            </span>
                                            <span
                                                class="flex items-center gap-1.5"
                                            >
                                                <Activity
                                                    size={12}
                                                    class="text-primary/60"
                                                />
                                                {w.calories} KCAL
                                            </span>
                                            <span
                                                class="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px]"
                                            >
                                                {w.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center gap-8">
                                    <div class="text-right">
                                        <span
                                            class="text-[10px] font-bold text-muted block mb-1 uppercase tracking-widest opacity-40"
                                            >{formatDate(w.date)}</span
                                        >
                                        <span
                                            class="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border
                                            {w.difficulty === 'Hard' ||
                                            w.difficulty === 'Extreme'
                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}"
                                        >
                                            {w.difficulty}
                                        </span>
                                    </div>
                                    <button
                                        onclick={() =>
                                            fitnessStore.removeWorkout(w.id)}
                                        class="p-2 text-muted/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        {/each}
                    {/if}

                    {#if workouts.length === 0}
                        <div
                            class="card-subtle text-center py-16 border-dashed opacity-60"
                        >
                            <Dumbbell
                                size={48}
                                class="mx-auto mb-4 text-muted/20"
                            />
                            <p class="text-muted">No workouts logged yet.</p>
                            <button
                                onclick={() => (isLogWorkoutOpen = true)}
                                class="mt-4 text-primary text-sm font-medium hover:underline"
                                >Log your first session</button
                            >
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-10">
            <!-- Training Plan -->
            <div
                class="card-subtle bg-gradient-to-br from-primary/5 to-transparent border-primary/20 p-6"
            >
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-light text-white">Training Plan</h3>
                    <div
                        class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
                    >
                        <Calendar size={16} />
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="p-4 rounded-xl bg-surface border border-line">
                        <p
                            class="text-[10px] text-primary font-black uppercase tracking-widest mb-1"
                        >
                            Current Focus
                        </p>
                        <p class="text-sm font-bold text-white">
                            Hypertrophy Phase 2
                        </p>
                    </div>

                    <div class="space-y-4">
                        <p
                            class="text-xs font-bold text-muted uppercase tracking-wider"
                        >
                            Recommended Session
                        </p>
                        <div
                            class="p-5 rounded-2xl bg-background border border-line relative overflow-hidden group"
                        >
                            <div
                                class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"
                            >
                                <Dumbbell size={80} />
                            </div>
                            <h4 class="text-white font-bold mb-3">
                                Pull Day (Back & Bi)
                            </h4>
                            <ul class="text-xs text-muted space-y-2 mb-6">
                                <li class="flex items-center gap-2 italic">
                                    <span
                                        class="w-1 h-1 rounded-full bg-primary"
                                    ></span> Deadlifts 3x5
                                </li>
                                <li class="flex items-center gap-2 italic">
                                    <span
                                        class="w-1 h-1 rounded-full bg-primary"
                                    ></span> Pullups 3x8
                                </li>
                                <li class="flex items-center gap-2 italic">
                                    <span
                                        class="w-1 h-1 rounded-full bg-primary"
                                    ></span> Rows 3x10
                                </li>
                            </ul>
                            <button
                                class="w-full btn btn-primary py-2 text-xs font-bold uppercase tracking-widest"
                            >
                                Start Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Health Logs -->
            <div class="space-y-6">
                <h3 class="text-lg font-light text-white px-1">
                    Health Metrics
                </h3>
                <div class="grid grid-cols-1 gap-4">
                    <div
                        class="card-subtle p-5 flex items-center justify-between"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"
                            >
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <span class="text-xs text-muted block"
                                    >Weight</span
                                >
                                <span class="text-xl font-bold text-white"
                                    >{fitnessStore.latestWeight} kg</span
                                >
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] text-muted block uppercase"
                                >Goal</span
                            >
                            <span class="text-sm text-emerald-500 font-bold"
                                >{stats.weightGoal} kg</span
                            >
                        </div>
                    </div>

                    <div
                        class="card-subtle p-5 flex items-center justify-between"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"
                            >
                                <Moon size={20} />
                            </div>
                            <div>
                                <span class="text-xs text-muted block"
                                    >Sleep</span
                                >
                                <span class="text-xl font-bold text-white"
                                    >{fitnessStore.latestSleep}h</span
                                >
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] text-muted block uppercase"
                                >Trend</span
                            >
                            <span class="text-xs text-purple-400 font-bold"
                                >+0.4h avg</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<LogWorkoutModal bind:isOpen={isLogWorkoutOpen} />
<UpdateStatsModal bind:isOpen={isUpdateStatsOpen} />
