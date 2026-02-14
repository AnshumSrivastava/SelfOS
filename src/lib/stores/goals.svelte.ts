import { SupabaseStore } from './supabaseStore.svelte';
import { tasksStore } from './tasks.svelte';

export type Priority = 'high' | 'medium' | 'low';
export type GoalHorizon = 'life' | 'long' | 'mid' | 'short';
export type GoalStatus = 'planned' | 'active' | 'completed' | 'paused' | 'abandoned';
export type GoalArea = 'Professional' | 'Personal' | 'Health' | 'Family' | 'Fun' | 'Spiritual' | 'Other';

export interface Goal {
    id: string;
    title: string;
    vision?: string;
    description?: string;
    deadline?: string;
    targetDate?: string;
    priority: Priority;
    horizon: GoalHorizon;
    area: GoalArea;
    parentId?: string;
    status: GoalStatus;
    completed: boolean;
    createdAt: string;
    strategicNotes?: string;
}

export interface GoalLog {
    id: string;
    goalId: string;
    date: string;
    workDone: string;
    lessons: string;
    nextStep: string;
    mood: number;
    difficulty: number;
}

class GoalsStore {
    private goalsStore = new SupabaseStore<Goal>('goals', { migrationKey: 'goals' });
    private logsStore = new SupabaseStore<GoalLog>('goal_logs', { migrationKey: 'goal-logs' });

    get goals() { return this.goalsStore.value; }
    get logs() { return this.logsStore.value; }
    get loading() { return this.goalsStore.loading || this.logsStore.loading; }

    get activeGoals() {
        return this.goals.filter(g => g.status === 'active');
    }

    async addGoal(goal: Omit<Goal, 'id' | 'completed' | 'createdAt' | 'status'>) {
        return await this.goalsStore.insert({
            ...goal,
            status: 'active',
            completed: false,
        } as any);
    }

    async updateGoal(id: string, updates: Partial<Goal>) {
        await this.goalsStore.update(id, updates);
    }

    async deleteGoal(id: string) {
        const children = this.getGoalChildren(id);
        for (const child of children) {
            await this.deleteGoal(child.id);
        }

        tasksStore.tasks.forEach(async t => {
            if (t.goalId === id) {
                await tasksStore.update(t.id, { goalId: null });
            }
        });

        await this.goalsStore.delete(id);
    }

    async addLog(log: Omit<GoalLog, 'id' | 'date'>) {
        return await this.logsStore.insert({
            ...log,
            date: new Date().toISOString()
        });
    }

    getGoalLogs(goalId: string) {
        return this.logs.filter(l => l.goalId === goalId);
    }

    getGoalChildren(parentId: string) {
        return this.goals.filter(g => g.parentId === parentId);
    }

    getGoalParent(goalId: string) {
        const goal = this.goals.find(g => g.id === goalId);
        return goal?.parentId ? this.goals.find(g => g.id === goal.parentId) : null;
    }

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

    getAreaProgress(area: GoalArea): number {
        const areaGoals = this.goals.filter(g => g.area === area && !g.parentId);
        if (areaGoals.length === 0) return 0;

        const totalProgress = areaGoals.reduce((acc, goal) => acc + this.getGoalProgress(goal.id), 0);
        return Math.round(totalProgress / areaGoals.length);
    }
}

export async function parseBatchTasks(input: string): Promise<{ tasks: { title: string; link?: string }[]; playlistTitle?: string }> {
    // Basic implementation for parsing text/links
    // In a real app, this would call a backend API for YouTube playlist parsing
    const lines = input.split('\n').filter(l => l.trim().length > 0);
    const tasks = lines.map(line => {
        const title = line.replace(/https?:\/\/[^\s]+/g, '').trim();
        const linkMatch = line.match(/https?:\/\/[^\s]+/);
        return {
            title: title || 'Untitled Module',
            link: linkMatch ? linkMatch[0] : undefined
        };
    });

    return {
        tasks,
        playlistTitle: tasks.length > 0 ? "Imported Collection" : undefined
    };
}

export const goalsStore = new GoalsStore();
