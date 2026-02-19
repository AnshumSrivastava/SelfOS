<script lang="ts">
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import {
        FileText,
        Search,
        Plus,
        Trash2,
        Layers,
        Target,
        Bookmark,
        Archive,
        Clock,
    } from "lucide-svelte";

    import { notesStore, type Note } from "$lib/stores/notes.svelte";
    import NoteModal from "./NoteModal.svelte";
    import { confirmState } from "$lib/stores/confirm.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import { onMount } from "svelte";

    let selectedPARA = $state("All");
    let selectedTag = $state("All");
    let searchQuery = $state("");
    let isModalOpen = $state(false);
    let currentNote = $state<Note | null>(null);

    const paraSections = [
        { id: "All", name: "Collective Archive", icon: Clock },
        { id: "Project", name: "Projects", icon: Target },
        { id: "Area", name: "Areas", icon: Layers },
        { id: "Resource", name: "Resources", icon: Bookmark },
        { id: "Archive", name: "Archives", icon: Archive },
    ];

    onMount(() => {
        notesStore.init();
    });

    let filteredNotes = $derived(
        notesStore.notes.filter((note) => {
            const matchesPARA =
                selectedPARA === "All" || note.folder === selectedPARA;
            const matchesTag =
                selectedTag === "All" || note.tags?.includes(selectedTag);
            const matchesSearch =
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesPARA && matchesTag && matchesSearch;
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

<div class="page-container flex flex-col h-full gap-8">
    <PageHeader
        title="Knowledge Base"
        subtitle="Continuous synthesis and archival."
    >
        <div class="flex items-center gap-4">
            <div class="relative">
                <Search
                    size={14}
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-muted/40"
                />
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search the archive..."
                    class="bg-white/5 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white w-64 focus:outline-none focus:border-primary/30 transition-all placeholder:text-muted/20"
                />
            </div>
            <button
                onclick={openNewNote}
                class="btn btn-primary px-6 h-[46px] flex items-center gap-2"
            >
                <Plus size={18} /> New Insight
            </button>
        </div>
    </PageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
        <!-- Sidebar Navigation -->
        <div class="space-y-8 sticky top-8">
            <div class="space-y-2">
                <h4
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2 mb-4"
                >
                    PARA Framework
                </h4>
                <div class="flex flex-col gap-1">
                    {#each paraSections as section}
                        {@const Icon = section.icon}
                        <button
                            onclick={() => (selectedPARA = section.id)}
                            class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group {selectedPARA ===
                            section.id
                                ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20'
                                : 'text-muted hover:bg-white/5 hover:text-white'}"
                        >
                            <Icon
                                size={16}
                                class={selectedPARA === section.id
                                    ? "text-black"
                                    : "text-primary"}
                            />
                            <span class="text-xs uppercase tracking-widest"
                                >{section.name}</span
                            >
                        </button>
                    {/each}
                </div>
            </div>

            <div class="space-y-4">
                <h4
                    class="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2"
                >
                    Contextual Tags
                </h4>
                <div class="flex flex-wrap gap-2 px-1">
                    {#each notesStore.allTags as tag}
                        <button
                            onclick={() => (selectedTag = tag)}
                            class="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all {selectedTag ===
                            tag
                                ? 'bg-white text-black border-white'
                                : 'bg-white/5 text-muted border border-white/5 hover:border-primary/30'}"
                        >
                            #{tag}
                        </button>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="flex-1 space-y-6">
            {#if notesStore.loading}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {#each Array(4) as _}
                        <div
                            class="card-subtle p-8 bg-white/5 rounded-3xl border border-white/5"
                        >
                            <SkeletonLoader lines={3} />
                        </div>
                    {/each}
                </div>
            {:else}
                <div
                    class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6"
                >
                    <!-- Quick Add Card -->
                    <button
                        onclick={openNewNote}
                        class="group flex flex-col items-center justify-center p-8 rounded-3xl border border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all min-h-[220px]"
                    >
                        <div
                            class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all mb-4"
                        >
                            <Plus size={24} />
                        </div>
                        <span
                            class="text-[10px] font-black text-muted uppercase tracking-[0.2em] group-hover:text-primary transition-colors"
                            >Capture New Insight</span
                        >
                    </button>

                    {#each filteredNotes as note (note.id)}
                        <div class="relative group h-full">
                            <button
                                onclick={() => openNote(note)}
                                class="w-full h-full flex flex-col justify-between p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 hover:-translate-y-1 transition-all text-left group/card"
                            >
                                <div class="space-y-4">
                                    <div
                                        class="flex justify-between items-start"
                                    >
                                        <div
                                            class="px-2 py-1 rounded-md bg-primary/10 text-primary text-[8px] font-black uppercase tracking-[0.2em]"
                                        >
                                            {note.folder || "General"}
                                        </div>
                                        <span
                                            class="text-[9px] font-bold text-muted/30 uppercase tracking-widest"
                                        >
                                            {note.createdAt
                                                ? new Date(
                                                      note.createdAt,
                                                  ).toLocaleDateString(
                                                      undefined,
                                                      {
                                                          month: "short",
                                                          day: "numeric",
                                                      },
                                                  )
                                                : "DRAFT"}
                                        </span>
                                    </div>
                                    <h3
                                        class="text-lg font-light text-theme-text-strong tracking-tight line-clamp-2 group-hover/card:text-primary transition-colors"
                                    >
                                        {note.title}
                                    </h3>
                                    <p
                                        class="text-xs text-muted leading-relaxed line-clamp-3 opacity-60"
                                    >
                                        {note.content}
                                    </p>
                                </div>

                                <div
                                    class="pt-6 mt-6 border-t border-white/5 flex flex-wrap gap-2"
                                >
                                    {#each (note.tags || []).slice(0, 3) as tag}
                                        <span
                                            class="text-[9px] font-black uppercase tracking-widest text-muted/40"
                                            >#{tag}</span
                                        >
                                    {/each}
                                </div>
                            </button>
                            <button
                                onclick={async (e) => {
                                    e.stopPropagation();
                                    if (
                                        await confirmState.confirm(
                                            "Purge Insight",
                                            "Are you sure you want to remove this from the archive?",
                                        )
                                    ) {
                                        notesStore.deleteNote(note.id);
                                    }
                                }}
                                class="absolute top-4 right-4 p-2 text-muted/20 hover:text-red-400 bg-black/40 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-white/5"
                                title="Delete Insight"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
