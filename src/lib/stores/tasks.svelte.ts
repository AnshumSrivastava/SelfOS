import { LocalStore } from './localStore.svelte';

type Task = {
    id: string;
    title: string;
    tag: string;
    due: string;
    completed: boolean;
};

const DEFAULT_TASKS: Task[] = [
    { id: '1', title: "Review Q1 Goals", tag: "Work", due: "Today", completed: false },
    { id: '2', title: "Update Finance Sheet", tag: "Finance", due: "Today", completed: false },
];

class TasksStore {
    store = new LocalStore<Task[]>('selfos_tasks', DEFAULT_TASKS);

    get tasks() {
        return this.store.value;
    }

    add(title: string, tag: string = 'General', due: string = 'Today') {
        this.store.value.push({
            id: crypto.randomUUID(),
            title,
            tag,
            due,
            completed: false
        });
    }

    toggle(id: string) {
        const task = this.store.value.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
        }
    }

    remove(id: string) {
        this.store.value = this.store.value.filter(t => t.id !== id);
    }

    get activeCount() {
        return this.store.value.filter(t => !t.completed).length;
    }

    get completedCount() {
        return this.store.value.filter(t => t.completed).length;
    }
}

export const tasksStore = new TasksStore();
