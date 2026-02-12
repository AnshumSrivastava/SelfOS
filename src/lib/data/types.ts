/**
 * Core data layer types and interfaces
 * This file defines the contracts for database-agnostic data operations
 */

// ============================================================================
// Filter and Query Types
// ============================================================================

export interface FilterOptions {
    where?: Record<string, any>;
    orderBy?: { field: string; direction: "asc" | "desc" }[];
    limit?: number;
    offset?: number;
}

export interface QueryResult<T> {
    data: T[];
    total: number;
    hasMore: boolean;
}

// ============================================================================
// Data Controller Interface (Repository Pattern)
// ============================================================================

export interface IDataController {
    // CRUD Operations
    get<T>(collection: string, id: string): Promise<T | null>;
    getAll<T>(collection: string, filter?: FilterOptions): Promise<T[]>;
    create<T>(collection: string, data: Omit<T, "id">): Promise<T>;
    update<T>(
        collection: string,
        id: string,
        data: Partial<T>,
    ): Promise<T | null>;
    delete(collection: string, id: string): Promise<boolean>;

    // Batch Operations
    batchCreate<T>(collection: string, items: Omit<T, "id">[]): Promise<T[]>;
    batchUpdate<T>(
        collection: string,
        updates: Array<{ id: string; data: Partial<T> }>,
    ): Promise<T[]>;
    batchDelete(collection: string, ids: string[]): Promise<boolean>;

    // Query Operations
    query<T>(collection: string, filter: FilterOptions): Promise<QueryResult<T>>;
    count(collection: string, filter?: FilterOptions): Promise<number>;

    // Real-time Subscriptions (for future Supabase)
    subscribe<T>(
        collection: string,
        callback: (data: T[]) => void,
        filter?: FilterOptions,
    ): () => void;

    // Utility
    clear(collection: string): Promise<boolean>;
    clearAll(): Promise<boolean>;
}

// ============================================================================
// Base Entity Types
// ============================================================================

export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Collection Names (Type-safe collection references)
// ============================================================================

export const COLLECTIONS = {
    TASKS: "tasks",
    HABITS: "habits",
    FINANCE_TRANSACTIONS: "finance_transactions",
    FINANCE_BUDGETS: "finance_budgets",
    FINANCE_GOALS: "finance_goals",
    FINANCE_INVESTMENTS: "finance_investments",
    FINANCE_REMINDERS: "finance_reminders",
    NOTES: "notes",
    FOCUS_SESSIONS: "focus_sessions",
    USER_PROFILE: "user_profile",
    GAMIFICATION: "gamification",
    ACHIEVEMENTS: "achievements",
    QUESTS: "quests",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

// ============================================================================
// Error Types
// ============================================================================

export class DataError extends Error {
    constructor(
        message: string,
        public code: string,
        public details?: any,
    ) {
        super(message);
        this.name = "DataError";
    }
}

export class ValidationError extends DataError {
    constructor(message: string, details?: any) {
        super(message, "VALIDATION_ERROR", details);
        this.name = "ValidationError";
    }
}

export class NotFoundError extends DataError {
    constructor(collection: string, id: string) {
        super(`Item not found in ${collection}: ${id}`, "NOT_FOUND", {
            collection,
            id,
        });
        this.name = "NotFoundError";
    }
}
