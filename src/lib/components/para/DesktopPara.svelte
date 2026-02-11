<script lang="ts">
    import {
        Folder,
        Layers,
        BookOpen,
        Archive,
        MoreHorizontal,
    } from "lucide-svelte";
    import { projectsStore } from "$lib/stores/projects.svelte";
    import type { Project } from "$lib/stores/projects.svelte";
    import ProjectDetailModal from "./ProjectDetailModal.svelte";

    const iconMap: Record<string, any> = {
        Layers,
        Folder,
        BookOpen,
        Archive,
    };

    let selectedProject: Project | null = $state(null);

    function getSectionItems(type: string) {
        switch (type) {
            case "project":
                return projectsStore.activeProjects;
            case "area":
                return projectsStore.areas;
            case "resource":
                return projectsStore.resources;
            case "archive":
                return projectsStore.archives;
            default:
                return [];
        }
    }

    function handleAdd(type: string) {
        if (type === "project") {
            projectsStore.addProject({ name: "New Project", type: "project" });
        } else if (type === "area") {
            projectsStore.addProject({
                name: "New Area",
                type: "area",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
            });
        } else if (type === "resource") {
            projectsStore.addProject({
                name: "New Resource",
                type: "resource",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
            });
        }
    }

    function deleteItem(id: string) {
        if (confirm("Are you sure you want to delete this item?")) {
            projectsStore.deleteProject(id);
        }
    }

    function getItemCount(item: Project) {
        return (item.scratchpad?.length || 0) + (item.resources?.length || 0);
    }

    function openProject(item: Project) {
        selectedProject = item;
    }
</script>

{#if selectedProject}
    <ProjectDetailModal
        project={selectedProject}
        onClose={() => (selectedProject = null)}
    />
{/if}

<div class="space-y-8 pb-12">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">P.A.R.A. System</h1>
        <p class="text-muted">Projects · Areas · Resources · Archives</p>
    </div>

    <div class="grid grid-cols-1 gap-8">
        {#each projectsStore.sections as section}
            {@const items = getSectionItems(section.type)}
            <div class="card relative overflow-hidden group">
                <div class="flex items-start gap-4 mb-6">
                    <div class="p-3 rounded-lg {section.bg} {section.color}">
                        <svelte:component
                            this={iconMap[section.icon] || Folder}
                            size={24}
                        />
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-white">
                            {section.name}
                        </h2>
                        <p class="text-sm text-muted">{section.description}</p>
                    </div>
                </div>

                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {#each items as item}
                        <div
                            class="p-4 rounded-xl bg-background border border-line hover:border-{section.id ===
                            'archives'
                                ? 'white'
                                : 'primary'}/50 transition-all cursor-pointer group/item flex flex-col justify-between h-32 relative text-left"
                            onclick={() => openProject(item)}
                            role="button"
                            tabindex="0"
                            onkeydown={(e) =>
                                e.key === "Enter" && openProject(item)}
                        >
                            <div
                                class="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity z-10"
                            >
                                <button
                                    class="p-1 hover:bg-surface rounded text-muted hover:text-red-400"
                                    onclick={(e) => {
                                        e.stopPropagation();
                                        deleteItem(item.id);
                                    }}
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            <div class="w-full">
                                <div
                                    class="flex justify-between items-start mb-2"
                                >
                                    <span
                                        class="font-medium text-white group-hover/item:text-primary transition-colors truncate w-full pr-6"
                                        >{item.name}</span
                                    >
                                </div>
                                {#if item.intent}
                                    <p class="text-xs text-muted line-clamp-2">
                                        {item.intent}
                                    </p>
                                {/if}
                            </div>

                            <div class="text-xs text-muted mt-auto pt-2 w-full">
                                {#if section.id === "projects"}
                                    <div
                                        class="flex items-center justify-between mb-1"
                                    >
                                        <span>Last active</span>
                                        <span
                                            >{new Date(
                                                item.updatedAt ||
                                                    item.createdAt,
                                            ).toLocaleDateString()}</span
                                        >
                                    </div>
                                    <!-- Dormancy Indicator -->
                                    {#if projectsStore.isDormant(item)}
                                        <div
                                            class="text-orange-500 text-[10px] mt-1"
                                        >
                                            ● Dormant (>21d)
                                        </div>
                                    {/if}
                                {:else if section.id === "archives"}
                                    Archived
                                {:else}
                                    {getItemCount(item)} items
                                {/if}
                            </div>
                        </div>
                    {/each}

                    <!-- Add New -->
                    {#if section.id !== "archives"}
                        <button
                            onclick={() => handleAdd(section.type)}
                            class="p-4 rounded-xl border border-dashed border-line hover:bg-surface/50 hover:border-primary/50 text-muted hover:text-white transition-all flex items-center justify-center h-32"
                        >
                            <span class="text-sm font-medium">Add New</span>
                        </button>
                    {/if}
                </div>

                <div
                    class="absolute -right-12 -top-12 w-48 h-48 {section.bg} blur-3xl rounded-full opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity"
                ></div>
            </div>
        {/each}
    </div>
</div>
