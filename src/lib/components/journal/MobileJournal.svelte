<script>
    import { PenTool, Smile, Cloud, Sun, Plus } from "lucide-svelte";

    const journals = [
        {
            date: "Today",
            mood: "Great",
            title: "Productive Start",
            preview: "Managed to get the auth system working perfectly...",
        },
        {
            date: "Yesterday",
            mood: "Okay",
            title: "A bit slow",
            preview: "Had trouble focusing in the afternoon...",
        },
    ];
</script>

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Journal</h1>
        <button
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Mood Selector -->
    <div class="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {#each ["Angry", "Sad", "Neutral", "Good", "Great"] as mood}
            <button class="flex flex-col items-center gap-2 min-w-[60px]">
                <div
                    class="w-12 h-12 rounded-full border border-neutral-800 bg-[#0A0A0A] flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors"
                >
                    <Smile size={20} />
                </div>
                <span class="text-[10px] text-gray-500">{mood}</span>
            </button>
        {/each}
    </div>

    <!-- Entries -->
    <div class="space-y-4">
        {#each journals as entry}
            <div
                class="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-900 group active:scale-[0.98] transition-all"
            >
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold text-emerald-500"
                        >{entry.date}</span
                    >
                    <Smile size={14} class="text-gray-400" />
                </div>
                <h3 class="text-white font-medium mb-1">{entry.title}</h3>
                <p class="text-sm text-gray-500 line-clamp-2">
                    {entry.preview}
                </p>
            </div>
        {/each}
    </div>
</div>
