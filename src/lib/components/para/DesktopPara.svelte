<script lang="ts">
    import { projectsStore } from "$lib/stores/projects.svelte";
    import { uiState } from "$lib/stores/ui.svelte";
    import type { Project } from "$lib/stores/projects.svelte";
    import ProjectDetailModal from "./ProjectDetailModal.svelte";
    import ParaKanbanColumn from "./ParaKanbanColumn.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";

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

<div class="h-screen flex flex-col overflow-hidden bg-background">
    <!-- Header Area -->
    <div class="px-8 py-10 shrink-0">
        <div class="flex items-end justify-between">
            <div>
                <h1 class="text-4xl font-light text-white tracking-tight mb-2">
                    P.A.R.A. <span class="text-primary font-bold">Board</span>
                </h1>
                <p
                    class="text-sm font-bold text-muted uppercase tracking-[0.3em]"
                >
                    Strategic Indexing & Capture
                </p>
            </div>

            <div class="flex items-center gap-6">
                <div class="flex flex-col items-end">
                    <span
                        class="text-[10px] font-bold text-muted uppercase tracking-widest"
                        >System Health</span
                    >
                    <span class="text-xs font-bold text-emerald-500 uppercase"
                        >Operational</span
                    >
                </div>
            </div>
        </div>
    </div>

    <!-- Kanban Board (Horizontal) -->
    <div
        class="flex-1 flex gap-6 px-8 overflow-x-auto pb-12 custom-scrollbar-h items-start"
    >
        {#if projectsStore.loading}
            <div class="flex gap-6 w-full">
                {#each Array(4) as _}
                    <div class="w-80 shrink-0">
                        <SkeletonLoader lines={5} height="h-32" />
                    </div>
                {/each}
            </div>
        {:else}
            {#each projectsStore.sections as section}
                <ParaKanbanColumn
                    {section}
                    items={getSectionItems(section.type)}
                    onOpenProject={openProject}
                />
            {/each}
        {/if}

        <!-- Spacer for end padding -->
        <div class="w-8 shrink-0"></div>
    </div>
</div>

<style>
    .custom-scrollbar-h::-webkit-scrollbar {
        height: 6px;
    }
    .custom-scrollbar-h::-webkit-scrollbar-track {
        background: transparent;
        margin: 0 32px;
    }
    .custom-scrollbar-h::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
    .custom-scrollbar-h:hover::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
    }
</style>
