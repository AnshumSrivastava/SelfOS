<script lang="ts">
    import { Plus, ChevronRight, Folder } from "lucide-svelte";
    import { projectsStore } from "$lib/stores/projects.svelte";
    import ProjectDetailModal from "./ProjectDetailModal.svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";
    import type { Project } from "$lib/stores/projects.svelte";
    import { syncStore } from "$lib/stores/sync.svelte";
    import {
        Activity,
        FolderKanban,
        ShieldCheck,
        Activity as ActivityIcon,
    } from "lucide-svelte";
    import PageHeader from "$lib/components/ui/PageHeader.svelte";

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
    <PageHeader title="P.A.R.A." subtitle="Operational Overview">
        <button
            onclick={handleAdd}
            class="w-10 h-10 rounded-xl bg-theme-primary text-theme-text-inverse flex items-center justify-center shadow-lg active:scale-95 transition-all"
            aria-label="Add new project"
        >
            <Plus size={20} />
        </button>
    </PageHeader>

    <!-- System Status -->
    <div class="px-6 flex items-center gap-2 mb-2">
        <div
            class="w-1.5 h-1.5 rounded-full {syncStore.globalStatus === 'stable'
                ? 'bg-theme-success'
                : 'bg-theme-primary animate-pulse'}"
        ></div>
        <span
            class="text-[10px] font-bold text-theme-text-muted uppercase tracking-[0.2em]"
            >{syncStore.globalStatus === "stable"
                ? "Operational"
                : "Syncing..."}</span
        >
    </div>

    <!-- Stats / System Status -->
    <div class="grid grid-cols-2 gap-3 mb-6 px-6">
        <div class="card-subtle p-4">
            <div class="text-2xl font-bold text-theme-text-strong">
                {projectsStore.activeProjects.length}
            </div>
            <div
                class="text-xs text-theme-text-muted uppercase tracking-widest"
            >
                Active
            </div>
        </div>
        <div class="card-subtle p-4">
            <div class="text-2xl font-bold text-theme-text-strong">
                {projectsStore.projects.filter((p) => p.status === "Archived")
                    .length}
            </div>
            <div
                class="text-xs text-theme-text-muted uppercase tracking-widest"
            >
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
                    class="w-full text-left bg-theme-surface-subtle/40 backdrop-blur-md border border-theme-line rounded-2xl p-4 active:scale-[0.98] transition-all group relative overflow-hidden shadow-lg ring-1 ring-white/5"
                    onclick={() => openProject(project)}
                >
                    <div
                        class="absolute left-0 top-0 bottom-0 w-1 {project.color ||
                            'bg-theme-text-muted'} opacity-70"
                    ></div>

                    <div class="flex justify-between items-start">
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                <h3
                                    class="font-bold text-theme-text-strong text-lg leading-tight truncate"
                                >
                                    {project.name || "Untitled Item"}
                                </h3>
                                {#if projectsStore.isDormant(project)}
                                    <span
                                        class="text-[9px] text-theme-warning bg-theme-warning/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold"
                                    >
                                        Dormant
                                    </span>
                                {/if}
                            </div>
                            <p
                                class="text-xs text-theme-text-muted line-clamp-2 leading-relaxed h-8"
                            >
                                {project.intent || "No objective defined yet."}
                            </p>
                        </div>
                    </div>

                    <div
                        class="mt-4 pt-3 border-t border-theme-line flex items-center justify-between"
                    >
                        <div
                            class="flex items-center gap-3 text-[10px] text-theme-text-muted font-bold uppercase tracking-wider"
                        >
                            <div class="flex items-center gap-1.5">
                                <span class="text-theme-success"
                                    >{projectsStore
                                        .getScratchpad(project.id)
                                        .filter(
                                            (e) =>
                                                e.type === "task" &&
                                                !e.isCompleted,
                                        ).length}</span
                                > Tasks
                            </div>
                            <div
                                class="w-1 h-1 bg-theme-line rounded-full"
                            ></div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-theme-primary"
                                    >{projectsStore.getResources(project.id)
                                        .length}</span
                                > Assets
                            </div>
                        </div>
                        <div
                            class="text-[10px] text-theme-text-muted font-mono bg-theme-surface-subtle px-2 py-0.5 rounded"
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
                <div class="text-center py-12 card-subtle opacity-50 mx-6">
                    <div
                        class="w-16 h-16 rounded-full bg-theme-surface flex items-center justify-center mx-auto mb-4 text-theme-text-muted"
                    >
                        <Folder size={32} />
                    </div>
                    <h3 class="text-lg font-medium text-theme-text-muted">
                        No active projects
                    </h3>
                    <p class="text-sm text-theme-text-muted mt-2">
                        Tap the + button to create one.
                    </p>
                </div>
            {/if}
        {/if}
    </div>
</div>
