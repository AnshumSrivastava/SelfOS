<script lang="ts">
    import { X, Save, Clock, Flame, Dumbbell } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";
    import { fitnessStore, type Workout } from "$lib/stores/fitness.svelte";

    let { isOpen = $bindable(), onSave = () => {} } = $props();

    let title = $state("");
    let duration = $state("");
    let calories = $state(0);
    let type = $state("Strength");
    let difficulty = $state<Workout["difficulty"]>("Medium");

    const workoutTypes = ["Strength", "Cardio", "Flexibility", "HIIT", "Sport"];
    const difficulties: Workout["difficulty"][] = [
        "Easy",
        "Medium",
        "Hard",
        "Extreme",
    ];

    function save() {
        if (!title || !duration) return;

        // Parse duration: handle "45", "45m", etc.
        const parsedDuration =
            parseInt(duration.toString().replace(/[^\d]/g, "")) || 0;
        const parsedCalories = parseInt(calories.toString()) || 0;

        fitnessStore.addWorkout({
            title,
            duration: parsedDuration,
            calories: parsedCalories,
            type,
            difficulty,
            date: new Date().toISOString(),
        });

        title = "";
        duration = "";
        calories = 0;
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
            class="card-subtle w-full max-w-lg shadow-2xl relative overflow-hidden"
            transition:scale={{ duration: 200, start: 0.95 }}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
        >
            <!-- Decorative Header Gradient -->
            <div
                class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"
            ></div>

            <div class="flex justify-between items-center mb-8">
                <div>
                    <h3 class="text-2xl font-light text-white">Log Workout</h3>
                    <p
                        class="text-xs text-muted mt-1 uppercase tracking-widest"
                    >
                        Add your latest session
                    </p>
                </div>
                <button
                    onclick={() => (isOpen = false)}
                    class="p-2 rounded-full hover:bg-surface transition-colors text-muted hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            <div class="space-y-6">
                <!-- Title Input -->
                <div class="space-y-2">
                    <label
                        class="text-xs font-bold text-muted uppercase ml-1"
                        for="workout-title">Workout Title</label
                    >
                    <div class="relative">
                        <Dumbbell
                            size={16}
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                        />
                        <input
                            id="workout-title"
                            type="text"
                            bind:value={title}
                            placeholder="e.g. Upper Body Power"
                            class="input w-full pl-10"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <!-- Duration -->
                    <div class="space-y-2">
                        <label
                            class="text-xs font-bold text-muted uppercase ml-1"
                            for="workout-duration">Duration</label
                        >
                        <div class="relative">
                            <Clock
                                size={16}
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                            />
                            <input
                                id="workout-duration"
                                type="text"
                                bind:value={duration}
                                placeholder="e.g. 45m"
                                class="input w-full pl-10"
                            />
                        </div>
                    </div>

                    <!-- Calories -->
                    <div class="space-y-2">
                        <label
                            class="text-xs font-bold text-muted uppercase ml-1"
                            for="workout-calories">Calories</label
                        >
                        <div class="relative">
                            <Flame
                                size={16}
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500"
                            />
                            <input
                                id="workout-calories"
                                type="number"
                                bind:value={calories}
                                class="input w-full pl-10"
                            />
                        </div>
                    </div>
                </div>

                <!-- Type Selector -->
                <div class="space-y-2">
                    <label
                        class="text-xs font-bold text-muted uppercase ml-1"
                        for="workout-type">Workout Type</label
                    >
                    <div class="flex flex-wrap gap-2">
                        {#each workoutTypes as t}
                            <button
                                onclick={() => (type = t)}
                                class="px-4 py-2 rounded-xl border text-sm transition-all {type ===
                                t
                                    ? 'bg-primary border-primary text-black'
                                    : 'border-line bg-surface/50 text-muted hover:border-primary/50'}"
                            >
                                {t}
                            </button>
                        {/each}
                    </div>
                </div>

                <!-- Difficulty Selector -->
                <div class="space-y-2">
                    <label
                        class="text-xs font-bold text-muted uppercase ml-1"
                        for="workout-difficulty">Difficulty</label
                    >
                    <div class="flex gap-2">
                        {#each difficulties as d}
                            <button
                                onclick={() => (difficulty = d)}
                                class="flex-1 py-2 rounded-xl border text-xs font-bold transition-all {difficulty ===
                                d
                                    ? 'bg-secondary border-secondary text-white'
                                    : 'border-line bg-surface/50 text-muted hover:border-secondary/50'}"
                            >
                                {d}
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <div class="mt-10 flex gap-3">
                <button
                    onclick={() => (isOpen = false)}
                    class="btn btn-ghost flex-1"
                >
                    Discard
                </button>
                <button
                    onclick={save}
                    disabled={!title || !duration}
                    class="btn btn-primary flex-1 flex items-center justify-center gap-2 group"
                >
                    <Save
                        size={18}
                        class="group-active:scale-90 transition-transform"
                    />
                    Log Session
                </button>
            </div>
        </div>
    </div>
{/if}
