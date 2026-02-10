import { LocalStore } from './localStore.svelte';

export type Meal = {
    id: string;
    name: string;
    calories: number;
    time: string;
    protein?: number;
    carbs?: number;
    fats?: number;
};

const DEFAULT_MEALS: Meal[] = [
    { id: '1', name: "Breakfast", calories: 450, time: "8:00 AM", protein: 30, carbs: 40, fats: 15 },
    { id: '2', name: "Lunch", calories: 850, time: "1:00 PM", protein: 50, carbs: 90, fats: 25 },
];

class NutritionStore {
    store = new LocalStore<Meal[]>('selfos_nutrition', DEFAULT_MEALS);

    get meals() {
        return this.store.value;
    }

    addMeal(meal: Omit<Meal, 'id'>) {
        this.store.value = [...this.store.value, { ...meal, id: crypto.randomUUID() }];
    }
}

export const nutritionStore = new NutritionStore();
