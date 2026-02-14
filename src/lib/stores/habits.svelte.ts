import { SupabaseStore } from './supabaseStore.svelte';

export type Habit = {
    id: string;
    name: string;
    description?: string;
    streak: number;
    completed_dates: string[]; // ISO date strings YYYY-MM-DD
    created_at?: string;
};

class HabitsStore {
    private store = new SupabaseStore<Habit>('habits');

    get habits() {
        return this.store.value;
    }

    get loading() {
        return this.store.loading;
    }

    async add(name: string) {
        await this.store.insert({
            name,
            streak: 0,
            completed_dates: []
        });
    }

    async remove(id: string) {
        await this.store.delete(id);
    }

    async toggle(id: string) {
        const today = new Date().toISOString().split('T')[0];
        const habit = this.store.value.find(h => h.id === id);

        if (habit) {
            let completedDates = [...habit.completed_dates];
            if (completedDates.includes(today)) {
                completedDates = completedDates.filter(d => d !== today);
            } else {
                completedDates.push(today);
            }
            const streak = this.calculateStreak(completedDates);
            await this.store.update(id, {
                completed_dates: completedDates,
                streak
            });
        }
    }

    calculateStreak(completedDates: string[]): number {
        if (completedDates.length === 0) return 0;

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Start checking from today
        let checkDate = new Date(today);

        // If today is NOT completed, start checking from yesterday.
        if (!completedDates.includes(todayStr)) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        let checkDateStr = checkDate.toISOString().split('T')[0];
        if (!completedDates.includes(checkDateStr)) {
            return 0;
        }

        let currentStreak = 0;
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (completedDates.includes(dateStr)) {
                currentStreak++;
                // Move to previous day
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return currentStreak;
    }

    isCompleted(id: string) {
        const today = new Date().toISOString().split('T')[0];
        const habit = this.store.value.find(h => h.id === id);
        return habit?.completed_dates.includes(today) ?? false;
    }

    get completedCount() {
        const today = new Date().toISOString().split('T')[0];
        return this.store.value.filter(h => h.completed_dates.includes(today)).length;
    }

    get totalCount() {
        return this.store.value.length;
    }
}

export const habitsStore = new HabitsStore();
