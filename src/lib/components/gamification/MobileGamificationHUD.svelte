<script lang="ts">
    import { Coins, Zap } from "lucide-svelte";
    import { slide } from "svelte/transition";
    import { gamificationStore } from "$lib/stores/gamification.svelte";

    let isExpanded = $state(false);

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }
</script>

{#if gamificationStore.profile}
    <!-- Mobile Gamification HUD -->
    <div
        class="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-cyan-500/20"
    >
        <!-- Collapsed View (Always Visible) -->
        <button
            onclick={toggleExpanded}
            class="w-full px-4 py-3 flex items-center justify-between active:bg-white/5 transition-colors"
        >
            <!-- Left: Avatar & Level -->
            <div class="flex items-center gap-3">
                <!-- Avatar -->
                <div class="relative">
                    <div
                        class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center"
                    >
                        <span class="text-xl">👤</span>
                    </div>
                    <!-- Level Badge -->
                    <div
                        class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 border-2 border-[#0a0a0f] flex items-center justify-center"
                    >
                        <span class="text-[10px] font-bold text-white"
                            >{gamificationStore.profile.level}</span
                        >
                    </div>
                </div>

                <!-- Username & XP -->
                <div class="text-left">
                    <div class="text-sm font-bold text-white">
                        {gamificationStore.profile.username}
                    </div>
                    <div class="text-xs text-gray-400">
                        {gamificationStore.profile.xp} / {gamificationStore.xpToNextLevel}
                        XP
                    </div>
                </div>
            </div>

            <!-- Right: Currency -->
            <div class="flex items-center gap-3">
                <!-- Gold -->
                <div
                    class="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                >
                    <Coins size={14} class="text-yellow-500" />
                    <span class="text-xs font-bold text-yellow-500"
                        >{gamificationStore.profile.gold}</span
                    >
                </div>

                <!-- Gems -->
                <div
                    class="flex items-center gap-1 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
                >
                    <Zap size={14} class="text-cyan-400" />
                    <span class="text-xs font-bold text-cyan-400"
                        >{gamificationStore.profile.gems}</span
                    >
                </div>

                <!-- Expand Indicator -->
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    class="text-gray-400 transition-transform {isExpanded
                        ? 'rotate-180'
                        : ''}"
                >
                    <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        fill="none"
                    />
                </svg>
            </div>
        </button>

        <!-- Expanded View (XP Bar) -->
        {#if isExpanded}
            <div transition:slide={{ duration: 200 }} class="px-4 pb-3">
                <!-- XP Progress Bar -->
                <div
                    class="relative h-2 bg-gray-800 rounded-full overflow-hidden"
                >
                    <!-- Background Glow -->
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-sm"
                    ></div>

                    <!-- Progress Fill -->
                    <div
                        class="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-500"
                        style="width: {gamificationStore.xpProgress}%"
                    >
                        <!-- Shimmer Effect -->
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                        ></div>
                    </div>
                </div>

                <!-- Level Progress Text -->
                <div class="mt-1 text-center text-xs text-gray-400">
                    {Math.floor(gamificationStore.xpProgress)}% to Level {gamificationStore
                        .profile.level + 1}
                </div>
            </div>
        {/if}
    </div>
{/if}

<style>
    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    .animate-shimmer {
        animation: shimmer 2s infinite;
    }
</style>
