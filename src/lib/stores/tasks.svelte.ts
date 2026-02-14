import { SupabaseStore } from "./supabaseStore.svelte";

export type Task = {
    id: string;
    title: string;
    description?: string;
    project: string;
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
    private store = new SupabaseStore<Task>("tasks", { migrationKey: "selfos_tasks_v2" });

    get tasks() {
        return this.store.value;
    }

    get loading() {
        return this.store.loading;
    }

    async add(task: Omit<Task, "id" | "createdAt" | "status" | "completedAt">) {
        return await this.store.insert({
            title: task.title,
            description: task.description,
            link: task.link || null,
            goalId: task.goalId || null,
            project: task.project || "General",
            priority: task.priority || "medium",
            status: "pending",
            deadline: task.deadline || null,
            scheduled: task.scheduled || null,
            completedAt: null,
        } as any);
    }

    // Helper functions for parsing
    private isYouTubePlaylistUrl(text: string): boolean {
        return /youtube\.com\/playlist\?list=|youtu\.be\/.*\?list=/.test(text);
    }

    private async parseYouTubePlaylist(url: string): Promise<Array<{ title: string; url: string }>> {
        try {
            const response = await fetch('/api/youtube-playlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            if (!response.ok) return [];
            const data = await response.json();
            return data.videos || [];
        } catch (error) {
            console.error('Failed to parse YouTube playlist:', error);
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

    async addBatch(input: string, project: string = "General", priority: "low" | "medium" | "high" = "medium") {
        const trimmed = input.trim();
        let addedCount = 0;

        if (this.isYouTubePlaylistUrl(trimmed)) {
            const videos = await this.parseYouTubePlaylist(trimmed);
            for (const video of videos) {
                await this.add({
                    title: video.title,
                    link: video.url,
                    goalId: null,
                    project,
                    priority,
                    deadline: null,
                    scheduled: null
                });
                addedCount++;
            }
        } else {
            const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            for (const line of lines) {
                const { title, link } = this.parseTaskLine(line);
                await this.add({
                    title,
                    link,
                    goalId: null,
                    project,
                    priority,
                    deadline: null,
                    scheduled: null
                });
                addedCount++;
            }
        }
        return addedCount;
    }

    async update(id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) {
        await this.store.update(id, updates);
    }

    async toggle(id: string) {
        const task = this.store.value.find((t) => t.id === id);
        if (task) {
            const isCompleted = task.status === "completed";
            await this.store.update(id, {
                status: isCompleted ? "pending" : "completed",
                completedAt: isCompleted ? null : new Date().toISOString()
            });
        }
    }

    async remove(id: string) {
        await this.store.delete(id);
    }

    get activeCount() {
        return this.store.value.filter((t) => t.status !== "completed").length;
    }

    get completedCount() {
        return this.store.value.filter((t) => t.status === "completed").length;
    }
}

export const tasksStore = new TasksStore();
