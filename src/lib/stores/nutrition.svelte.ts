import { SupabaseStore } from './supabaseStore.svelte';
import { auth } from './auth.svelte';

export type UserProfile = {
    age: number;
    sex: 'male' | 'female';
    height: number;
    weight: number;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'extra';
};

export type NutritionGoals = {
    targetCalories: number;
    targetProtein: number;
    targetCarbs: number;
    targetFat: number;
    targetWater: number;
};

export type Meal = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    date: string;
    time: string;
    isFrequent: boolean;
    type?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

export type NutritionSettings = UserProfile & NutritionGoals & {
    waterIntake: number;
};

class NutritionStore {
    private mealsStore = new SupabaseStore<Meal>('nutrition_meals');
    private settingsStore = new SupabaseStore<NutritionSettings & { id: string }>('nutrition_settings', { orderBy: 'last_reset' });

    constructor() {
        // Init is handled by SupabaseStore
    }

    #log(message: string, data?: any, level: 'info' | 'error' | 'warn' = 'info') {
        const timestamp = new Date().toISOString();
        const status = level.toUpperCase();
        const category = 'NUTRITION';
        const prefix = `[${timestamp}] [${category}] [${status}]`;

        const logMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;

        if (data) {
            logMethod(`${prefix} ${message} |`, data);
        } else {
            logMethod(`${prefix} ${message}`);
        }
    }


    get profile(): UserProfile {
        const s = this.settingsStore.value[0];
        return {
            age: s?.age || 25,
            sex: s?.sex || 'male',
            height: s?.height || 180,
            weight: s?.weight || 75,
            activityLevel: s?.activityLevel || 'moderate'
        };
    }

    get goals(): NutritionGoals {
        const s = this.settingsStore.value[0];
        return {
            targetCalories: s?.targetCalories || 2500,
            targetProtein: s?.targetProtein || 150,
            targetCarbs: s?.targetCarbs || 300,
            targetFat: s?.targetFat || 70,
            targetWater: s?.targetWater || 3.0
        };
    }
    get loading() {
        return this.mealsStore.loading || this.settingsStore.loading;
    }

    get meals() {
        const today = new Date().toISOString().split('T')[0];
        return this.mealsStore.value.filter(m => m.date.startsWith(today));
    }

    get frequentMeals() {
        return this.mealsStore.value.filter(m => m.isFrequent);
    }

    get water() {
        return this.settingsStore.value[0]?.waterIntake || 0;
    }

    get todayStats() {
        return this.meals.reduce((acc, meal) => ({
            calories: acc.calories + meal.calories,
            protein: acc.protein + meal.protein,
            carbs: acc.carbs + meal.carbs,
            fats: acc.fats + meal.fats
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
    }

    async updateProfile(newProfile: UserProfile) {
        // Calculate new goals based on profile
        const goals = this.calculateTargetGoals(newProfile);
        await this.settingsStore.upsertSingle({
            ...newProfile,
            ...goals
        });
    }

    private calculateTargetGoals(p: UserProfile): NutritionGoals {
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
        const protein = Math.round((tdee * 0.3) / 4);
        const carbs = Math.round((tdee * 0.4) / 4);
        const fats = Math.round((tdee * 0.3) / 9);
        const water = Math.round((p.weight * 0.035) * 10) / 10;

        return {
            targetCalories: tdee,
            targetProtein: protein,
            targetCarbs: carbs,
            targetFat: fats,
            targetWater: water
        };
    }

    async addMeal(meal: Omit<Meal, 'id' | 'date'>, customDate?: string) {
        await this.mealsStore.insert({
            ...meal,
            time: meal.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            date: customDate ? new Date(customDate).toISOString() : new Date().toISOString(),
            isFrequent: false
        });
    }

    async toggleFrequent(mealId: string) {
        const meal = this.mealsStore.value.find(m => m.id === mealId);
        if (meal) {
            await this.mealsStore.update(mealId, { isFrequent: !meal.isFrequent });
        }
    }

    async removeMeal(id: string) {
        await this.mealsStore.delete(id);
    }

    async addWater(amount: number) {
        const current = this.water;
        await this.settingsStore.upsertSingle({ waterIntake: current + amount });
    }

    async resetWater() {
        await this.settingsStore.upsertSingle({ waterIntake: 0 });
    }
}

export const nutritionStore = new NutritionStore();
