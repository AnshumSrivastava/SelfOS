import { LocalStore } from './localStore.svelte';

export type Task = {
    id: string;
    title: string;
    description?: string;
    project: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'completed';
    deadline: string | null; // ISO Date string
    scheduled: string | null; // ISO Date string
    createdAt: string; // ISO Date string
    completedAt?: string | null; // ISO Date string
};

const DEFAULT_TASKS: Task[] = [
    {
        id: '1',
        title: "Refactor Auth System",
        project: "SelfOS",
        priority: 'high',
        status: 'pending',
        deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        scheduled: null,
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        title: "Write Q4 Goals",
        project: "Life",
        priority: 'medium',
        status: 'pending',
        deadline: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        scheduled: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString()
    },
];

class TasksStore {
    store = new LocalStore<Task[]>('selfos_tasks_v2', DEFAULT_TASKS);

    get tasks() {
        return this.store.value;
    }

    add(task: Omit<Task, 'id' | 'createdAt' | 'status' | 'completedAt'>) {
        this.store.value.push({
            id: crypto.randomUUID(),
            title: task.title,
            description: task.description,
            project: task.project || 'General',
            priority: task.priority || 'medium',
            status: 'pending',
            deadline: task.deadline || null,
            scheduled: task.scheduled || null,
            createdAt: new Date().toISOString(),
            completedAt: null
        });
    }

    update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) {
        const index = this.store.value.findIndex(t => t.id === id);
        if (index !== -1) {
            this.store.value[index] = { ...this.store.value[index], ...updates };
        }
    }

    toggle(id: string) {
        const task = this.store.value.find(t => t.id === id);
        if (task) {
            if (task.status === 'completed') {
                task.status = 'pending';
                task.completedAt = null;
            } else {
                task.status = 'completed';
                task.completedAt = new Date().toISOString();
            }
        }
    }

    remove(id: string) {
        this.store.value = this.store.value.filter(t => t.id !== id);
    }

    get activeCount() {
        return this.store.value.filter(t => t.status !== 'completed').length;
    }

    get completedCount() {
        return this.store.value.filter(t => t.status === 'completed').length;
    }
}

export const tasksStore = new TasksStore();
