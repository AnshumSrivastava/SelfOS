<script>
    import { Search, Plus, Folder } from "lucide-svelte";

    const notes = [
        { title: "Project Ideas 2026", folder: "Work", date: "2h ago" },
        {
            title: "Book Summary: Atomic Habits",
            folder: "Learning",
            date: "Yesterday",
        },
    ];

    const folders = ["All", "Work", "Personal", "Learning"];
</script>

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Notes</h1>
        <button
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Search -->
    <div class="relative">
        <Search
            size={18}
            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
            type="text"
            placeholder="Search..."
            class="w-full bg-[#0A0A0A] border border-neutral-900 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors placeholder:text-gray-600"
        />
    </div>

    <!-- Folders -->
    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {#each folders as f}
            <button
                class="px-4 py-2 rounded-full border border-neutral-800 text-sm font-medium text-gray-400 whitespace-nowrap {f ===
                'All'
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-900'}"
            >
                {f}
            </button>
        {/each}
    </div>

    <!-- Note List -->
    <div class="grid grid-cols-2 gap-3">
        {#each notes as note}
            <div
                class="p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex flex-col justify-between aspect-square"
            >
                <div>
                    <Folder size={16} class="text-gray-500 mb-2" />
                    <h3 class="font-medium text-white line-clamp-3">
                        {note.title}
                    </h3>
                </div>
                <div class="flex justify-between items-end mt-2">
                    <span class="text-[10px] text-gray-500">{note.folder}</span>
                    <span class="text-[10px] text-gray-600">{note.date}</span>
                </div>
            </div>
        {/each}
        <div
            class="p-4 rounded-2xl border border-dashed border-neutral-800 flex flex-col items-center justify-center aspect-square text-gray-600"
        >
            <Plus size={24} />
            <span class="text-xs mt-2">New Note</span>
        </div>
    </div>
</div>
