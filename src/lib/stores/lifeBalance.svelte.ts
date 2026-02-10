import { LocalStore } from './localStore.svelte';

export type BalanceTask = {
    id: number | string;
    title: string;
    category: string;
    completed: boolean;
};

const DEFAULT_TASKS: BalanceTask[] = [
    { id: 1, title: "Jog 5km", category: "health", completed: false },
    { id: 2, title: "Call Mom", category: "family", completed: false },
    { id: 3, title: "Guitar", category: "fun", completed: true },
    { id: 4, title: "Meditate", category: "spiritual", completed: false },
    { id: 5, title: "Water 3L", category: "health", completed: false },
];

class LifeBalanceStore {
    store = new LocalStore<BalanceTask[]>('selfos_life_balance', DEFAULT_TASKS);

    get tasks() {
        return this.store.value;
    }

    toggleTask(id: number | string) {
        const task = this.store.value.find((t) => t.id === id);
        if (task) {
            task.completed = !task.completed;
            // Trigger reactivity by reassigning
            this.store.value = [...this.store.value];
        }
    }

    addTask(task: Omit<BalanceTask, 'id'>) {
        this.store.value = [...this.store.value, { ...task, id: crypto.randomUUID(), completed: false }];
    }
}

export const lifeBalanceStore = new LifeBalanceStore();
