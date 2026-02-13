import { LocalStore } from './localStore.svelte';
import { tasksStore } from './tasks.svelte';

// Simplified data types
export type Priority = 'high' | 'medium' | 'low';
export type GoalHorizon = 'life' | 'long' | 'mid' | 'short';
export type GoalStatus = 'planned' | 'active' | 'completed' | 'paused';
export type GoalArea = 'Professional' | 'Personal' | 'Health' | 'Family' | 'Fun' | 'Spiritual' | 'Other';

export interface Goal {
    id: string;
    title: string;
    vision?: string;        // Why this goal matters
    description?: string;
    deadline?: string;      // ISO date
    targetDate?: string;    // Target completion date
    priority: Priority;
    horizon: GoalHorizon;
    area: GoalArea;
    parentId?: string;      // For hierarchy
    status: GoalStatus;
    completed: boolean;
    createdAt: string;
    strategicNotes?: string;
}

export interface GoalLog {
    id: string;
    goalId: string;
    date: string;           // ISO date
    workDone: string;
    lessons: string;
    nextStep: string;
    mood: number;           // 1-5
    difficulty: number;     // 1-5
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

class GoalsStore {
    private goalsStore = new LocalStore<Goal[]>('goals', []);
    private logsStore = new LocalStore<GoalLog[]>('goal-logs', []);

    // Getters
    get goals() {
        return this.goalsStore.value;
    }

    get logs() {
        return this.logsStore.value;
    }

    get activeGoals() {
        return this.goals.filter(g => g.status === 'active');
    }

    // Goal methods
    addGoal(goal: Omit<Goal, 'id' | 'completed' | 'createdAt' | 'status'>) {
        const newGoal: Goal = {
            id: crypto.randomUUID(),
            status: 'active',
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
        // Recursive deletion for hierarchy
        const children = this.getGoalChildren(id);
        children.forEach(child => this.deleteGoal(child.id));

        // Unlink tasks instead of deleting them? 
        // Or delete them if they were exclusively created for this goal.
        // For now, let's just unlink them to be safe.
        tasksStore.tasks.forEach(t => {
            if (t.goalId === id) {
                tasksStore.update(t.id, { goalId: null });
            }
        });

        this.goalsStore.value = this.goalsStore.value.filter(g => g.id !== id);
        this.logsStore.value = this.logsStore.value.filter(l => l.goalId !== id);
    }

    // Logging / Journaling
    addLog(log: Omit<GoalLog, 'id' | 'date'>) {
        const newLog: GoalLog = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            ...log
        };
        this.logsStore.value = [newLog, ...this.logsStore.value];
        return newLog;
    }

    getGoalLogs(goalId: string) {
        return this.logs.filter(l => l.goalId === goalId);
    }

    // Hierarchy helpers
    getGoalChildren(parentId: string) {
        return this.goals.filter(g => g.parentId === parentId);
    }

    getGoalParent(goalId: string) {
        const goal = this.goals.find(g => g.id === goalId);
        return goal?.parentId ? this.goals.find(g => g.id === goal.parentId) : null;
    }

    // Integrated Progress calculation
    getGoalProgress(goalId: string): number {
        const tasks = tasksStore.tasks.filter(t => t.goalId === goalId);
        const children = this.getGoalChildren(goalId);

        if (tasks.length === 0 && children.length === 0) {
            const goal = this.goals.find(g => g.id === goalId);
            return goal?.completed || goal?.status === 'completed' ? 100 : 0;
        }

        let totalWeight = tasks.length + children.length;
        let completedWeight = tasks.filter(t => t.status === 'completed').length;

        children.forEach(child => {
            completedWeight += this.getGoalProgress(child.id) / 100;
        });

        return Math.round((completedWeight / totalWeight) * 100);
    }

    // Health metrics
    getGoalHealth(goalId: string): 'on-track' | 'at-risk' | 'stalled' {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return 'stalled';

        const logs = this.getGoalLogs(goalId);
        const lastLogDate = logs.length > 0 ? new Date(logs[0].date) : new Date(goal.createdAt);
        const daysSinceLastUpdate = (Date.now() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceLastUpdate > 14) return 'stalled';
        if (daysSinceLastUpdate > 7) return 'at-risk';
        return 'on-track';
    }

    // Mobile UI Helper Methods
    async addTasksBatch(goalId: string, input: string) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return 0;

        const { tasks } = await parseBatchTasks(input);
        tasks.forEach(task => {
            tasksStore.add({
                title: task.title,
                link: task.link || null,
                goalId: goalId,
                project: goal.area,
                priority: goal.priority,
                deadline: null,
                scheduled: null
            });
        });
        return tasks.length;
    }

    getAreaProgress(area: GoalArea): number {
        const areaGoals = this.goals.filter(g => g.area === area && !g.parentId);
        if (areaGoals.length === 0) return 0;

        const totalProgress = areaGoals.reduce((acc, goal) => acc + this.getGoalProgress(goal.id), 0);
        return Math.round(totalProgress / areaGoals.length);
    }

    getGoalTasks(goalId: string) {
        return tasksStore.tasks.filter(t => t.goalId === goalId);
    }

    toggleTask(taskId: string) {
        tasksStore.toggle(taskId);
    }

    deleteTask(taskId: string) {
        tasksStore.remove(taskId);
    }
}

export const goalsStore = new GoalsStore();
