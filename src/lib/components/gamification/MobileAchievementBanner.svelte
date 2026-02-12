<script lang="ts">
    import { slide } from "svelte/transition";
    import { Coins, Zap } from "lucide-svelte";
    import type { Achievement } from "$lib/types/gamification";
    import { hapticFeedback } from "$lib/utils/swipeGestures";

    let {
        achievement,
        show = $bindable(false),
    }: {
        achievement: Achievement | null;
        show?: boolean;
    } = $props();

    // Auto-dismiss after 3 seconds
    $effect(() => {
        if (show && achievement) {
            hapticFeedback([10, 50, 10]);
            const timeout = setTimeout(() => {
                show = false;
            }, 3000);

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

    function handleDismiss() {
        show = false;
    }
</script>

{#if show && achievement}
    <button
        transition:slide={{ duration: 300 }}
        class="fixed top-16 left-4 right-4 z-50 bg-gradient-to-r {getRarityColor(
            achievement.rarity,
        )} rounded-xl p-4 shadow-2xl w-auto text-left"
        onclick={handleDismiss}
        aria-label="Dismiss achievement notification"
    >
        <div class="flex items-center gap-3">
            <!-- Icon -->
            <div class="text-3xl flex-shrink-0">
                {achievement.icon}
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
                <div
                    class="text-xs font-bold text-white/80 uppercase tracking-wide mb-0.5"
                >
                    Achievement Unlocked
                </div>
                <div class="text-base font-bold text-white mb-1">
                    {achievement.title}
                </div>

                <!-- Rewards -->
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1">
                        <Zap size={12} class="text-white/80" />
                        <span class="text-xs font-bold text-white"
                            >+{achievement.xpReward} XP</span
                        >
                    </div>
                    <div class="flex items-center gap-1">
                        <Coins size={12} class="text-white/80" />
                        <span class="text-xs font-bold text-white"
                            >+{achievement.goldReward}</span
                        >
                    </div>
                </div>
            </div>

            <!-- Close Icon (not a button to avoid nesting) -->
            <div
                onclick={(e) => {
                    e.stopPropagation();
                    handleDismiss();
                }}
                role="button"
                tabindex="0"
                onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleDismiss();
                    }
                }}
                class="flex-shrink-0 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                aria-label="Dismiss achievement"
            >
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    class="text-white"
                >
                    <path
                        d="M2 2L10 10M2 10L10 2"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                </svg>
            </div>
        </div>
    </button>
{/if}
