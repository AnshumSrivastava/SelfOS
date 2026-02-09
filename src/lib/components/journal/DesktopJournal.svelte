<script>
    import {
        PenTool,
        Calendar,
        ChevronLeft,
        ChevronRight,
        Smile,
        Frown,
        Meh,
        Sun,
        Cloud,
        Moon,
    } from "lucide-svelte";

    const journals = [
        {
            date: "Today, Oct 10",
            mood: "Great",
            weather: "Sunny",
            title: "Productive start to the week",
            preview:
                "Managed to get the auth system working perfectly. Felt good about the...",
        },
        {
            date: "Yesterday, Oct 9",
            mood: "Okay",
            weather: "Cloudy",
            title: "A bit slow",
            preview:
                "Had trouble focusing in the afternoon. Need to sleep earlier...",
        },
        {
            date: "Mon, Oct 8",
            mood: "Good",
            weather: "Rainy",
            title: "Weekly Planning",
            preview:
                "Set goals for the upcoming sprint. Excited about the new features...",
        },
    ];
</script>

<div class="space-y-8 pb-12">
    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-3xl font-bold text-white mb-2">Journal</h1>
            <p class="text-muted">Reflect, Learn, Grow.</p>
        </div>
        <button class="btn btn-primary flex items-center gap-2">
            <PenTool size={18} /> New Entry
        </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Calendar / Streak -->
        <div class="space-y-6">
            <div class="card">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-white">October 2026</h3>
                    <div class="flex gap-2">
                        <button class="p-1 hover:bg-white/10 rounded"
                            ><ChevronLeft size={16} /></button
                        >
                        <button class="p-1 hover:bg-white/10 rounded"
                            ><ChevronRight size={16} /></button
                        >
                    </div>
                </div>

                <!-- Mini Calendar Mockup -->
                <div class="grid grid-cols-7 gap-2 text-center text-sm">
                    {#each ["S", "M", "T", "W", "T", "F", "S"] as d}<span
                            class="text-muted text-xs font-bold">{d}</span
                        >{/each}
                    {#each Array(31) as _, i}
                        <div
                            class="aspect-square rounded-full flex items-center justify-center cursor-pointer hover:bg-white/10 {i ===
                            9
                                ? 'bg-primary text-black font-bold'
                                : i < 9
                                  ? 'text-white'
                                  : 'text-muted'}"
                        >
                            {i + 1}
                        </div>
                    {/each}
                </div>
            </div>

            <div class="card bg-surface/50 border-primary/20">
                <h3
                    class="text-sm font-bold text-muted mb-4 uppercase tracking-wider"
                >
                    Mood Tracker
                </h3>
                <div class="flex justify-between px-2">
                    <div class="flex flex-col items-center gap-2">
                        <span
                            class="h-16 w-1.5 bg-background rounded-full overflow-hidden flex items-end"
                        >
                            <span class="w-full bg-green-500 h-[60%]"></span>
                        </span>
                        <Smile size={16} class="text-green-500" />
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <span
                            class="h-16 w-1.5 bg-background rounded-full overflow-hidden flex items-end"
                        >
                            <span class="w-full bg-yellow-500 h-[30%]"></span>
                        </span>
                        <Meh size={16} class="text-yellow-500" />
                    </div>
                    <div class="flex flex-col items-center gap-2">
                        <span
                            class="h-16 w-1.5 bg-background rounded-full overflow-hidden flex items-end"
                        >
                            <span class="w-full bg-red-500 h-[10%]"></span>
                        </span>
                        <Frown size={16} class="text-red-500" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Entries -->
        <div class="lg:col-span-2 space-y-4">
            {#each journals as entry}
                <div
                    class="card hover:border-primary/50 transition-all cursor-pointer group"
                >
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-bold text-primary"
                                >{entry.date}</span
                            >
                            <span class="w-1 h-1 rounded-full bg-line"></span>
                            <div
                                class="flex items-center gap-1 text-xs text-muted"
                            >
                                {#if entry.weather === "Sunny"}<Sun
                                        size={12}
                                    />{:else}<Cloud size={12} />{/if}
                                {entry.weather}
                            </div>
                        </div>
                        <div
                            class="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-surface border border-line text-white"
                        >
                            {#if entry.mood === "Great"}<Smile
                                    size={12}
                                    class="text-green-500"
                                />{/if}
                            {entry.mood}
                        </div>
                    </div>

                    <h3
                        class="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors"
                    >
                        {entry.title}
                    </h3>
                    <p class="text-muted text-sm line-clamp-2">
                        {entry.preview}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</div>
