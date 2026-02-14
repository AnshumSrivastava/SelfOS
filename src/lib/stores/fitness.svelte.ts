import { SupabaseStore } from './supabaseStore.svelte';
import { supabase } from '$lib/supabaseClient';
import { auth } from './auth.svelte';

export type Workout = {
    id: string;
    title: string;
    duration: string;
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
    private workoutsStore = new SupabaseStore<Workout>('fitness_workouts', { migrationKey: 'selfos_fitness_workouts' });
    private weightStore = new SupabaseStore<WeightLog>('fitness_weight_logs');
    private sleepStore = new SupabaseStore<SleepLog>('fitness_sleep_logs');
    private goalsStore = new SupabaseStore<FitnessStats & { id: string }>('fitness_stats');
    private dailyStore = new SupabaseStore<DailyMetrics & { id: string }>('fitness_daily_metrics');

    constructor() {
        this.initMigration();
    }

    private async initMigration() {
        if (typeof window === 'undefined') return;

        // Custom migration for the complex stats object
        $effect.root(() => {
            $effect(() => {
                if (!auth.loading && auth.isAuthenticated) {
                    this.migrateStats();
                }
            });
        });
    }

    private async migrateStats() {
        const stored = localStorage.getItem('selfos_fitness_stats');
        if (!stored) return;

        try {
            const stats = JSON.parse(stored);
            // Verify if migration already happened by checking if goals were ever fetched
            if (this.goalsStore.value.length === 0) {
                console.log("Migrating fitness stats from localStorage...");

                // 1. Migrate Goals
                await this.goalsStore.upsertSingle({
                    weightGoal: stats.weightGoal || 70,
                    stepGoal: stats.stepGoal || 10000,
                    waterGoal: stats.waterGoal || 2.5
                });

                // 2. Migrate Weight History
                if (Array.isArray(stats.weight)) {
                    for (const w of stats.weight) {
                        await this.weightStore.insert({ date: w.date, value: w.value });
                    }
                }

                // 3. Migrate Sleep History
                if (Array.isArray(stats.sleep)) {
                    for (const s of stats.sleep) {
                        await this.sleepStore.insert({ date: s.date, hours: s.hours });
                    }
                }

                // 4. Migrate Daily Metrics (today)
                const today = new Date().toISOString().split('T')[0];
                await this.dailyStore.upsertSingle({
                    id: today, // Using date as ID for daily metrics in this context if needed, or structured differently
                    steps: stats.todaySteps || 0,
                    water: stats.todayWater || 0
                } as any);

                console.log("Fitness stats migration complete.");
            }
        } catch (e) {
            console.error("Migration error for fitness stats:", e);
        }
    }

    get workouts() { return this.workoutsStore.value; }
    get weights() { return this.weightStore.value; }
    get sleepLogs() { return this.sleepStore.value; }
    get goals() { return this.goalsStore.value[0] || { weightGoal: 70, stepGoal: 10000, waterGoal: 2.5 }; }

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
        await this.dailyStore.upsertSingle({ steps: count } as any);
    }

    async addWater(amount: number) {
        const today = new Date().toISOString().split('T')[0];
        const currentWater = this.stats.todayWater;
        await this.dailyStore.upsertSingle({ water: currentWater + amount } as any);
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
