import { LocalStore } from './localStore.svelte';

export type Workout = {
    id: string;
    title: string;
    duration: string;
    calories: number;
    date: string; // "Today", "Yesterday" or ISO
    type: string; // Strength, Cardio, etc.
};

const DEFAULT_WORKOUTS: Workout[] = [
    {
        id: '1',
        title: "Push Day",
        duration: "45m",
        calories: 320,
        date: "Today",
        type: "Strength"
    },
    {
        id: '2',
        title: "Morning Cardio",
        duration: "30m",
        calories: 250,
        date: "Yesterday",
        type: "Cardio"
    },
];

class FitnessStore {
    store = new LocalStore<Workout[]>('selfos_fitness', DEFAULT_WORKOUTS);

    get workouts() {
        return this.store.value;
    }

    addWorkout(workout: Omit<Workout, 'id'>) {
        this.store.value = [...this.store.value, { ...workout, id: crypto.randomUUID() }];
    }
}

export const fitnessStore = new FitnessStore();
