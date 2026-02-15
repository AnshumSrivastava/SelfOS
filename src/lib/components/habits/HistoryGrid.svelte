<script lang="ts">
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { fade } from "svelte/transition";

    let { weeks = 8 } = $props();

    let daysCount = $derived(weeks * 7);
    const now = new Date();

    // Generate grid data derived from habitsStore
    let gridData = $derived.by(() => {
        const data = [];
        const count = daysCount; // Use the derived value
        for (let i = count - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];

            const totalHabits = habitsStore.totalCount;
            const completedCount = habitsStore.habits.filter((h) =>
                (h.completedDates || []).includes(dateStr),
            ).length;
            const percentage =
                totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;

            data.push({
                dateStr,
                percentage,
                completedCount,
                totalHabits,
                dayOfWeek: d.getDay(),
            });
        }
        return data;
    });

    function getColorClass(percentage: number) {
        if (percentage === 0) return "bg-surface border-line";
        if (percentage <= 25) return "bg-primary/20 border-primary/30";
        if (percentage <= 50) return "bg-primary/40 border-primary/50";
        if (percentage <= 75) return "bg-primary/70 border-primary/80";
        return "bg-primary border-primary";
    }

    let hoveredDate = $state<string | null>(null);
</script>

<div class="space-y-4">
    <div class="flex justify-between items-center text-xs text-muted">
        <span>Consistency (Last {weeks} weeks)</span>
        <div class="flex items-center gap-1">
            <span>Less</span>
            <div class="flex gap-1">
                <div class="w-2.5 h-2.5 rounded-[2px] bg-surface"></div>
                <div class="w-2.5 h-2.5 rounded-[2px] bg-primary/30"></div>
                <div class="w-2.5 h-2.5 rounded-[2px] bg-primary/60"></div>
                <div class="w-2.5 h-2.5 rounded-[2px] bg-primary"></div>
            </div>
            <span>More</span>
        </div>
    </div>

    <div
        class="grid grid-flow-col grid-rows-7 gap-1.5 auto-cols-max"
        role="grid"
        aria-label="Habit completion history"
    >
        {#each gridData as day}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <div
                class="w-3 h-3 rounded-[2px] border transition-all duration-300 {getColorClass(
                    day.percentage,
                )} {hoveredDate === day.dateStr
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : ''}"
                onmouseover={() => (hoveredDate = day.dateStr)}
                onmouseout={() => (hoveredDate = null)}
                role="gridcell"
                tabindex="0"
                aria-label={`${day.dateStr}: ${Math.round(day.percentage)}% (${day.completedCount}/${day.totalHabits})`}
                title={`${day.dateStr}: ${Math.round(day.percentage)}% (${day.completedCount}/${day.totalHabits})`}
            ></div>
        {/each}
    </div>

    {#if hoveredDate}
        {@const hoveredItem = gridData.find((d) => d.dateStr === hoveredDate)}
        {#if hoveredItem}
            <div
                class="text-[10px] text-muted animate-in fade-in slide-in-from-top-1 duration-200"
            >
                <span class="font-bold text-white"
                    >{new Date(hoveredItem.dateStr).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                    )}</span
                >
                — {Math.round(hoveredItem.percentage)}% completed ({hoveredItem.completedCount}/{hoveredItem.totalHabits})
            </div>
        {/if}
    {:else}
        <div class="text-[10px] text-muted opacity-0">Placeholder</div>
    {/if}
</div>
