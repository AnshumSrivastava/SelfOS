import { LocalStore } from './localStore.svelte';

export type UserProfile = {
    age: number;
    sex: 'male' | 'female';
    height: number; // cm
    weight: number; // kg
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';
};

export type NutritionGoals = {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    water: number; // liters
};

export type Meal = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    time: string;
    date: string; // ISO String
    isFrequent?: boolean;
};

const DEFAULT_PROFILE: UserProfile = {
    age: 25,
    sex: 'male',
    height: 180,
    weight: 75,
    activityLevel: 'moderate'
};

const DEFAULT_GOALS: NutritionGoals = {
    calories: 2500,
    protein: 150,
    carbs: 300,
    fats: 70,
    water: 3.0
};

const DEFAULT_MEALS: Meal[] = [
    {
        id: '1',
        name: "Oatmeal with Berries",
        calories: 350,
        protein: 12,
        carbs: 60,
        fats: 8,
        time: "08:00 AM",
        date: new Date().toISOString(),
        isFrequent: true
    },
    {
        id: '2',
        name: "Grilled Chicken & Rice",
        calories: 650,
        protein: 45,
        carbs: 70,
        fats: 15,
        time: "01:30 PM",
        date: new Date().toISOString(),
        isFrequent: true
    }
];

class NutritionStore {
    private profileStore = new LocalStore<UserProfile>('selfos_nutrition_profile', DEFAULT_PROFILE);
    private goalsStore = new LocalStore<NutritionGoals>('selfos_nutrition_goals', DEFAULT_GOALS);
    private mealsStore = new LocalStore<Meal[]>('selfos_nutrition_meals', DEFAULT_MEALS);
    private waterStore = new LocalStore<number>('selfos_nutrition_water', 1.2);

    get profile() { return this.profileStore.value; }
    get goals() { return this.goalsStore.value; }
    get meals() {
        const today = new Date().toISOString().split('T')[0];
        return this.mealsStore.value.filter(m => m.date.startsWith(today));
    }
    get frequentMeals() {
        return this.mealsStore.value.filter(m => m.isFrequent);
    }
    get water() { return this.waterStore.value; }

    get todayStats() {
        return this.meals.reduce((acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fats: acc.fats + meal.fats
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    }

    updateProfile(newProfile: UserProfile) {
        this.profileStore.value = newProfile;
        this.calculateGoals();
    }

    private calculateGoals() {
        const p = this.profileStore.value;

        // Mifflin-St Jeor Equation
        let bmr = (10 * p.weight) + (6.25 * p.height) - (5 * p.age);
        bmr += p.sex === 'male' ? 5 : -161;

        const multipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            extra: 1.9
        };

        const tdee = Math.round(bmr * multipliers[p.activityLevel]);

        // Standard macro split: 30% Protein, 40% Carbs, 30% Fats
        const protein = Math.round((tdee * 0.3) / 4);
        const carbs = Math.round((tdee * 0.4) / 4);
        const fats = Math.round((tdee * 0.3) / 9);

        // Water: 35ml per kg
        const water = Math.round((p.weight * 0.035) * 10) / 10;

        this.goalsStore.value = {
            calories: tdee,
            protein,
            carbs,
            fats,
            water
        };
    }

    addMeal(meal: Omit<Meal, 'id' | 'date'>, customDate?: string) {
        const newMeal = {
            ...meal,
            id: crypto.randomUUID(),
            date: customDate ? new Date(customDate).toISOString() : new Date().toISOString()
        };
        this.mealsStore.value = [...this.mealsStore.value, newMeal];
    }

    toggleFrequent(mealId: string) {
        this.mealsStore.value = this.mealsStore.value.map(m =>
            m.id === mealId ? { ...m, isFrequent: !m.isFrequent } : m
        );
    }

    removeMeal(id: string) {
        this.mealsStore.value = this.mealsStore.value.filter(m => m.id !== id);
    }

    addWater(amount: number) {
        this.waterStore.value += amount;
    }

    resetWater() {
        this.waterStore.value = 0;
    }
}

export const nutritionStore = new NutritionStore();
