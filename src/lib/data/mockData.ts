// ============================================================================
// UNIFIED MOCK DATA FOR SELFOS
// ============================================================================
// This file contains all mock data for testing before Supabase integration.
// Structure is designed to support multi-user scenarios.
// ============================================================================

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: Date;
    preferences: UserPreferences;
    data: UserData;
}

export interface UserPreferences {
    theme: 'dark' | 'light' | 'amoled' | 'minimal';
    accentColor: string;
    language: string;
    timezone: string;
    notifications: {
        enabled: boolean;
        habits: boolean;
        tasks: boolean;
        goals: boolean;
    };
    features: {
        commandPalette: boolean;
        animations: boolean;
        sounds: boolean;
    };
}

// ============================================================================
// HABITS
// ============================================================================

export interface Habit {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    frequency: 'daily' | 'weekly' | 'custom';
    streak: number;
    bestStreak: number;
    completions: HabitCompletion[];
    createdAt: Date;
    archived: boolean;
}

export interface HabitCompletion {
    date: Date;
    completed: boolean;
    note?: string;
}

// ============================================================================
// TASKS
// ============================================================================

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    tags: string[];
    dueDate?: Date;
    completedAt?: Date;
    createdAt: Date;
    subtasks: Subtask[];
    links: string[];
}

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

// ============================================================================
// GOALS
// ============================================================================

export interface Goal {
    id: string;
    title: string;
    description?: string;
    category: 'personal' | 'career' | 'health' | 'finance' | 'learning' | 'other';
    progress: number; // 0-100
    target: number;
    current: number;
    unit: string;
    deadline?: Date;
    milestones: Milestone[];
    createdAt: Date;
    completedAt?: Date;
    archived: boolean;
}

export interface Milestone {
    id: string;
    title: string;
    completed: boolean;
    completedAt?: Date;
}

// ============================================================================
// FINANCE
// ============================================================================

export interface FinanceData {
    balance: number;
    income: number;
    expenses: number;
    transactions: Transaction[];
    budgets: Budget[];
    accounts: Account[];
}

export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: Date;
    accountId: string;
}

export interface Budget {
    id: string;
    category: string;
    limit: number;
    spent: number;
    period: 'weekly' | 'monthly' | 'yearly';
}

export interface Account {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'investment';
    balance: number;
}

// ============================================================================
// FITNESS
// ============================================================================

export interface FitnessData {
    workouts: Workout[];
    bodyMetrics: BodyMetric[];
    goals: FitnessGoal[];
}

export interface Workout {
    id: string;
    type: string;
    duration: number; // minutes
    calories: number;
    date: Date;
    notes?: string;
}

export interface BodyMetric {
    date: Date;
    weight?: number;
    bodyFat?: number;
    muscleMass?: number;
}

export interface FitnessGoal {
    id: string;
    type: 'weight' | 'strength' | 'endurance' | 'flexibility';
    target: number;
    current: number;
    unit: string;
}

// ============================================================================
// NUTRITION
// ============================================================================

export interface NutritionData {
    meals: Meal[];
    waterIntake: WaterLog[];
    dailyGoals: NutritionGoals;
}

export interface Meal {
    id: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: Food[];
    date: Date;
    totalCalories: number;
}

export interface Food {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    serving: string;
}

export interface WaterLog {
    date: Date;
    amount: number; // ml
}

export interface NutritionGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number; // ml
}

// ============================================================================
// NOTES & LIBRARY
// ============================================================================

export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    folder?: string;
    createdAt: Date;
    updatedAt: Date;
    pinned: boolean;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    status: 'reading' | 'completed' | 'want-to-read';
    progress: number; // pages
    totalPages: number;
    rating?: number;
    notes?: string;
    startedAt?: Date;
    completedAt?: Date;
}

// ============================================================================
// PROJECTS & JOURNAL
// ============================================================================

export interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'planning' | 'active' | 'on-hold' | 'completed';
    progress: number;
    tasks: string[]; // task IDs
    deadline?: Date;
    createdAt: Date;
}

export interface JournalEntry {
    id: string;
    date: Date;
    mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
    content: string;
    gratitude?: string[];
    highlights?: string[];
    tags: string[];
}

// ============================================================================
// FOCUS & CALENDAR
// ============================================================================

export interface FocusSession {
    id: string;
    type: 'deep-work' | 'pomodoro' | 'flow';
    duration: number; // minutes
    task?: string;
    startedAt: Date;
    completedAt?: Date;
    interruptions: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    type: 'meeting' | 'appointment' | 'reminder' | 'task';
    location?: string;
    attendees?: string[];
}

// ============================================================================
// USER DATA CONTAINER
// ============================================================================

export interface UserData {
    habits: Habit[];
    tasks: Task[];
    goals: Goal[];
    finance: FinanceData;
    fitness: FitnessData;
    nutrition: NutritionData;
    notes: Note[];
    library: Book[];
    projects: Project[];
    journal: JournalEntry[];
    focus: FocusSession[];
    calendar: CalendarEvent[];
}

// ============================================================================
// MOCK DATA
// ============================================================================

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

export const mockUser: User = {
    id: 'user-1',
    name: 'Reference One',
    email: 'user@selfos.app',
    avatar: undefined,
    createdAt: new Date('2024-01-01'),
    preferences: {
        theme: 'dark',
        accentColor: '#00ff9d',
        language: 'en',
        timezone: 'Asia/Kolkata',
        notifications: {
            enabled: true,
            habits: true,
            tasks: true,
            goals: true,
        },
        features: {
            commandPalette: true,
            animations: true,
            sounds: false,
        },
    },
    data: {
        habits: [
            {
                id: 'habit-1',
                name: 'Morning Meditation',
                description: '10 minutes of mindfulness',
                frequency: 'daily',
                streak: 2,
                bestStreak: 24,
                completions: [
                    { date: today, completed: true },
                    { date: yesterday, completed: true },
                ],
                createdAt: new Date('2024-01-15'),
                archived: false,
            },
            {
                id: 'habit-2',
                name: 'Read 30 mins',
                description: 'Daily reading habit',
                frequency: 'daily',
                streak: 0,
                bestStreak: 15,
                completions: [],
                createdAt: new Date('2024-01-20'),
                archived: false,
            },
            {
                id: 'habit-3',
                name: 'Workout',
                description: 'Exercise routine',
                frequency: 'daily',
                streak: 0,
                bestStreak: 12,
                completions: [],
                createdAt: new Date('2024-02-01'),
                archived: false,
            },
            {
                id: 'habit-4',
                name: 'No Sugar',
                description: 'Avoid processed sugar',
                frequency: 'daily',
                streak: 0,
                bestStreak: 8,
                completions: [],
                createdAt: new Date('2024-02-05'),
                archived: false,
            },
        ],
        tasks: [
            {
                id: 'task-1',
                title: 'Refactor Auth System',
                description: 'Update authentication flow',
                status: 'in-progress',
                priority: 'high',
                category: 'Development',
                tags: ['coding', 'backend'],
                dueDate: new Date('2024-02-15'),
                createdAt: new Date('2024-02-10'),
                subtasks: [
                    { id: 'st-1', title: 'Review current implementation', completed: true },
                    { id: 'st-2', title: 'Design new flow', completed: false },
                ],
                links: ['https://github.com/project/auth'],
            },
            {
                id: 'task-2',
                title: 'Write Q4 Goals',
                description: 'Plan quarterly objectives',
                status: 'todo',
                priority: 'medium',
                category: 'Planning',
                tags: ['goals', 'planning'],
                dueDate: new Date('2024-02-12'),
                createdAt: new Date('2024-02-11'),
                subtasks: [],
                links: [],
            },
            {
                id: 'task-3',
                title: 'Review PRs',
                description: 'Code review for team',
                status: 'todo',
                priority: 'high',
                category: 'Development',
                tags: ['code-review'],
                createdAt: new Date('2024-02-11'),
                subtasks: [],
                links: [],
            },
        ],
        goals: [
            {
                id: 'goal-1',
                title: 'Learn TypeScript',
                description: 'Master TypeScript for better code quality',
                category: 'learning',
                progress: 65,
                target: 100,
                current: 65,
                unit: '%',
                deadline: new Date('2024-03-31'),
                milestones: [
                    { id: 'm1', title: 'Complete basics', completed: true },
                    { id: 'm2', title: 'Build project', completed: false },
                ],
                createdAt: new Date('2024-01-01'),
                archived: false,
            },
            {
                id: 'goal-2',
                title: 'Run 5K',
                description: 'Complete a 5K run',
                category: 'health',
                progress: 40,
                target: 5,
                current: 2,
                unit: 'km',
                deadline: new Date('2024-04-30'),
                milestones: [],
                createdAt: new Date('2024-02-01'),
                archived: false,
            },
        ],
        finance: {
            balance: 1114.5,
            income: 5000,
            expenses: 3885.5,
            transactions: [
                {
                    id: 'txn-1',
                    type: 'income',
                    amount: 5000,
                    category: 'Salary',
                    description: 'Monthly salary',
                    date: new Date('2024-02-01'),
                    accountId: 'acc-1',
                },
                {
                    id: 'txn-2',
                    type: 'expense',
                    amount: 1200,
                    category: 'Rent',
                    description: 'Monthly rent',
                    date: new Date('2024-02-05'),
                    accountId: 'acc-1',
                },
                {
                    id: 'txn-3',
                    type: 'expense',
                    amount: 450,
                    category: 'Groceries',
                    description: 'Weekly groceries',
                    date: new Date('2024-02-08'),
                    accountId: 'acc-1',
                },
            ],
            budgets: [
                {
                    id: 'budget-1',
                    category: 'Food',
                    limit: 800,
                    spent: 450,
                    period: 'monthly',
                },
            ],
            accounts: [
                {
                    id: 'acc-1',
                    name: 'Main Checking',
                    type: 'checking',
                    balance: 1114.5,
                },
            ],
        },
        fitness: {
            workouts: [
                {
                    id: 'workout-1',
                    type: 'Running',
                    duration: 30,
                    calories: 300,
                    date: yesterday,
                    notes: 'Morning run',
                },
            ],
            bodyMetrics: [
                {
                    date: today,
                    weight: 70,
                    bodyFat: 18,
                },
            ],
            goals: [
                {
                    id: 'fg-1',
                    type: 'weight',
                    target: 68,
                    current: 70,
                    unit: 'kg',
                },
            ],
        },
        nutrition: {
            meals: [],
            waterIntake: [
                { date: today, amount: 1500 },
            ],
            dailyGoals: {
                calories: 2200,
                protein: 150,
                carbs: 250,
                fat: 70,
                water: 2500,
            },
        },
        notes: [
            {
                id: 'note-1',
                title: 'Project Ideas',
                content: 'List of potential side projects...',
                tags: ['ideas', 'projects'],
                createdAt: new Date('2024-02-10'),
                updatedAt: new Date('2024-02-10'),
                pinned: true,
            },
        ],
        library: [
            {
                id: 'book-1',
                title: 'Atomic Habits',
                author: 'James Clear',
                status: 'reading',
                progress: 120,
                totalPages: 320,
                rating: 5,
                startedAt: new Date('2024-01-15'),
            },
        ],
        projects: [
            {
                id: 'project-1',
                name: 'SelfOS',
                description: 'Personal productivity system',
                status: 'active',
                progress: 75,
                tasks: ['task-1'],
                createdAt: new Date('2024-01-01'),
            },
        ],
        journal: [
            {
                id: 'journal-1',
                date: today,
                mood: 'good',
                content: 'Productive day working on SelfOS redesign...',
                gratitude: ['Health', 'Family', 'Progress'],
                highlights: ['Completed UI research'],
                tags: ['productive'],
            },
        ],
        focus: [
            {
                id: 'focus-1',
                type: 'deep-work',
                duration: 270, // 4.5 hours
                task: 'UI Redesign',
                startedAt: new Date(today.setHours(9, 0, 0)),
                completedAt: new Date(today.setHours(13, 30, 0)),
                interruptions: 2,
            },
        ],
        calendar: [
            {
                id: 'event-1',
                title: 'Team Meeting',
                description: 'Weekly sync',
                startTime: new Date(today.setHours(10, 0, 0)),
                endTime: new Date(today.setHours(11, 30, 0)),
                type: 'meeting',
            },
            {
                id: 'event-2',
                title: 'Dentist Appt',
                startTime: new Date(new Date(today).setDate(today.getDate() + 1)),
                endTime: new Date(new Date(today).setDate(today.getDate() + 1)),
                type: 'appointment',
            },
        ],
    },
};

// Export current user (will be replaced with Supabase auth later)
export const currentUser = mockUser;
