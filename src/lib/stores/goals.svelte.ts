import { LocalStore } from './localStore.svelte';

export type Goal = {
    id: string;
    title: string;
    deadline: string;
    progress: number;
    tasks: number;
};

const DEFAULT_GOALS: Goal[] = [
    {
        id: '1',
        title: "Launch SaaS MV",
        deadline: "Dec 31",
        progress: 65,
        tasks: 12,
    },
    {
        id: '2',
        title: "Reach 10% Body Fat",
        deadline: "Nov 15",
        progress: 40,
        tasks: 20,
    },
    {
        id: '3',
        title: "Read 12 Books",
        deadline: "Dec 31",
        progress: 33,
        tasks: 12,
    },
];

class GoalsStore {
    store = new LocalStore<Goal[]>('selfos_goals', DEFAULT_GOALS);

    get goals() {
        return this.store.value;
    }

    addGoal(goal: Omit<Goal, 'id'>) {
        this.store.value = [...this.store.value, { ...goal, id: crypto.randomUUID() }];
    }
}

export const goalsStore = new GoalsStore();
