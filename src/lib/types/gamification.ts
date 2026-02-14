/**
 * Gamification System Types
 * Defines all interfaces for the RPG-style gamification mechanics
 */

import type { BaseEntity } from "$lib/data/types";

// ============================================================================
// Player & Character
// ============================================================================

export interface PlayerProfile extends BaseEntity {
    // Basic Info
    username: string;
    email?: string;

    // Progression
    level: number;
    xp: number;
    totalXp: number;

    // Currency
    gold: number;
    gems: number;

    // Character
    avatar: AvatarData;

    // Progression Tracking
    achievements: string[]; // Achievement IDs
    badges: string[]; // Badge IDs
    completedQuests: string[]; // Quest IDs

    // Preferences
    preferences: {
        theme: string;
        notifications: boolean;
        soundEffects: boolean;
    };
}

export interface AvatarData {
    class: "Warrior" | "Mage" | "Rogue" | "Paladin" | "Ranger";
    name: string;
    customization: {
        skinTone: string;
        hairStyle: string;
        hairColor: string;
        eyeColor: string;
        outfit: string;
        accessory?: string;
    };
    equipment: {
        weapon?: string;
        armor?: string;
        helmet?: string;
        accessory?: string;
    };
}

// ============================================================================
// XP & Leveling
// ============================================================================

export interface XPGainEvent {
    amount: number;
    source: XPSource;
    sourceId: string;
    timestamp: string;
    multiplier?: number;
}

export type XPSource =
    | "task_complete"
    | "habit_complete"
    | "streak_milestone"
    | "quest_complete"
    | "achievement_unlock"
    | "focus_session"
    | "daily_login"
    | "challenge_win";

export interface LevelUpReward {
    level: number;
    gold: number;
    gems?: number;
    unlocks?: string[]; // Feature or item unlocks
}

// ============================================================================
// Achievements & Badges
// ============================================================================

export interface Achievement extends BaseEntity {
    title: string;
    description: string;
    icon: string;
    rarity: AchievementRarity;
    category: AchievementCategory;

    // Requirements
    requirements: AchievementRequirement[];

    // Rewards
    xpReward: number;
    goldReward: number;
    badgeId?: string;

    // Progress
    progress: number;
    maxProgress: number;
    isCompleted: boolean;
    completedAt?: string;

    // Display
    isHidden: boolean; // Secret achievements
    order: number;
}

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export type AchievementCategory =
    | "productivity"
    | "habits"
    | "finance"
    | "learning"
    | "social"
    | "special";

export interface AchievementRequirement {
    type:
    | "task_count"
    | "habit_streak"
    | "xp_total"
    | "level_reach"
    | "gold_earn"
    | "focus_hours"
    | "custom";
    target: number;
    current: number;
}

export interface Badge extends BaseEntity {
    name: string;
    description: string;
    icon: string;
    tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
    category: string;
    earnedAt: string;
}

// ============================================================================
// Quests (Gamified Tasks)
// ============================================================================

export interface Quest extends BaseEntity {
    // Basic Info
    title: string;
    description: string;
    notes?: string;

    // Quest Properties
    rarity: QuestRarity;
    questType: QuestType;
    difficulty: 1 | 2 | 3 | 4 | 5; // Star rating

    // Status
    status: "active" | "completed" | "failed" | "abandoned";
    priority: "low" | "medium" | "high";

    // Timing
    deadline?: string;
    scheduledFor?: string;
    completedAt?: string;

    // Organization
    project?: string;
    tags: string[];
    category?: string;

    // Rewards
    xpReward: number;
    goldReward: number;
    bonusRewards?: {
        gems?: number;
        items?: string[];
    };

    // Sub-quests (optional)
    subQuests?: SubQuest[];
    parentQuestId?: string;
}

export type QuestRarity = "common" | "rare" | "epic" | "legendary";

export type QuestType =
    | "main" // Important tasks
    | "side" // Optional tasks
    | "daily" // Recurring daily
    | "weekly" // Recurring weekly
    | "event"; // Special limited-time

export interface SubQuest {
    id: string;
    title: string;
    isCompleted: boolean;
}

// ============================================================================
// Daily Challenges (Gamified Habits)
// ============================================================================

export interface DailyChallenge extends BaseEntity {
    name: string;
    description?: string;
    icon?: string;

    // Challenge Properties
    difficulty: 1 | 2 | 3 | 4 | 5;
    category: string;

    // Tracking
    streak: number;
    bestStreak: number;
    completionHistory: Record<string, boolean>; // date -> completed

    // Rewards
    baseXP: number;
    streakBonus: number; // XP per streak day
    goldReward: number;

    // Status
    isActive: boolean;
    lastCompletedAt?: string;
}

// ============================================================================
// Rewards & Economy
// ============================================================================

export interface Reward {
    id: string;
    name: string;
    description: string;
    icon: string;
    type: "cosmetic" | "powerup" | "unlock" | "custom";
    cost: {
        gold?: number;
        gems?: number;
    };
    isUnlocked: boolean;
    isPurchased: boolean;
}

export interface PowerUp {
    id: string;
    name: string;
    description: string;
    icon: string;
    effect: {
        type: "xp_multiplier" | "gold_multiplier" | "focus_boost";
        value: number;
        duration: number; // minutes
    };
    cost: {
        gold?: number;
        gems?: number;
    };
}

// ============================================================================
// Streaks & Milestones
// ============================================================================

export interface StreakData {
    current: number;
    longest: number;
    lastUpdated: string;
    milestones: StreakMilestone[];
}

export interface StreakMilestone {
    days: number;
    reward: {
        xp: number;
        gold: number;
        badge?: string;
    };
    isUnlocked: boolean;
}

// ============================================================================
// Leaderboards (Optional Social Feature)
// ============================================================================

export interface LeaderboardEntry {
    userId: string;
    username: string;
    avatar: string;
    level: number;
    xp: number;
    rank: number;
}

// ============================================================================
// Notifications & Events
// ============================================================================

export interface GameNotification {
    id: string;
    type:
    | "level_up"
    | "achievement"
    | "quest_complete"
    | "streak_milestone"
    | "reward_earned";
    title: string;
    message: string;
    icon?: string;
    timestamp: string;
    isRead: boolean;
    data?: any; // Additional context
}
