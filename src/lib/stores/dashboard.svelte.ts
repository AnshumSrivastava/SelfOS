import { browser } from "$app/environment";
import { supabase } from "$lib/supabaseClient";
import { auth } from "./auth.svelte";
import { userStore } from "./user.svelte";

// Widget types
export type WidgetType =
    | "welcome"
    | "today-decisions"
    | "now-next-later"
    | "calendar-snapshot"
    | "momentum-snapshot"
    | "financial-pulse"
    | "goal-pulse"
    | "quick-capture"
    | "stats"
    | "habits"
    | "tasks"
    | "calendar"
    | "goals"
    | "activity";

export type Widget = {
    id: string;
    type: WidgetType;
    enabled: boolean;
    order: number;
    size: "small" | "medium" | "large" | "full";
};

export type DashboardConfig = {
    widgets: Widget[];
    layout: "grid" | "list";
};

const DEFAULT_WIDGETS: Widget[] = [
    { id: "today-decisions", type: "today-decisions", enabled: true, order: 0, size: "full" },
    { id: "now-next-later", type: "now-next-later", enabled: true, order: 1, size: "full" },
    { id: "calendar-snapshot", type: "calendar-snapshot", enabled: true, order: 2, size: "medium" },
    { id: "momentum-snapshot", type: "momentum-snapshot", enabled: true, order: 3, size: "medium" },
    { id: "financial-pulse", type: "financial-pulse", enabled: true, order: 4, size: "medium" },
    { id: "goal-pulse", type: "goal-pulse", enabled: true, order: 5, size: "medium" },
];

class DashboardStore {
    widgets = $state<Widget[]>([...DEFAULT_WIDGETS]);
    layout = $state<"grid" | "list">("grid");

    // Decision data
    todayDecisions = $state<any[]>([]);
    momentumRisks = $state<any[]>([]);
    financeAlerts = $state<any[]>([]);
    goalNextSteps = $state<any[]>([]);
    loading = $state(false);
    error = $state<string | null>(null);

    constructor() {
        if (browser) {
            this.loadConfig();
            this.fetchData();
        }
    }

    async fetchData() {
        if (!auth.isAuthenticated) return;
        this.loading = true;
        this.error = null;

        try {
            console.log('[DashboardStore] START: Fetching data from Supabase views...');

            // 10-second timeout to avoid hanging UI
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Dashboard data request timed out (10s)")), 10000);
            });

            const mainFetchPromise = Promise.all([
                supabase.from('v_today_decisions').select('*').order('score', { ascending: false }),
                supabase.from('v_momentum_risks').select('*').order('streak', { ascending: false }),
                supabase.from('v_finance_due_alerts').select('*').order('amount', { ascending: false }),
                supabase.from('v_goal_next_steps').select('*')
            ]);

            const [decisions, risks, alerts, steps] = await Promise.race([
                mainFetchPromise,
                timeoutPromise
            ]) as any[];

            // Log individual results for better debugging
            console.log('[DashboardStore] Results received:', {
                decisions: decisions?.data?.length || 0,
                risks: risks?.data?.length || 0,
                alerts: alerts?.data?.length || 0,
                steps: steps?.data?.length || 0
            });

            if (decisions.error) throw new Error(`Today Decisions Error: ${decisions.error.message}`);
            if (risks.error) throw new Error(`Momentum Risks Error: ${risks.error.message}`);
            if (alerts.error) throw new Error(`Finance Alerts Error: ${alerts.error.message}`);
            if (steps.error) throw new Error(`Goal Steps Error: ${steps.error.message}`);

            this.todayDecisions = decisions.data || [];
            this.momentumRisks = risks.data || [];
            this.financeAlerts = alerts.data || [];
            this.goalNextSteps = steps.data || [];

            console.log('[DashboardStore] SUCCESS: All data successfully loaded.');
        } catch (e: any) {
            console.error('[DashboardStore] CRITICAL FAILURE:', e);
            this.error = e.message || 'Unknown error occurred during focus initialization';
        } finally {
            this.loading = false;
        }
    }

    // Load dashboard config from localStorage
    private loadConfig() {
        const key = userStore.getUserStorageKey("dashboard-config");
        const stored = localStorage.getItem(key);

        if (stored) {
            try {
                const config: DashboardConfig = JSON.parse(stored);
                this.widgets = config.widgets;
                this.layout = config.layout;
            } catch (e) {
                console.error("Failed to load dashboard config:", e);
                this.widgets = [...DEFAULT_WIDGETS];
            }
        }
    }

    // Save dashboard config to localStorage
    private saveConfig() {
        const key = userStore.getUserStorageKey("dashboard-config");
        const config: DashboardConfig = {
            widgets: this.widgets,
            layout: this.layout,
        };
        localStorage.setItem(key, JSON.stringify(config));
    }

    // Get enabled widgets sorted by order
    get enabledWidgets() {
        return this.widgets
            .filter((w) => w.enabled)
            .sort((a, b) => a.order - b.order);
    }

    // Toggle widget visibility
    toggleWidget(widgetId: string) {
        const widget = this.widgets.find((w) => w.id === widgetId);
        if (widget) {
            widget.enabled = !widget.enabled;
            this.saveConfig();
        }
    }

    // Reorder widgets (for drag and drop)
    reorderWidgets(newOrder: Widget[]) {
        // Update order property based on array index
        this.widgets = newOrder.map((widget, index) => ({
            ...widget,
            order: index,
        }));
        this.saveConfig();
    }

    // Update widget size
    updateWidgetSize(
        widgetId: string,
        size: "small" | "medium" | "large" | "full",
    ) {
        const widget = this.widgets.find((w) => w.id === widgetId);
        if (widget) {
            widget.size = size;
            this.saveConfig();
        }
    }

    // Toggle layout
    toggleLayout() {
        this.layout = this.layout === "grid" ? "list" : "grid";
        this.saveConfig();
    }

    // Reset to defaults
    resetToDefaults() {
        this.widgets = [...DEFAULT_WIDGETS];
        this.layout = "grid";
        this.saveConfig();
    }
}

export const dashboardStore = new DashboardStore();
