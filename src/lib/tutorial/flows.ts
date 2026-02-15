import { base } from '$app/paths';

export type TutorialStep = {
    id: string;
    route: string;
    targetSelector?: string;
    title: string;
    body: string;
    placement?: 'top' | 'right' | 'bottom' | 'left' | 'center';
    action?: {
        label: string;
        type: 'click' | 'input' | 'navigate' | 'observe';
        targetSelector?: string;
    };
    skippable?: boolean;
};

export type TutorialFlow = {
    id: string;
    title: string;
    description: string;
    steps: TutorialStep[];
};

export const TUTORIAL_FLOWS: TutorialFlow[] = [
    {
        id: 'setup',
        title: 'Initial Setup',
        description: 'Configure your SelfOS workspace.',
        steps: [
            {
                id: 'welcome',
                route: `${base}/`,
                title: 'Welcome to SelfOS',
                body: 'SelfOS is your local-first personal OS. Let\'s get you settled in.',
                placement: 'center'
            },
            {
                id: 'settings-btn',
                route: `${base}/`,
                targetSelector: '#settings-nav-item',
                title: 'Customize Your Experience',
                body: 'You can change your theme, accent color, and enabled modules in Settings.',
                placement: 'right'
            },
            {
                id: 'theme-selection',
                route: `${base}/settings`,
                targetSelector: '.theme-selector',
                title: 'Appearance',
                body: 'Choose a theme that fits your style. Dark mode is the default and recommended for focus.',
                placement: 'bottom'
            }
        ]
    },
    {
        id: 'navigation',
        title: 'Navigation & Modules',
        description: 'Learn how to move around and what each module does.',
        steps: [
            {
                id: 'dashboard-overview',
                route: `${base}/`,
                title: 'The Dashboard',
                body: 'Your daily overview. See your tasks, habits, and goals at a glance.',
                placement: 'center'
            },
            {
                id: 'sidebar-nav',
                route: `${base}/`,
                targetSelector: 'nav.sidebar',
                title: 'Primary Navigation',
                body: 'Use the sidebar to switch between different modules like Tasks, Habits, and Finance.',
                placement: 'right'
            },
            {
                id: 'search-launcher',
                route: `${base}/`,
                targetSelector: '#search-trigger',
                title: 'Quick Search',
                body: 'Press Space or click here to search anything or run commands via the palette.',
                placement: 'bottom'
            }
        ]
    },
    {
        id: 'tasks',
        title: 'Tasks Module',
        description: 'Manage your daily to-dos.',
        steps: [
            {
                id: 'tasks-page',
                route: `${base}/tasks`,
                title: 'Tasks (fka Quests)',
                body: 'This is where you manage your actionable items. No emojis or gamification here anymore, just pure productivity.',
                placement: 'center'
            },
            {
                id: 'add-task',
                route: `${base}/tasks`,
                targetSelector: '#add-task-btn',
                title: 'Capture Everything',
                body: 'Click here to add a new task. Give it a title and you\'re good to go.',
                placement: 'left'
            }
        ]
    }
];

export function getFlowById(id: string): TutorialFlow | undefined {
    return TUTORIAL_FLOWS.find(f => f.id === id);
}

export function getAllFlows(): TutorialFlow[] {
    return TUTORIAL_FLOWS;
}
