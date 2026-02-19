<script lang="ts">
    import { Save, Trash2, Folder, Hash, Eye, EyeOff, X } from "lucide-svelte";
    import { notesStore, type Note } from "$lib/stores/notes.svelte";
    import { marked } from "marked";
    import { confirmState } from "$lib/stores/confirm.svelte";
    import Modal from "$lib/components/ui/Modal.svelte";

    let { isOpen = $bindable(false), note = $bindable(null) } = $props<{
        isOpen: boolean;
        note: Note | null;
    }>();

    let title = $state("");
    let content = $state("");
    let tags = $state<string[]>([]);
    let newTag = $state("");
    let isPreview = $state(false);
    let renderedContent = $derived(parseContent(content));

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
            isOpen = false;
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
                folder: "General",
                isFavorite: false,
            });
        }
        isOpen = false;
    }

    async function deleteNote() {
        if (
            note &&
            (await confirmState.confirm(
                "Delete Note",
                "Are you sure you want to delete this note? This action cannot be undone.",
            ))
        ) {
            notesStore.deleteNote(note.id);
            isOpen = false;
        }
    }

    let showSuggestions = $state(false);

    // Filter suggestions based on input, exclude already added tags
    let filteredSuggestions = $derived(
        notesStore.allTags
            .filter((t) => t !== "All" && !tags.includes(t))
            .filter((t) => t.toLowerCase().includes(newTag.toLowerCase()))
            .slice(0, 5),
    );

    function addTag(e: KeyboardEvent) {
        if ((e.key === "Enter" || e.key === " ") && newTag.trim()) {
            e.preventDefault();
            const tag = newTag.trim().replace(/^#/, "").toLowerCase();
            if (!tags.includes(tag)) {
                tags = [...tags, tag];
            }
            newTag = "";
            showSuggestions = false;
        }
    }

    function selectSuggestion(tag: string) {
        if (!tags.includes(tag)) {
            tags = [...tags, tag];
        }
        newTag = "";
        showSuggestions = false;
    }

    function parseContent(markdown: string) {
        if (typeof markdown !== "string") return "";

        // Obsidian Style Links: [[Link Name]] or [[Link Name|Display Text]]
        const wikiLinkRegex = /\[\[(.*?)(?:\|(.*?))?\]\]/g;

        const processedMarkdown = markdown.replace(
            wikiLinkRegex,
            (match, linkName, displayText) => {
                const cleanName = linkName.trim();
                const display = displayText ? displayText.trim() : cleanName;
                return `<a href="#" class="internal-link text-primary hover:underline" data-note-title="${cleanName}">${display}</a>`;
            },
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (marked as any).parse(processedMarkdown, {
            gfm: true,
            breaks: true,
        });
    }

    async function handlePreviewClick(e: MouseEvent | KeyboardEvent) {
        const target = e.target as HTMLElement;
        const link = target.closest(".internal-link") as HTMLElement;
        if (!link) return;

        e.preventDefault();
        e.stopPropagation();

        const targetTitle = link.dataset.noteTitle;
        if (!targetTitle) return;

        const existingNote = notesStore.notes.find(
            (n) => n.title.toLowerCase() === targetTitle.toLowerCase(),
        );

        if (existingNote) {
            note = existingNote;
        } else {
            // Create new note
            const newNote = await notesStore.addNote({
                title: targetTitle,
                content: "",
                tags: [],
                folder: "General",
                isFavorite: false,
            });
            note = newNote;
        }
    }

    function removeTag(tagToRemove: string) {
        tags = tags.filter((t) => t !== tagToRemove);
    }

    function handleTextareaKeydown(
        e: KeyboardEvent & { currentTarget: HTMLTextAreaElement },
    ) {
        if (e.key === "Tab") {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            content =
                content.substring(0, start) + "\t" + content.substring(end);
            // Move cursor
            setTimeout(() => {
                e.currentTarget.selectionStart = e.currentTarget.selectionEnd =
                    start + 1;
            }, 0);
        }

        if (e.key === "Enter") {
            const start = e.currentTarget.selectionStart;
            const textUpToCursor = content.substring(0, start);
            const lineStart = textUpToCursor.lastIndexOf("\n") + 1;
            const currentLine = textUpToCursor.substring(lineStart);

            const unorderedMatch = currentLine.match(/^(\s*)- /);
            const orderedMatch = currentLine.match(/^(\s*)(\d+)\. /);

            if (unorderedMatch) {
                e.preventDefault();
                const indent = unorderedMatch[1];
                // If line is just the bullet, remove it (end list)
                if (currentLine.trim() === "-") {
                    content =
                        content.substring(0, lineStart) +
                        content.substring(start);
                    return;
                }

                const insert = `\n${indent}- `;
                content =
                    content.substring(0, start) +
                    insert +
                    content.substring(start);

                setTimeout(() => {
                    const newPos = start + insert.length;
                    e.currentTarget.selectionStart =
                        e.currentTarget.selectionEnd = newPos;
                }, 0);
            } else if (orderedMatch) {
                e.preventDefault();
                const indent = orderedMatch[1];
                const num = parseInt(orderedMatch[2], 10);

                // If line is just the number, remove it (end list)
                if (currentLine.trim() === `${num}.`) {
                    content =
                        content.substring(0, lineStart) +
                        content.substring(start);
                    return;
                }

                const insert = `\n${indent}${num + 1}. `;
                content =
                    content.substring(0, start) +
                    insert +
                    content.substring(start);
                setTimeout(() => {
                    const newPos = start + insert.length;
                    e.currentTarget.selectionStart =
                        e.currentTarget.selectionEnd = newPos;
                }, 0);
            }
        }
    }
</script>

<Modal bind:isOpen title={note ? "Refine Note" : "Capture Insight"} size="lg">
    <div class="space-y-6">
        <!-- Header Actions -->
        <div
            class="flex items-center justify-between pb-4 border-b border-white/5"
        >
            <div class="flex items-center gap-3">
                <button
                    class="p-2 rounded-xl bg-white/5 text-muted hover:text-white transition-colors"
                    onclick={() => (isPreview = !isPreview)}
                    title={isPreview ? "Edit" : "Preview Markdown"}
                >
                    {#if isPreview}
                        <EyeOff size={18} />
                    {:else}
                        <Eye size={18} />
                    {/if}
                </button>
            </div>

            <div class="flex items-center gap-2">
                {#if note}
                    <button
                        class="p-2 text-muted hover:text-red-400 rounded-xl transition-colors"
                        onclick={deleteNote}
                        title="Delete note"
                    >
                        <Trash2 size={18} />
                    </button>
                {/if}
                <button
                    onclick={saveNote}
                    class="btn btn-primary px-6 h-10 flex items-center gap-2"
                >
                    <Save size={16} /> Archive
                </button>
            </div>
        </div>

        <div class="space-y-6">
            <!-- Title -->
            <input
                type="text"
                bind:value={title}
                placeholder="Untitled Thought"
                class="w-full bg-transparent text-3xl font-light text-theme-text-strong tracking-tighter placeholder:text-muted/20 focus:outline-none"
            />

            <!-- Tags -->
            <div class="flex flex-wrap items-center gap-2 min-h-[32px]">
                {#each tags as tag}
                    <span
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white/5 text-muted border border-white/5 hover:border-primary/30 transition-all"
                    >
                        #{tag}
                        <button
                            onclick={() => removeTag(tag)}
                            class="hover:text-red-400 transition-colors"
                            ><X size={12} /></button
                        >
                    </span>
                {/each}
                <div class="relative flex items-center group/input">
                    <Hash
                        size={12}
                        class="absolute left-3 text-muted/40 pointer-events-none group-focus-within/input:text-primary transition-colors"
                    />
                    <input
                        type="text"
                        bind:value={newTag}
                        onkeydown={addTag}
                        oninput={() => (showSuggestions = true)}
                        onfocus={() => (showSuggestions = true)}
                        onblur={() =>
                            setTimeout(() => (showSuggestions = false), 200)}
                        placeholder="Tag context..."
                        class="bg-transparent text-[10px] font-bold text-muted placeholder:text-muted/20 focus:outline-none pl-8 w-24 focus:w-32 transition-all"
                    />

                    {#if showSuggestions && filteredSuggestions.length > 0}
                        <div
                            class="absolute top-full left-0 mt-3 w-48 bg-[#151515] border border-white/5 rounded-xl shadow-2xl overflow-hidden z-50 p-1"
                        >
                            {#each filteredSuggestions as suggestion}
                                <button
                                    class="w-full text-left px-3 py-2 text-[10px] font-bold text-muted uppercase tracking-widest hover:bg-primary hover:text-black rounded-lg transition-all flex items-center gap-2"
                                    onclick={() => selectSuggestion(suggestion)}
                                >
                                    <Hash size={10} />
                                    {suggestion}
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Editor -->
            <div class="min-h-[400px]">
                {#if isPreview}
                    <div
                        class="prose prose-invert prose-lg max-w-none text-muted leading-relaxed prose-a:text-primary"
                        onclick={handlePreviewClick}
                        onkeydown={(e) =>
                            e.key === "Enter" && handlePreviewClick(e as any)}
                        role="button"
                        tabindex="0"
                    >
                        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                        {@html renderedContent}
                    </div>
                {:else}
                    <textarea
                        bind:value={content}
                        onkeydown={handleTextareaKeydown}
                        placeholder="Deep dive into the architecture of this idea..."
                        class="w-full min-h-[400px] bg-transparent text-lg text-theme-text-strong font-light resize-none focus:outline-none leading-relaxed placeholder:text-muted/10 custom-scrollbar"
                    ></textarea>
                {/if}
            </div>
        </div>
    </div>
</Modal>

<style>
    /* Force list styles since Tailwind/Typography plugin might be missing or overridden */
    :global(.prose ul) {
        list-style-type: disc !important;
        padding-left: 1.5em !important;
    }
    :global(.prose ol) {
        list-style-type: decimal !important;
        padding-left: 1.5em !important;
    }
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 2px;
    }
</style>
