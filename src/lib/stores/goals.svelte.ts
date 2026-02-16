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
    private goalsStore = new SupabaseStore<Goal>('goals');
    private logsStore = new SupabaseStore<GoalLog>('goal_logs');

    get goals() { return this.goalsStore.value; }
    get logs() { return this.logsStore.value; }
    get loading() { return this.goalsStore.loading || this.logsStore.loading; }

    get status() {
        if (this.goalsStore.status === 'saving' || this.logsStore.status === 'saving') return 'saving';
        if (this.goalsStore.status === 'loading' || this.logsStore.status === 'loading') return 'loading';
        if (this.goalsStore.status === 'error' || this.logsStore.status === 'error') return 'error';
        if (this.goalsStore.status === 'success' || this.logsStore.status === 'success') return 'success';
        return 'idle';
    }

    get errorMsg() {
        return this.goalsStore.errorMsg || this.logsStore.errorMsg;
    }

    get activeGoals() {
        return this.goals.filter(g => g.status === 'active');
    }

    async addGoal(goal: Omit<Goal, 'id' | 'completed' | 'createdAt' | 'status'>) {
        try {
            console.log('[GoalsStore] Adding new goal:', goal.title);
            return await this.goalsStore.insert({
                ...goal,
                status: 'active',
                completed: false,
            } as any);
        } catch (error) {
            console.error('[GoalsStore] Failed to add goal:', error);
            throw error;
        }
    }

    async updateGoal(id: string, updates: Partial<Goal>) {
        try {
            await this.goalsStore.update(id, updates);
        } catch (error) {
            console.error(`[GoalsStore] Failed to update goal ${id}:`, error);
            throw error;
        }
    }

    async deleteGoal(id: string) {
        try {
            console.log(`[GoalsStore] Deleting goal ${id} and its children...`);
            const children = this.getGoalChildren(id);
            for (const child of children) {
                await this.deleteGoal(child.id);
            }

            // Cleanup task associations
            const associatedTasks = tasksStore.tasks.filter(t => t.goalId === id);
            for (const t of associatedTasks) {
                await tasksStore.update(t.id, { goalId: null });
            }

            await this.goalsStore.delete(id);
        } catch (error) {
            console.error(`[GoalsStore] Failed to delete goal ${id}:`, error);
            throw error;
        }
    }

    async addLog(log: Omit<GoalLog, 'id' | 'date'>) {
        try {
            return await this.logsStore.insert({
                ...log,
                date: new Date().toISOString()
            });
        } catch (error) {
            console.error(`[GoalsStore] Failed to add goal log for ${log.goalId}:`, error);
            throw error;
        }
    }

    getGoalLogs(goalId: string) {
        return this.logs.filter(l => l.goalId === goalId);
    }

    getGoalChildren(parentId: string) {
        return this.goals.filter(g => g.parentId === parentId);
    }

    getGoalTasks(goalId: string) {
        return tasksStore.tasks.filter(t => t.goalId === goalId);
    }

    async addTasksBatch(goalId: string, input: string) {
        return await tasksStore.addBatch(input, null, 'medium', goalId);
    }

    async toggleTask(taskId: string) {
        return await tasksStore.toggle(taskId);
    }

    async deleteTask(taskId: string) {
        return await tasksStore.remove(taskId);
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

        return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
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

    async parseBatchTasks(input: string): Promise<{ tasks: { title: string; link?: string }[]; playlistTitle?: string }> {
        // Check if it's a YouTube URL
        const isYoutube = input.includes('youtube.com/playlist') || input.includes('list=');

        if (isYoutube) {
            try {
                // Determine base URL - this would ideally come from environment config
                const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
                if (!SUPABASE_URL) throw new Error('Supabase URL not configured');

                const response = await fetch(`${SUPABASE_URL}/functions/v1/youtube-playlist`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: input })
                });

                if (!response.ok) throw new Error('Failed to fetch from edge function');
                return await response.json();
            } catch (error) {
                console.error('[GoalsStore] Edge function failed, falling back to local parsing:', error);
                // Fallback to local parsing (maybe they pasted titles instead)
            }
        }

        const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const tasks = lines.map(line => {
            const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
            if (urlMatch) {
                const url = urlMatch[1];
                const title = line.replace(url, '').trim();
                return { title: title || url, link: url };
            }
            return { title: line };
        });

        return {
            tasks,
            playlistTitle: tasks.length > 0 ? "Imported Collection" : undefined
        };
    }
}

export const goalsStore = new GoalsStore();
