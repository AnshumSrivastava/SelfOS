import { supabase } from '$lib/supabaseClient';
import { auth } from '$lib/stores/auth.svelte';

class MomentumService {
    /**
     * Calculates current streak based on a list of completed ISO dates.
     * Assumes dates are sorted descending (newest first).
     */
    calculateStreak(completedDates: string[]): number {
        if (completedDates.length === 0) return 0;

        const today = new Date().toISOString().split('T')[0];
        let currentStreak = 0;
        let checkDate = new Date();

        // If today is not in the list, start checking from yesterday
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

    /**
     * Checks if a milestone should be triggered based on total completion or streak.
     * This can eventually hook into gamification_notifications.
     */
    async checkMilestones(type: string, userId: string, currentCount: number) {
        // Logic to check gamification_achievements and trigger notifications
        // This is a placeholder for future cross-module logic
    }
}

export const momentumService = new MomentumService();
