import { SupabaseStore, type StoreStatus } from './supabaseStore.svelte';
import { supabase } from '$lib/supabaseClient';
import { auth } from './auth.svelte';
import { generateUUID } from '$lib/utils/uuid';
import { logger } from '$lib/services/logger';
import { syncStore } from './sync.svelte';

export type Habit = {
    id: string;
    name: string;
    description?: string;
    color?: string;
    frequency?: string;
    streak: number;
    completed_dates?: string[];
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
    private checkinsStatus = $state<StoreStatus>('idle');
    private checkinsError = $state<string | null>(null);

    #log(message: string, data?: any, level: 'info' | 'error' | 'warn' = 'info') {
        logger[level]('DATA', message, data, 'HabitsStore');
    }

    #setCheckinsStatus(status: StoreStatus, error: string | null = null) {
        this.checkinsStatus = status;
        this.checkinsError = error;
        syncStore.updateStatus('habit_checkins', status, error);
    }

    constructor() {
        syncStore.register('habit_checkins', 'habit_checkins');
        if (typeof window !== 'undefined') {
            $effect.root(() => {
                $effect(() => {
                    if (!auth.loading) {
                        if (auth.isAuthenticated) {
                            this.#log(`Auth ready, fetching initial checkins...`);
                            this.fetchCheckins();
                        } else {
                            this.checkinsLoading = false;
                        }
                    }
                });
            });
        }
    }

    get status() {
        if (this.store.status === 'saving' || this.checkinsStatus === 'saving') return 'saving';
        if (this.store.status === 'loading' || this.checkinsLoading) return 'loading';
        if (this.store.status === 'error' || this.checkinsStatus === 'error') return 'error';
        if (this.store.status === 'success' || this.checkinsStatus === 'success') return 'success';
        return 'idle';
    }

    get errorMsg() {
        return this.store.errorMsg || this.checkinsError;
    }

    get habits() {
        return this.store.value.map(habit => ({
            ...habit,
            completedDates: this.checkins
                .filter(c => c.habit_id === habit.id && c.status === 'completed')
                .map(c => c.date)
        }));
    }

    get loading() {
        return this.store.loading || this.checkinsLoading;
    }

    async fetchCheckins() {
        if (!auth.isAuthenticated) return;
        this.#setCheckinsStatus('loading');
        try {
            const { data, error } = await supabase
                .from('habit_checkins')
                .select('*')
                .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

            if (error) {
                this.#log('Failed to fetch checkins', error, 'error');
                this.#setCheckinsStatus('error', error.message);
                return;
            }

            if (data) {
                this.checkins = data;
                this.#setCheckinsStatus('idle');
            }
        } catch (e) {
            this.#log('Unexpected error fetching checkins', e, 'error');
            this.#setCheckinsStatus('error', (e as Error).message);
        }
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
        const previousCheckins = [...this.checkins];
        this.#setCheckinsStatus('saving');

        if (existingCheckin) {
            // Optimistic Remove
            this.checkins = this.checkins.filter(c => c.id !== existingCheckin.id);

            try {
                const { error } = await supabase
                    .from('habit_checkins')
                    .delete()
                    .eq('id', existingCheckin.id);

                if (error) {
                    this.#log('Failed to delete checkin, rolling back', error, 'error');
                    this.checkins = previousCheckins;
                    this.#setCheckinsStatus('error', error.message);
                    throw error;
                }
                this.#setCheckinsStatus('success');
                setTimeout(() => { if (this.checkinsStatus === 'success') this.#setCheckinsStatus('idle'); }, 2000);
            } catch (err) {
                this.checkins = previousCheckins;
                this.#setCheckinsStatus('error', (err as Error).message);
                throw err;
            }
        } else {
            // Optimistic Add
            const tempId = `temp-${generateUUID()}`;
            const optimisticCheckin: HabitCheckin = {
                id: tempId,
                habit_id: id,
                date: today,
                status: 'completed'
            };
            this.checkins = [...this.checkins, optimisticCheckin];

            try {
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
                    this.#log('Failed to insert checkin, rolling back', error, 'error');
                    this.checkins = previousCheckins;
                    this.#setCheckinsStatus('error', error.message);
                    throw error;
                }

                if (data) {
                    // Replace tempId with actual id from DB
                    this.checkins = this.checkins.map(c => c.id === tempId ? data : c);
                    this.#setCheckinsStatus('success');
                    setTimeout(() => { if (this.checkinsStatus === 'success') this.#setCheckinsStatus('idle'); }, 2000);
                }
            } catch (err) {
                this.checkins = previousCheckins;
                this.#setCheckinsStatus('error', (err as Error).message);
                throw err;
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
