<script lang="ts">
    import {
        X,
        Send,
        CheckSquare,
        FileText,
        Link as LinkIcon,
        Trash2,
        Archive,
        CornerDownLeft,
        Clock,
        Maximize2,
        Minimize2,
        Save,
    } from "lucide-svelte";
    import { projectsStore } from "$lib/stores/projects.svelte";
    import type { Project, ScratchpadEntry } from "$lib/stores/projects.svelte";
    import { fade } from "svelte/transition";
    import Portal from "$lib/components/ui/Portal.svelte";

    let { project, onClose }: { project: Project; onClose: () => void } =
        $props();

    // Use live project from store to ensure reactivity.
    // Since projectsStore.projects uses $state, access it directly in $derived.
    let liveProject = $derived(
        projectsStore.projects.find((p) => p.id === project.id) || project,
    );

    let scratchpadInput = $state("");
    let viewMode = $state<"default" | "history">("default");
    let mobileMode = $state<"view" | "edit">("view");

    // Derived Lists
    let tasks = $derived(
        liveProject.scratchpad.filter(
            (e) => e.type === "task" && !e.isCompleted,
        ),
    );
    let resources = $derived(liveProject.resources);
    let thoughts = $derived(
        liveProject.scratchpad.filter((e) => e.type === "note"),
    );
    // Show all non-task entries (notes) and completed tasks in "History"
    let history = $derived(
        [...liveProject.scratchpad].sort((a, b) => b.createdAt - a.createdAt),
    );
    let isDormant = $derived(projectsStore.isDormant(liveProject));

    function handleKeydown(e: KeyboardEvent) {
        // Cmd+Enter or Ctrl+Enter to save
        // Also support Shift+Enter for strict newline, but user asked for Shift+Enter to "proceed" (process)?
        // "add shift+enter as proceeding as well" -> treat same as Cmd+Enter
        if ((e.metaKey || e.ctrlKey || e.shiftKey) && e.key === "Enter") {
            e.preventDefault();
            processInput();
        }
    }

    function normalizeUrl(url: string) {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return url;
        }
        return "https://" + url;
    }

    function processInput() {
        const raw = scratchpadInput.trim();
        if (!raw) return;

        const lines = raw.split("\n");

        // Single "Note" content accumulator
        let noteBuffer: string[] = [];

        lines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed.startsWith("[]")) {
                // Task found
                const content = trimmed.substring(2).trim();
                // If we have buffered note lines, save them first (optional, or we can just append unrelated lines)
                // Let's decide: Does '[]' break the note?
                // A common pattern: Note... Note... Task... Note...
                // Maybe we should just extract tasks/links and leave the rest as one big note?
                // Or split into multiple notes?
                // Simpler: Extract specific lines as Tasks/Resources.
                // Join ALL other lines into ONE Note entry (if not empty).
                if (content)
                    projectsStore.addScratchpadEntry(
                        liveProject.id,
                        content,
                        "task",
                    );
            } else if (trimmed.startsWith("{}")) {
                // Resource found
                const content = trimmed.substring(2).trim();
                if (content) {
                    projectsStore.addResource(liveProject.id, {
                        type: "link",
                        title: content,
                        content: normalizeUrl(content),
                    });
                }
            } else {
                if (trimmed) noteBuffer.push(line); // Preserve original line text (indentation?)
            }
        });

        if (noteBuffer.length > 0) {
            const noteContent = noteBuffer.join("\n").trim();
            if (noteContent)
                projectsStore.addScratchpadEntry(
                    liveProject.id,
                    noteContent,
                    "note",
                );
        }

        scratchpadInput = "";
    }

    function toggleTask(entry: ScratchpadEntry) {
        projectsStore.toggleScratchpadTask(liveProject.id, entry.id);
    }

    function deleteEntry(id: string) {
        const updated = liveProject.scratchpad.filter((e) => e.id !== id);
        projectsStore.updateProject(liveProject.id, { scratchpad: updated });
    }

    function deleteResource(id: string) {
        const updated = liveProject.resources.filter((e) => e.id !== id);
        projectsStore.updateProject(liveProject.id, { resources: updated });
    }

    function handleArchive() {
        if (confirm("Archive this project?")) {
            projectsStore.archiveProject(liveProject.id);
            onClose();
        }
    }
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key === "Escape") {
            onClose();
        }
    }}
/>

<Portal>
    <div
        class="fixed inset-0 z-[5000] bg-black text-white flex flex-col md:flex-row animate-in fade-in duration-200 overflow-hidden font-sans"
    >
        <!-- MAIN COLUMN: Editor (Flex-1) -->
        <div class="flex-1 flex flex-col h-full relative bg-background">
            <!-- Header (Moved from Left Sidebar) -->
            <div
                class="h-16 border-b border-line flex items-center justify-between px-6 bg-surface/50 backdrop-blur shrink-0"
            >
                <div class="flex items-center gap-4">
                    <button onclick={onClose} class="md:hidden text-muted">
                        <X size={24} />
                    </button>
                    <div class="flex items-center gap-3">
                        <div
                            class="{liveProject.bg} {liveProject.color} w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        >
                            <div
                                class="w-3 h-3 bg-current rounded-full opacity-50"
                            ></div>
                        </div>
                        <div>
                            <h1
                                class="text-lg font-bold text-white leading-tight flex items-center gap-2"
                            >
                                {liveProject.name}
                                {#if isDormant}
                                    <span
                                        class="text-[10px] text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider"
                                        >Dormant</span
                                    >
                                {/if}
                            </h1>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    {#if liveProject.intent}
                        <span
                            class="hidden md:block text-xs text-muted italic truncate max-w-[300px]"
                            >"{liveProject.intent}"</span
                        >
                    {/if}
                    <div class="w-px h-4 bg-line hidden md:block"></div>
                    <button
                        onclick={() =>
                            (viewMode =
                                viewMode === "default" ? "history" : "default")}
                        class="text-muted hover:text-white transition-colors {viewMode ===
                        'history'
                            ? 'text-white'
                            : ''}"
                        title="Toggle History"
                    >
                        <Clock size={18} />
                    </button>
                    <button
                        onclick={handleArchive}
                        class="text-muted hover:text-white transition-colors"
                        title="Archive Project"
                    >
                        <Archive size={18} />
                    </button>
                    <button
                        onclick={onClose}
                        class="hidden md:block text-muted hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <!-- Editors Area (Responsive) -->
            <!-- DESKTOP: Always show Editor -->
            <!-- MOBILE: Show Editor ONLY in 'edit' mode -->
            <div
                class="flex-1 flex flex-col p-0 overflow-hidden relative {mobileMode ===
                'view'
                    ? 'hidden md:flex'
                    : 'flex'}"
            >
                <!-- Hint (Desktop only or Edit mode) -->
                <div
                    class="flex items-center justify-between px-6 py-3 border-b border-line bg-surface/30 backdrop-blur shrink-0 z-10"
                >
                    <span
                        class="text-sm font-medium text-muted uppercase tracking-widest"
                        >Scratchpad / Inbox</span
                    >
                    <div class="text-xs text-muted flex items-center">
                        <span class="text-emerald-500 font-bold">[] task</span>
                        <span class="mx-3 border-l border-line h-3"></span>
                        <span class="text-blue-500 font-bold">{"{}"} link</span>
                        <span class="mx-3 border-l border-line h-3"></span>
                        <span class="hidden md:inline">SHIFT+ENTER to save</span
                        >
                        <span class="md:hidden">Process to save</span>
                    </div>
                </div>

                <div class="flex-1 relative group w-full h-full">
                    <textarea
                        bind:value={scratchpadInput}
                        onkeydown={handleKeydown}
                        placeholder="Capture thoughts, tasks, or links..."
                        class="w-full h-full bg-transparent text-lg md:text-xl text-white placeholder-muted p-6 md:p-8 resize-none outline-none leading-relaxed"
                        autofocus
                    ></textarea>

                    <!-- Save Button (Floating) -->
                    <div class="absolute bottom-6 right-6 flex gap-3 z-50">
                        <!-- Mobile: Cancel/Done -->
                        <button
                            onclick={() => (mobileMode = "view")}
                            class="md:hidden flex items-center justify-center bg-surface text-white w-12 h-12 rounded-full shadow-lg border border-line active:scale-95 transition-all"
                            title="Done"
                        >
                            <X size={20} />
                        </button>

                        <!-- Process Button -->
                        <button
                            onclick={(e) => {
                                e.stopPropagation();
                                processInput();
                            }}
                            disabled={!scratchpadInput.trim()}
                            class="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-base hover:bg-gray-200 disabled:opacity-50 disabled:translate-y-2 transition-all shadow-xl active:scale-95"
                        >
                            <span>Process</span>
                            <CornerDownLeft size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT COLUMN: Output (300px on Desktop) -->
        <!-- MOBILE: Show this column ONLY in 'view' mode (as the main content) -->
        <div
            class="{mobileMode === 'view'
                ? 'flex w-full'
                : 'hidden'} md:flex flex-col md:w-[300px] border-l border-line bg-surface"
        >
            <!-- Mobile Header for View Mode (replacing generic Project Overview) -->
            <div
                class="md:hidden px-6 py-4 flex flex-col gap-4 border-b border-neutral-800 bg-neutral-900/50"
            >
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-xl font-bold text-white leading-tight">
                            {liveProject.name}
                        </h2>
                        {#if liveProject.intent}
                            <p class="text-sm text-muted mt-1">
                                {liveProject.intent}
                            </p>
                        {/if}
                    </div>
                </div>

                <button
                    onclick={() => (mobileMode = "edit")}
                    class="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-3 rounded-xl font-bold text-base shadow-lg active:scale-95 transition-transform"
                >
                    <FileText size={18} />
                    <span>Open Scratchpad</span>
                </button>
            </div>

            {#if viewMode === "default"}
                <!-- Tasks (Top) -->
                <div
                    class="flex-1 overflow-y-auto border-b border-neutral-800 p-0 flex flex-col min-h-[30%] max-h-[40%]"
                >
                    <div
                        class="px-4 py-3 border-b border-neutral-800 bg-neutral-900/30 sticky top-0 z-10 backdrop-blur"
                    >
                        <h3
                            class="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2"
                        >
                            <CheckSquare size={16} /> Active Tasks
                        </h3>
                    </div>
                    <div class="p-4 space-y-2 overflow-y-auto">
                        {#each tasks as task (task.id)}
                            <div
                                class="group flex items-start gap-3 p-2 rounded hover:bg-neutral-800/50 transition-colors"
                            >
                                <button
                                    class="mt-0.5 text-gray-600 hover:text-emerald-500 transition-colors"
                                    onclick={() => toggleTask(task)}
                                >
                                    <div
                                        class="w-4 h-4 border-2 border-current rounded"
                                    ></div>
                                </button>
                                <span
                                    class="text-base text-gray-300 flex-1 leading-snug"
                                    >{task.content}</span
                                >
                                <button
                                    onclick={() => deleteEntry(task.id)}
                                    class="text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        {/each}
                        {#if tasks.length === 0}
                            <div class="text-sm text-gray-700 italic px-2">
                                No active tasks.
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Resources (Middle) -->
                <div
                    class="flex-shrink-0 border-b border-neutral-800 flex flex-col max-h-[25%] overflow-hidden"
                >
                    <div
                        class="px-4 py-3 border-b border-neutral-800 bg-neutral-900/30 sticky top-0 z-10 backdrop-blur"
                    >
                        <h3
                            class="text-sm font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2"
                        >
                            <LinkIcon size={16} /> Resources
                        </h3>
                    </div>
                    <div class="p-4 space-y-2 overflow-y-auto">
                        {#each resources as resource}
                            <div
                                class="group flex items-center justify-between p-2 rounded hover:bg-neutral-800/50"
                            >
                                <a
                                    href={normalizeUrl(resource.content)}
                                    target="_blank"
                                    class="flex items-center gap-2 flex-1 min-w-0"
                                >
                                    <LinkIcon
                                        size={12}
                                        class="text-blue-500 shrink-0"
                                    />
                                    <span
                                        class="text-base text-gray-300 truncate"
                                        >{resource.title}</span
                                    >
                                </a>
                                <button
                                    onclick={() => deleteResource(resource.id)}
                                    class="text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        {/each}
                        {#if resources.length === 0}
                            <div class="text-sm text-gray-700 italic px-2">
                                No resources.
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Thoughts / Notes (Bottom - Replaces History) -->
                <div
                    class="flex-1 flex flex-col overflow-hidden bg-neutral-900/10"
                >
                    <div
                        class="px-4 py-3 border-b border-neutral-800 bg-neutral-900/30 sticky top-0 z-10 backdrop-blur"
                    >
                        <h3
                            class="text-sm font-bold text-violet-500 uppercase tracking-widest flex items-center gap-2"
                        >
                            <FileText size={16} /> Thoughts
                        </h3>
                    </div>
                    <div class="p-4 space-y-4 overflow-y-auto flex-1">
                        {#each thoughts as thought}
                            <div
                                class="relative pl-4 border-l border-neutral-800 group"
                            >
                                <div
                                    class="absolute -left-[17px] top-1 w-2 h-2 rounded-full border border-neutral-800 bg-[#0A0A0A] bg-violet-500"
                                ></div>
                                <div
                                    class="flex justify-between items-start gap-2"
                                >
                                    <div
                                        class="text-base text-gray-400 whitespace-pre-wrap"
                                    >
                                        {thought.content}
                                    </div>
                                    <button
                                        onclick={() => deleteEntry(thought.id)}
                                        class="text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        {/each}
                        {#if thoughts.length === 0}
                            <div class="text-sm text-gray-700 italic px-2">
                                No thoughts recorded.
                            </div>
                        {/if}
                    </div>
                </div>
            {:else}
                <!-- HISTORY VIEW -->
                <div class="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A]">
                    <div
                        class="px-4 py-3 border-b border-neutral-800 bg-neutral-900/30 sticky top-0 z-10 backdrop-blur"
                    >
                        <h3
                            class="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"
                        >
                            <Clock size={16} /> Full History
                        </h3>
                    </div>
                    <div class="p-4 space-y-4 overflow-y-auto flex-1">
                        {#each history as entry}
                            <div
                                class="relative pl-4 border-l border-neutral-800"
                            >
                                <div
                                    class="absolute -left-[17px] top-1 w-2 h-2 rounded-full border border-neutral-800 bg-[#0A0A0A] {entry.type ===
                                    'task'
                                        ? entry.isCompleted
                                            ? 'bg-emerald-500'
                                            : 'bg-transparent'
                                        : 'bg-gray-600'}"
                                ></div>
                                <div class="text-[10px] text-gray-600 mb-0.5">
                                    {new Date(
                                        entry.createdAt,
                                    ).toLocaleDateString([], {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                                <div
                                    class="text-base text-gray-400 whitespace-pre-wrap {entry.isCompleted
                                        ? 'line-through text-gray-600'
                                        : ''}"
                                >
                                    {entry.content}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        </div>
    </div>
</Portal>
