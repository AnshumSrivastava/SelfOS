<script lang="ts">
    import { X, Save, Trash2, Folder, ArrowLeft, Hash } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { notesStore, type Note } from "$lib/stores/notes.svelte";

    let { isOpen = $bindable(false), note = $bindable(null) } = $props<{
        isOpen: boolean;
        note: Note | null;
    }>();

    let title = $state("");
    let content = $state("");
    let tags = $state<string[]>([]);
    let newTag = $state("");

    $effect(() => {
        if (isOpen && note) {
            title = note.title;
            content = note.content || "";
            tags = note.tags || [];
        } else if (isOpen && !note) {
            title = "";
            content = "";
            tags = [];
        }
    });

    function saveNote() {
        if (!title.trim() && !content.trim()) {
            close();
            return;
        }

        let finalTitle = title.trim() || "Untitled Note";

        if (note) {
            notesStore.updateNote(note.id, {
                title: finalTitle,
                content,
                tags,
            });
        } else {
            notesStore.addNote({
                title: finalTitle,
                content,
                tags,
            });
        }
        close();
    }

    function deleteNote() {
        if (note) {
            notesStore.deleteNote(note.id);
            close();
        }
    }

    function close() {
        isOpen = false;
        setTimeout(() => {
            note = null;
            title = "";
            content = "";
            tags = [];
            newTag = "";
        }, 300);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            saveNote();
        }
    }

    function addTag(e: KeyboardEvent) {
        if ((e.key === "Enter" || e.key === " ") && newTag.trim()) {
            e.preventDefault();
            const tag = newTag.trim().replace(/^#/, "");
            if (!tags.includes(tag)) {
                tags = [...tags, tag];
            }
            newTag = "";
        }
    }

    function removeTag(tagToRemove: string) {
        tags = tags.filter((t) => t !== tagToRemove);
    }
</script>

<svelte:window onkeydown={isOpen ? handleKeydown : undefined} />

{#if isOpen}
    <div
        class="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col"
        transition:fly={{ y: 20, duration: 300 }}
    >
        <!-- Minimal Header -->
        <div
            class="flex items-center justify-between p-4 shrink-0 transition-opacity duration-200 opacity-50 hover:opacity-100 group"
        >
            <div class="flex items-center gap-3">
                <button
                    onclick={saveNote}
                    class="p-2 -ml-2 rounded-full hover:bg-neutral-800 text-gray-400 hover:text-white transition-colors"
                    title="Save & Close (Esc)"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div
                class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {#if note}
                    <button
                        class="p-2 text-red-900/50 hover:bg-red-900/80 hover:text-red-200 rounded-lg transition-colors"
                        onclick={deleteNote}
                        title="Delete note"
                    >
                        <Trash2 size={18} />
                    </button>
                {/if}
            </div>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto">
            <div class="max-w-3xl mx-auto p-6 md:p-12 space-y-6">
                <!-- Title -->
                <input
                    type="text"
                    bind:value={title}
                    placeholder="Untitled Note"
                    class="w-full bg-transparent text-4xl md:text-5xl font-bold text-white placeholder:text-neutral-800 focus:outline-none"
                    autofocus
                />

                <!-- Tags Input -->
                <div class="flex flex-wrap items-center gap-2 min-h-[32px]">
                    {#each tags as tag}
                        <span
                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 group"
                        >
                            #{tag}
                            <button
                                onclick={() => removeTag(tag)}
                                class="group-hover:text-white text-transparent transition-colors"
                                ><X size={12} /></button
                            >
                        </span>
                    {/each}
                    <div class="relative flex items-center">
                        <Hash
                            size={14}
                            class="absolute left-0 text-neutral-600 pointer-events-none"
                        />
                        <input
                            type="text"
                            bind:value={newTag}
                            onkeydown={addTag}
                            placeholder="Add tag..."
                            class="bg-transparent text-sm text-neutral-400 placeholder:text-neutral-700 focus:outline-none pl-5 w-32 focus:w-48 transition-all"
                        />
                    </div>
                </div>

                <!-- Editor -->
                <textarea
                    bind:value={content}
                    placeholder="Start writing..."
                    class="w-full min-h-[calc(100vh-300px)] bg-transparent text-lg text-gray-300 resize-none focus:outline-none leading-relaxed placeholder:text-neutral-800 font-light"
                ></textarea>
            </div>
        </div>
    </div>
{/if}
