<script lang="ts">
    import { fly, scale } from "svelte/transition";
    import type { Achievement } from "$lib/types/gamification";

    let {
        achievement = $bindable<Achievement | null>(null),
        onClose = () => {},
    } = $props();

    let show = $derived(achievement !== null);

    // Auto-dismiss after 5 seconds
    $effect(() => {
        if (achievement) {
            const timeout = setTimeout(() => {
                achievement = null;
                onClose();
            }, 5000);

            return () => clearTimeout(timeout);
        }
    });

    function getRarityColor(rarity: Achievement["rarity"]) {
        switch (rarity) {
            case "common":
                return "from-gray-500 to-gray-600";
            case "rare":
                return "from-blue-500 to-blue-600";
            case "epic":
                return "from-purple-500 to-purple-600";
            case "legendary":
                return "from-yellow-500 to-orange-600";
        }
    }

    function getRarityBorder(rarity: Achievement["rarity"]) {
        switch (rarity) {
            case "common":
                return "border-gray-500/50";
            case "rare":
                return "border-blue-500/50";
            case "epic":
                return "border-purple-500/50";
            case "legendary":
                return "border-yellow-500/50 shadow-lg shadow-yellow-500/30";
        }
    }
</script>

{#if show && achievement}
    <div
        class="fixed top-4 right-4 z-[90] max-w-sm w-full"
        transition:fly={{ x: 400, duration: 400 }}
    >
        <div
            class="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] border-2 {getRarityBorder(
                achievement.rarity,
            )} rounded-xl p-4 shadow-2xl overflow-hidden"
            transition:scale={{ duration: 300, start: 0.9 }}
        >
            <!-- Animated Background -->
            <div
                class="absolute inset-0 bg-gradient-to-r {getRarityColor(
                    achievement.rarity,
                )} opacity-10 animate-pulse"
            ></div>

            <!-- Shimmer Effect -->
            <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer-slide"
            ></div>

            <!-- Content -->
            <div class="relative z-10 flex items-start gap-4">
                <!-- Icon -->
                <div
                    class="flex-shrink-0 w-16 h-16 bg-gradient-to-br {getRarityColor(
                        achievement.rarity,
                    )} rounded-xl flex items-center justify-center text-3xl shadow-lg"
                >
                    {achievement.icon}
                </div>

                <!-- Text -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <h3 class="font-bold text-white text-lg truncate">
                            {achievement.title}
                        </h3>
                        <span
                            class="px-2 py-0.5 text-xs font-bold uppercase rounded {getRarityColor(
                                achievement.rarity,
                            )} text-white"
                        >
                            {achievement.rarity}
                        </span>
                    </div>
                    <p class="text-sm text-gray-400 mb-2">
                        {achievement.description}
                    </p>
                    <div class="flex items-center gap-3 text-xs">
                        <span class="text-cyan-400 font-semibold"
                            >+{achievement.xpReward} XP</span
                        >
                        <span class="text-yellow-500 font-semibold"
                            >+{achievement.goldReward} Gold</span
                        >
                    </div>
                </div>

                <!-- Close Button -->
                <button
                    onclick={() => {
                        achievement = null;
                        onClose();
                    }}
                    class="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                    >
                        <path d="M6 6L14 14M6 14L14 6" />
                    </svg>
                </button>
            </div>

            <!-- Progress Bar (if not completed) -->
            {#if achievement.progress < achievement.maxProgress}
                <div
                    class="relative z-10 mt-3 h-1 bg-black/30 rounded-full overflow-hidden"
                >
                    <div
                        class="h-full bg-gradient-to-r {getRarityColor(
                            achievement.rarity,
                        )} transition-all duration-500"
                        style="width: {(achievement.progress /
                            achievement.maxProgress) *
                            100}%"
                    ></div>
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    @keyframes shimmer-slide {
        0% {
            transform: translateX(-100%) skewX(-12deg);
        }
        100% {
            transform: translateX(200%) skewX(-12deg);
        }
    }

    .animate-shimmer-slide {
        animation: shimmer-slide 2s ease-in-out infinite;
    }
</style>
