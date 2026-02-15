import { SupabaseStore } from './supabaseStore.svelte';
import { supabase } from '$lib/supabaseClient';
import { auth } from './auth.svelte';

export type Habit = {
    id: string;
    name: string;
    description?: string;
    color?: string;
    frequency?: string;
    streak: number;
    last_completed?: string;
    created_at?: string;
    updated_at?: string;
};

export type HabitCheckin = {
    id: string;
    habit_id: string;
    date: string;
    status: 'completed' | 'skipped';
};

class HabitsStore {
    private store = new SupabaseStore<Habit>('habits');
    private checkins = $state<HabitCheckin[]>([]);
    private checkinsLoading = $state(true);

    #log(message: string, data?: any, level: 'info' | 'error' | 'warn' = 'info') {
        const timestamp = new Date().toISOString();
        const status = level.toUpperCase();
        const category = 'HABITS';
        const prefix = `[${timestamp}] [${category}] [${status}]`;

        const logMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;

        if (data) {
            logMethod(`${prefix} ${message} |`, data);
        } else {
            logMethod(`${prefix} ${message}`);
        }
    }

    constructor() {
        this.fetchCheckins();
    }

    get habits() {
        return this.store.value;
    }

    get loading() {
        return this.store.loading || this.checkinsLoading;
    }

    async fetchCheckins() {
        if (!auth.isAuthenticated) return;
        this.checkinsLoading = true;
        const { data, error } = await supabase
            .from('habit_checkins')
            .select('*')
            .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

        if (!error && data) {
            this.checkins = data;
        } else if (error) {
            this.#log('Failed to fetch checkins', error, 'error');
        }
        this.checkinsLoading = false;
    }

    async add(name: string) {
        if (!auth.isAuthenticated) {
            this.#log('Failed to add habit: User not authenticated', null, 'error');
            throw new Error("You must be logged in to add habits");
        }

        this.#log(`Attempting to add habit: ${name}`);
        try {
            const result = await this.store.insert({
                name,
                streak: 0,
                frequency: 'daily',
                color: '#00ff9d'
            });

            if (result) {
                this.#log('Habit added successfully', result);
                return result;
            } else {
                throw new Error("Insert succeeded but returned no data");
            }
        } catch (error: any) {
            this.#log('Failed to add habit', error, 'error');
            throw error;
        }
    }

    async remove(id: string) {
        await this.store.delete(id);
    }

    async toggle(id: string) {
        const today = new Date().toISOString().split('T')[0];
        const existingCheckin = this.checkins.find(c => c.habit_id === id && c.date === today);

        if (existingCheckin) {
            const { error } = await supabase
                .from('habit_checkins')
                .delete()
                .eq('id', existingCheckin.id);

            if (error) {
                this.#log('Failed to delete checkin', error, 'error');
                throw error;
            }
            this.checkins = this.checkins.filter(c => c.id !== existingCheckin.id);
        } else {
            const { data, error } = await supabase
                .from('habit_checkins')
                .insert([{
                    user_id: auth.user?.id,
                    habit_id: id,
                    date: today,
                    status: 'completed'
                }])
                .select()
                .single();

            if (error) {
                this.#log('Failed to insert checkin', error, 'error');
                throw error;
            }
            if (data) {
                this.checkins.push(data);
            }
        }

        // Update streak (simplified for now, moving to MomentumService later)
        await this.updateStreak(id);
    }

    private async updateStreak(id: string) {
        const habitCheckins = this.checkins
            .filter(c => c.habit_id === id)
            .map(c => c.date)
            .sort((a, b) => b.localeCompare(a));

        const streak = this.calculateStreak(habitCheckins);
        await this.store.update(id, { streak });
    }

    calculateStreak(completedDates: string[]): number {
        if (completedDates.length === 0) return 0;

        const today = new Date().toISOString().split('T')[0];
        let currentStreak = 0;
        let checkDate = new Date();

        // If not completed today, start from yesterday
        if (!completedDates.includes(today)) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (completedDates.includes(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return currentStreak;
    }

    isCompleted(id: string) {
        const today = new Date().toISOString().split('T')[0];
        return this.checkins.some(c => c.habit_id === id && c.date === today);
    }

    get completedCount() {
        const today = new Date().toISOString().split('T')[0];
        return this.checkins.filter(c => c.date === today).length;
    }

    get totalCount() {
        return this.store.value.length;
    }
}

export const habitsStore = new HabitsStore();
