<script lang="ts">
    import {
        Plus,
        MoreHorizontal,
        Layers,
        Folder,
        BookOpen,
        Archive,
        GripVertical,
        Trash2,
    } from "lucide-svelte";
    import { projectsStore, type Project } from "$lib/stores/projects.svelte";
    import { fade } from "svelte/transition";

    let {
        section,
        items,
        onOpenProject,
    }: {
        section: any;
        items: Project[];
        onOpenProject: (project: Project) => void;
    } = $props();

    const iconMap: Record<string, any> = {
        Layers,
        Folder,
        BookOpen,
        Archive,
    };

    let isOver = $state(false);
    let IconComponent = $derived(iconMap[section.icon] || Folder);

    function handleDragStart(e: DragEvent, id: string) {
        if (e.dataTransfer) {
            e.dataTransfer.setData("text/plain", id);
            e.dataTransfer.effectAllowed = "move";
        }
    }

    async function handleDrop(e: DragEvent) {
        isOver = false;
        const id = e.dataTransfer?.getData("text/plain");
        if (id) {
            await projectsStore.moveProject(id, section.type);
        }
    }

    async function handleAdd() {
        const project = await projectsStore.addProject({
            name: "",
            type: section.type,
        });
        if (project) {
            onOpenProject(project);
        }
    }

    function getItemCount(item: Project) {
        return (
            projectsStore.getScratchpad(item.id).length +
            projectsStore.getResources(item.id).length
        );
    }
</script>

<div
    class="flex flex-col h-full w-80 shrink-0 select-none transition-colors rounded-2xl {isOver
        ? 'bg-theme-primary-soft'
        : ''}"
    role="region"
    aria-label="{section.name} column"
    ondragover={(e) => {
        e.preventDefault();
        isOver = true;
    }}
    ondragleave={() => (isOver = false)}
    ondrop={handleDrop}
>
    <div
        class="px-4 py-6 flex items-center justify-between sticky top-0 bg-theme-background-glass backdrop-blur-xl z-20"
    >
        <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg {section.bg} {section.color}">
                <IconComponent size={18} />
            </div>
            <div>
                <h3
                    class="text-sm font-bold text-theme-text-strong uppercase tracking-widest"
                >
                    {section.name}
                </h3>
                <span
                    class="text-[10px] text-theme-text-muted font-bold uppercase tracking-tighter"
                    >{items.length} Items</span
                >
            </div>
        </div>
        <button
            onclick={handleAdd}
            class="btn btn-ghost !p-2 rounded-lg"
            aria-label="Add new {section.name}"
        >
            <Plus size={16} />
        </button>
    </div>

    <!-- Items List -->
    <div class="flex-1 px-4 space-y-4 overflow-y-auto pb-20 custom-scrollbar">
        {#each items as item (item.id)}
            <div
                draggable="true"
                ondragstart={(e) => handleDragStart(e, item.id)}
                transition:fade={{ duration: 200 }}
                class="group relative p-4 rounded-2xl bg-theme-surface-subtle/30 backdrop-blur-xl border border-theme-line hover:border-theme-primary transition-all cursor-pointer active:scale-[0.98] shadow-2xl ring-1 ring-white/5"
                onclick={() => onOpenProject(item)}
                onkeydown={(e) => e.key === "Enter" && onOpenProject(item)}
                role="button"
                tabindex="0"
            >
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1 min-w-0">
                        <h4
                            class="font-bold text-theme-text-strong group-hover:text-theme-primary transition-colors truncate"
                        >
                            {item.name || "Untitled"}
                        </h4>
                        {#if item.intent}
                            <p
                                class="text-xs text-theme-text-muted line-clamp-1 mt-1 font-medium italic opacity-70"
                            >
                                "{item.intent}"
                            </p>
                        {/if}
                    </div>
                    <div
                        class="opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
                    >
                        <button
                            onclick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Delete this ${section.type}?`)) {
                                    projectsStore.deleteProject(item.id);
                                }
                            }}
                            class="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-danger hover:bg-theme-danger/10 transition-colors"
                            title="Delete Item"
                        >
                            <Trash2 size={14} />
                        </button>
                        <GripVertical
                            size={14}
                            class="text-theme-text-muted cursor-grab active:cursor-grabbing ml-1"
                        />
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4">
                    <div class="flex items-center gap-2">
                        {#if section.type === "project"}
                            <div class="flex items-center gap-1.5">
                                <div
                                    class="w-12 h-1 bg-theme-background-subtle rounded-full overflow-hidden border border-theme-line"
                                >
                                    <div
                                        class="h-full bg-theme-success"
                                        style="width: {item.progress || 0}%"
                                    ></div>
                                </div>
                                <span
                                    class="text-[9px] font-bold text-theme-success"
                                    >{item.progress}%</span
                                >
                            </div>
                        {:else}
                            <span
                                class="text-[9px] font-bold text-theme-text-muted uppercase tracking-widest"
                            >
                                {getItemCount(item)} Assets
                            </span>
                        {/if}
                    </div>

                    <div class="flex items-center gap-2">
                        {#if projectsStore.isDormant(item)}
                            <div
                                class="w-1.5 h-1.5 rounded-full bg-theme-warning animate-pulse"
                                title="Dormant"
                            ></div>
                        {/if}
                        <span
                            class="text-[9px] font-bold text-theme-text-muted uppercase opacity-50"
                        >
                            {new Date(
                                item.updatedAt || item.createdAt,
                            ).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </div>
        {/each}

        {#if items.length === 0}
            <div
                class="flex flex-col items-center justify-center py-12 text-center text-theme-text-muted opacity-30 border-2 border-dashed border-theme-line rounded-2xl"
            >
                <span class="text-[10px] font-bold uppercase tracking-widest"
                    >Empty Lane</span
                >
            </div>
        {/if}
    </div>
</div>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: var(--theme-line);
        border-radius: 10px;
    }
    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
        background: var(--theme-text-muted);
        opacity: 0.2;
    }
</style>
