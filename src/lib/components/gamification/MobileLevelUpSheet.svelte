<script lang="ts">
    import { Coins, Zap, X } from "lucide-svelte";
    import { slide, fade } from "svelte/transition";
    import { gamificationStore } from "$lib/stores/gamification.svelte";
    import { hapticFeedback } from "$lib/utils/swipeGestures";

    let {
        show = $bindable(false),
        level,
        rewards,
    }: {
        show?: boolean;
        level: number;
        rewards: { gold: number; gems: number };
    } = $props();

    function handleContinue() {
        hapticFeedback(10);
        show = false;
    }
</script>

{#if show}
    <!-- Backdrop -->
    <button
        transition:fade={{ duration: 200 }}
        onclick={handleContinue}
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        aria-label="Close level up modal"
    ></button>

    <!-- Bottom Sheet -->
    <div
        transition:slide={{ duration: 300 }}
        class="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] border-t-4 border-yellow-500 rounded-t-3xl p-6 pb-8"
    >
        <!-- Celebration Icon -->
        <div class="text-center mb-4">
            <div class="inline-block relative">
                <!-- Glow Effect -->
                <div
                    class="absolute inset-0 bg-yellow-500/30 blur-2xl rounded-full animate-pulse"
                ></div>

                <!-- Icon -->
                <div class="relative text-7xl animate-bounce">🎉</div>
            </div>
        </div>

        <!-- Level Up Text -->
        <h2
            class="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
        >
            Level Up!
        </h2>
        <p class="text-center text-xl text-white mb-6">
            You're now <span class="font-bold text-yellow-400"
                >Level {level}</span
            >
        </p>

        <!-- Rewards -->
        <div class="flex justify-center gap-4 mb-8">
            <!-- Gold Reward -->
            <div
                class="flex items-center gap-2 px-4 py-3 bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl"
            >
                <Coins size={24} class="text-yellow-500" />
                <div>
                    <div class="text-xs text-gray-400">Earned</div>
                    <div class="text-lg font-bold text-yellow-500">
                        +{rewards.gold}
                    </div>
                </div>
            </div>

            <!-- Gems Reward (if any) -->
            {#if rewards.gems > 0}
                <div
                    class="flex items-center gap-2 px-4 py-3 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl"
                >
                    <Zap size={24} class="text-cyan-400" />
                    <div>
                        <div class="text-xs text-gray-400">Bonus</div>
                        <div class="text-lg font-bold text-cyan-400">
                            +{rewards.gems}
                        </div>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Continue Button -->
        <button
            onclick={handleContinue}
            class="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-bold text-lg text-white active:scale-95 transition-transform shadow-lg shadow-yellow-500/30"
        >
            Continue
        </button>
    </div>
{/if}
