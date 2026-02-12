import { LocalStore } from "./localStore.svelte";
import { gamificationStore } from "./gamification.svelte";
import type { QuestRarity } from "$lib/types/gamification";

export type Task = {
    id: string;
    title: string;
    description?: string;
    project: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "completed";
    deadline: string | null; // ISO Date string
    scheduled: string | null; // ISO Date string
    createdAt: string; // ISO Date string
    completedAt?: string | null; // ISO Date string
};

const DEFAULT_TASKS: Task[] = [
    {
        id: "1",
        title: "Refactor Auth System",
        project: "SelfOS",
        priority: "high",
        status: "pending",
        deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        scheduled: null,
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Write Q4 Goals",
        project: "Life",
        priority: "medium",
        status: "pending",
        deadline: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        scheduled: new Date(Date.now() + 86400000).toISOString(),
        createdAt: new Date().toISOString(),
    },
];

// ============================================================================
// Quest/Gamification Helpers
// ============================================================================

/**
 * Calculate quest rarity based on priority and deadline urgency
 */
export function calculateQuestRarity(task: Task): QuestRarity {
    const now = Date.now();
    const isOverdue = task.deadline && new Date(task.deadline).getTime() < now;
    const isDueToday =
        task.deadline &&
        new Date(task.deadline).toDateString() === new Date().toDateString();
    const isDueSoon =
        task.deadline &&
        new Date(task.deadline).getTime() - now < 3 * 24 * 60 * 60 * 1000; // 3 days

    // Legendary: High priority + (Overdue OR Due Today)
    if (task.priority === "high" && (isOverdue || isDueToday)) {
        return "legendary";
    }

    // Epic: High priority + Due Soon, OR Medium priority + Overdue
    if (
        (task.priority === "high" && isDueSoon) ||
        (task.priority === "medium" && isOverdue)
    ) {
        return "epic";
    }

    // Rare: Medium priority + Due Soon, OR High priority
    if ((task.priority === "medium" && isDueSoon) || task.priority === "high") {
        return "rare";
    }

    // Common: Everything else
    return "common";
}

/**
 * Calculate XP reward based on quest rarity and priority
 */
export function calculateQuestXP(task: Task): number {
    const rarity = calculateQuestRarity(task);
    const baseXP = {
        common: 10,
        rare: 30,
        epic: 75,
        legendary: 150,
    }[rarity];

    // Bonus for priority
    const priorityBonus = {
        low: 0,
        medium: 5,
        high: 10,
    }[task.priority];

    return baseXP + priorityBonus;
}

/**
 * Calculate gold reward (10% of XP)
 */
export function calculateQuestGold(task: Task): number {
    return Math.floor(calculateQuestXP(task) * 0.1);
}

/**
 * Calculate difficulty stars (1-5)
 */
export function calculateQuestDifficulty(task: Task): 1 | 2 | 3 | 4 | 5 {
    const rarity = calculateQuestRarity(task);
    const difficultyMap: Record<QuestRarity, 1 | 2 | 3 | 4 | 5> = {
        common: 1,
        rare: 2,
        epic: 4,
        legendary: 5,
    };
    return difficultyMap[rarity];
}

// ============================================================================
// Tasks Store
// ============================================================================

class TasksStore {
    store = new LocalStore<Task[]>("selfos_tasks_v2", DEFAULT_TASKS);

    get tasks() {
        return this.store.value;
    }

    add(task: Omit<Task, "id" | "createdAt" | "status" | "completedAt">) {
        this.store.value.push({
            id: crypto.randomUUID(),
            title: task.title,
            description: task.description,
            project: task.project || "General",
            priority: task.priority || "medium",
            status: "pending",
            deadline: task.deadline || null,
            scheduled: task.scheduled || null,
            createdAt: new Date().toISOString(),
            completedAt: null,
        });
    }

    update(id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) {
        const index = this.store.value.findIndex((t) => t.id === id);
        if (index !== -1) {
            this.store.value[index] = { ...this.store.value[index], ...updates };
        }
    }

    async toggle(id: string) {
        const task = this.store.value.find((t) => t.id === id);
        if (task) {
            const wasCompleted = task.status === "completed";

            if (wasCompleted) {
                // Uncomplete task
                task.status = "pending";
                task.completedAt = null;
            } else {
                // Complete task - GRANT XP AND GOLD!
                task.status = "completed";
                task.completedAt = new Date().toISOString();

                // Calculate rewards
                const xpReward = calculateQuestXP(task);
                const goldReward = calculateQuestGold(task);

                // Grant XP (this will also check for level ups and achievements)
                await gamificationStore.gainXP(xpReward, "task_complete", task.id);

                // Grant Gold
                await gamificationStore.addGold(goldReward);

                // Check task-based achievements
                const completedCount = this.completedCount;
                const firstStepsAchievement = gamificationStore.achievements.find(
                    (a) => a.title === "First Steps",
                );
                const productivityWarriorAchievement =
                    gamificationStore.achievements.find(
                        (a) => a.title === "Productivity Warrior",
                    );

                if (firstStepsAchievement) {
                    await gamificationStore.checkAchievement(
                        firstStepsAchievement.id,
                        completedCount,
                    );
                }

                if (productivityWarriorAchievement) {
                    await gamificationStore.checkAchievement(
                        productivityWarriorAchievement.id,
                        completedCount,
                    );
                }
            }
        }
    }

    remove(id: string) {
        this.store.value = this.store.value.filter((t) => t.id !== id);
    }

    get activeCount() {
        return this.store.value.filter((t) => t.status !== "completed").length;
    }

    get completedCount() {
        return this.store.value.filter((t) => t.status === "completed").length;
    }
}

export const tasksStore = new TasksStore();
