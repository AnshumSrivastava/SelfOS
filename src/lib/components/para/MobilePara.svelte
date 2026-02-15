<script lang="ts">
    import { Plus, ChevronRight, Folder } from "lucide-svelte";
    import { projectsStore } from "$lib/stores/projects.svelte";
    import ProjectDetailModal from "./ProjectDetailModal.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import type { Project } from "$lib/stores/projects.svelte";

    let selectedProject: Project | null = $state(null);

    async function handleAdd() {
        const project = await projectsStore.addProject({
            name: "",
            type: "project",
        });
        if (project) {
            openProject(project);
        }
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
    <div class="px-6 py-8 flex items-center justify-between shrink-0">
        <div>
            <h1
                class="text-3xl font-bold text-white tracking-tight leading-none mb-1"
            >
                P.A.R.A.
            </h1>
            <p
                class="text-[10px] font-bold text-primary uppercase tracking-widest"
            >
                Digital Registry
            </p>
        </div>
        <button
            onclick={handleAdd}
            class="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl active:scale-95 transition-all"
        >
            <Plus size={24} />
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
        {#if projectsStore.loading}
            <SkeletonLoader lines={3} height="h-32" />
        {:else}
            {#each projectsStore.activeProjects as project}
                <button
                    class="w-full text-left bg-surface/40 backdrop-blur-md border border-line/50 rounded-2xl p-4 active:scale-[0.98] transition-all group relative overflow-hidden shadow-lg ring-1 ring-white/5"
                    onclick={() => openProject(project)}
                >
                    <!-- Color Indicator Bar -->
                    <div
                        class="absolute left-0 top-0 bottom-0 w-1 {project.color ||
                            'bg-gray-500'} opacity-70"
                    ></div>

                    <div class="flex justify-between items-start">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                <h3
                                    class="font-bold text-white text-lg leading-tight truncate"
                                >
                                    {project.name || "Untitled Item"}
                                </h3>
                                {#if projectsStore.isDormant(project)}
                                    <span
                                        class="text-[9px] text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold"
                                    >
                                        Dormant
                                    </span>
                                {/if}
                            </div>
                            <p
                                class="text-xs text-muted line-clamp-2 leading-relaxed h-8"
                            >
                                {project.intent || "No objective defined yet."}
                            </p>
                        </div>
                    </div>

                    <!-- Last Updated / Metadata -->
                    <div
                        class="mt-4 pt-3 border-t border-white/5 flex items-center justify-between"
                    >
                        <div
                            class="flex items-center gap-3 text-[10px] text-muted font-bold uppercase tracking-wider"
                        >
                            <div class="flex items-center gap-1.5">
                                <span class="text-emerald-400"
                                    >{projectsStore
                                        .getScratchpad(project.id)
                                        .filter(
                                            (e) =>
                                                e.type === "task" &&
                                                !e.isCompleted,
                                        ).length}</span
                                > Tasks
                            </div>
                            <div class="w-1 h-1 bg-white/10 rounded-full"></div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-blue-400"
                                    >{projectsStore.getResources(project.id)
                                        .length}</span
                                > Assets
                            </div>
                        </div>
                        <div
                            class="text-[10px] text-muted font-mono bg-white/5 px-2 py-0.5 rounded"
                        >
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
        {/if}
    </div>
</div>
