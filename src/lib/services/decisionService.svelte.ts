import { supabase } from '$lib/supabaseClient';
import { auth } from '$lib/stores/auth.svelte';

export interface DecisionItem {
    type: 'task' | 'event';
    id: string;
    title: string;
    focus_time: string;
    priority: string;
    status: string;
}

class DecisionService {
    private items = $state<DecisionItem[]>([]);
    private loading = $state(true);

    async fetchTodayDecisions() {
        if (!auth.isAuthenticated) return;
        this.loading = true;

        const { data, error } = await supabase
            .from('v_today_decisions')
            .select('*');

        if (!error && data) {
            this.items = data;
        }
        this.loading = false;
        return data;
    }

    get urgentItems() {
        return this.items.filter(i => i.priority === 'high');
    }

    get todaySchedule() {
        return this.items.sort((a, b) => new Date(a.focus_time).getTime() - new Date(b.focus_time).getTime());
    }

    get isLoading() {
        return this.loading;
    }
}

export const decisionService = new DecisionService();
