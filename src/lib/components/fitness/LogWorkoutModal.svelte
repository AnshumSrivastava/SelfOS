<script lang="ts">
    import { Save, Clock, Flame, Dumbbell } from "lucide-svelte";
    import { fitnessStore, type Workout } from "$lib/stores/fitness.svelte";
    import Modal from "$lib/components/ui/Modal.svelte";

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

<Modal bind:isOpen title="Log Session">
    <div class="space-y-6">
        <!-- Title Input -->
        <div class="space-y-2">
            <label
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                for="workout-title">Session Title</label
            >
            <div class="relative">
                <Dumbbell
                    size={14}
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-primary"
                />
                <input
                    id="workout-title"
                    type="text"
                    bind:value={title}
                    placeholder="e.g. Upper Body Power"
                    class="input w-full pl-11 bg-white/5 border-white/5 focus:border-primary/30"
                />
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <!-- Duration -->
            <div class="space-y-2">
                <label
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                    for="workout-duration">Duration</label
                >
                <div class="relative">
                    <Clock
                        size={14}
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                        id="workout-duration"
                        type="text"
                        bind:value={duration}
                        placeholder="e.g. 45m"
                        class="input w-full pl-11 bg-white/5 border-white/5 focus:border-white/20"
                    />
                </div>
            </div>

            <!-- Calories -->
            <div class="space-y-2">
                <label
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                    for="workout-calories">Intensity (kcal)</label
                >
                <div class="relative">
                    <Flame
                        size={14}
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
                    />
                    <input
                        id="workout-calories"
                        type="number"
                        bind:value={calories}
                        class="input w-full pl-11 bg-white/5 border-white/5 focus:border-orange-500/30"
                    />
                </div>
            </div>
        </div>

        <!-- Type Selector -->
        <div class="space-y-2">
            <label
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                for="workout-type">Categorization</label
            >
            <div class="flex flex-wrap gap-2">
                {#each workoutTypes as t}
                    <button
                        onclick={() => (type = t)}
                        class="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all {type ===
                        t
                            ? 'bg-primary text-black'
                            : 'bg-white/5 text-muted hover:text-white border border-transparent hover:border-white/10'}"
                    >
                        {t}
                    </button>
                {/each}
            </div>
        </div>

        <!-- Difficulty Selector -->
        <div class="space-y-2">
            <label
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1"
                for="workout-difficulty">Strain Level</label
            >
            <div class="flex gap-2">
                {#each difficulties as d}
                    <button
                        onclick={() => (difficulty = d)}
                        class="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all {difficulty ===
                        d
                            ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                            : 'bg-white/5 text-muted hover:text-white border border-transparent'}"
                    >
                        {d}
                    </button>
                {/each}
            </div>
        </div>

        <div class="mt-8 flex gap-3">
            <button
                onclick={() => (isOpen = false)}
                class="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
            >
                Cancel
            </button>
            <button
                onclick={save}
                disabled={!title || !duration}
                class="flex-[2] py-4 bg-primary text-black rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-primary/20"
            >
                Confirm Session
            </button>
        </div>
    </div>
</Modal>
