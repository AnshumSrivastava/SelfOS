/**
 * Supabase Adapter (Placeholder)
 * Future implementation for Supabase backend
 * Will implement the same IDataController interface
 */

import type {
    IDataController,
    FilterOptions,
    QueryResult,
    BaseEntity,
} from "../types";

export class SupabaseAdapter implements IDataController {
    // TODO: Implement Supabase client integration
    // This will be implemented when migrating to Supabase

    async get<T extends BaseEntity>(
        collection: string,
        id: string,
    ): Promise<T | null> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async getAll<T extends BaseEntity>(
        collection: string,
        filter?: FilterOptions,
    ): Promise<T[]> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async create<T extends BaseEntity>(
        collection: string,
        data: Omit<T, "id">,
    ): Promise<T> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async update<T extends BaseEntity>(
        collection: string,
        id: string,
        data: Partial<T>,
    ): Promise<T | null> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async delete(collection: string, id: string): Promise<boolean> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async batchCreate<T extends BaseEntity>(
        collection: string,
        items: Omit<T, "id">[],
    ): Promise<T[]> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async batchUpdate<T extends BaseEntity>(
        collection: string,
        updates: Array<{ id: string; data: Partial<T> }>,
    ): Promise<T[]> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async batchDelete(collection: string, ids: string[]): Promise<boolean> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async query<T extends BaseEntity>(
        collection: string,
        filter: FilterOptions,
    ): Promise<QueryResult<T>> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async count(collection: string, filter?: FilterOptions): Promise<number> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    subscribe<T extends BaseEntity>(
        collection: string,
        callback: (data: T[]) => void,
        filter?: FilterOptions,
    ): () => void {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async clear(collection: string): Promise<boolean> {
        throw new Error("SupabaseAdapter not yet implemented");
    }

    async clearAll(): Promise<boolean> {
        throw new Error("SupabaseAdapter not yet implemented");
    }
}
