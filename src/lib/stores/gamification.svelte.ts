/**
 * Gamification Store
 * Central store for all gamification mechanics: XP, levels, achievements, quests
 */

import { dataController, COLLECTIONS } from "$lib/data/DataController";
import type {
    PlayerProfile,
    Achievement,
    XPGainEvent,
    GameNotification,
    AvatarData,
} from "$lib/types/gamification";

// ============================================================================
// XP & Level Calculation
// ============================================================================

function calculateXPForLevel(level: number): number {
    // Formula: 100 * (level ^ 1.5)
    return Math.floor(100 * Math.pow(level, 1.5));
}

function calculateLevelFromXP(totalXP: number): number {
    let level = 1;
    let xpRequired = 0;

    while (xpRequired <= totalXP) {
        level++;
        xpRequired += calculateXPForLevel(level);
    }

    return level - 1;
}

// ============================================================================
// Default Data
// ============================================================================

const DEFAULT_AVATAR: AvatarData = {
    class: "Warrior",
    name: "Hero",
    customization: {
        skinTone: "#fdbcb4",
        hairStyle: "short",
        hairColor: "#4a3728",
        eyeColor: "#6b4423",
        outfit: "starter",
    },
    equipment: {},
};

const DEFAULT_PROFILE: Omit<PlayerProfile, keyof import("$lib/data/types").BaseEntity> = {
    username: "Player",
    level: 1,
    xp: 0,
    totalXP: 0,
    gold: 0,
    gems: 0,
    avatar: DEFAULT_AVATAR,
    achievements: [],
    badges: [],
    completedQuests: [],
    preferences: {
        theme: "dark",
        notifications: true,
        soundEffects: true,
    },
};

// ============================================================================
// Gamification Store
// ============================================================================

class GamificationStore {
    // State
    profile = $state<PlayerProfile | null>(null);
    achievements = $state<Achievement[]>([]);
    notifications = $state<GameNotification[]>([]);

    // Derived
    xpToNextLevel = $derived.by(() => {
        if (!this.profile) return 0;
        return calculateXPForLevel(this.profile.level + 1);
    });

    xpProgress = $derived.by(() => {
        if (!this.profile) return 0;
        return (this.profile.xp / this.xpToNextLevel) * 100;
    });

    unreadNotifications = $derived.by(() => {
        return this.notifications.filter((n) => !n.isRead).length;
    });

    // ========================================================================
    // Initialization
    // ========================================================================

    async init() {
        await this.loadProfile();
        await this.loadAchievements();
        await this.loadNotifications();
    }

    private async loadProfile() {
        const profiles = await dataController.getAll<PlayerProfile>(
            COLLECTIONS.USER_PROFILE,
        );

        if (profiles.length === 0) {
            // Create default profile
            this.profile = await dataController.create<PlayerProfile>(
                COLLECTIONS.USER_PROFILE,
                DEFAULT_PROFILE,
            );
        } else {
            this.profile = profiles[0];
        }
    }

    private async loadAchievements() {
        this.achievements = await dataController.getAll<Achievement>(
            COLLECTIONS.ACHIEVEMENTS,
        );

        // Initialize default achievements if none exist
        if (this.achievements.length === 0) {
            await this.initializeDefaultAchievements();
        }
    }

    private async loadNotifications() {
        this.notifications = await dataController.getAll<GameNotification>(
            "notifications",
            {
                orderBy: [{ field: "timestamp", direction: "desc" }],
                limit: 50,
            },
        );
    }

    // ========================================================================
    // XP & Leveling
    // ========================================================================

    async gainXP(amount: number, source: XPGainEvent["source"], sourceId: string) {
        if (!this.profile) return;

        const oldLevel = this.profile.level;
        const newTotalXP = this.profile.totalXP + amount;
        const newLevel = calculateLevelFromXP(newTotalXP);

        // Calculate XP in current level
        let xpInLevel = amount;
        if (newLevel > oldLevel) {
            // Level up occurred
            const xpForOldLevel = calculateXPForLevel(oldLevel + 1);
            xpInLevel = this.profile.xp + amount - xpForOldLevel;
        } else {
            xpInLevel = this.profile.xp + amount;
        }

        // Update profile
        this.profile = await dataController.update<PlayerProfile>(
            COLLECTIONS.USER_PROFILE,
            this.profile.id,
            {
                xp: xpInLevel,
                totalXP: newTotalXP,
                level: newLevel,
            },
        );

        // Check for level up
        if (newLevel > oldLevel) {
            await this.handleLevelUp(oldLevel, newLevel);
        }

        // Log XP gain event
        await this.logXPEvent({ amount, source, sourceId, timestamp: new Date().toISOString() });
    }

    private async handleLevelUp(oldLevel: number, newLevel: number) {
        if (!this.profile) return;

        // Calculate rewards
        const goldReward = newLevel * 50;
        const gemsReward = newLevel % 5 === 0 ? 10 : 0; // Gems every 5 levels

        // Update profile with rewards
        this.profile = await dataController.update<PlayerProfile>(
            COLLECTIONS.USER_PROFILE,
            this.profile.id,
            {
                gold: this.profile.gold + goldReward,
                gems: this.profile.gems + gemsReward,
            },
        );

        // Create notification
        await this.addNotification({
            type: "level_up",
            title: `Level Up! You're now Level ${newLevel}`,
            message: `You earned ${goldReward} gold${gemsReward > 0 ? ` and ${gemsReward} gems` : ""}!`,
            icon: "🎉",
        });

        // Check for level-based achievements
        await this.checkLevelAchievements(newLevel);
    }

    private async logXPEvent(event: XPGainEvent) {
        // Store XP events for analytics (optional)
        await dataController.create("xp_events", event);
    }

    // ========================================================================
    // Achievements
    // ========================================================================

    private async initializeDefaultAchievements() {
        const defaultAchievements: Omit<Achievement, keyof import("$lib/data/types").BaseEntity>[] = [
            {
                title: "First Steps",
                description: "Complete your first quest",
                icon: "🎯",
                rarity: "common",
                category: "productivity",
                requirements: [{ type: "task_count", target: 1, current: 0 }],
                xpReward: 10,
                goldReward: 5,
                progress: 0,
                maxProgress: 1,
                isCompleted: false,
                isHidden: false,
                order: 1,
            },
            {
                title: "Habit Former",
                description: "Maintain a 7-day streak",
                icon: "🔥",
                rarity: "rare",
                category: "habits",
                requirements: [{ type: "habit_streak", target: 7, current: 0 }],
                xpReward: 100,
                goldReward: 50,
                progress: 0,
                maxProgress: 7,
                isCompleted: false,
                isHidden: false,
                order: 2,
            },
            {
                title: "Productivity Warrior",
                description: "Complete 100 quests",
                icon: "⚔️",
                rarity: "epic",
                category: "productivity",
                requirements: [{ type: "task_count", target: 100, current: 0 }],
                xpReward: 500,
                goldReward: 250,
                progress: 0,
                maxProgress: 100,
                isCompleted: false,
                isHidden: false,
                order: 3,
            },
            {
                title: "Level 10",
                description: "Reach level 10",
                icon: "⭐",
                rarity: "rare",
                category: "special",
                requirements: [{ type: "level_reach", target: 10, current: 1 }],
                xpReward: 200,
                goldReward: 100,
                progress: 1,
                maxProgress: 10,
                isCompleted: false,
                isHidden: false,
                order: 4,
            },
            {
                title: "Unstoppable",
                description: "Maintain a 30-day streak",
                icon: "💪",
                rarity: "epic",
                category: "habits",
                requirements: [{ type: "habit_streak", target: 30, current: 0 }],
                xpReward: 300,
                goldReward: 150,
                progress: 0,
                maxProgress: 30,
                isCompleted: false,
                isHidden: false,
                order: 5,
            },
            {
                title: "Legend",
                description: "Maintain a 100-day streak",
                icon: "👑",
                rarity: "legendary",
                category: "habits",
                requirements: [{ type: "habit_streak", target: 100, current: 0 }],
                xpReward: 1000,
                goldReward: 500,
                badgeId: "legend_badge",
                progress: 0,
                maxProgress: 100,
                isCompleted: false,
                isHidden: false,
                order: 6,
            },
        ];

        this.achievements = await dataController.batchCreate<Achievement>(
            COLLECTIONS.ACHIEVEMENTS,
            defaultAchievements,
        );
    }

    async checkAchievement(achievementId: string, progress: number) {
        const achievement = this.achievements.find((a) => a.id === achievementId);
        if (!achievement || achievement.isCompleted) return;

        const updated = await dataController.update<Achievement>(
            COLLECTIONS.ACHIEVEMENTS,
            achievementId,
            {
                progress: Math.min(progress, achievement.maxProgress),
                isCompleted: progress >= achievement.maxProgress,
                completedAt:
                    progress >= achievement.maxProgress
                        ? new Date().toISOString()
                        : undefined,
            },
        );

        if (updated && updated.isCompleted && !achievement.isCompleted) {
            await this.unlockAchievement(updated);
        }

        // Update local state
        const index = this.achievements.findIndex((a) => a.id === achievementId);
        if (index !== -1 && updated) {
            this.achievements[index] = updated;
        }
    }

    private async unlockAchievement(achievement: Achievement) {
        if (!this.profile) return;

        // Add to profile
        this.profile = await dataController.update<PlayerProfile>(
            COLLECTIONS.USER_PROFILE,
            this.profile.id,
            {
                achievements: [...this.profile.achievements, achievement.id],
            },
        );

        // Grant rewards
        await this.gainXP(achievement.xpReward, "achievement_unlock", achievement.id);
        await this.addGold(achievement.goldReward);

        // Create notification
        await this.addNotification({
            type: "achievement",
            title: `Achievement Unlocked: ${achievement.title}`,
            message: achievement.description,
            icon: achievement.icon,
            data: { achievementId: achievement.id, rarity: achievement.rarity },
        });
    }

    private async checkLevelAchievements(level: number) {
        // Check for level-based achievements
        const levelAchievements = this.achievements.filter(
            (a) =>
                a.requirements.some((r) => r.type === "level_reach") && !a.isCompleted,
        );

        for (const achievement of levelAchievements) {
            await this.checkAchievement(achievement.id, level);
        }
    }

    // ========================================================================
    // Currency
    // ========================================================================

    async addGold(amount: number) {
        if (!this.profile) return;

        this.profile = await dataController.update<PlayerProfile>(
            COLLECTIONS.USER_PROFILE,
            this.profile.id,
            {
                gold: this.profile.gold + amount,
            },
        );
    }

    async spendGold(amount: number): Promise<boolean> {
        if (!this.profile || this.profile.gold < amount) return false;

        this.profile = await dataController.update<PlayerProfile>(
            COLLECTIONS.USER_PROFILE,
            this.profile.id,
            {
                gold: this.profile.gold - amount,
            },
        );

        return true;
    }

    async addGems(amount: number) {
        if (!this.profile) return;

        this.profile = await dataController.update<PlayerProfile>(
            COLLECTIONS.USER_PROFILE,
            this.profile.id,
            {
                gems: this.profile.gems + amount,
            },
        );
    }

    // ========================================================================
    // Notifications
    // ========================================================================

    private async addNotification(
        notification: Omit<GameNotification, "id" | "timestamp" | "isRead">,
    ) {
        const newNotification = await dataController.create<GameNotification>(
            "notifications",
            {
                ...notification,
                timestamp: new Date().toISOString(),
                isRead: false,
            },
        );

        this.notifications.unshift(newNotification);

        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }
    }

    async markNotificationRead(id: string) {
        await dataController.update<GameNotification>("notifications", id, {
            isRead: true,
        });

        const notification = this.notifications.find((n) => n.id === id);
        if (notification) {
            notification.isRead = true;
        }
    }

    async clearNotifications() {
        await dataController.clear("notifications");
        this.notifications = [];
    }
}

// Export singleton
export const gamificationStore = new GamificationStore();
