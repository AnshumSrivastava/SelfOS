import { LocalStore } from './localStore.svelte';

// Simplified data types
export type Priority = 'high' | 'normal' | 'low';
export type GoalType = 'short' | 'mid' | 'long';
export type GoalArea = 'Professional' | 'Personal' | 'Health' | 'Family' | 'Fun' | 'Spiritual' | 'Other';

export interface Goal {
    id: string;
    title: string;
    description?: string;
    reason?: string;
    deadline?: string;
    priority: Priority;
    type: GoalType;
    area: GoalArea;
    parentId?: string;
    completed: boolean;
    createdAt: string;
}

export interface Task {
    id: string;
    goalId: string;
    title: string;
    link?: string; // Optional link for the task
    date?: string; // ISO date string
    startTime?: string; // HH:mm format
    completed: boolean;
    createdAt: string;
}

// YouTube video data
interface YouTubeVideo {
    title: string;
    url: string;
}

// YouTube playlist parsing via server-side API
async function parseYouTubePlaylist(url: string): Promise<{ videos: YouTubeVideo[], playlistTitle?: string }> {
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
            return { videos: [] };
        }

        const data = await response.json();
        return {
            videos: data.videos || [],
            playlistTitle: data.playlistTitle
        };
    } catch (error) {
        console.error('Failed to parse YouTube playlist:', error);
        return { videos: [] };
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
export async function parseBatchTasks(input: string): Promise<{ tasks: Array<{ title: string; link?: string }>, playlistTitle?: string }> {
    const trimmed = input.trim();

    // Check if it's a YouTube playlist URL
    if (isYouTubePlaylistUrl(trimmed)) {
        const { videos, playlistTitle } = await parseYouTubePlaylist(trimmed);
        return {
            tasks: videos.map(v => ({ title: v.title, link: v.url })),
            playlistTitle
        };
    }

    // Otherwise, split by newlines and parse each line
    const tasks = trimmed
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => parseTaskLine(line));

    return { tasks };
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
        // Find child goals and delete them or update them
        const childGoals = this.goals.filter(g => g.parentId === id);
        childGoals.forEach(child => this.deleteGoal(child.id));

        // Delete tasks
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
        return newTask;
    }

    // Batch add tasks
    async addTasksBatch(goalId: string, input: string): Promise<number> {
        const { tasks, playlistTitle } = await parseBatchTasks(input);

        // If it's a new goal and we have a playlist title, update the goal title
        if (playlistTitle) {
            const goal = this.goals.find(g => g.id === goalId);
            if (goal && (goal.title === 'New Goal' || !goal.title)) {
                this.updateGoal(goalId, { title: playlistTitle });
            }
        }

        for (const { title, link } of tasks) {
            this.addTask({ goalId, title, link });
        }

        return tasks.length;
    }

    updateTask(id: string, updates: Partial<Task>) {
        this.tasksStore.value = this.tasksStore.value.map(t =>
            t.id === id ? { ...t, ...updates } : t
        );
    }

    deleteTask(id: string) {
        this.tasksStore.value = this.tasksStore.value.filter(t => t.id !== id);
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

    // Hierarchy helpers
    getGoalChildren(parentId: string) {
        return this.goals.filter(g => g.parentId === parentId);
    }

    getGoalParent(goalId: string) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal || !goal.parentId) return null;
        return this.goals.find(g => g.id === goal.parentId);
    }

    // Life Balance metrics
    getAreaProgress(area: GoalArea): number {
        const areaGoals = this.goals.filter(g => g.area === area);
        if (areaGoals.length === 0) return 0;

        let totalProgress = 0;
        areaGoals.forEach(goal => {
            totalProgress += this.getGoalProgress(goal.id);
        });

        return Math.round(totalProgress / areaGoals.length);
    }

    // Progress calculation
    getGoalProgress(goalId: string): number {
        const tasks = this.getGoalTasks(goalId);
        const children = this.getGoalChildren(goalId);

        if (tasks.length === 0 && children.length === 0) {
            const goal = this.goals.find(g => g.id === goalId);
            return goal?.completed ? 100 : 0;
        }

        let totalWeight = tasks.length + children.length;
        let completedWeight = tasks.filter(t => t.completed).length;

        children.forEach(child => {
            completedWeight += this.getGoalProgress(child.id) / 100;
        });

        return Math.round((completedWeight / totalWeight) * 100);
    }
}

export const goalsStore = new GoalsStore();
