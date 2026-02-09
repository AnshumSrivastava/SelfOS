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
                // Simple streak logic: decrease if unchecking today? 
                // For now, just keep it simple. Real streak calc is complex.
            } else {
                habit.completedDates.push(today);
                habit.streak += 1; // Increment streak on completion
            }
        }
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
