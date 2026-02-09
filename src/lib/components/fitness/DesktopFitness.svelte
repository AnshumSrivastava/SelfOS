<script>
    import StatCard from "$lib/components/ui/StatCard.svelte";
    import {
        Dumbbell,
        Activity,
        Calendar,
        Play,
        Timer,
        TrendingUp,
    } from "lucide-svelte";

    const workouts = [
        {
            title: "Push Day",
            duration: "45m",
            type: "Strength",
            diff: "Hard",
            date: "Today",
        },
        {
            title: "Morning Cardio",
            duration: "30m",
            type: "Cardio",
            diff: "Medium",
            date: "Yesterday",
        },
        {
            title: "Leg Day",
            duration: "60m",
            type: "Strength",
            diff: "Extreme",
            date: "Oct 8",
        },
        {
            title: "Yoga Flow",
            duration: "20m",
            type: "Flexibility",
            diff: "Easy",
            date: "Oct 7",
        },
    ];
</script>

<div class="space-y-8 pb-12">
    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-3xl font-bold text-[var(--color-text)] mb-2">
                Fitness & Health
            </h1>
            <p class="text-muted">Train like an athlete. Recover like a pro.</p>
        </div>
        <button class="btn btn-primary flex items-center gap-2">
            <Play size={18} fill="currentColor" /> Start Workout
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
            title="Workouts"
            value="12/20"
            icon={Dumbbell}
            trend={2}
            subtext="Monthly Goal"
        />
        <StatCard
            title="Active Cal"
            value="14,500"
            icon={Activity}
            trend={5.5}
            color="secondary"
        />
        <StatCard
            title="Weight"
            value="72.5kg"
            icon={TrendingUp}
            trend={-0.5}
            subtext="Goal: 70kg"
            color="primary"
        />
        <StatCard title="Sleep Avg" value="7h 12m" icon={Timer} trend={1.2} />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
            <div class="card">
                <h3 class="font-bold text-[var(--color-text)] mb-6">
                    Recent Activity
                </h3>
                <div class="space-y-4">
                    {#each workouts as w}
                        <div
                            class="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-transparent hover:border-line hover:bg-surface transition-all group cursor-pointer"
                        >
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-12 h-12 rounded-xl bg-surface border border-line flex items-center justify-center text-primary group-hover:scale-105 transition-transform"
                                >
                                    <Dumbbell size={24} />
                                </div>
                                <div>
                                    <h4
                                        class="font-bold text-[var(--color-text)] group-hover:text-primary transition-colors"
                                    >
                                        {w.title}
                                    </h4>
                                    <div
                                        class="flex gap-3 text-xs text-muted mt-1"
                                    >
                                        <span class="flex items-center gap-1"
                                            ><Timer
                                                size={12}
                                            />{w.duration}</span
                                        >
                                        <span
                                            class="px-2 py-0.5 rounded bg-surface border border-line"
                                            >{w.type}</span
                                        >
                                    </div>
                                </div>
                            </div>

                            <div class="text-right">
                                <span class="text-xs text-muted block mb-1"
                                    >{w.date}</span
                                >
                                <span
                                    class="text-xs font-bold px-2 py-1 rounded-full
                  {w.diff === 'Hard' || w.diff === 'Extreme'
                                        ? 'bg-red-500/10 text-red-500'
                                        : 'bg-green-500/10 text-green-500'}"
                                >
                                    {w.diff}
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Body Map / Stats Placeholder -->
            <div class="grid grid-cols-2 gap-6">
                <div class="card bg-surface flex flex-col justify-between">
                    <h3 class="text-sm font-medium text-muted">Steps Today</h3>
                    <div class="mt-4">
                        <span
                            class="text-3xl font-bold text-[var(--color-text)]"
                            >8,432</span
                        >
                        <p class="text-xs text-muted mt-1">Goal: 10,000</p>
                        <div
                            class="mt-2 h-1.5 w-full bg-background rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-primary w-[84%] rounded-full"
                            ></div>
                        </div>
                    </div>
                </div>
                <div class="card bg-surface flex flex-col justify-between">
                    <h3 class="text-sm font-medium text-muted">Water Intake</h3>
                    <div class="mt-4">
                        <span
                            class="text-3xl font-bold text-[var(--color-text)]"
                            >1.2L</span
                        >
                        <p class="text-xs text-muted mt-1">Goal: 2.5L</p>
                        <div
                            class="mt-2 h-1.5 w-full bg-background rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-secondary w-[48%] rounded-full"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Workout Plan -->
        <div class="card relative overflow-hidden bg-surface border-primary/20">
            <h3 class="font-bold text-[var(--color-text)] mb-4">
                Training Plan
            </h3>
            <div class="space-y-4 relative z-10">
                <div
                    class="p-3 rounded-lg bg-primary/10 border border-primary/20"
                >
                    <p class="text-xs text-primary font-bold mb-1">
                        Current Focus
                    </p>
                    <p class="text-sm text-[var(--color-text)]">
                        Hypertrophy Phase 2
                    </p>
                </div>

                <div class="space-y-3 pt-2">
                    <p class="text-sm font-medium text-muted">Next Workout</p>
                    <div
                        class="p-4 rounded-xl bg-background border border-line"
                    >
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-[var(--color-text)] font-bold"
                                >Pull Day (Back & Bi)</span
                            >
                        </div>
                        <ul class="text-xs text-muted space-y-1 ml-4 list-disc">
                            <li>Deadlifts 3x5</li>
                            <li>Pullups 3x8</li>
                            <li>Rows 3x10</li>
                        </ul>
                        <button
                            class="w-full btn btn-primary mt-4 text-xs py-1.5"
                            >Start Session</button
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
