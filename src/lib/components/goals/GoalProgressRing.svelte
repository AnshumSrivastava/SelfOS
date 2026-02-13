<script lang="ts">
    let {
        progress = 0,
        size = "md",
        health = "on-track",
    } = $props<{
        progress: number;
        size?: "sm" | "md" | "lg";
        health?: "on-track" | "at-risk" | "stalled";
    }>();

    const sizes = {
        sm: { dim: 32, stroke: 3, radius: 14 },
        md: { dim: 48, stroke: 4, radius: 20 },
        lg: { dim: 64, stroke: 6, radius: 26 },
    };

    const currentSize = $derived(sizes[size as keyof typeof sizes]);
    const center = $derived(currentSize.dim / 2);
    const circumference = $derived(2 * Math.PI * currentSize.radius);
    const offset = $derived(circumference - (progress / 100) * circumference);

    const colors = {
        "on-track": "text-emerald-500",
        "at-risk": "text-amber-500",
        stalled: "text-rose-500",
    };

    const bgColors = {
        "on-track": "text-emerald-500/10",
        "at-risk": "text-amber-500/10",
        stalled: "text-rose-500/10",
    };
</script>

<div
    class="relative inline-flex items-center justify-center"
    style="width: {currentSize.dim}px; height: {currentSize.dim}px;"
>
    <!-- Background Circle -->
    <svg class="transform -rotate-90 w-full h-full">
        <circle
            cx={center}
            cy={center}
            r={currentSize.radius}
            stroke="currentColor"
            stroke-width={currentSize.stroke}
            fill="transparent"
            class={bgColors[health as keyof typeof bgColors]}
        />
        <!-- Progress Circle -->
        <circle
            cx={center}
            cy={center}
            r={currentSize.radius}
            stroke="currentColor"
            stroke-width={currentSize.stroke}
            fill="transparent"
            stroke-dasharray={circumference}
            style="stroke-dashoffset: {offset}"
            class="transition-all duration-500 ease-out {colors[
                health as keyof typeof colors
            ]}"
            stroke-linecap="round"
        />
    </svg>

    {#if size !== "sm"}
        <span
            class="absolute text-[10px] font-bold {colors[
                health as keyof typeof colors
            ]}"
        >
            {Math.round(progress)}%
        </span>
    {/if}
</div>
