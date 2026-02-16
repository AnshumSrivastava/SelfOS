import { SupabaseStore } from './supabaseStore.svelte';
import { auth } from './auth.svelte';
import { logger } from '$lib/services/logger';
import { syncStore } from './sync.svelte';

export type Workout = {
    id: string;
    title: string;
    duration: number; // in minutes
    calories: number;
    date: string;
    type: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
};

export type WeightLog = {
    id: string;
    date: string;
    value: number;
};

export type SleepLog = {
    id: string;
    date: string;
    hours: number;
};

export type DailyMetrics = {
    date: string;
    steps: number;
    water: number;
};

export type FitnessStats = {
    weightGoal: number;
    stepGoal: number;
    waterGoal: number;
};

class FitnessStore {
    private workoutsStore = new SupabaseStore<Workout>('fitness_workouts');
    private weightStore = new SupabaseStore<WeightLog>('fitness_weight_logs');
    private sleepStore = new SupabaseStore<SleepLog>('fitness_sleep_logs');
    private goalsStore = new SupabaseStore<FitnessStats & { id: string }>('fitness_stats', { orderBy: 'updated_at' });
    private dailyStore = new SupabaseStore<DailyMetrics & { id: string }>('fitness_daily_metrics', { orderBy: 'date' });

    constructor() {
        syncStore.register('fitness_workouts', 'Workouts');
        syncStore.register('fitness_weight_logs', 'Weight History');
        syncStore.register('fitness_sleep_logs', 'Sleep Tracking');
        syncStore.register('fitness_stats', 'Fitness Goals');
        syncStore.register('fitness_daily_metrics', 'Daily Fitness');

        logger.info('SYSTEM', 'Fitness Store initialized', null, 'fitness');
    }

    get workouts() { return this.workoutsStore.value; }
    get weights() { return this.weightStore.value; }
    get sleepLogs() { return this.sleepStore.value; }
    get goals() { return this.goalsStore.value[0] || { weightGoal: 70, stepGoal: 10000, waterGoal: 2.5 }; }
    get loading() {
        return this.workoutsStore.loading ||
            this.weightStore.loading ||
            this.sleepStore.loading ||
            this.goalsStore.loading ||
            this.dailyStore.loading;
    }

    // For backward compatibility with UI
    get stats() {
        const today = new Date().toISOString().split('T')[0];
        const daily = this.dailyStore.value.find(d => (d as any).date === today) || { steps: 0, water: 0 };
        return {
            todaySteps: daily.steps,
            todayWater: daily.water,
            weight: this.weightStore.value,
            sleep: this.sleepStore.value,
            stepGoal: this.goals.stepGoal,
            waterGoal: this.goals.waterGoal,
            weightGoal: this.goals.weightGoal
        };
    }

    async addWorkout(workout: Omit<Workout, 'id'>) {
        await this.workoutsStore.insert(workout);
    }

    async removeWorkout(id: string) {
        await this.workoutsStore.delete(id);
    }

    async updateSteps(count: number) {
        const today = new Date().toISOString().split('T')[0];
        const existing = this.dailyStore.value.find(d => (d as any).date === today);
        await this.dailyStore.upsertSingle({
            id: existing?.id,
            date: today,
            steps: count
        } as any);
    }

    async addWater(amount: number) {
        const today = new Date().toISOString().split('T')[0];
        const existing = this.dailyStore.value.find(d => (d as any).date === today);
        const currentWater = existing?.water || 0;
        await this.dailyStore.upsertSingle({
            id: existing?.id,
            date: today,
            water: currentWater + amount
        } as any);
    }

    async logWeight(value: number) {
        await this.weightStore.insert({ date: new Date().toISOString(), value });
    }

    async logSleep(hours: number) {
        await this.sleepStore.insert({ date: new Date().toISOString(), hours });
    }

    get latestWeight() {
        const history = this.weightStore.value;
        return history.length > 0 ? history[0].value : 0; // order is created_at desc
    }

    get latestSleep() {
        const history = this.sleepStore.value;
        return history.length > 0 ? history[0].hours : 0;
    }
}

export const fitnessStore = new FitnessStore();
