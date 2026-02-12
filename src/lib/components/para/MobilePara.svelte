<script lang="ts">
    import { Plus, ChevronRight, Folder } from "lucide-svelte";
    import { projectsStore } from "$lib/stores/projects.svelte";
    import ProjectDetailModal from "./ProjectDetailModal.svelte";
    import type { Project } from "$lib/stores/projects.svelte";

    let selectedProject: Project | null = $state(null);

    function handleAdd() {
        projectsStore.addProject({ name: "New Project", type: "project" });
    }

    function openProject(project: Project) {
        selectedProject = project;
    }
</script>

{#if selectedProject}
    <ProjectDetailModal
        project={selectedProject}
        onClose={() => (selectedProject = null)}
    />
{/if}

<div class="page-container h-full">
    <!-- Header -->
    <div class="module-header">
        <h1 class="text-3xl font-light text-white tracking-tight">Projects</h1>
        <button
            onclick={handleAdd}
            class="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={20} />
        </button>
    </div>

    <!-- Stats / System Status (Optional - keeping it minimal) -->
    <div class="grid grid-cols-2 gap-3 mb-6">
        <div class="card-subtle p-4">
            <div class="text-2xl font-bold text-white">
                {projectsStore.activeProjects.length}
            </div>
            <div class="text-xs text-muted uppercase tracking-widest">
                Active
            </div>
        </div>
        <div class="card-subtle p-4">
            <div class="text-2xl font-bold text-white">
                {projectsStore.projects.filter((p) => p.status === "Archived")
                    .length}
            </div>
            <div class="text-xs text-muted uppercase tracking-widest">
                Archived
            </div>
        </div>
    </div>

    <!-- Active Projects List -->
    <div class="space-y-3">
        {#each projectsStore.activeProjects as project}
            <button
                class="w-full text-left card-subtle active:scale-[0.98] transition-all group relative overflow-hidden"
                onclick={() => openProject(project)}
            >
                <!-- Color Indicator Bar -->
                <div
                    class="absolute left-0 top-0 bottom-0 w-1.5 {project.color ||
                        'bg-gray-500'}"
                ></div>

                <div class="flex justify-between items-start pl-2">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <h3
                                class="font-bold text-white text-lg leading-tight truncate"
                            >
                                {project.name}
                            </h3>
                            {#if projectsStore.isDormant(project)}
                                <span
                                    class="text-[10px] text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider"
                                >
                                    Dormant
                                </span>
                            {/if}
                        </div>
                        {#if project.intent}
                            <p class="text-sm text-muted line-clamp-1">
                                {project.intent}
                            </p>
                        {:else}
                            <p class="text-sm text-muted italic opacity-50">
                                No intent set
                            </p>
                        {/if}
                    </div>
                </div>

                <!-- Last Updated / Metadata -->
                <div
                    class="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between pl-2"
                >
                    <div class="flex items-center gap-3 text-xs text-gray-500">
                        <div class="flex items-center gap-1">
                            <span class="font-medium text-gray-400"
                                >{project.scratchpad.filter(
                                    (e) => e.type === "task" && !e.isCompleted,
                                ).length}</span
                            > tasks
                        </div>
                        <div class="w-1 h-1 bg-neutral-800 rounded-full"></div>
                        <div class="flex items-center gap-1">
                            <span class="font-medium text-gray-400"
                                >{project.resources.length}</span
                            > links
                        </div>
                    </div>
                    <div class="text-xs text-neutral-600">
                        {new Date(project.updatedAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" },
                        )}
                    </div>
                </div>
            </button>
        {/each}

        {#if projectsStore.activeProjects.length === 0}
            <div class="text-center py-12 card-subtle opacity-50">
                <div
                    class="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-4 text-muted"
                >
                    <Folder size={32} />
                </div>
                <h3 class="text-lg font-medium text-muted">
                    No active projects
                </h3>
                <p class="text-sm text-muted mt-2">
                    Tap the + button to create one.
                </p>
            </div>
        {/if}
    </div>
</div>
