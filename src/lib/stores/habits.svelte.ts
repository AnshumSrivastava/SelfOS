import { LocalStore } from './localStore.svelte';

type Habit = {
    id: string;
    name: string;
    streak: number;
    completedDates: string[]; // ISO date strings YYYY-MM-DD
};

const DEFAULT_HABITS: Habit[] = [
    { id: '1', name: "Morning Meditation", streak: 12, completedDates: [] },
    { id: '2', name: "Read 30 mins", streak: 5, completedDates: [] },
    { id: '3', name: "Workout", streak: 3, completedDates: [] },
    { id: '4', name: "No Sugar", streak: 8, completedDates: [] },
];

class HabitsStore {
    store = new LocalStore<Habit[]>('selfos_habits', DEFAULT_HABITS);

    get habits() {
        return this.store.value;
    }

    add(name: string) {
        this.store.value.push({
            id: crypto.randomUUID(),
            name,
            streak: 0,
            completedDates: []
        });
    }

    remove(id: string) {
        this.store.value = this.store.value.filter(h => h.id !== id);
    }

    toggle(id: string) {
        const today = new Date().toISOString().split('T')[0];
        const habit = this.store.value.find(h => h.id === id);

        if (habit) {
            if (habit.completedDates.includes(today)) {
                habit.completedDates = habit.completedDates.filter(d => d !== today);
            } else {
                habit.completedDates.push(today);
            }
            habit.streak = this.calculateStreak(habit.completedDates);
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

        // Double check: if yesterday is also not in main list (and today wasn't), streak is 0.
        // We need to sync checkDate with ISO string logic
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
        return habit?.completedDates.includes(today) ?? false;
    }

    get completedCount() {
        const today = new Date().toISOString().split('T')[0];
        return this.store.value.filter(h => h.completedDates.includes(today)).length;
    }

    get totalCount() {
        return this.store.value.length;
    }
}

export const habitsStore = new HabitsStore();
