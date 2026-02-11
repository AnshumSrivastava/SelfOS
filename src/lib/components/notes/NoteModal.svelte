<script lang="ts">
    import {
        X,
        Save,
        Trash2,
        Folder,
        ArrowLeft,
        Hash,
        Eye,
        EyeOff,
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { notesStore, type Note } from "$lib/stores/notes.svelte";
    import { marked } from "marked";
    import { confirmState } from "$lib/stores/confirm.svelte";

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

    async function deleteNote() {
        if (
            note &&
            (await confirmState.confirm(
                "Delete Note",
                "Are you sure you want to delete this note? This action cannot be undone.",
            ))
        ) {
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
            isPreview = false;
        }, 300);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            saveNote();
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

    function handlePreviewClick(e: MouseEvent) {
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
            const newNote = notesStore.addNote({
                title: targetTitle,
                content: "",
                tags: [],
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

            <div class="flex items-center gap-2">
                <button
                    class="p-2 text-gray-400 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors"
                    onclick={() => (isPreview = !isPreview)}
                    title={isPreview ? "Edit" : "Preview Markdown"}
                >
                    {#if isPreview}
                        <EyeOff size={20} />
                    {:else}
                        <Eye size={20} />
                    {/if}
                </button>

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
                <div
                    class="flex flex-wrap items-center justify-start gap-2 min-h-[32px]"
                >
                    {#each tags as tag}
                        <span
                            class="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-neutral-800 text-white shadow-sm border border-neutral-700/50 group transition-all hover:border-neutral-600"
                        >
                            #{tag}
                            <button
                                onclick={() => removeTag(tag)}
                                class="group-hover:text-red-400 text-transparent transition-colors"
                                ><X size={14} /></button
                            >
                        </span>
                    {/each}
                    <div class="relative flex items-center group/input">
                        <Hash
                            size={14}
                            class="absolute left-2.5 text-neutral-500 pointer-events-none group-focus-within/input:text-primary transition-colors"
                        />
                        <input
                            type="text"
                            bind:value={newTag}
                            onkeydown={addTag}
                            oninput={() => (showSuggestions = true)}
                            onfocus={() => (showSuggestions = true)}
                            onblur={() =>
                                setTimeout(
                                    () => (showSuggestions = false),
                                    200,
                                )}
                            placeholder="Add tag..."
                            class="bg-transparent text-sm text-neutral-300 placeholder:text-neutral-600 focus:outline-none pl-7 w-24 focus:w-32 transition-all border-b border-transparent focus:border-neutral-700 pb-0.5"
                        />

                        {#if showSuggestions && filteredSuggestions.length > 0}
                            <div
                                class="absolute top-full left-0 mt-2 w-48 bg-[#1A1A1A] border border-neutral-800 rounded-lg shadow-xl overflow-hidden z-50"
                            >
                                {#each filteredSuggestions as suggestion}
                                    <button
                                        class="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-2"
                                        onclick={() =>
                                            selectSuggestion(suggestion)}
                                    >
                                        <Hash size={12} class="opacity-50" />
                                        {suggestion}
                                    </button>
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Editor / Preview -->
                {#if isPreview}
                    {#key renderedContent}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div
                            class="prose prose-invert prose-xl max-w-none text-gray-200 leading-relaxed prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-gray-500 pl-4 prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                            onclick={handlePreviewClick}
                        >
                            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                            {@html renderedContent}
                        </div>
                    {/key}
                {:else}
                    <textarea
                        bind:value={content}
                        onkeydown={handleTextareaKeydown}
                        placeholder="Start writing..."
                        class="w-full min-h-[calc(100vh-300px)] bg-transparent text-xl md:text-2xl text-gray-200 resize-none focus:outline-none leading-relaxed placeholder:text-neutral-800"
                    ></textarea>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    /* Force list styles since Tailwind/Typography plugin might be missing or overridden */
    :global(.prose ul) {
        list-style-type: disc !important;
        padding-left: 1.5em !important;
        margin-top: 1em;
        margin-bottom: 1em;
    }
    :global(.prose ol) {
        list-style-type: decimal !important;
        padding-left: 1.5em !important;
        margin-top: 1em;
        margin-bottom: 1em;
    }
    :global(.prose li) {
        margin-bottom: 0.25em;
    }
</style>
