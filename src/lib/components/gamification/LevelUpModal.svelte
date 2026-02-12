<script lang="ts">
    import { scale, fade, fly } from "svelte/transition";
    import { Trophy, Star, Coins, Gem, Sparkles, X } from "lucide-svelte";
    import { gamificationStore } from "$lib/stores/gamification.svelte";

    let { show = $bindable(false), oldLevel = 1, newLevel = 2 } = $props();

    let rewards = $derived({
        gold: newLevel * 50,
        gems: newLevel % 5 === 0 ? 10 : 0,
        xp: 0,
    });

    function close() {
        show = false;
    }
</script>

{#if show}
    <!-- Overlay -->
    <div
        class="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        transition:fade={{ duration: 300 }}
        onclick={close}
    >
        <!-- Modal -->
        <div
            class="relative max-w-lg w-full"
            transition:scale={{ duration: 400, start: 0.8 }}
            onclick={(e) => e.stopPropagation()}
        >
            <!-- Glow Effect -->
            <div
                class="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl animate-pulse"
            ></div>

            <!-- Card -->
            <div
                class="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] border-2 border-cyan-500/30 rounded-2xl p-8 shadow-2xl"
            >
                <!-- Close Button -->
                <button
                    onclick={close}
                    class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <!-- Particle Effects -->
                <div
                    class="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none"
                >
                    {#each Array(20) as _, i}
                        <div
                            class="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
                            style="left: {Math.random() *
                                100}%; top: {Math.random() *
                                100}%; animation-delay: {i *
                                0.1}s; animation-duration: {2 +
                                Math.random() * 2}s;"
                        ></div>
                    {/each}
                </div>

                <!-- Content -->
                <div class="relative z-10 text-center space-y-6">
                    <!-- Icon -->
                    <div class="flex justify-center">
                        <div
                            class="relative w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-bounce-slow"
                        >
                            <Trophy size={48} class="text-white" />
                            <div
                                class="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"
                            ></div>
                        </div>
                    </div>

                    <!-- Title -->
                    <div>
                        <h2
                            class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 mb-2 animate-shimmer"
                        >
                            LEVEL UP!
                        </h2>
                        <p class="text-2xl text-white font-bold">
                            Level {oldLevel} → Level {newLevel}
                        </p>
                    </div>

                    <!-- Rewards -->
                    <div class="space-y-3">
                        <p
                            class="text-gray-400 text-sm uppercase tracking-wider"
                        >
                            Rewards Earned
                        </p>
                        <div class="flex justify-center gap-6">
                            <!-- Gold -->
                            <div
                                class="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                            >
                                <Coins size={20} class="text-yellow-500" />
                                <span class="text-xl font-bold text-yellow-500"
                                    >+{rewards.gold}</span
                                >
                            </div>

                            <!-- Gems (if applicable) -->
                            {#if rewards.gems > 0}
                                <div
                                    class="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
                                >
                                    <Gem size={20} class="text-cyan-500" />
                                    <span
                                        class="text-xl font-bold text-cyan-500"
                                        >+{rewards.gems}</span
                                    >
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- Stats Increase (Optional) -->
                    <div
                        class="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2"
                    >
                        <div
                            class="flex items-center justify-center gap-2 text-sm text-gray-400"
                        >
                            <Sparkles size={16} />
                            <span>All stats increased!</span>
                        </div>
                    </div>

                    <!-- Continue Button -->
                    <button
                        onclick={close}
                        class="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes float {
        0%,
        100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
        }
    }

    @keyframes shimmer {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    @keyframes bounce-slow {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .animate-float {
        animation: float linear infinite;
    }

    .animate-shimmer {
        background-size: 200% 200%;
        animation: shimmer 3s ease infinite;
    }

    .animate-bounce-slow {
        animation: bounce-slow 2s ease-in-out infinite;
    }
</style>
