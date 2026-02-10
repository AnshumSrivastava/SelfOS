<script lang="ts">
    import { Search, Plus, Folder } from "lucide-svelte";
    import { notesStore, type Note } from "$lib/stores/notes.svelte";
    import NoteModal from "./NoteModal.svelte";

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

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Notes</h1>
        <button
            onclick={openNewNote}
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
            bind:value={searchQuery}
            placeholder="Search..."
            class="w-full bg-[#0A0A0A] border border-neutral-900 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-white/20 transition-colors placeholder:text-gray-600"
        />
    </div>

    <!-- Filters -->
    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {#each filters as f}
            <button
                onclick={() => (selectedFilter = f)}
                class="px-4 py-2 rounded-full border border-neutral-800 text-sm font-medium whitespace-nowrap {f ===
                selectedFilter
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-900 text-gray-400'}"
            >
                {f}
            </button>
        {/each}
    </div>

    <!-- Note List -->
    <div class="grid grid-cols-2 gap-3">
        <button
            onclick={openNewNote}
            class="p-4 rounded-2xl border border-dashed border-neutral-800 flex flex-col items-center justify-center aspect-square text-gray-600 active:scale-95 transition-transform"
        >
            <Plus size={24} />
            <span class="text-xs mt-2">New Note</span>
        </button>

        {#each filteredNotes as note (note.id)}
            <button
                onclick={() => openNote(note)}
                class="p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex flex-col justify-between aspect-square text-left active:scale-95 transition-transform"
            >
                <div class="w-full">
                    <div class="flex justify-between items-start mb-2">
                        <Folder size={16} class="text-gray-500" />
                        <span class="text-[10px] text-gray-600"
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
                                class="text-[9px] text-gray-500 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded-md"
                                >#{tag}</span
                            >
                        {/each}
                        {#if note.tags.length > 2}
                            <span class="text-[9px] text-gray-500 px-1"
                                >+{note.tags.length - 2}</span
                            >
                        {/if}
                    {/if}
                </div>
            </button>
        {/each}
    </div>
</div>
