<script lang="ts">
    import {
        X,
        Trash2,
        BookOpen,
        Send,
        FileText,
        ArrowRight,
        CornerUpRight,
    } from "lucide-svelte";
    import { libraryStore } from "$lib/stores/library.svelte";

    let { bookId, isOpen = $bindable(false) } = $props<{
        bookId: string | null;
        isOpen: boolean;
    }>();

    let book = $derived(
        bookId ? libraryStore.books.find((b) => b.id === bookId) : null,
    );
    let scratchpad = $derived(bookId ? libraryStore.getScratchpad(bookId) : []);

    // Scratchpad
    let scratchpadInput = $state("");

    function submitThought() {
        if (!bookId || !scratchpadInput.trim()) return;
        libraryStore.addToScratchpad(bookId, scratchpadInput.trim());
        scratchpadInput = "";
    }

    function promoteToNote(entryId: string) {
        if (!bookId) return;
        libraryStore.promoteToNote(bookId, entryId);
    }

    function deleteThought(entryId: string) {
        if (!bookId || !confirm("Delete this thought?")) return;
        libraryStore.deleteFromScratchpad(bookId, entryId);
    }

    function deleteBook() {
        if (!bookId || !confirm("Are you sure you want to delete this book?"))
            return;
        libraryStore.deleteBook(bookId);
        isOpen = false;
    }

    function updateStatus(newStatus: any) {
        if (!bookId) return;
        libraryStore.updateBook(bookId, { status: newStatus });
    }
    import Portal from "$lib/components/ui/Portal.svelte";

    $effect(() => {
        if (isOpen) {
            // Push state when opened
            const state = { modalOpen: true, bookId };
            history.pushState(state, "", "");

            const handlePopState = (event: PopStateEvent) => {
                // If user presses back, close the modal
                isOpen = false;
            };

            window.addEventListener("popstate", handlePopState);

            return () => {
                window.removeEventListener("popstate", handlePopState);
                // If we are closing but the state is still ours (e.g. Escape key), go back
                // But we need to be careful not to double-pop if the popstate triggered the close.
                // Actually, simply: if isOpen becomes false programmatically, we should pop?
                // No, simpler: Just listen to popstate to CLOSE.
                // If closed via UI (Escape/Button), we should history.back().
                // However, distinguishing between "Close by Back Button" (already popped) and "Close by UI" (need to pop) is tricky in effect cleanup.
                // A common pattern:
            };
        }
    });

    // Better approach for Svelte 5 effect:
    // When isOpen changes to true -> pushState.
    // When isOpen changes to false -> if we are not processing a popstate, history.back().
    // When popstate -> set isOpen = false (and flag that it was popstate).

    let isPoppingState = false;

    $effect(() => {
        if (isOpen) {
            history.pushState({ modal: "bookDetails" }, "");

            const onPopState = () => {
                isPoppingState = true;
                isOpen = false;
            };

            window.addEventListener("popstate", onPopState);

            return () => {
                window.removeEventListener("popstate", onPopState);
                if (!isPoppingState) {
                    history.back();
                }
                isPoppingState = false;
            };
        }
    });
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key === "Escape" && isOpen) {
            isOpen = false;
        }
    }}
/>

{#if isOpen && book}
    <Portal>
        <div
            class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
        >
            <div
                class="w-full h-full bg-background flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
            >
                <!-- Mobile-First Header -->
                <div
                    class="p-4 md:p-6 border-b border-line flex flex-col md:flex-row gap-4 md:gap-6 md:items-start bg-surface/30 shrink-0"
                >
                    <div class="flex gap-4 items-start">
                        <div
                            class="w-12 md:w-16 aspect-[2/3] rounded shadow-lg {book.coverUrl} opacity-80 flex items-center justify-center shrink-0"
                        >
                            {#if book.coverUrl && book.coverUrl.startsWith("http")}
                                <img
                                    src={book.coverUrl}
                                    alt={book.title}
                                    class="absolute inset-0 w-full h-full object-cover rounded"
                                />
                            {:else}
                                <BookOpen size={20} class="text-white/50" />
                            {/if}
                        </div>
                        <div class="flex-1 min-w-0 pt-1">
                            <div
                                class="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 mb-2"
                            >
                                <h2
                                    class="text-xl md:text-3xl font-bold text-white line-clamp-1"
                                >
                                    {book.title}
                                </h2>
                                <p class="text-sm md:text-xl text-muted">
                                    {book.author}
                                </p>
                            </div>
                            {#if book.why}
                                <div
                                    class="text-xs md:text-base text-white/80 italic mb-3 border-l-2 border-primary/50 pl-3 py-1 bg-white/5 inline-block rounded-r pr-4 line-clamp-2 md:line-clamp-none"
                                >
                                    "{book.why}"
                                </div>
                            {/if}
                        </div>
                        <!-- Close Button Mobile Position -->
                        <button
                            onclick={() => (isOpen = false)}
                            class="md:hidden p-2 text-muted hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div class="flex flex-wrap gap-2 w-full md:w-auto">
                        {#each ["Want to Read", "Reading", "Paused", "Done"] as status}
                            <button
                                class="px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm border transition-colors flex-1 md:flex-none whitespace-nowrap {book.status ===
                                status
                                    ? 'bg-primary text-black border-primary font-medium'
                                    : 'bg-transparent border-line text-muted hover:border-white/50'}"
                                onclick={() => updateStatus(status)}
                            >
                                {status}
                            </button>
                        {/each}
                    </div>
                    <!-- Desktop Actions -->
                    <div class="hidden md:flex gap-4 items-center ml-auto">
                        <button
                            onclick={deleteBook}
                            class="p-2 text-muted hover:text-red-500 transition-colors flex items-center gap-2 group"
                            aria-label="Delete Book"
                        >
                            <Trash2 size={20} />
                            <span
                                class="text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >Delete Book</span
                            >
                        </button>
                        <div class="w-px h-8 bg-line"></div>
                        <button
                            onclick={() => (isOpen = false)}
                            class="p-2 text-muted hover:text-white transition-colors"
                            aria-label="Close"
                        >
                            <X size={32} />
                        </button>
                    </div>
                </div>

                <!-- Scratchpad Area -->
                <div
                    class="flex-1 flex flex-col overflow-hidden bg-background w-full md:max-w-5xl md:mx-auto md:border-x border-line/30"
                >
                    <!-- Helper Text -->
                    <div
                        class="px-4 md:px-8 pt-4 md:pt-6 pb-2 text-xs md:text-sm text-muted uppercase tracking-wider font-medium flex justify-between items-center"
                    >
                        <span>Continuous Scratchpad</span>
                        <div class="flex items-center gap-2">
                            <button
                                onclick={deleteBook}
                                class="md:hidden p-1.5 text-red-400/50 hover:text-red-400 transition-colors"
                                aria-label="Delete Book"
                            >
                                <Trash2 size={16} />
                            </button>
                            <span
                                class="text-[10px] normal-case bg-surface border border-line px-2 py-0.5 rounded"
                                >Append-only</span
                            >
                        </div>
                    </div>

                    <!-- Feed -->
                    <div
                        class="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-6 md:space-y-8"
                    >
                        {#each scratchpad as entry (entry.id)}
                            <div
                                class="group relative pl-4 md:pl-6 border-l-2 border-line hover:border-primary/50 transition-colors py-1"
                            >
                                <div
                                    class="flex justify-between items-start mb-1 md:mb-2"
                                >
                                    <span
                                        class="text-[10px] md:text-xs text-muted"
                                        >{new Date(
                                            entry.createdAt,
                                        ).toLocaleString(undefined, {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}</span
                                    >

                                    <div
                                        class="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <button
                                            onclick={() =>
                                                deleteThought(entry.id)}
                                            class="p-1.5 text-muted hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                            title="Delete thought"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        {#if entry.promotedToNoteId}
                                            <span
                                                class="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20"
                                            >
                                                <FileText size={10} />
                                            </span>
                                        {:else}
                                            <button
                                                onclick={() =>
                                                    promoteToNote(entry.id)}
                                                class="flex items-center gap-1 text-[10px] text-muted hover:text-white bg-surface border border-line px-2 py-1 rounded hover:border-white/30 transition-colors"
                                            >
                                                <CornerUpRight size={12} />
                                            </button>
                                        {/if}
                                    </div>
                                </div>
                                <p
                                    class="text-base md:text-lg text-white/90 whitespace-pre-wrap leading-relaxed"
                                >
                                    {entry.content}
                                </p>
                            </div>
                        {/each}

                        {#if scratchpad.length === 0}
                            <div
                                class="text-center py-12 md:py-20 text-muted italic text-base md:text-lg px-4"
                            >
                                No thoughts yet. <br /> This is your place for raw,
                                unfiltered reflection.
                            </div>
                        {/if}
                    </div>

                    <!-- Input -->
                    <div class="p-4 md:p-8 border-t border-line bg-surface/30">
                        <div class="relative max-w-4xl mx-auto flex gap-2">
                            <textarea
                                bind:value={scratchpadInput}
                                placeholder="Add a thought..."
                                rows="1"
                                class="flex-1 bg-background border border-line rounded-xl px-4 py-3 text-base md:text-xl text-white focus:outline-none focus:border-primary resize-none placeholder:text-muted/30 leading-relaxed max-h-32 min-h-[3rem]"
                                onkeydown={(e) =>
                                    e.key === "Enter" &&
                                    !e.shiftKey &&
                                    (e.preventDefault(), submitThought())}
                            ></textarea>
                            <button
                                onclick={submitThought}
                                disabled={!scratchpadInput.trim()}
                                class="flex-none w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-black shadow-lg disabled:opacity-50 disabled:shadow-none hover:bg-primary/90 transition-all active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <div
                            class="text-center mt-2 text-[10px] text-muted md:hidden"
                        >
                            Tap send to save
                        </div>
                        <div
                            class="hidden md:block text-right mt-2 text-[10px] text-muted"
                        >
                            Press Enter to save
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Portal>
{/if}
