import { SupabaseStore } from "./supabaseStore.svelte";

export type Task = {
    id: string;
    title: string;
    description?: string;
    projectId: string | null;
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "completed";
    link: string | null;
    deadline: string | null;
    scheduled: string | null;
    goalId: string | null;
    createdAt: string;
    completedAt?: string | null;
};

class TasksStore {
    private store = new SupabaseStore<Task>("tasks");

    #log(message: string, data?: any, level: 'info' | 'error' | 'warn' = 'info') {
        const timestamp = new Date().toISOString();
        const status = level.toUpperCase();
        const category = 'TASKS';
        const prefix = `[${timestamp}] [${category}] [${status}]`;

        const logMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;

        if (data) {
            logMethod(`${prefix} ${message} |`, data);
        } else {
            logMethod(`${prefix} ${message}`);
        }
    }

    get tasks() {
        return this.store.value;
    }

    get loading() {
        return this.store.loading;
    }

    get status() {
        return this.store.status;
    }

    get errorMsg() {
        return this.store.errorMsg;
    }

    // --- Derived Filters ---
    get todayTasks() {
        const today = new Date().toISOString().split('T')[0];
        return this.tasks.filter(t => t.status !== 'completed' && (t.scheduled === today || t.deadline === today));
    }

    get upcomingTasks() {
        const today = new Date().toISOString().split('T')[0];
        return this.tasks.filter(t => t.status !== 'completed' && t.scheduled && t.scheduled > today);
    }

    get overdueTasks() {
        const today = new Date().toISOString().split('T')[0];
        return this.tasks.filter(t => t.status !== 'completed' && t.deadline && t.deadline < today);
    }

    async add(task: Omit<Task, "id" | "createdAt" | "status" | "completedAt">) {
        try {
            return await this.store.insert({
                title: task.title,
                description: task.description,
                link: task.link || null,
                goalId: task.goalId || null,
                projectId: task.projectId || null,
                priority: task.priority || "medium",
                status: "pending",
                deadline: task.deadline || null,
                scheduled: task.scheduled || null,
                completedAt: null,
            } as any);
        } catch (error) {
            this.#log('Failed to add task', error, 'error');
            throw error;
        }
    }

    // Helper functions for parsing
    private isYouTubePlaylistUrl(text: string): boolean {
        return /youtube\.com\/playlist\?list=|youtu\.be\/.*\?list=/.test(text);
    }

    private async parseYouTubePlaylist(url: string): Promise<Array<{ title: string; url: string }>> {
        try {
            const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
            if (!SUPABASE_URL) throw new Error('Supabase URL not configured');

            const response = await fetch(`${SUPABASE_URL}/functions/v1/youtube-playlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            if (!response.ok) {
                this.#log('YouTube API returned error', response.status, 'warn');
                return [];
            }
            const data = await response.json();
            // Map the edge function response format (tasks) to the expected format (videos)
            const tasks = data.tasks || [];
            return tasks.map((t: any) => ({ title: t.title, url: t.link }));
        } catch (error) {
            this.#log('Failed to parse YouTube playlist via edge function', error, 'error');
            return [];
        }
    }

    private parseTaskLine(line: string): { title: string; link: string | null } {
        const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
            const url = urlMatch[1];
            const title = line.replace(url, '').trim();
            return { title: title || url, link: url };
        }
        return { title: line, link: null };
    }

    async addBatch(input: string, projectId: string | null = null, priority: "low" | "medium" | "high" = "medium", goalId: string | null = null) {
        const trimmed = input.trim();
        let addedCount = 0;
        let errorCount = 0;

        this.#log(`Starting batch add for ${projectId || 'Inbox'}${goalId ? ` (Goal: ${goalId})` : ''}`);

        if (this.isYouTubePlaylistUrl(trimmed)) {
            const videos = await this.parseYouTubePlaylist(trimmed);
            for (const video of videos) {
                try {
                    await this.add({
                        title: video.title,
                        link: video.url,
                        goalId,
                        projectId,
                        priority,
                        deadline: null,
                        scheduled: null
                    });
                    addedCount++;
                } catch (e) {
                    errorCount++;
                    this.#log(`Failed to add video: ${video.title}`, e, 'error');
                }
            }
        } else {
            const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            for (const line of lines) {
                try {
                    const { title, link } = this.parseTaskLine(line);
                    await this.add({
                        title,
                        link,
                        goalId,
                        projectId,
                        priority,
                        deadline: null,
                        scheduled: null
                    });
                    addedCount++;
                } catch (e) {
                    errorCount++;
                    this.#log(`Failed to add line: ${line}`, e, 'error');
                }
            }
        }

        this.#log(`Batch complete: ${addedCount} added, ${errorCount} errors`);
        return { addedCount, errorCount };
    }

    async update(id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) {
        try {
            await this.store.update(id, updates);
        } catch (error) {
            this.#log(`Failed to update task ${id}`, error, 'error');
            throw error;
        }
    }

    async toggle(id: string) {
        const task = this.store.value.find((t) => t.id === id);
        if (task) {
            const isCompleted = task.status === "completed";
            try {
                await this.store.update(id, {
                    status: isCompleted ? "pending" : "completed",
                    completedAt: isCompleted ? null : new Date().toISOString()
                });
            } catch (error) {
                this.#log(`Failed to toggle task ${id}`, error, 'error');
                throw error;
            }
        }
    }

    async remove(id: string) {
        try {
            await this.store.delete(id);
        } catch (error) {
            this.#log(`Failed to remove task ${id}`, error, 'error');
            throw error;
        }
    }

    get activeCount() {
        return this.store.value.filter((t) => t.status !== "completed").length;
    }

    get completedCount() {
        return this.store.value.filter((t) => t.status === "completed").length;
    }
}

export const tasksStore = new TasksStore();
