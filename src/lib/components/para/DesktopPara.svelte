<script lang="ts">
    import { projectsStore } from "$lib/stores/projects.svelte";
    import { onMount } from "svelte";
    import type { Project } from "$lib/stores/projects.svelte";
    import ProjectDetailModal from "./ProjectDetailModal.svelte";
    import ParaKanbanColumn from "./ParaKanbanColumn.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import { syncStore } from "$lib/stores/sync.svelte";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";
    import { FolderKanban, ShieldCheck, Activity } from "lucide-svelte";

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

<div class="h-full flex flex-col overflow-hidden">
    <PageHeader
        title="P.A.R.A. Registry"
        subtitle="Strategic metadata management."
        icon={FolderKanban}
    >
        <div class="flex items-center gap-6">
            <div class="flex flex-col items-end">
                <span
                    class="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest"
                    >System Health</span
                >
                <div class="flex items-center gap-2">
                    <div
                        class="w-1.5 h-1.5 rounded-full {syncStore.globalStatus ===
                        'stable'
                            ? 'bg-theme-success'
                            : syncStore.globalStatus === 'syncing'
                              ? 'bg-theme-primary animate-pulse'
                              : 'bg-theme-danger'}"
                    ></div>
                    <span
                        class="text-xs font-bold {syncStore.globalStatus ===
                        'stable'
                            ? 'text-theme-success'
                            : syncStore.globalStatus === 'syncing'
                              ? 'text-theme-primary'
                              : 'text-theme-danger'} uppercase"
                    >
                        {syncStore.globalStatus === "stable"
                            ? "Operational"
                            : syncStore.globalStatus.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    </PageHeader>

    <!-- Kanban Board (Horizontal) -->
    <div
        class="flex-1 flex gap-8 px-10 overflow-x-auto pb-12 custom-scrollbar-h items-start w-full mx-auto mt-8"
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
