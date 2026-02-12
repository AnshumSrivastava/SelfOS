import { LocalStore } from './localStore.svelte';

export type Workout = {
    id: string;
    title: string;
    duration: string;
    calories: number;
    date: string; // ISO string
    type: string; // Strength, Cardio, etc.
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
};

export type HealthStats = {
    todaySteps: number;
    todayWater: number; // in liters
    weight: { date: string; value: number }[];
    sleep: { date: string; hours: number }[];
    stepGoal: number;
    waterGoal: number;
    weightGoal: number;
};

const DEFAULT_WORKOUTS: Workout[] = [
    {
        id: '1',
        title: "Push Day",
        duration: "45m",
        calories: 320,
        date: new Date().toISOString(),
        type: "Strength",
        difficulty: 'Hard'
    },
    {
        id: '2',
        title: "Morning Cardio",
        duration: "30m",
        calories: 250,
        date: new Date(Date.now() - 86400000).toISOString(),
        type: "Cardio",
        difficulty: 'Medium'
    },
];

const DEFAULT_STATS: HealthStats = {
    todaySteps: 8432,
    todayWater: 1.2,
    weight: [
        { date: new Date(Date.now() - 172800000).toISOString(), value: 73.0 },
        { date: new Date(Date.now() - 86400000).toISOString(), value: 72.8 },
        { date: new Date().toISOString(), value: 72.5 }
    ],
    sleep: [
        { date: new Date(Date.now() - 86400000).toISOString(), hours: 7.2 }
    ],
    stepGoal: 10000,
    waterGoal: 2.5,
    weightGoal: 70
};

class FitnessStore {
    private workoutsStore = new LocalStore<Workout[]>('selfos_fitness_workouts', DEFAULT_WORKOUTS);
    private statsStore = new LocalStore<HealthStats>('selfos_fitness_stats', DEFAULT_STATS);

    get workouts() {
        return this.workoutsStore.value;
    }

    get stats() {
        return this.statsStore.value;
    }

    addWorkout(workout: Omit<Workout, 'id'>) {
        this.workoutsStore.value = [{ ...workout, id: crypto.randomUUID() }, ...this.workoutsStore.value];
    }

    removeWorkout(id: string) {
        this.workoutsStore.value = this.workoutsStore.value.filter(w => w.id !== id);
    }

    updateSteps(count: number) {
        this.statsStore.value.todaySteps = count;
    }

    addWater(amount: number) {
        this.statsStore.value.todayWater += amount;
    }

    logWeight(value: number) {
        const date = new Date().toISOString();
        this.statsStore.value.weight = [...this.statsStore.value.weight, { date, value }];
    }

    logSleep(hours: number) {
        const date = new Date().toISOString();
        this.statsStore.value.sleep = [...this.statsStore.value.sleep, { date, hours }];
    }

    get latestWeight() {
        const history = this.statsStore.value.weight;
        return history.length > 0 ? history[history.length - 1].value : 0;
    }

    get latestSleep() {
        const history = this.statsStore.value.sleep;
        return history.length > 0 ? history[history.length - 1].hours : 0;
    }
}

export const fitnessStore = new FitnessStore();
