<script lang="ts">
    import {
        Folder,
        FileText,
        Search,
        Plus,
        Hash,
        Trash2,
    } from "lucide-svelte";

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
        <div>
            <h1 class="text-3xl font-light text-white">Notes</h1>
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
                    bind:value={searchQuery}
                    placeholder="Search notes..."
                    class="input pl-10 w-64"
                />
            </div>
            <button
                onclick={openNewNote}
                class="btn btn-primary flex items-center gap-2"
            >
                <Plus size={18} /> New Note
            </button>
        </div>
    </div>

    <div class="flex gap-2 overflow-x-auto pb-2">
        {#each filters as f}
            <button
                onclick={() => (selectedFilter = f)}
                class="px-4 py-1.5 rounded-full text-sm border border-line transition-all active:scale-95 {f ===
                selectedFilter
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-surface text-muted border-line hover:text-white hover:border-muted'}"
            >
                {f}
            </button>
        {/each}
    </div>

    <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
        <!-- Quick Add Card -->
        <button
            onclick={openNewNote}
            class="border border-dashed border-line rounded-xl flex flex-col items-center justify-center p-8 text-muted hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group h-full min-h-[200px]"
        >
            <Plus
                size={40}
                class="mb-4 group-hover:scale-110 transition-transform"
            />
            <span class="font-medium">Create New Note</span>
        </button>

        {#each filteredNotes as note (note.id)}
            <div class="relative group h-full">
                <button
                    onclick={() => openNote(note)}
                    class="card-subtle w-full h-full flex flex-col justify-between min-h-[200px] text-left hover:-translate-y-1 transition-transform"
                >
                    <div class="w-full">
                        <div class="flex justify-between items-start mb-4">
                            <Folder
                                size={20}
                                class="text-primary/50 group-hover:text-primary transition-colors"
                            />
                            <span class="text-xs text-muted">{note.date}</span>
                        </div>
                        <h3
                            class="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-2"
                        >
                            {note.title}
                        </h3>
                        <p class="text-sm text-muted mt-2 line-clamp-3">
                            {note.content}
                        </p>
                    </div>
                    <div
                        class="pt-4 mt-4 border-t border-line/50 flex flex-wrap gap-1 w-full min-h-[24px] items-end"
                    >
                        {#if note.tags}
                            {#each note.tags.slice(0, 3) as tag}
                                <span
                                    class="text-[10px] text-muted bg-surface/50 border border-line px-1.5 py-0.5 rounded-md"
                                    >#{tag}</span
                                >
                            {/each}
                            {#if note.tags.length > 3}
                                <span class="text-[10px] text-muted pl-1"
                                    >+{note.tags.length - 3}</span
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
                    class="absolute top-2 right-2 p-2 text-muted hover:text-red-400 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Note"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        {/each}
    </div>
</div>
