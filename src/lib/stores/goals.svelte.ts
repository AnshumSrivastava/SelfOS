import { LocalStore } from './localStore.svelte';

// Simplified data types
export type Priority = 'high' | 'normal' | 'low';

export interface Goal {
    id: string;
    title: string;
    description?: string;
    deadline?: string;
    priority: Priority;
    completed: boolean;
    createdAt: string;
}

export interface Task {
    id: string;
    goalId: string;
    title: string;
    link?: string; // Optional link for the task
    completed: boolean;
    createdAt: string;
}

// YouTube video data
interface YouTubeVideo {
    title: string;
    url: string;
}

// YouTube playlist parsing via server-side API
async function parseYouTubePlaylist(url: string): Promise<YouTubeVideo[]> {
    try {
        const response = await fetch('/api/youtube-playlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            console.error('Failed to parse YouTube playlist');
            return [];
        }

        const data = await response.json();
        return data.videos || [];
    } catch (error) {
        console.error('Failed to parse YouTube playlist:', error);
        return [];
    }
}

// Detect if text contains a YouTube playlist URL
function isYouTubePlaylistUrl(text: string): boolean {
    return /youtube\.com\/playlist\?list=|youtu\.be\/.*\?list=/.test(text);
}

// Parse a single line that might contain a link
function parseTaskLine(line: string): { title: string; link?: string } {
    // Check if line contains a URL (simple detection)
    const urlMatch = line.match(/(https?:\/\/[^\s]+)/);

    if (urlMatch) {
        const url = urlMatch[1];
        const title = line.replace(url, '').trim();
        return { title: title || url, link: url };
    }

    return { title: line };
}

// Parse batch task input (multiple lines or YouTube playlist)
export async function parseBatchTasks(input: string): Promise<Array<{ title: string; link?: string }>> {
    const trimmed = input.trim();

    // Check if it's a YouTube playlist URL
    if (isYouTubePlaylistUrl(trimmed)) {
        const videos = await parseYouTubePlaylist(trimmed);
        return videos.map(v => ({ title: v.title, link: v.url }));
    }

    // Otherwise, split by newlines and parse each line
    return trimmed
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => parseTaskLine(line));
}

// Simple store class
class GoalsStore {
    private goalsStore = new LocalStore<Goal[]>('goals', []);
    private tasksStore = new LocalStore<Task[]>('goal-tasks', []);

    // Getters
    get goals() {
        return this.goalsStore.value;
    }

    get tasks() {
        return this.tasksStore.value;
    }

    get activeGoals() {
        return this.goals.filter(g => !g.completed);
    }

    get completedGoals() {
        return this.goals.filter(g => g.completed);
    }

    // Goal methods
    addGoal(goal: Omit<Goal, 'id' | 'completed' | 'createdAt'>) {
        const newGoal: Goal = {
            id: crypto.randomUUID(),
            completed: false,
            createdAt: new Date().toISOString(),
            ...goal
        };
        this.goalsStore.value = [newGoal, ...this.goalsStore.value];
        return newGoal;
    }

    updateGoal(id: string, updates: Partial<Goal>) {
        this.goalsStore.value = this.goalsStore.value.map(g =>
            g.id === id ? { ...g, ...updates } : g
        );
    }

    deleteGoal(id: string) {
        // Delete goal and its tasks
        this.tasksStore.value = this.tasksStore.value.filter(t => t.goalId !== id);
        this.goalsStore.value = this.goalsStore.value.filter(g => g.id !== id);
    }

    toggleGoal(id: string) {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            this.updateGoal(id, { completed: !goal.completed });
        }
    }

    // Task methods
    addTask(task: Omit<Task, 'id' | 'completed' | 'createdAt'>) {
        const newTask: Task = {
            id: crypto.randomUUID(),
            completed: false,
            createdAt: new Date().toISOString(),
            ...task
        };
        this.tasksStore.value = [...this.tasksStore.value, newTask];
        this.updateGoalProgress(task.goalId);
        return newTask;
    }

    // Batch add tasks
    async addTasksBatch(goalId: string, input: string): Promise<number> {
        const parsedTasks = await parseBatchTasks(input);

        for (const { title, link } of parsedTasks) {
            this.addTask({ goalId, title, link });
        }

        return parsedTasks.length;
    }

    updateTask(id: string, updates: Partial<Task>) {
        const task = this.tasks.find(t => t.id === id);
        this.tasksStore.value = this.tasksStore.value.map(t =>
            t.id === id ? { ...t, ...updates } : t
        );
        if (task) {
            this.updateGoalProgress(task.goalId);
        }
    }

    deleteTask(id: string) {
        const task = this.tasks.find(t => t.id === id);
        this.tasksStore.value = this.tasksStore.value.filter(t => t.id !== id);
        if (task) {
            this.updateGoalProgress(task.goalId);
        }
    }

    toggleTask(id: string) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.updateTask(id, { completed: !task.completed });
        }
    }

    getGoalTasks(goalId: string) {
        return this.tasks.filter(t => t.goalId === goalId);
    }

    // Progress calculation
    getGoalProgress(goalId: string): number {
        const tasks = this.getGoalTasks(goalId);
        if (tasks.length === 0) return 0;

        const completedTasks = tasks.filter(t => t.completed).length;
        return Math.round((completedTasks / tasks.length) * 100);
    }

    private updateGoalProgress(goalId: string) {
        // Progress is calculated on-the-fly, no need to store it
    }
}

export const goalsStore = new GoalsStore();
