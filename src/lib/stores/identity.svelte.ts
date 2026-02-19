import { SupabaseStore } from './supabaseStore.svelte';
import type { IdentityTrait, IdentityAction } from '$lib/types/identity';

class IdentityTraitsStore extends SupabaseStore<IdentityTrait> {
    constructor() {
        super('identity_traits', { orderBy: 'name' });
    }
}

class IdentityActionsStore extends SupabaseStore<IdentityAction> {
    constructor() {
        super('identity_actions', { orderBy: 'created_at' });
    }

    // Analytics: Get alignment stats for the last 7 days
    get weeklyStats() {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const recentActions = this.value.filter(a => new Date(a.createdAt) >= last7Days);
        if (recentActions.length === 0) return { score: 0, total: 0, aligned: 0, misaligned: 0 };

        const aligned = recentActions.filter(a => a.isAligned).length;
        const misaligned = recentActions.length - aligned;
        const score = Math.round((aligned / recentActions.length) * 100);

        return { score, total: recentActions.length, aligned, misaligned };
    }
}

export const identityTraits = new IdentityTraitsStore();
export const identityActions = new IdentityActionsStore();
