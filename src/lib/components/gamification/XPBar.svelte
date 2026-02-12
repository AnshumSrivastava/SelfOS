<script lang="ts">
    import { Zap } from "lucide-svelte";

    let {
        current = 0,
        max = 100,
        label = "XP",
        showNumbers = true,
        size = "md",
        color = "cyan",
    } = $props();

    let percentage = $derived(Math.min((current / max) * 100, 100));

    let heightClass = $derived(
        size === "sm" ? "h-2" : size === "lg" ? "h-4" : "h-3",
    );

    let gradientClass = $derived(
        color === "cyan"
            ? "from-cyan-500 to-cyan-600"
            : color === "purple"
              ? "from-purple-500 to-purple-600"
              : color === "green"
                ? "from-green-500 to-green-600"
                : color === "yellow"
                  ? "from-yellow-500 to-yellow-600"
                  : "from-cyan-500 to-purple-600",
    );
</script>

<div class="w-full">
    {#if showNumbers}
        <div class="flex items-center justify-between mb-1 text-sm">
            <span class="text-gray-400 font-medium">{label}</span>
            <span class="text-white font-bold"
                >{current.toLocaleString()} / {max.toLocaleString()}</span
            >
        </div>
    {/if}

    <div
        class="relative w-full {heightClass} bg-black/40 rounded-full overflow-hidden border border-white/10"
    >
        <!-- Background Glow -->
        <div
            class="absolute inset-0 bg-gradient-to-r {gradientClass} opacity-20 blur-sm"
        ></div>

        <!-- Progress Bar -->
        <div
            class="relative h-full bg-gradient-to-r {gradientClass} transition-all duration-500 ease-out shadow-lg"
            style="width: {percentage}%"
        >
            <!-- Shimmer Effect -->
            <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"
            ></div>

            <!-- Pulse Effect at End -->
            {#if percentage > 0}
                <div
                    class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/40 to-transparent animate-pulse"
                ></div>
            {/if}
        </div>

        <!-- Spark Effect (when near full) -->
        {#if percentage > 90}
            <div class="absolute right-2 top-1/2 -translate-y-1/2">
                <Zap size={12} class="text-white animate-pulse" />
            </div>
        {/if}
    </div>
</div>

<style>
    @keyframes shimmer {
        0% {
            transform: translateX(-100%) skewX(-12deg);
        }
        100% {
            transform: translateX(200%) skewX(-12deg);
        }
    }

    .animate-shimmer {
        animation: shimmer 2s ease-in-out infinite;
    }
</style>
