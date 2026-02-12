<script lang="ts">
    import type { PlayerStats } from "$lib/types/gamification";

    let {
        icon = "⚔️",
        label = "Strength",
        value = 50,
        max = 100,
        color = "red",
        size = "md",
    } = $props();

    let percentage = $derived(Math.min((value / max) * 100, 100));

    let colorClasses = $derived(
        color === "red"
            ? {
                  gradient: "from-red-500 to-red-600",
                  glow: "shadow-red-500/30",
                  text: "text-red-400",
              }
            : color === "blue"
              ? {
                    gradient: "from-blue-500 to-blue-600",
                    glow: "shadow-blue-500/30",
                    text: "text-blue-400",
                }
              : color === "green"
                ? {
                      gradient: "from-green-500 to-green-600",
                      glow: "shadow-green-500/30",
                      text: "text-green-400",
                  }
                : color === "purple"
                  ? {
                        gradient: "from-purple-500 to-purple-600",
                        glow: "shadow-purple-500/30",
                        text: "text-purple-400",
                    }
                  : {
                        gradient: "from-orange-500 to-orange-600",
                        glow: "shadow-orange-500/30",
                        text: "text-orange-400",
                    },
    );

    let sizeClasses = $derived(
        size === "sm"
            ? { container: "w-16", bar: "h-20", icon: "text-lg" }
            : size === "lg"
              ? { container: "w-24", bar: "h-32", icon: "text-3xl" }
              : { container: "w-20", bar: "h-24", icon: "text-2xl" },
    );
</script>

<div class="flex flex-col items-center gap-2">
    <!-- Vertical Stat Bar -->
    <div class="relative {sizeClasses.container}">
        <!-- Background -->
        <div
            class="relative {sizeClasses.bar} bg-black/40 rounded-full border border-white/10 overflow-hidden"
        >
            <!-- Glow Effect -->
            <div
                class="absolute inset-0 bg-gradient-to-t {colorClasses.gradient} opacity-20 blur-sm"
            ></div>

            <!-- Fill -->
            <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t {colorClasses.gradient} transition-all duration-500 ease-out {colorClasses.glow} shadow-lg"
                style="height: {percentage}%"
            >
                <!-- Shimmer -->
                <div
                    class="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent animate-shimmer-vertical"
                ></div>
            </div>

            <!-- Value Text -->
            <div
                class="absolute inset-0 flex items-center justify-center text-white font-bold text-sm z-10"
            >
                {value}
            </div>
        </div>

        <!-- Icon -->
        <div
            class="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-br {colorClasses.gradient} rounded-full flex items-center justify-center {sizeClasses.icon} {colorClasses.glow} shadow-lg"
        >
            {icon}
        </div>
    </div>

    <!-- Label -->
    <span
        class="text-xs font-medium {colorClasses.text} uppercase tracking-wider"
    >
        {label}
    </span>
</div>

<style>
    @keyframes shimmer-vertical {
        0% {
            transform: translateY(100%);
        }
        100% {
            transform: translateY(-100%);
        }
    }

    .animate-shimmer-vertical {
        animation: shimmer-vertical 2s ease-in-out infinite;
    }
</style>
