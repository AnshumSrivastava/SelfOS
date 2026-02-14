import { SupabaseStore } from './supabaseStore.svelte';
import { auth } from './auth.svelte';

export type ScratchpadEntry = {
    id: string;
    projectId: string;
    content: string;
    type: 'note' | 'task';
    isCompleted?: boolean;
    createdAt?: string;
};

export type ProjectResource = {
    id: string;
    projectId: string;
    type: 'link' | 'file' | 'reference';
    title: string;
    content: string;
    createdAt?: string;
};

export type Project = {
    id: string;
    name: string;
    intent?: string;
    type: 'project' | 'area' | 'resource' | 'archive';
    icon?: string;
    color: string;
    bg: string;
    status: 'Active' | 'Paused' | 'Completed' | 'Archived';
    progress: number;
    deadline?: string;
    updatedAt: string;
    createdAt: string;
};

const DEFAULT_SECTIONS = [
    {
        id: "projects",
        name: "Projects",
        type: "project",
        description: "Goal-oriented efforts with a deadline.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        icon: "Layers"
    },
    {
        id: "areas",
        name: "Areas",
        type: "area",
        description: "Responsibilities with no end date.",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        icon: "Folder"
    },
    {
        id: "resources",
        name: "Resources",
        type: "resource",
        description: "Topics of ongoing interest.",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        icon: "BookOpen"
    },
    {
        id: "archives",
        name: "Archives",
        type: "archive",
        description: "Inactive items for reference.",
        color: "text-gray-400",
        bg: "bg-gray-800",
        icon: "Archive"
    },
];

class ProjectsStore {
    sections = DEFAULT_SECTIONS;
    private projectsStore = new SupabaseStore<Project>('projects', { migrationKey: 'selfos_projects_v3' });
    private scratchpadStore = new SupabaseStore<ScratchpadEntry>('project_scratchpad');
    private resourcesStore = new SupabaseStore<ProjectResource>('project_resources');

    constructor() {
        this.initMigration();
    }

    private async initMigration() {
        if (typeof window === 'undefined') return;

        $effect.root(() => {
            $effect(() => {
                if (!auth.loading && auth.isAuthenticated) {
                    this.migrateNestedData();
                }
            });
        });
    }

    private async migrateNestedData() {
        const stored = localStorage.getItem('selfos_projects_v3');
        if (!stored) return;

        try {
            const projects = JSON.parse(stored);
            if (Array.isArray(projects) && projects.length > 0) {
                if (this.scratchpadStore.value.length === 0 && this.projectsStore.value.length > 0) {
                    console.log("Migrating project nested data from localStorage...");
                    for (const project of projects) {
                        const sbProject = this.projectsStore.value.find(p => p.name === project.name);
                        if (sbProject) {
                            if (Array.isArray(project.scratchpad)) {
                                for (const entry of project.scratchpad) {
                                    await this.scratchpadStore.insert({
                                        projectId: sbProject.id,
                                        content: entry.content || '',
                                        type: entry.type || 'note',
                                        isCompleted: entry.isCompleted || false
                                    } as any);
                                }
                            }
                            if (Array.isArray(project.resources)) {
                                for (const res of project.resources) {
                                    await this.resourcesStore.insert({
                                        projectId: sbProject.id,
                                        title: res.title || 'Untitled',
                                        type: res.type || 'link',
                                        content: res.content || ''
                                    } as any);
                                }
                            }
                        }
                    }
                    console.log("Project nested data migration complete.");
                }
            }
        } catch (e) {
            console.error("Migration error for project nested data:", e);
        }
    }

    get projects() { return this.projectsStore.value; }
    get loading() { return this.projectsStore.loading || this.scratchpadStore.loading || this.resourcesStore.loading; }

    get activeProjects() {
        return this.projectsStore.value.filter(p => p.status === 'Active' && p.type === 'project');
    }

    get areas() {
        return this.projectsStore.value.filter(p => p.type === 'area');
    }

    get resources() {
        return this.projectsStore.value.filter(p => p.type === 'resource');
    }

    get archives() {
        return this.projectsStore.value.filter(p => p.status === 'Archived' || p.type === 'archive');
    }

    getSectionStats(type: string) {
        if (type === 'archive') {
            return this.projectsStore.value.filter(p => p.status === 'Archived').length;
        }
        return this.projectsStore.value.filter(p => p.type === type && p.status !== 'Archived').length;
    }

    getProject(id: string) {
        return this.projectsStore.value.find(p => p.id === id);
    }

    getScratchpad(projectId: string) {
        return this.scratchpadStore.value.filter(e => e.projectId === projectId);
    }

    getResources(projectId: string) {
        return this.resourcesStore.value.filter(r => r.projectId === projectId);
    }

    async addProject(project: Partial<Project>) {
        return await this.projectsStore.insert({
            name: 'New Project',
            type: 'project',
            progress: 0,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            status: 'Active',
            updatedAt: new Date().toISOString(),
            ...project
        } as any);
    }

    async updateProject(id: string, updates: Partial<Project>) {
        await this.projectsStore.update(id, {
            ...updates,
            updatedAt: new Date().toISOString()
        });
    }

    async deleteProject(id: string) {
        await this.projectsStore.delete(id);
    }

    async archiveProject(id: string) {
        await this.updateProject(id, { status: 'Archived' });
    }

    async addScratchpadEntry(projectId: string, content: string, type: 'note' | 'task' = 'note') {
        await this.scratchpadStore.insert({
            projectId,
            content,
            type,
            isCompleted: false
        } as any);
        await this.updateProject(projectId, {});
    }

    async toggleScratchpadTask(projectId: string, entryId: string) {
        const entry = this.scratchpadStore.value.find(e => e.id === entryId);
        if (entry) {
            await this.scratchpadStore.update(entryId, { isCompleted: !entry.isCompleted });
            await this.updateProject(projectId, {});
        }
    }

    async deleteScratchpadEntry(projectId: string, entryId: string) {
        await this.scratchpadStore.delete(entryId);
        await this.updateProject(projectId, {});
    }

    async deleteResource(projectId: string, resourceId: string) {
        await this.resourcesStore.delete(resourceId);
        await this.updateProject(projectId, {});
    }

    async addResource(projectId: string, resource: Omit<ProjectResource, 'id' | 'projectId' | 'createdAt'>) {
        await this.resourcesStore.insert({
            projectId,
            ...resource
        } as any);
        await this.updateProject(projectId, {});
    }

    isDormant(project: Project) {
        const TWENTY_ONE_DAYS = 21 * 24 * 60 * 60 * 1000;
        return (Date.now() - new Date(project.updatedAt).getTime()) > TWENTY_ONE_DAYS;
    }
}

export const projectsStore = new ProjectsStore();
