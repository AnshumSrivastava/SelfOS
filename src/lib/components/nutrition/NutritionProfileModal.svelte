<script lang="ts">
    import { X, Save, Ruler, Weight, User, Activity } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";
    import {
        nutritionStore,
        type UserProfile,
    } from "$lib/stores/nutrition.svelte";

    /**
     * Modal for editing the user's nutrition profile.
     * Contains fields for age, sex, height, weight, and activity level.
     * These stats are used to calculate daily caloric and macronutrient goals.
     */

    let { isOpen = $bindable() } = $props();

    let age = $state(nutritionStore.profile.age);
    let sex = $state(nutritionStore.profile.sex);
    let height = $state(nutritionStore.profile.height);
    let weight = $state(nutritionStore.profile.weight);
    let activityLevel = $state(nutritionStore.profile.activityLevel);

    const activityLevels: {
        value: UserProfile["activityLevel"];
        label: string;
        desc: string;
    }[] = [
        {
            value: "sedentary",
            label: "Sedentary",
            desc: "Office job, little exercise",
        },
        {
            value: "light",
            label: "Lightly Active",
            desc: "1-3 days of exercise/week",
        },
        {
            value: "moderate",
            label: "Moderately Active",
            desc: "3-5 days of exercise/week",
        },
        {
            value: "active",
            label: "Very Active",
            desc: "6-7 days of exercise/week",
        },
        {
            value: "extra",
            label: "Extra Active",
            desc: "Physical job or 2x training",
        },
    ];

    function save() {
        nutritionStore.updateProfile({
            age,
            sex,
            height,
            weight,
            activityLevel,
        });
        isOpen = false;
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        transition:fade={{ duration: 200 }}
        onclick={() => (isOpen = false)}
    >
        <div
            class="card-subtle w-full max-w-lg shadow-2xl relative overflow-hidden"
            transition:scale={{ duration: 200, start: 0.95 }}
            onclick={(e) => e.stopPropagation()}
        >
            <div
                class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500"
            ></div>

            <div class="flex justify-between items-center mb-8">
                <div>
                    <h3 class="text-2xl font-light text-white">Your Profile</h3>
                    <p
                        class="text-xs text-muted mt-1 uppercase tracking-widest"
                    >
                        Set your physical stats for goal calculation
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
                <!-- Age & Sex -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label
                            class="text-xs font-bold text-muted uppercase ml-1"
                            for="age">Age</label
                        >
                        <div class="relative">
                            <User
                                size={16}
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                            />
                            <input
                                id="age"
                                type="number"
                                bind:value={age}
                                class="input w-full pl-10"
                            />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label
                            class="text-xs font-bold text-muted uppercase ml-1"
                            >Sex</label
                        >
                        <div class="flex gap-2">
                            <button
                                onclick={() => (sex = "male")}
                                class="flex-1 py-2 rounded-xl border text-sm transition-all {sex ===
                                'male'
                                    ? 'bg-primary border-primary text-black'
                                    : 'border-line bg-surface/50 text-muted'}"
                                >Male</button
                            >
                            <button
                                onclick={() => (sex = "female")}
                                class="flex-1 py-2 rounded-xl border text-sm transition-all {sex ===
                                'female'
                                    ? 'bg-primary border-primary text-black'
                                    : 'border-line bg-surface/50 text-muted'}"
                                >Female</button
                            >
                        </div>
                    </div>
                </div>

                <!-- Height & Weight -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label
                            class="text-xs font-bold text-muted uppercase ml-1"
                            for="height">Height (cm)</label
                        >
                        <div class="relative">
                            <Ruler
                                size={16}
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                            />
                            <input
                                id="height"
                                type="number"
                                bind:value={height}
                                class="input w-full pl-10"
                            />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label
                            class="text-xs font-bold text-muted uppercase ml-1"
                            for="weight">Weight (kg)</label
                        >
                        <div class="relative">
                            <Weight
                                size={16}
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                            />
                            <input
                                id="weight"
                                type="number"
                                bind:value={weight}
                                class="input w-full pl-10"
                            />
                        </div>
                    </div>
                </div>

                <!-- Activity Level -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-muted uppercase ml-1"
                        >Activity Level</label
                    >
                    <div class="space-y-2">
                        {#each activityLevels as level}
                            <button
                                onclick={() => (activityLevel = level.value)}
                                class="w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group {activityLevel ===
                                level.value
                                    ? 'bg-surface border-primary'
                                    : 'border-line bg-surface/30 hover:bg-surface/50'}"
                            >
                                <div>
                                    <p
                                        class="text-sm font-bold {activityLevel ===
                                        level.value
                                            ? 'text-primary'
                                            : 'text-white'}"
                                    >
                                        {level.label}
                                    </p>
                                    <p class="text-[10px] text-muted">
                                        {level.desc}
                                    </p>
                                </div>
                                <Activity
                                    size={16}
                                    class="{activityLevel === level.value
                                        ? 'text-primary'
                                        : 'text-muted/30'} transition-colors"
                                />
                            </button>
                        {/each}
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <button
                    onclick={save}
                    class="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                    <Save size={18} />
                    Calculate & Update Goals
                </button>
            </div>
        </div>
    </div>
{/if}
