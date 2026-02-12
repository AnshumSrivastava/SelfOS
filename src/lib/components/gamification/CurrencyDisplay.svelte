<script lang="ts">
    import { scale } from "svelte/transition";
    import { Coins, Gem } from "lucide-svelte";

    let { gold = 0, gems = 0, size = "md" } = $props();

    let sizeClasses = $derived(
        size === "sm"
            ? { text: "text-sm", icon: 16 }
            : size === "lg"
              ? { text: "text-xl", icon: 24 }
              : { text: "text-base", icon: 20 },
    );
</script>

<div class="flex items-center gap-4">
    <!-- Gold -->
    <div
        class="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/20 transition-colors"
    >
        <Coins
            size={sizeClasses.icon}
            class="text-yellow-500 animate-spin-slow"
        />
        <span class="{sizeClasses.text} font-bold text-yellow-500">
            {gold.toLocaleString()}
        </span>
    </div>

    <!-- Gems -->
    <div
        class="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
    >
        <Gem size={sizeClasses.icon} class="text-cyan-500 animate-pulse" />
        <span class="{sizeClasses.text} font-bold text-cyan-500">
            {gems.toLocaleString()}
        </span>
    </div>
</div>

<style>
    @keyframes spin-slow {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
    }
</style>
