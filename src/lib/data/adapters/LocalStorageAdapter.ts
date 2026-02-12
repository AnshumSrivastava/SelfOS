/**
 * LocalStorage Adapter
 * Implements IDataController for browser localStorage
 * This adapter will be replaced with SupabaseAdapter in the future
 */

import type {
    IDataController,
    FilterOptions,
    QueryResult,
    BaseEntity,
} from "../types";
import { NotFoundError, ValidationError } from "../types";

export class LocalStorageAdapter implements IDataController {
    private prefix: string;

    constructor(prefix: string = "selfos_") {
        this.prefix = prefix;
    }

    // ========================================================================
    // Private Helpers
    // ========================================================================

    private getKey(collection: string): string {
        return `${this.prefix}${collection}`;
    }

    private generateId(): string {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private readCollection<T extends BaseEntity>(collection: string): T[] {
        try {
            const key = this.getKey(collection);
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error(`Error reading collection ${collection}:`, error);
            return [];
        }
    }

    private writeCollection<T>(collection: string, data: T[]): void {
        try {
            const key = this.getKey(collection);
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error writing collection ${collection}:`, error);
            throw new Error(`Failed to write to localStorage: ${error}`);
        }
    }

    private applyFilter<T>(items: T[], filter?: FilterOptions): T[] {
        let result = [...items];

        // Apply where clause
        if (filter?.where) {
            result = result.filter((item) => {
                return Object.entries(filter.where!).every(([key, value]) => {
                    return (item as any)[key] === value;
                });
            });
        }

        // Apply ordering
        if (filter?.orderBy) {
            filter.orderBy.forEach(({ field, direction }) => {
                result.sort((a, b) => {
                    const aVal = (a as any)[field];
                    const bVal = (b as any)[field];
                    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
                    return direction === "asc" ? comparison : -comparison;
                });
            });
        }

        // Apply pagination
        if (filter?.offset !== undefined) {
            result = result.slice(filter.offset);
        }
        if (filter?.limit !== undefined) {
            result = result.slice(0, filter.limit);
        }

        return result;
    }

    // ========================================================================
    // CRUD Operations
    // ========================================================================

    async get<T extends BaseEntity>(
        collection: string,
        id: string,
    ): Promise<T | null> {
        const items = this.readCollection<T>(collection);
        const item = items.find((item) => item.id === id);
        return item || null;
    }

    async getAll<T extends BaseEntity>(
        collection: string,
        filter?: FilterOptions,
    ): Promise<T[]> {
        const items = this.readCollection<T>(collection);
        return this.applyFilter(items, filter);
    }

    async create<T extends BaseEntity>(
        collection: string,
        data: Omit<T, "id">,
    ): Promise<T> {
        const items = this.readCollection<T>(collection);
        const now = new Date().toISOString();

        const newItem = {
            ...data,
            id: this.generateId(),
            createdAt: now,
            updatedAt: now,
        } as T;

        items.push(newItem);
        this.writeCollection(collection, items);

        return newItem;
    }

    async update<T extends BaseEntity>(
        collection: string,
        id: string,
        data: Partial<T>,
    ): Promise<T | null> {
        const items = this.readCollection<T>(collection);
        const index = items.findIndex((item) => item.id === id);

        if (index === -1) {
            return null;
        }

        const updatedItem = {
            ...items[index],
            ...data,
            id: items[index].id, // Preserve ID
            createdAt: items[index].createdAt, // Preserve creation date
            updatedAt: new Date().toISOString(),
        };

        items[index] = updatedItem;
        this.writeCollection(collection, items);

        return updatedItem;
    }

    async delete(collection: string, id: string): Promise<boolean> {
        const items = this.readCollection(collection);
        const filteredItems = items.filter((item) => item.id !== id);

        if (filteredItems.length === items.length) {
            return false; // Item not found
        }

        this.writeCollection(collection, filteredItems);
        return true;
    }

    // ========================================================================
    // Batch Operations
    // ========================================================================

    async batchCreate<T extends BaseEntity>(
        collection: string,
        itemsToCreate: Omit<T, "id">[],
    ): Promise<T[]> {
        const items = this.readCollection<T>(collection);
        const now = new Date().toISOString();

        const newItems = itemsToCreate.map((data) => ({
            ...data,
            id: this.generateId(),
            createdAt: now,
            updatedAt: now,
        })) as T[];

        items.push(...newItems);
        this.writeCollection(collection, items);

        return newItems;
    }

    async batchUpdate<T extends BaseEntity>(
        collection: string,
        updates: Array<{ id: string; data: Partial<T> }>,
    ): Promise<T[]> {
        const items = this.readCollection<T>(collection);
        const now = new Date().toISOString();
        const updatedItems: T[] = [];

        updates.forEach(({ id, data }) => {
            const index = items.findIndex((item) => item.id === id);
            if (index !== -1) {
                const updatedItem = {
                    ...items[index],
                    ...data,
                    id: items[index].id,
                    createdAt: items[index].createdAt,
                    updatedAt: now,
                };
                items[index] = updatedItem;
                updatedItems.push(updatedItem);
            }
        });

        this.writeCollection(collection, items);
        return updatedItems;
    }

    async batchDelete(collection: string, ids: string[]): Promise<boolean> {
        const items = this.readCollection(collection);
        const idsSet = new Set(ids);
        const filteredItems = items.filter((item) => !idsSet.has(item.id));

        if (filteredItems.length === items.length) {
            return false; // No items deleted
        }

        this.writeCollection(collection, filteredItems);
        return true;
    }

    // ========================================================================
    // Query Operations
    // ========================================================================

    async query<T extends BaseEntity>(
        collection: string,
        filter: FilterOptions,
    ): Promise<QueryResult<T>> {
        const allItems = this.readCollection<T>(collection);
        const filteredItems = this.applyFilter(allItems, {
            ...filter,
            limit: undefined,
            offset: undefined,
        });

        const total = filteredItems.length;
        const offset = filter.offset || 0;
        const limit = filter.limit || total;
        const data = filteredItems.slice(offset, offset + limit);
        const hasMore = offset + limit < total;

        return { data, total, hasMore };
    }

    async count(collection: string, filter?: FilterOptions): Promise<number> {
        const items = this.readCollection(collection);
        const filteredItems = this.applyFilter(items, filter);
        return filteredItems.length;
    }

    // ========================================================================
    // Real-time Subscriptions (Simulated for localStorage)
    // ========================================================================

    subscribe<T extends BaseEntity>(
        collection: string,
        callback: (data: T[]) => void,
        filter?: FilterOptions,
    ): () => void {
        // For localStorage, we'll use storage events to simulate real-time updates
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === this.getKey(collection)) {
                const items = this.readCollection<T>(collection);
                const filteredItems = this.applyFilter(items, filter);
                callback(filteredItems);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // Initial data load
        const items = this.readCollection<T>(collection);
        const filteredItems = this.applyFilter(items, filter);
        callback(filteredItems);

        // Return unsubscribe function
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }

    // ========================================================================
    // Utility Methods
    // ========================================================================

    async clear(collection: string): Promise<boolean> {
        try {
            const key = this.getKey(collection);
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error clearing collection ${collection}:`, error);
            return false;
        }
    }

    async clearAll(): Promise<boolean> {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach((key) => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error("Error clearing all collections:", error);
            return false;
        }
    }
}
