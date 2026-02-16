/**
 * Data Controller
 * Unified interface for all data operations
 * Abstracts the underlying storage mechanism (localStorage, Supabase, etc.)
 */

import type { IDataController, BaseEntity } from "./types";
import { LocalStorageAdapter } from "./adapters/LocalStorageAdapter";
// import { SupabaseAdapter } from './adapters/SupabaseAdapter';

// ============================================================================
// Configuration
// ============================================================================

const USE_SUPABASE = false; // Toggle this when ready to migrate to Supabase

// ============================================================================
// Singleton Data Controller
// ============================================================================

class DataControllerSingleton implements IDataController {
    private adapter: IDataController;

    constructor() {
        // Initialize with appropriate adapter
        if (USE_SUPABASE) {
            // this.adapter = new SupabaseAdapter();
            throw new Error(
                "Supabase adapter not yet implemented. Set USE_SUPABASE to false.",
            );
        } else {
            this.adapter = new LocalStorageAdapter("selfos_");
        }
    }

    // Delegate all IDataController methods to the adapter
    async get<T extends BaseEntity>(collection: string, id: string) {
        return this.adapter.get<T>(collection, id);
    }

    async getAll<T extends BaseEntity>(collection: string, filter?: any) {
        return this.adapter.getAll<T>(collection, filter);
    }

    async create<T extends BaseEntity>(collection: string, data: any) {
        return this.adapter.create<T>(collection, data);
    }

    async update<T extends BaseEntity>(
        collection: string,
        id: string,
        data: any,
    ) {
        return this.adapter.update<T>(collection, id, data);
    }

    async delete(collection: string, id: string) {
        return this.adapter.delete(collection, id);
    }

    async batchCreate<T extends BaseEntity>(collection: string, items: any[]) {
        return this.adapter.batchCreate<T>(collection, items);
    }

    async batchUpdate<T extends BaseEntity>(collection: string, updates: any[]) {
        return this.adapter.batchUpdate<T>(collection, updates);
    }

    async batchDelete(collection: string, ids: string[]) {
        return this.adapter.batchDelete(collection, ids);
    }

    async query<T extends BaseEntity>(collection: string, filter: any) {
        return this.adapter.query<T>(collection, filter);
    }

    async count(collection: string, filter?: any) {
        return this.adapter.count(collection, filter);
    }

    subscribe<T extends BaseEntity>(
        collection: string,
        callback: (data: T[]) => void,
        filter?: any,
    ) {
        return this.adapter.subscribe<T>(collection, callback, filter);
    }

    async clear(collection: string) {
        return this.adapter.clear(collection);
    }

    async clearAll() {
        return this.adapter.clearAll();
    }

    // Utility method to switch adapters (for testing or migration)
    switchAdapter(adapter: IDataController) {
        this.adapter = adapter;
    }
}

// Export singleton instance
export const dataController = new DataControllerSingleton();

// Export types for convenience
export type { IDataController, FilterOptions, QueryResult } from "./types";
export { COLLECTIONS } from "./types";
