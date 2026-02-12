<script lang="ts">
    import { Search, Plus, Folder, Trash2 } from "lucide-svelte";

    import { notesStore, type Note } from "$lib/stores/notes.svelte";
    import NoteModal from "./NoteModal.svelte";
    import { confirmState } from "$lib/stores/confirm.svelte";

    let selectedFilter = $state("All");
    let searchQuery = $state("");
    let isModalOpen = $state(false);
    let currentNote = $state<Note | null>(null);

    let filters = $derived(notesStore.allTags);

    let filteredNotes = $derived(
        notesStore.notes.filter((note) => {
            const matchesFilter =
                selectedFilter === "All" || note.tags?.includes(selectedFilter);

            const matchesSearch =
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        }),
    );

    function openNewNote() {
        currentNote = null;
        isModalOpen = true;
    }

    function openNote(note: Note) {
        currentNote = note;
        isModalOpen = true;
    }
</script>

<NoteModal bind:isOpen={isModalOpen} bind:note={currentNote} />

<div class="page-container relative">
    <div class="module-header">
        <h1 class="text-3xl font-light text-white">Notes</h1>
        <button
            onclick={openNewNote}
            class="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Search -->
    <div class="relative">
        <Search
            size={18}
            class="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search..."
            class="input w-full pl-11"
        />
    </div>

    <!-- Filters -->
    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {#each filters as f}
            <button
                onclick={() => (selectedFilter = f)}
                class="px-4 py-1.5 rounded-full border border-line text-sm font-medium whitespace-nowrap transition-all active:scale-95 {f ===
                selectedFilter
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-surface text-muted'}"
            >
                {f}
            </button>
        {/each}
    </div>

    <!-- Note List -->
    <div class="grid grid-cols-2 gap-3">
        <button
            onclick={openNewNote}
            class="card-subtle flex flex-col items-center justify-center aspect-square text-muted border-dashed border-line active:scale-95 transition-transform"
        >
            <Plus size={24} />
            <span class="text-xs mt-2">New Note</span>
        </button>

        {#each filteredNotes as note (note.id)}
            <div class="relative group">
                <button
                    onclick={() => openNote(note)}
                    class="card-subtle flex flex-col justify-between aspect-square text-left w-full h-full active:scale-95 transition-transform"
                >
                    <div class="w-full">
                        <div class="flex justify-between items-start mb-2">
                            <Folder size={16} class="text-muted" />
                            <span class="text-[10px] text-muted"
                                >{note.date}</span
                            >
                        </div>
                        <h3
                            class="font-medium text-white line-clamp-3 leading-tight"
                        >
                            {note.title}
                        </h3>
                    </div>

                    <div class="flex flex-wrap gap-1 mt-auto w-full">
                        {#if note.tags && note.tags.length > 0}
                            {#each note.tags.slice(0, 2) as tag}
                                <span
                                    class="text-[9px] text-muted bg-surface/50 border border-line px-1.5 py-0.5 rounded-md"
                                    >#{tag}</span
                                >
                            {/each}
                            {#if note.tags.length > 2}
                                <span class="text-[9px] text-muted px-1"
                                    >+{note.tags.length - 2}</span
                                >
                            {/if}
                        {/if}
                    </div>
                </button>
                <button
                    onclick={async (e) => {
                        e.stopPropagation();
                        if (
                            await confirmState.confirm(
                                "Delete Note",
                                "Are you sure you want to delete this note?",
                            )
                        ) {
                            notesStore.deleteNote(note.id);
                        }
                    }}
                    class="absolute top-2 right-2 p-2 text-muted hover:text-red-400 z-10"
                    title="Delete Note"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        {/each}
    </div>
</div>
