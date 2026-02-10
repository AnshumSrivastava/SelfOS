import { LocalStore } from './localStore.svelte';

export type Project = {
    id: string;
    name: string;
    type: 'project' | 'area' | 'resource' | 'archive';
    icon?: string; // Lucide icon name or similar (string representation)
    itemsCount: number;
    color: string;
    bg: string;
    progress?: number; // 0-100
};

const DEFAULT_PROJECTS: Project[] = [
    {
        id: "projects",
        name: "Projects",
        type: "project",
        itemsCount: 3,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        id: "areas",
        name: "Areas",
        type: "area",
        itemsCount: 4,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
    },
    {
        id: "resources",
        name: "Resources",
        type: "resource",
        itemsCount: 4,
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
    },
    {
        id: "archives",
        name: "Archives",
        type: "archive",
        itemsCount: 2,
        color: "text-gray-400",
        bg: "bg-gray-800",
    },
];

const ACTIVE_PROJECTS = [
    { id: '1', name: "SelfOS Remake", progress: 75, color: "bg-emerald-500" },
    { id: '2', name: "Q4 Fitness", progress: 30, color: "bg-emerald-500" }
];

class ProjectsStore {
    // We'll keep the categories hardcoded or separate for now as they are structural
    // But let's verify if we want to search individual projects or the categories?
    // The user wants to search "modules and data". Individual projects are data.

    sections = $state(DEFAULT_PROJECTS);
    activeProjects = new LocalStore('selfos_active_projects', ACTIVE_PROJECTS);

    get projects() {
        return this.activeProjects.value;
    }

    addProject(name: string) {
        this.activeProjects.value = [...this.activeProjects.value, {
            id: crypto.randomUUID(),
            name,
            progress: 0,
            color: "bg-emerald-500"
        }];
    }
}

export const projectsStore = new ProjectsStore();
