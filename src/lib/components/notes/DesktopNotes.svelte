<script>
    import { Folder, FileText, Search, Plus, Grid, List } from "lucide-svelte";

    const notes = [
        {
            title: "Project Ideas 2026",
            folder: "Work",
            type: "note",
            date: "2h ago",
        },
        {
            title: "Book Summary: Atomic Habits",
            folder: "Learning",
            type: "note",
            date: "Yesterday",
        },
        {
            title: "Travel Itinerary: Japan",
            folder: "Personal",
            type: "note",
            date: "Oct 5",
        },
        {
            title: "Meeting Notes: Q4 Strategy",
            folder: "Work",
            type: "note",
            date: "Oct 2",
        },
        {
            title: "React vs Svelte",
            folder: "Tech",
            type: "note",
            date: "Sep 28",
        },
        {
            folder: "Journal",
            type: "note",
            date: "Sep 25",
        },
        {
            title: "Call insurance about renewal",
            folder: "Calls / Emails",
            type: "note",
            date: "Today",
        },
        {
            title: "Plan for Tomorrow",
            folder: "Tomorrow",
            type: "note",
            date: "Today",
        },
    ];

    const folders = [
        "All Notes",
        "Work",
        "Personal",
        "Calls / Emails",
        "Tomorrow",
        "Learning",
        "Tech",
        "Journal",
    ];
</script>

<div class="space-y-8 pb-12">
    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-3xl font-bold text-white mb-2">Notebook</h1>
            <p class="text-muted">Second Brain & Knowledge Base.</p>
        </div>

        <div class="flex gap-3">
            <div class="relative">
                <Search
                    size={18}
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                    type="text"
                    placeholder="Search notes..."
                    class="bg-surface border border-line rounded-lg pl-10 pr-4 py-2 text-sm text-white w-64 focus:outline-none focus:border-primary placeholder:text-muted/50"
                />
            </div>
            <button class="btn btn-primary flex items-center gap-2">
                <Plus size={18} /> New Note
            </button>
        </div>
    </div>

    <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        {#each folders as f}
            <button
                class="px-4 py-1.5 rounded-lg text-sm border border-transparent hover:bg-surface hover:text-white transition-colors {f ===
                'All Notes'
                    ? 'bg-surface text-white border-line'
                    : 'text-muted'}"
            >
                {f}
            </button>
        {/each}
    </div>

    <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
        <!-- Quick Add Card -->
        <div
            class="border border-dashed border-line rounded-xl flex flex-col items-center justify-center p-8 text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group h-full min-h-[200px]"
        >
            <Plus
                size={40}
                class="mb-4 group-hover:scale-110 transition-transform"
            />
            <span class="font-medium">Create New Note</span>
        </div>

        {#each notes as note}
            <div
                class="card group cursor-pointer hover:-translate-y-1 transition-transform h-full flex flex-col justify-between min-h-[200px]"
            >
                <div>
                    <div class="flex justify-between items-start mb-4">
                        <Folder
                            size={20}
                            class="text-primary/50 group-hover:text-primary transition-colors"
                        />
                        <span
                            class="text-xs text-muted border border-line px-2 py-1 rounded-full"
                            >{note.folder}</span
                        >
                    </div>
                    <h3
                        class="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-2"
                    >
                        {note.title}
                    </h3>
                    <p class="text-sm text-muted mt-2 line-clamp-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore...
                    </p>
                </div>
                <div
                    class="pt-4 mt-4 border-t border-line/50 flex items-center gap-2 text-xs text-muted"
                >
                    <FileText size={12} />
                    <span>{note.date}</span>
                </div>
            </div>
        {/each}
    </div>
</div>
