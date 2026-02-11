import { browser } from "$app/environment";
import { userStore } from "./user.svelte";

// Widget types
export type WidgetType =
    | "welcome"
    | "next-actions"
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
    { id: "welcome", type: "welcome", enabled: true, order: 0, size: "full" },
    {
        id: "next-actions",
        type: "next-actions",
        enabled: true,
        order: 1,
        size: "full",
    },
    { id: "stats", type: "stats", enabled: true, order: 2, size: "full" },
    { id: "habits", type: "habits", enabled: true, order: 3, size: "medium" },
    { id: "tasks", type: "tasks", enabled: true, order: 4, size: "medium" },
    {
        id: "calendar",
        type: "calendar",
        enabled: true,
        order: 5,
        size: "medium",
    },
    { id: "goals", type: "goals", enabled: true, order: 6, size: "medium" },
    {
        id: "activity",
        type: "activity",
        enabled: true,
        order: 7,
        size: "large",
    },
];

class DashboardStore {
    widgets = $state<Widget[]>([...DEFAULT_WIDGETS]);
    layout = $state<"grid" | "list">("grid");

    constructor() {
        if (browser) {
            this.loadConfig();
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
