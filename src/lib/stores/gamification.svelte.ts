import { SupabaseStore } from './supabaseStore.svelte';
import { auth } from './auth.svelte';

export type AvatarData = {
    class: string;
    name: string;
    customization: any;
    equipment: any;
};

export type PlayerProfile = {
    userId: string;
    username: string;
    level: number;
    xp: number;
    totalXP: number;
    gold: number;
    gems: number;
    avatar: AvatarData;
    achievements: string[];
    badges: string[];
    completedQuests: string[];
};

export type Achievement = {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    category: string;
    requirements: any[];
    xpReward: number;
    goldReward: number;
    badgeId?: string;
    progress: number;
    maxProgress: number;
    isCompleted: boolean;
    isHidden: boolean;
    order: number;
    completedAt?: string;
};

export type GameNotification = {
    id: string;
    type: string;
    title: string;
    message: string;
    icon: string;
    data?: any;
    isRead: boolean;
    timestamp: string;
};

function calculateXPForLevel(level: number): number {
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

class GamificationStore {
    private profileStore = new SupabaseStore<PlayerProfile & { id: string }>('gamification_profiles');
    private achievementsStore = new SupabaseStore<Achievement>('gamification_achievements', { migrationKey: 'selfos_achievements' });
    private notificationsStore = new SupabaseStore<GameNotification>('gamification_notifications', { migrationKey: 'selfos_notifications' });

    constructor() {
        this.init();
    }

    private async init() {
        if (typeof window === 'undefined') return;

        $effect.root(() => {
            $effect(() => {
                if (!auth.loading && auth.isAuthenticated) {
                    this.migrateAndSync();
                }
            });
        });
    }

    private async migrateAndSync() {
        if (this.profileStore.value.length === 0) {
            const saved = localStorage.getItem('selfos_user_profile');
            if (saved) {
                console.log("Migrating gamification profile from localStorage...");
                const parsed = JSON.parse(saved);
                // DataController usually saves as an array or object in local storage
                const data = Array.isArray(parsed) ? parsed[0] : parsed;
                if (data) {
                    await this.profileStore.upsertSingle({
                        username: data.username || 'Hero',
                        level: data.level || 1,
                        xp: data.xp || 0,
                        totalXP: data.totalXP || 0,
                        gold: data.gold || 0,
                        gems: data.gems || 0,
                        avatar: data.avatar || DEFAULT_AVATAR,
                        achievements: data.achievements || [],
                        badges: data.badges || [],
                        completedQuests: data.completedQuests || []
                    });
                }
            } else {
                await this.profileStore.upsertSingle({
                    username: 'Hero',
                    level: 1,
                    xp: 0,
                    totalXP: 0,
                    gold: 0,
                    gems: 0,
                    avatar: DEFAULT_AVATAR,
                    achievements: [],
                    badges: [],
                    completedQuests: []
                });
            }
        }

        // Initialize default achievements if empty after migration check
        if (this.achievementsStore.value.length === 0) {
            await this.initializeDefaultAchievements();
        }
    }

    get profile(): PlayerProfile | null {
        return this.profileStore.value[0] || null;
    }

    get achievements() {
        return this.achievementsStore.value;
    }

    get notifications() {
        return this.notificationsStore.value.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    get unreadNotifications() {
        return this.notifications.filter(n => !n.isRead).length;
    }

    get xpToNextLevel() {
        if (!this.profile) return 0;
        return calculateXPForLevel(this.profile.level + 1);
    }

    get xpProgress() {
        if (!this.profile) return 0;
        return (this.profile.xp / this.xpToNextLevel) * 100;
    }

    async gainXP(amount: number, source: string, sourceId: string) {
        if (!this.profile) return;

        const oldLevel = this.profile.level;
        const newTotalXP = this.profile.totalXP + amount;
        const newLevel = calculateLevelFromXP(newTotalXP);

        let xpInLevel = amount;
        if (newLevel > oldLevel) {
            const xpForOldLevel = calculateXPForLevel(oldLevel + 1);
            xpInLevel = this.profile.xp + amount - xpForOldLevel;
        } else {
            xpInLevel = this.profile.xp + amount;
        }

        await this.profileStore.upsertSingle({
            xp: xpInLevel,
            totalXP: newTotalXP,
            level: newLevel
        });

        if (newLevel > oldLevel) {
            await this.handleLevelUp(oldLevel, newLevel);
        }
    }

    private async handleLevelUp(oldLevel: number, newLevel: number) {
        if (!this.profile) return;

        const goldReward = newLevel * 50;
        const gemsReward = newLevel % 5 === 0 ? 10 : 0;

        await this.profileStore.upsertSingle({
            gold: this.profile.gold + goldReward,
            gems: this.profile.gems + gemsReward
        });

        await this.addNotification({
            type: "level_up",
            title: `Level Up! You're now Level ${newLevel}`,
            message: `You earned ${goldReward} gold${gemsReward > 0 ? ` and ${gemsReward} gems` : ""}!`,
            icon: "🎉",
        });

        await this.checkLevelAchievements(newLevel);
    }

    private async initializeDefaultAchievements() {
        const defaults = [
            { title: "First Steps", description: "Complete your first quest", icon: "🎯", rarity: "common", category: "productivity", requirements: [{ type: "task_count", target: 1, current: 0 }], xpReward: 10, goldReward: 5, progress: 0, maxProgress: 1, isCompleted: false, isHidden: false, order: 1 },
            { title: "Habit Former", description: "Maintain a 7-day streak", icon: "🔥", rarity: "rare", category: "habits", requirements: [{ type: "habit_streak", target: 7, current: 0 }], xpReward: 100, goldReward: 50, progress: 0, maxProgress: 7, isCompleted: false, isHidden: false, order: 2 }
        ];

        for (const d of defaults) {
            await this.achievementsStore.insert(d as any);
        }
    }

    async checkAchievement(achievementId: string, progress: number) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.isCompleted) return;

        const isCompleted = progress >= achievement.maxProgress;
        await this.achievementsStore.update(achievementId, {
            progress: Math.min(progress, achievement.maxProgress),
            isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : undefined
        });

        if (isCompleted) {
            await this.unlockAchievement(achievement);
        }
    }

    private async unlockAchievement(achievement: Achievement) {
        if (!this.profile) return;

        await this.profileStore.upsertSingle({
            achievements: [...this.profile.achievements, achievement.id]
        });

        await this.gainXP(achievement.xpReward, "achievement_unlock", achievement.id);
        await this.addGold(achievement.goldReward);

        await this.addNotification({
            type: "achievement",
            title: `Achievement Unlocked: ${achievement.title}`,
            message: achievement.description,
            icon: achievement.icon,
            data: { achievementId: achievement.id, rarity: achievement.rarity },
        });
    }

    private async checkLevelAchievements(level: number) {
        const levelAchievements = this.achievements.filter(a => !a.isCompleted && a.requirements.some(r => r.type === "level_reach"));
        for (const achievement of levelAchievements) {
            await this.checkAchievement(achievement.id, level);
        }
    }

    async addGold(amount: number) {
        if (!this.profile) return;
        await this.profileStore.upsertSingle({ gold: this.profile.gold + amount });
    }

    async addGems(amount: number) {
        if (!this.profile) return;
        await this.profileStore.upsertSingle({ gems: this.profile.gems + amount });
    }

    async addNotification(notification: any) {
        await this.notificationsStore.insert({
            ...notification,
            timestamp: new Date().toISOString(),
            isRead: false
        });
    }

    async markNotificationRead(id: string) {
        await this.notificationsStore.update(id, { isRead: true });
    }

    async clearNotifications() {
        for (const n of this.notifications) {
            await this.notificationsStore.delete(n.id);
        }
    }
}

export const gamificationStore = new GamificationStore();
