import { supabase } from '$lib/supabaseClient';
import { auth } from './auth.svelte';

export class SupabaseStore<T extends { id: string }> {
    #value = $state<T[]>([]);
    #tableName: string;
    #loading = $state(true);
    #orderBy?: string;
    #primaryKey: string;

    constructor(tableName: string, options: { initialValue?: T[], primaryKey?: string, orderBy?: string } = {}) {
        this.#tableName = tableName;
        this.#value = options.initialValue || [];
        this.#primaryKey = options.primaryKey || 'id';
        this.#orderBy = options.orderBy || 'created_at';
        this.#log(`Initializing store for table: ${this.#tableName}`);
        this.init();
    }

    // Centralized logging helper
    #log(message: string, data?: any, level: 'info' | 'error' | 'warn' = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = `[SupabaseStore:${this.#tableName}] [${timestamp}]`;
        if (level === 'error') {
            console.error(`${prefix} ❌ ${message}`, data || '');
        } else if (level === 'warn') {
            console.warn(`${prefix} ⚠️ ${message}`, data || '');
        } else {
            // Only log info in development or if explicitly needed
            console.log(`${prefix} ℹ️ ${message}`, data || '');
        }
    }

    // Helper to map snake_case from DB to camelCase for JS
    private toCamel(obj: any): T {
        if (!obj) return obj;
        const result: any = {};
        for (const key in obj) {
            const camelKey = key.replace(/([-_][a-z])/g, group =>
                group.toUpperCase().replace('-', '').replace('_', '')
            );
            result[camelKey] = obj[key];
        }
        return result as T;
    }

    private EXCLUDED_KEYS = [
        'resources', 'scratchpad', 'tasks', 'meals', 'goals', 'notes',
        'logs', 'checkpoints', 'history', 'projects', 'areas', 'archives'
    ];

    private toSnake(obj: any): any {
        if (!obj) return obj;
        const result: any = {};
        for (const key in obj) {
            if (this.EXCLUDED_KEYS.includes(key)) continue;

            const snakeKey = key
                .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
                .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
                .toLowerCase();
            result[snakeKey] = obj[key];
        }
        return result;
    }

    async init() {
        if (typeof window === 'undefined') return;

        if (auth.loading) {
            $effect.root(() => {
                $effect(() => {
                    if (!auth.loading) {
                        this.#log(`Auth ready, fetching initial data...`);
                        this.fetch();
                    }
                });
            });
        } else {
            await this.fetch();
        }
    }

    async fetch() {
        if (!auth.isAuthenticated) {
            this.#log('Fetch skipped: User not authenticated');
            this.#loading = false;
            return;
        }

        this.#loading = true;
        try {
            this.#log('Fetching data...');
            let query = supabase.from(this.#tableName).select('*');

            if (this.#orderBy) {
                query = query.order(this.#orderBy, { ascending: false });
            }

            const { data, error } = await query;

            if (error) {
                this.#handleError('fetch', error);
                return;
            }

            this.#value = (data || []).map((item: any) => this.toCamel(item));
            this.#log(`Fetched ${this.#value.length} items`);
        } catch (e) {
            this.#log('Unexpected error during fetch', e, 'error');
        } finally {
            this.#loading = false;
        }
    }

    get value() { return this.#value; }
    set value(v) { this.#value = v; }
    get loading() { return this.#loading; }

    async insert(item: Omit<T, 'id'>) {
        if (!auth.isAuthenticated) {
            this.#log('Insert skipped: User not authenticated', null, 'warn');
            return;
        }

        try {
            this.#log('Inserting new item...', item);
            const dbItem = this.toSnake({ ...item, user_id: auth.user?.id });
            const { data, error } = await supabase
                .from(this.#tableName)
                .insert([dbItem])
                .select()
                .single();

            if (error) {
                this.#handleError('insert', error);
                throw error;
            }

            if (data) {
                const mapped = this.toCamel(data);
                this.#value = [mapped, ...this.#value];
                this.#log('Insert successful', mapped.id);
                return mapped;
            }
        } catch (e) {
            this.#log('Unexpected error during insert', e, 'error');
            throw e;
        }
    }

    async update(id: string, updates: Partial<T>) {
        if (!auth.isAuthenticated) {
            this.#log('Update skipped: User not authenticated', null, 'warn');
            return;
        }

        if (!id) {
            this.#log('Update skipped: Missing ID', null, 'error');
            return;
        }

        // Optimistic update
        const index = this.#value.findIndex(i => i.id === id);
        let previousValue: T | null = null;
        if (index !== -1) {
            previousValue = { ...this.#value[index] };
            this.#value = this.#value.map((item, i) =>
                i === index ? { ...item, ...updates } : item
            );
        }

        try {
            this.#log(`Updating item ${id}...`, updates);
            const { error } = await supabase
                .from(this.#tableName)
                .update(this.toSnake(updates))
                .eq(this.#primaryKey, id);

            if (error) {
                this.#handleError('update', error);
                // Rollback on error
                if (index !== -1 && previousValue) {
                    this.#value = this.#value.map((item, i) =>
                        i === index ? (previousValue as T) : item
                    );
                }
                throw error;
            }
            this.#log(`Update successful for ${id}`);
        } catch (e) {
            this.#log(`Unexpected error during update of ${id}`, e, 'error');
            // Ensure rollback if not already handled
            if (index !== -1 && previousValue) {
                this.#value = this.#value.map((item, i) =>
                    i === index ? (previousValue as T) : item
                );
            }
            throw e;
        }
    }

    async delete(id: string) {
        if (!auth.isAuthenticated) {
            this.#log('Delete skipped: User not authenticated', null, 'warn');
            return;
        }

        if (!id) {
            this.#log('Delete skipped: Missing ID', null, 'error');
            return;
        }

        // Optimistic update
        const previousValue = [...this.#value];
        this.#value = this.#value.filter(i => i.id !== id);

        try {
            this.#log(`Deleting item ${id}...`);
            const { error } = await supabase
                .from(this.#tableName)
                .delete()
                .eq(this.#primaryKey, id);

            if (error) {
                this.#handleError('delete', error);
                // Rollback on error
                this.#value = previousValue;
                throw error;
            }
            this.#log(`Delete successful for ${id}`);
        } catch (e) {
            this.#log(`Unexpected error during delete of ${id}`, e, 'error');
            this.#value = previousValue;
            throw e;
        }
    }

    async upsertSingle(updates: Partial<T>) {
        if (!auth.isAuthenticated) {
            this.#log('Upsert skipped: User not authenticated', null, 'warn');
            return;
        }

        try {
            this.#log('Upserting single record...', updates);
            const { data, error } = await supabase
                .from(this.#tableName)
                .upsert(this.toSnake({ ...updates, user_id: auth.user?.id }))
                .select()
                .single();

            if (error) {
                this.#handleError('upsertSingle', error);
                throw error;
            }

            if (data) {
                const mapped = this.toCamel(data);
                this.#value = [mapped];
                this.#log('Upsert successful', mapped.id);
                return mapped;
            }
        } catch (e) {
            this.#log('Unexpected error during upsert', e, 'error');
            throw e;
        }
    }

    #handleError(operation: string, error: any) {
        this.#log(`Error during ${operation} on ${this.#tableName}`, error, 'error');
        if (error.code === '42P01') {
            this.#log(`HINT: Table "${this.#tableName}" does not exist. Did you run the latest supabase_schema.sql?`, null, 'error');
        } else if (error.code === '23503') {
            this.#log(`HINT: Foreign key violation. Check if referenced records (like goals or projects) exist.`, null, 'error');
        } else if (error.code === 'PGRST116') {
            this.#log(`No records found or too many records for .single()`, null, 'warn');
        }
    }
}
