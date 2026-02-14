import { browser } from '$app/environment';
import { SupabaseStore } from './supabaseStore.svelte';
import { auth } from './auth.svelte';

export type ThemeType = 'dark' | 'light' | 'amoled' | 'minimal';
export type LayoutStyle = 'card' | 'list' | 'compact';
export type FontSize = 'compact' | 'normal' | 'large';

export interface DashboardWidget {
    id: string;
    type: string;
    enabled: boolean;
    order: number;
}

export interface PagePreferences {
    [key: string]: {
        layoutStyle?: LayoutStyle;
        showMetrics?: string[];
        hideMetrics?: string[];
    };
}

export interface UserSettings {
    theme: ThemeType;
    accentColor: string;
    features: Record<string, boolean>;
    mobileNavItems: string[];
    layoutStyle: LayoutStyle;
    fontSize: FontSize;
    animations: boolean;
    borderRadius: number;
    modulePadding: number;
    dashboardWidgets: DashboardWidget[];
    pagePreferences: PagePreferences;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
    { id: 'stats', type: 'stats', enabled: true, order: 0 },
    { id: 'habits', type: 'habits', enabled: true, order: 1 },
    { id: 'tasks', type: 'tasks', enabled: true, order: 2 },
    { id: 'activity', type: 'activity', enabled: true, order: 3 },
    { id: 'progress', type: 'progress', enabled: true, order: 4 },
    { id: 'events', type: 'events', enabled: true, order: 5 },
    { id: 'goals', type: 'goals', enabled: true, order: 6 },
];

const DEFAULT_FEATURES = {
    dashboard: true,
    habits: true,
    finance: true,
    fitness: true,
    nutrition: true,
    tasks: true,
    notes: true,
    library: true,
    goals: true,
    projects: true,
    journal: true,
    focus: true,
    calendar: true,
    settings: true
};

class SettingsStore {
    private store = new SupabaseStore<UserSettings & { id: string }>('user_settings', { orderBy: 'updated_at' });

    constructor() {
        if (browser) {
            this.init();
        }
    }

    private async init() {
        // Init is handled by SupabaseStore
        $effect.root(() => {
            // Effect to apply visual settings when data changes
            $effect(() => {
                if (this.current) {
                    this.applyAll();
                }
            });
        });
    }

    get current(): UserSettings {
        const s = this.store.value[0];
        return {
            theme: s?.theme || 'dark',
            accentColor: s?.accentColor || '#00ff9d',
            features: s?.features || DEFAULT_FEATURES,
            mobileNavItems: s?.mobileNavItems || ['dashboard', 'projects', 'tasks'],
            layoutStyle: s?.layoutStyle || 'card',
            fontSize: s?.fontSize || 'normal',
            animations: s?.animations ?? true,
            borderRadius: s?.borderRadius || 16,
            modulePadding: s?.modulePadding || 24,
            dashboardWidgets: s?.dashboardWidgets || DEFAULT_WIDGETS,
            pagePreferences: s?.pagePreferences || {}
        };
    }

    // Facade properties for reactivity in components
    get theme() { return this.current.theme; }
    get accentColor() { return this.current.accentColor; }
    get features() { return this.current.features; }
    get layoutStyle() { return this.current.layoutStyle; }
    get fontSize() { return this.current.fontSize; }
    get animations() { return this.current.animations; }
    get borderRadius() { return this.current.borderRadius; }
    get modulePadding() { return this.current.modulePadding; }
    get dashboardWidgets() { return this.current.dashboardWidgets; }
    get pagePreferences() { return this.current.pagePreferences; }
    get mobileNavItems() { return this.current.mobileNavItems; }

    async update(updates: Partial<UserSettings>) {
        await this.store.upsertSingle(updates);
    }

    async toggleFeature(feature: string) {
        const features = { ...this.features };
        features[feature] = !features[feature];
        await this.update({ features });
    }

    async setTheme(theme: ThemeType) {
        await this.update({ theme });
    }

    async setAccentColor(accentColor: string) {
        await this.update({ accentColor });
    }

    async setLayoutStyle(layoutStyle: LayoutStyle) {
        await this.update({ layoutStyle });
    }

    async setFontSize(fontSize: FontSize) {
        await this.update({ fontSize });
    }

    async toggleAnimations() {
        await this.update({ animations: !this.animations });
    }

    async updateDashboardWidget(widgetId: string, updates: Partial<DashboardWidget>) {
        const widgets = [...this.dashboardWidgets];
        const index = widgets.findIndex(w => w.id === widgetId);
        if (index !== -1) {
            widgets[index] = { ...widgets[index], ...updates };
            await this.update({ dashboardWidgets: widgets });
        }
    }

    async setDesignVariable(variable: 'borderRadius' | 'modulePadding', value: number) {
        await this.update({ [variable]: value });
    }

    async setPagePreference(page: string, preferences: any) {
        const currentPrefs = { ...this.pagePreferences };
        currentPrefs[page] = { ...currentPrefs[page], ...preferences };
        await this.update({ pagePreferences: currentPrefs });
    }

    private applyAll() {
        if (!browser) return;
        this.applyTheme();
        this.applyFontSize();
        this.applyDesignSystem();
        document.documentElement.classList.toggle('no-animations', !this.animations);
    }

    private applyFontSize() {
        const root = document.documentElement;
        root.classList.remove('font-compact', 'font-normal', 'font-large');
        root.classList.add(`font-${this.fontSize}`);
    }

    private applyDesignSystem() {
        const root = document.documentElement;
        root.style.setProperty('--card-radius', `${this.borderRadius}px`);
        root.style.setProperty('--module-padding', `${this.modulePadding}px`);
    }

    private applyTheme() {
        const root = document.documentElement;
        const { theme, accentColor } = this.current;

        if (theme === 'dark' || theme === 'amoled' || theme === 'minimal') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        if (theme === 'light') {
            root.style.setProperty('--theme-background', '#ffffff');
            root.style.setProperty('--theme-surface', '#f4f4f5');
            root.style.setProperty('--theme-text', '#18181b');
            root.style.setProperty('--color-text', '#18181b');
            root.style.setProperty('--theme-muted', '#71717a');
            root.style.setProperty('--theme-line', '#e4e4e7');
        } else if (theme === 'amoled') {
            root.style.setProperty('--theme-background', '#000000');
            root.style.setProperty('--theme-surface', '#050505');
            root.style.setProperty('--theme-text', '#ededed');
            root.style.setProperty('--color-text', '#ededed');
            root.style.setProperty('--theme-muted', '#a1a1aa');
            root.style.setProperty('--theme-line', '#27272a');
        } else if (theme === 'minimal') {
            root.style.setProperty('--theme-background', '#000000');
            root.style.setProperty('--theme-surface', '#1a1a1a');
            root.style.setProperty('--theme-text', '#FFFFFF');
            root.style.setProperty('--color-text', '#FFFFFF');
            root.style.setProperty('--theme-muted', '#999999');
            root.style.setProperty('--theme-line', '#333333');
        } else {
            root.style.setProperty('--theme-background', '#0a0a0c');
            root.style.setProperty('--theme-surface', '#121214');
            root.style.setProperty('--theme-text', '#ededed');
            root.style.setProperty('--color-text', '#ededed');
            root.style.setProperty('--theme-muted', '#a1a1aa');
            root.style.setProperty('--theme-line', '#27272a');
        }

        if (theme === 'minimal') {
            root.style.setProperty('--theme-primary', '#FFFFFF');
            root.style.setProperty('--color-primary', '#FFFFFF');
        } else {
            root.style.setProperty('--theme-primary', accentColor);
            root.style.setProperty('--color-primary', accentColor);
        }
    }
}

export const settings = new SettingsStore();
