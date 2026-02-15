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
    private projectsStore = new SupabaseStore<Project>('projects');
    private scratchpadStore = new SupabaseStore<ScratchpadEntry>('project_scratchpad');
    private resourcesStore = new SupabaseStore<ProjectResource>('project_resources');

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
        try {
            console.log('[ProjectsStore] Adding new project:', project.name);
            const type = project.type || 'project';
            const section = DEFAULT_SECTIONS.find(s => s.type === type);

            return await this.projectsStore.insert({
                name: project.name || 'New Item',
                type: type,
                progress: 0,
                color: section?.color.replace('text-', '') || "emerald-500",
                bg: section?.bg || "bg-emerald-500/10",
                status: type === 'archive' ? 'Archived' : 'Active',
                updatedAt: new Date().toISOString(),
                ...project
            } as any);
        } catch (error) {
            console.error('[ProjectsStore] Failed to add project:', error);
            throw error;
        }
    }

    async moveProject(id: string, newType: Project['type']) {
        try {
            const section = DEFAULT_SECTIONS.find(s => s.type === newType);
            const updates: Partial<Project> = {
                type: newType,
                status: newType === 'archive' ? 'Archived' : 'Active',
                updatedAt: new Date().toISOString()
            };

            if (section) {
                updates.color = section.color.replace('text-', '');
                updates.bg = section.bg;
            }

            await this.projectsStore.update(id, updates);
        } catch (error) {
            console.error(`[ProjectsStore] Failed to move project ${id} to ${newType}:`, error);
            throw error;
        }
    }

    async updateProject(id: string, updates: Partial<Project>) {
        try {
            await this.projectsStore.update(id, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error(`[ProjectsStore] Failed to update project ${id}:`, error);
            throw error;
        }
    }

    async deleteProject(id: string) {
        try {
            await this.projectsStore.delete(id);
        } catch (error) {
            console.error(`[ProjectsStore] Failed to delete project ${id}:`, error);
            throw error;
        }
    }

    async archiveProject(id: string) {
        await this.updateProject(id, { status: 'Archived' });
    }

    async addScratchpadEntry(projectId: string, content: string, type: 'note' | 'task' = 'note') {
        try {
            await this.scratchpadStore.insert({
                projectId,
                content,
                type,
                isCompleted: false
            } as any);
            await this.updateProject(projectId, {});
        } catch (error) {
            console.error(`[ProjectsStore] Failed to add scratchpad entry for project ${projectId}:`, error);
            throw error;
        }
    }

    async toggleScratchpadTask(projectId: string, entryId: string) {
        const entry = this.scratchpadStore.value.find(e => e.id === entryId);
        if (entry) {
            try {
                await this.scratchpadStore.update(entryId, { isCompleted: !entry.isCompleted });
                await this.updateProject(projectId, {});
            } catch (error) {
                console.error(`[ProjectsStore] Failed to toggle scratchpad task ${entryId}:`, error);
                throw error;
            }
        }
    }

    async deleteScratchpadEntry(projectId: string, entryId: string) {
        try {
            await this.scratchpadStore.delete(entryId);
            await this.updateProject(projectId, {});
        } catch (error) {
            console.error(`[ProjectsStore] Failed to delete scratchpad entry ${entryId}:`, error);
            throw error;
        }
    }

    async deleteResource(projectId: string, resourceId: string) {
        try {
            await this.resourcesStore.delete(resourceId);
            await this.updateProject(projectId, {});
        } catch (error) {
            console.error(`[ProjectsStore] Failed to delete resource ${resourceId}:`, error);
            throw error;
        }
    }

    async addResource(projectId: string, resource: Omit<ProjectResource, 'id' | 'projectId' | 'createdAt'>) {
        try {
            await this.resourcesStore.insert({
                projectId,
                ...resource
            } as any);
            await this.updateProject(projectId, {});
        } catch (error) {
            console.error(`[ProjectsStore] Failed to add resource for project ${projectId}:`, error);
            throw error;
        }
    }

    isDormant(project: Project) {
        if (!project.updatedAt) return false;
        const TWENTY_ONE_DAYS = 21 * 24 * 60 * 60 * 1000;
        return (Date.now() - new Date(project.updatedAt).getTime()) > TWENTY_ONE_DAYS;
    }
}

export const projectsStore = new ProjectsStore();
