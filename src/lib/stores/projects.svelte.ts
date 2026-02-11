import { LocalStore } from './localStore.svelte';

export type ScratchpadEntry = {
    id: string;
    content: string;
    type: 'note' | 'task';
    isCompleted?: boolean; // For soft tasks
    createdAt: number;
};

export type ProjectResource = {
    id: string;
    type: 'link' | 'file' | 'reference';
    title: string;
    content: string; // URL or file path/blob url
    createdAt: number;
};

export type Project = {
    id: string;
    name: string;
    intent?: string; // One-sentence goal
    type: 'project' | 'area' | 'resource' | 'archive';
    icon?: string;
    color: string;
    bg: string;
    status: 'Active' | 'Paused' | 'Completed' | 'Archived';

    // Low Friction Core
    scratchpad: ScratchpadEntry[];
    resources: ProjectResource[];

    createdAt: number;
    updatedAt: number; // For dormancy detection
    deadline?: number;

    // Legacy support (optional, can be removed if strictly following new phil)
    progress: number;
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

const DEFAULT_PROJECTS: Project[] = [
    {
        id: '1',
        name: "SelfOS Remake",
        intent: "Rebuild the OS to be faster and better looking.",
        type: 'project',
        progress: 75,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        status: 'Active',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        scratchpad: [
            { id: 'sp1', content: "Initial thought: we need better stores.", type: 'note', createdAt: Date.now() - 100000 },
            { id: 'sp2', content: "setup project module structure", type: 'task', isCompleted: true, createdAt: Date.now() - 50000 }
        ],
        resources: []
    }
];

class ProjectsStore {
    sections = $state(DEFAULT_SECTIONS);
    projectsData = new LocalStore<Project[]>('selfos_projects_v3', DEFAULT_PROJECTS); // v3 to reset/migrate

    get projects() {
        return this.projectsData.value;
    }

    get activeProjects() {
        return this.projectsData.value.filter(p => p.status === 'Active' && p.type === 'project');
    }

    get areas() {
        return this.projectsData.value.filter(p => p.type === 'area');
    }

    get resources() {
        return this.projectsData.value.filter(p => p.type === 'resource');
    }

    get archives() {
        return this.projectsData.value.filter(p => p.status === 'Archived' || p.type === 'archive');
    }

    getSectionStats(type: string) {
        if (type === 'archive') {
            return this.projectsData.value.filter(p => p.status === 'Archived').length;
        }
        return this.projectsData.value.filter(p => p.type === type && p.status !== 'Archived').length;
    }

    getProject(id: string) {
        return this.projectsData.value.find(p => p.id === id);
    }

    addProject(project: Partial<Project>) {
        const newProject: Project = {
            id: crypto.randomUUID(),
            name: 'New Project',
            type: 'project',
            progress: 0,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            status: 'Active',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            scratchpad: [],
            resources: [],
            ...project
        };

        this.projectsData.value = [newProject, ...this.projectsData.value];
        return newProject;
    }

    updateProject(id: string, updates: Partial<Project>) {
        this.projectsData.value = this.projectsData.value.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
        );
    }

    deleteProject(id: string) {
        this.projectsData.value = this.projectsData.value.filter(p => p.id !== id);
    }

    archiveProject(id: string) {
        this.updateProject(id, { status: 'Archived' });
    }

    // --- Low Friction Features ---

    addScratchpadEntry(projectId: string, content: string, type: 'note' | 'task' = 'note') {
        const project = this.getProject(projectId);
        if (!project) return;

        const entry: ScratchpadEntry = {
            id: crypto.randomUUID(),
            content,
            type,
            createdAt: Date.now(),
            isCompleted: false
        };

        this.updateProject(projectId, {
            scratchpad: [...project.scratchpad, entry]
        });
    }

    toggleScratchpadTask(projectId: string, entryId: string) {
        const project = this.getProject(projectId);
        if (!project) return;

        const updatedScratchpad = project.scratchpad.map(entry =>
            entry.id === entryId ? { ...entry, isCompleted: !entry.isCompleted } : entry
        );

        this.updateProject(projectId, { scratchpad: updatedScratchpad });
    }

    addResource(projectId: string, resource: Omit<ProjectResource, 'id' | 'createdAt'>) {
        const project = this.getProject(projectId);
        if (!project) return;

        const newResource: ProjectResource = {
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            ...resource
        };

        this.updateProject(projectId, {
            resources: [...project.resources, newResource]
        });
    }

    isDormant(project: Project) {
        const TWENTY_ONE_DAYS = 21 * 24 * 60 * 60 * 1000;
        return (Date.now() - project.updatedAt) > TWENTY_ONE_DAYS;
    }
}

export const projectsStore = new ProjectsStore();
