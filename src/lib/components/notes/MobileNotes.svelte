<script lang="ts">
    import {
        Search,
        Folder,
        Trash2,
        ArrowLeft,
        Share2,
        MoreVertical,
        FileText,
    } from "lucide-svelte";

    import { notesStore, type Note } from "$lib/stores/notes.svelte";
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import FloatingActionButton from "$lib/components/mobile/FloatingActionButton.svelte";
    import { confirmState } from "$lib/stores/confirm.svelte";
    import { generateUUID } from "$lib/utils/uuid";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";

    let searchQuery = $state("");
    let selectedTag = $state<string | null>(null);
    let isEditing = $state(false);
    let currentNote = $state<Note | null>(null); // Replace 'any' with Note type

    let filteredNotes = $derived(
        notesStore.notes.filter((note) => {
            const matchesSearch =
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTag = selectedTag
                ? note.tags.includes(selectedTag)
                : true;
            return matchesSearch && matchesTag;
        }),
    );

    const allTags = $derived(
        Array.from(new Set(notesStore.notes.flatMap((n) => n.tags))),
    );

    function openNote(note: Note) {
        currentNote = note;
        isEditing = true;
    }

    function createNote() {
        currentNote = {
            id: generateUUID(),
            title: "",
            content: "",
            tags: [],
            updatedAt: new Date().toISOString(),
            folder: "General",
            isFavorite: false,
        };
        isEditing = true;
    }
</script>

<div class="page-container h-full relative pb-24">
    <MobileHeader title="Notes" />

    <FloatingActionButton onclick={createNote} ariaLabel="New Note" />

    {#if isEditing && currentNote}
        <div
            class="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom duration-300"
        >
            <div
                class="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-10"
            >
                <button
                    onclick={() => (isEditing = false)}
                    class="p-2 -ml-2 text-muted hover:text-white"
                >
                    <ArrowLeft size={20} />
                </button>
                <div class="flex gap-4">
                    <button class="text-muted hover:text-white">
                        <Share2 size={18} />
                    </button>
                    <button class="text-muted hover:text-white">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-6">
                <input
                    type="text"
                    bind:value={currentNote.title}
                    placeholder="Title"
                    class="w-full bg-transparent text-3xl font-bold text-white placeholder:text-muted/30 outline-none mb-4"
                />
                <textarea
                    bind:value={currentNote.content}
                    placeholder="Start typing..."
                    class="w-full h-[calc(100vh-200px)] bg-transparent text-lg text-white/80 placeholder:text-muted/30 outline-none resize-none leading-relaxed font-light"
                ></textarea>
            </div>
        </div>
    {/if}

    <div class="px-6 space-y-6">
        <!-- Search & Filter -->
        <div class="space-y-4">
            <div class="relative">
                <Search
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    size={18}
                />
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search notes..."
                    class="w-full bg-surface/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:bg-surface focus:border-primary/50 outline-none transition-all placeholder:text-muted/50"
                />
            </div>

            {#if allTags.length > 0}
                <div
                    class="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-6 px-6"
                >
                    <button
                        onclick={() => (selectedTag = null)}
                        class="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border {selectedTag ===
                        null
                            ? 'bg-white text-black border-white'
                            : 'bg-transparent text-muted border-white/10 hover:border-white/30'}"
                    >
                        All
                    </button>
                    {#each allTags as tag}
                        <button
                            onclick={() =>
                                (selectedTag =
                                    selectedTag === tag ? null : tag)}
                            class="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border {selectedTag ===
                            tag
                                ? 'bg-primary text-black border-primary'
                                : 'bg-transparent text-muted border-white/10 hover:border-white/30'}"
                        >
                            {tag}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Notes Grid -->
        <div class="grid grid-cols-2 gap-3">
            {#if notesStore.loading}
                {#each Array(6) as _}
                    <div class="card-subtle p-4 h-48 space-y-4">
                        <SkeletonLoader lines={3} />
                    </div>
                {/each}
            {:else}
                {#each filteredNotes as note (note.id)}
                    <button
                        onclick={() => openNote(note)}
                        class="card-subtle p-4 flex flex-col gap-3 text-left group active:scale-[0.98] transition-all h-48 relative overflow-hidden bg-surface/30 backdrop-blur-xl border-white/5"
                    >
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                        ></div>

                        <h3
                            class="font-bold text-white text-base leading-tight line-clamp-2"
                        >
                            {note.title || "Untitled"}
                        </h3>
                        <p
                            class="text-xs text-muted/60 leading-relaxed line-clamp-4 font-normal"
                        >
                            {note.content || "No content"}
                        </p>
                        <div class="mt-auto flex gap-2">
                            {#if note.tags}
                                {#each note.tags.slice(0, 2) as tag}
                                    <span
                                        class="text-[9px] font-bold text-muted/40 uppercase tracking-wider bg-white/5 px-1.5 py-0.5 rounded"
                                        >#{tag}</span
                                    >
                                {/each}
                            {/if}
                        </div>
                    </button>
                {/each}
            {/if}
        </div>

        {#if filteredNotes.length === 0}
            <div
                class="flex flex-col items-center justify-center py-20 text-muted/40 space-y-4"
            >
                <FileText size={48} strokeWidth={1} />
                <p class="text-sm font-medium">No notes found</p>
            </div>
        {/if}
    </div>
</div>
