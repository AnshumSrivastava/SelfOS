import { browser } from '$app/environment';

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

    theme = $state('dark'); // 'dark', 'light', 'amoled'
    accentColor = $state('#00ff9d'); // Default green
    mobileNavItems = $state(['dashboard', 'projects', 'tasks']); // Keys of items to show on mobile nav

    constructor() {
        if (browser) {
            const savedSettings = localStorage.getItem('selfos-settings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                this.features = { ...this.features, ...parsed.features };
                this.theme = parsed.theme || 'dark';
                this.accentColor = parsed.accentColor || '#00ff9d';
                this.mobileNavItems = parsed.mobileNavItems || ['dashboard', 'projects', 'tasks'];
            }
            // Apply theme immediately on load
            this.applyTheme();

            // Auto-save effect
            $effect.root(() => {
                $effect(() => {
                    localStorage.setItem('selfos-settings', JSON.stringify({
                        features: this.features,
                        theme: this.theme,
                        accentColor: this.accentColor,
                        mobileNavItems: this.mobileNavItems
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

    setTheme(newTheme: string) {
        this.theme = newTheme;
    }

    setAccentColor(color: string) {
        this.accentColor = color;
    }

    applyTheme() {
        if (!browser) return;

        const root = document.documentElement;

        // Handle dark class for Tailwind
        if (this.theme === 'dark' || this.theme === 'amoled') {
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

        // Apply Accent Color
        root.style.setProperty('--theme-primary', this.accentColor);
        // Also update the Tailwind color var for consistency
        root.style.setProperty('--color-primary', this.accentColor);
    }
}

export const settings = new SettingsStore();
