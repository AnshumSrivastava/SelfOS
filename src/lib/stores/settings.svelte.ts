import { browser } from '$app/environment';

// Theme type definition
export type ThemeType = 'dark' | 'light' | 'amoled' | 'minimal';
export type LayoutStyle = 'card' | 'list' | 'compact';
export type FontSize = 'compact' | 'normal' | 'large';

// Dashboard widget configuration
export interface DashboardWidget {
    id: string;
    type: string;
    enabled: boolean;
    order: number;
}

// Per-page preferences
export interface PagePreferences {
    [key: string]: {
        layoutStyle?: LayoutStyle;
        showMetrics?: string[];
        hideMetrics?: string[];
    };
}

class SettingsStore {
    // Default values
    features = $state({
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
        lifeBalance: true,
        settings: true
    });

    theme = $state<ThemeType>('dark');
    accentColor = $state('#00ff9d'); // Default green
    mobileNavItems = $state(['dashboard', 'projects', 'tasks']);

    // New personalization options
    layoutStyle = $state<LayoutStyle>('card');
    fontSize = $state<FontSize>('normal');
    animations = $state(true);

    dashboardWidgets = $state<DashboardWidget[]>([
        { id: 'stats', type: 'stats', enabled: true, order: 0 },
        { id: 'habits', type: 'habits', enabled: true, order: 1 },
        { id: 'tasks', type: 'tasks', enabled: true, order: 2 },
        { id: 'activity', type: 'activity', enabled: true, order: 3 },
        { id: 'progress', type: 'progress', enabled: true, order: 4 },
        { id: 'events', type: 'events', enabled: true, order: 5 },
        { id: 'goals', type: 'goals', enabled: true, order: 6 },
    ]);

    pagePreferences = $state<PagePreferences>({});

    constructor() {
        if (browser) {
            const savedSettings = localStorage.getItem('selfos-settings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                this.features = { ...this.features, ...parsed.features };
                this.theme = parsed.theme || 'dark';
                this.accentColor = parsed.accentColor || '#00ff9d';
                this.mobileNavItems = parsed.mobileNavItems || ['dashboard', 'projects', 'tasks'];
                this.layoutStyle = parsed.layoutStyle || 'card';
                this.fontSize = parsed.fontSize || 'normal';
                this.animations = parsed.animations !== undefined ? parsed.animations : true;
                this.dashboardWidgets = parsed.dashboardWidgets || this.dashboardWidgets;
                this.pagePreferences = parsed.pagePreferences || {};
            }
            // Apply theme immediately on load
            this.applyTheme();
            this.applyFontSize();

            // Auto-save effect
            $effect.root(() => {
                $effect(() => {
                    localStorage.setItem('selfos-settings', JSON.stringify({
                        features: this.features,
                        theme: this.theme,
                        accentColor: this.accentColor,
                        mobileNavItems: this.mobileNavItems,
                        layoutStyle: this.layoutStyle,
                        fontSize: this.fontSize,
                        animations: this.animations,
                        dashboardWidgets: this.dashboardWidgets,
                        pagePreferences: this.pagePreferences,
                    }));
                });
            });
        }
    }

    toggleFeature(feature: keyof typeof this.features) {
        if (this.features[feature] !== undefined) {
            this.features[feature] = !this.features[feature];
        }
    }

    setTheme(newTheme: ThemeType) {
        this.theme = newTheme;
        this.applyTheme();
    }

    setAccentColor(color: string) {
        this.accentColor = color;
        this.applyTheme();
    }

    setLayoutStyle(style: LayoutStyle) {
        this.layoutStyle = style;
    }

    setFontSize(size: FontSize) {
        this.fontSize = size;
        this.applyFontSize();
    }

    toggleAnimations() {
        this.animations = !this.animations;
        if (browser) {
            document.documentElement.classList.toggle('no-animations', !this.animations);
        }
    }

    updateDashboardWidget(widgetId: string, updates: Partial<DashboardWidget>) {
        const index = this.dashboardWidgets.findIndex(w => w.id === widgetId);
        if (index !== -1) {
            this.dashboardWidgets[index] = { ...this.dashboardWidgets[index], ...updates };
        }
    }

    reorderDashboardWidgets(newOrder: DashboardWidget[]) {
        this.dashboardWidgets = newOrder;
    }

    setPagePreference(page: string, preferences: PagePreferences[string]) {
        this.pagePreferences[page] = { ...this.pagePreferences[page], ...preferences };
    }

    applyFontSize() {
        if (!browser) return;
        const root = document.documentElement;

        // Remove existing font size classes
        root.classList.remove('font-compact', 'font-normal', 'font-large');

        // Add new font size class
        root.classList.add(`font-${this.fontSize}`);
    }

    applyTheme() {
        if (!browser) return;

        const root = document.documentElement;

        // Handle dark class for Tailwind
        if (this.theme === 'dark' || this.theme === 'amoled' || this.theme === 'minimal') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Apply Theme Colors
        if (this.theme === 'light') {
            root.style.setProperty('--theme-background', '#ffffff');
            root.style.setProperty('--theme-surface', '#f4f4f5');
            root.style.setProperty('--theme-text', '#18181b');
            root.style.setProperty('--theme-muted', '#71717a');
            root.style.setProperty('--theme-line', '#e4e4e7');
            // Force override to ensure propagation
            root.style.setProperty('--color-text', '#18181b');
        } else if (this.theme === 'amoled') {
            root.style.setProperty('--theme-background', '#000000');
            root.style.setProperty('--theme-surface', '#050505');
            root.style.setProperty('--theme-text', '#ededed');
            root.style.setProperty('--theme-muted', '#a1a1aa');
            root.style.setProperty('--theme-line', '#27272a');
            // Force override to ensure propagation
            root.style.setProperty('--color-text', '#ededed');
        } else if (this.theme === 'minimal') {
            // Minimal Mode: Pure black/white/grey
            root.style.setProperty('--theme-background', '#000000');
            root.style.setProperty('--theme-surface', '#1a1a1a');
            root.style.setProperty('--theme-text', '#FFFFFF');
            root.style.setProperty('--theme-muted', '#999999');
            root.style.setProperty('--theme-line', '#333333');
            // Force override to ensure propagation
            root.style.setProperty('--color-text', '#FFFFFF');
        } else {
            // Default Dark
            root.style.setProperty('--theme-background', '#0a0a0c');
            root.style.setProperty('--theme-surface', '#121214');
            root.style.setProperty('--theme-text', '#ededed');
            root.style.setProperty('--theme-muted', '#a1a1aa');
            root.style.setProperty('--theme-line', '#27272a');
            // Force override to ensure propagation
            root.style.setProperty('--color-text', '#ededed');
        }

        // Apply Accent Color (use white for minimal mode)
        if (this.theme === 'minimal') {
            root.style.setProperty('--theme-primary', '#FFFFFF');
            root.style.setProperty('--color-primary', '#FFFFFF');
        } else {
            root.style.setProperty('--theme-primary', this.accentColor);
            root.style.setProperty('--color-primary', this.accentColor);
        }
    }
}

export const settings = new SettingsStore();
