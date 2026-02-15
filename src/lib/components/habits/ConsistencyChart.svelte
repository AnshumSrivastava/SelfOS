<script lang="ts">
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { fade } from "svelte/transition";

    let { height = "h-40", showLabels = true } = $props();

    const daysCount = 7;
    const now = new Date();

    // Generate chart data derived from habitsStore
    let chartData = $derived(
        Array.from({ length: daysCount }, (_, i) => {
            const d = new Date(now);
            d.setDate(now.getDate() - (daysCount - 1 - i));
            const dateStr = d.toISOString().split("T")[0];
            const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
            const dayNameNarrow = d.toLocaleDateString("en-US", {
                weekday: "narrow",
            });

            const totalHabits = habitsStore.totalCount;
            const completedCount = habitsStore.habits.filter((h) =>
                (h.completedDates || []).includes(dateStr),
            ).length;
            const percentage =
                totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

            return {
                dayName,
                dayNameNarrow,
                dateStr,
                percentage,
                completedCount,
                totalHabits,
            };
        }),
    );

    // SVG scaling
    const paddingX = 5;
    const svgHeight = 50;
    const graphHeight = 40; // max height of line
    const topPadding = 5;

    // Helper functions for coordinates (returning Percentages 0-100)
    function getX(index: number) {
        // distribute points from paddingX% to (100-paddingX)%
        const paddingPct = 5;
        const step = (100 - paddingPct * 2) / (daysCount - 1);
        return paddingPct + index * step;
    }

    function getY(percentage: number) {
        // Percentage 0 -> 90%
        // Percentage 100 -> 10% (keeping margins)
        const usefulHeight = 80;
        const topPadding = 10;
        return topPadding + usefulHeight - (percentage / 100) * usefulHeight;
    }

    // Generate points for the polyline (SVG coordinate system 0-100 matching percentages)
    let points = $derived(
        chartData.map((d, i) => `${getX(i)},${getY(d.percentage)}`).join(" "),
    );

    // Generate path for the gradient fill
    let areaPath = $derived(
        `M ${points.split(" ").join(" L ")} L ${getX(daysCount - 1)},100 L ${getX(0)},100 Z`,
    );

    let hoveredIndex = $state<number | null>(null);
    const gradientId = `chart-gradient-${Math.random().toString(36).substring(2)}`;
</script>

<div class={`w-full flex flex-col ${height} relative group select-none`}>
    <div class="flex-1 w-full relative h-full">
        <!-- Main SVG for Line and Area -->
        <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            class="w-full h-full overflow-visible absolute inset-0"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="0%"
                        stop-color="var(--color-primary)"
                        stop-opacity="0.5"
                    />
                    <stop
                        offset="100%"
                        stop-color="var(--color-primary)"
                        stop-opacity="0.1"
                    />
                </linearGradient>
            </defs>

            <!-- Gradient Area -->
            <path d={areaPath} fill="url(#{gradientId})" stroke="none" />

            <!-- Line Path -->
            <polyline
                {points}
                fill="none"
                stroke="var(--color-primary)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                vector-effect="non-scaling-stroke"
                class="drop-shadow-sm"
            />
        </svg>

        <!-- HTML Overlay for Dots & Interaction (Perfect Circles) -->
        <div class="absolute inset-0 w-full h-full pointer-events-none">
            {#each chartData as d, i}
                {@const cx = getX(i)}
                {@const cy = getY(d.percentage)}

                <!-- Interactive Hover Bar (Pointer Events Enabled) -->
                <div
                    class="absolute top-0 h-full -translate-x-1/2 cursor-pointer pointer-events-auto z-10"
                    style="left: {cx}%; width: 15%;"
                    role="graphics-symbol"
                    aria-label={`Data point for ${d.dayName}: ${Math.round(d.percentage)}%`}
                    onmouseenter={() => (hoveredIndex = i)}
                    onmouseleave={() => (hoveredIndex = null)}
                ></div>

                <!-- Visual Dot (HTML div for perfect circle) -->
                <div
                    class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 bg-[var(--color-primary)]"
                    style="
                        left: {cx}%; 
                        top: {cy}%; 
                        width: {hoveredIndex === i ? '6px' : '4px'}; 
                        height: {hoveredIndex === i ? '6px' : '4px'};
                    "
                ></div>
            {/each}
        </div>

        <!-- Tooltip Overlay (Absolute positioned relative to container) -->
        {#if hoveredIndex !== null}
            {@const data = chartData[hoveredIndex]}
            {@const xPercent = (hoveredIndex / (daysCount - 1)) * 100}

            <div
                class="absolute bottom-full left-0 mb-2 bg-[#1A1A1A] border border-neutral-800 px-3 py-2 rounded-lg shadow-xl text-xs z-20 pointer-events-none transition-all transform -translate-x-1/2"
                style="left: {xPercent}%;"
                transition:fade={{ duration: 150 }}
            >
                <div class="font-bold text-white mb-0.5 whitespace-nowrap">
                    {data.dayName}
                </div>
                <div class="text-primary font-mono">
                    {Math.round(data.percentage)}%
                </div>
                <div class="text-[10px] text-gray-400 whitespace-nowrap">
                    {data.completedCount}/{data.totalHabits} done
                </div>

                <!-- Tiny arrow -->
                <div
                    class="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1A1A1A]"
                ></div>
            </div>
        {/if}
    </div>

    {#if showLabels}
        <div class="flex justify-between mt-2 px-1">
            {#each chartData as d}
                <div
                    class="text-[10px] text-muted font-medium w-6 text-center opacity-60"
                >
                    <span class="md:hidden">{d.dayNameNarrow}</span>
                    <span class="hidden md:inline">{d.dayName}</span>
                </div>
            {/each}
        </div>
    {/if}
</div>
