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
        this.init();
    }

    // Helper to map snake_case from DB to camelCase for JS
    private toCamel(obj: any): T {
        const result: any = {};
        for (const key in obj) {
            const camelKey = key.replace(/([-_][a-z])/g, group =>
                group.toUpperCase().replace('-', '').replace('_', '')
            );
            result[camelKey] = obj[key];
        }
        return result as T;
    }

    // List of keys to exclude when writing to DB (e.g., nested UI-only data)
    private EXCLUDED_KEYS = [
        'resources', 'scratchpad', 'tasks', 'meals', 'goals', 'notes',
        'logs', 'checkpoints', 'history', 'projects', 'areas', 'archives'
    ];

    // Helper to map camelCase from JS to snake_case for DB and filter extra fields
    private toSnake(obj: any): any {
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

        // Wait for session to be ready
        if (auth.loading) {
            $effect.root(() => {
                $effect(() => {
                    if (!auth.loading) {
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
            this.#loading = false;
            return;
        }

        this.#loading = true;
        let query = supabase.from(this.#tableName).select('*');

        if (this.#orderBy) {
            query = query.order(this.#orderBy, { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
            console.error(`Error fetching from ${this.#tableName}:`, error);
            console.error(`Error details:`, error.message, error.details, error.hint);
            if (error.code === '42P01') {
                console.error(`HINT: Table "${this.#tableName}" does not exist. Did you run supabase_schema.sql?`);
            }
        } else {
            this.#value = (data || []).map((item: any) => this.toCamel(item));
        }
        this.#loading = false;
    }

    get value() { return this.#value; }
    set value(v) { this.#value = v; }
    get loading() { return this.#loading; }

    async insert(item: Omit<T, 'id'>) {
        if (!auth.isAuthenticated) return;

        const dbItem = this.toSnake({ ...item, user_id: auth.user?.id });
        const { data, error } = await supabase
            .from(this.#tableName)
            .insert([dbItem])
            .select()
            .single();

        if (error) {
            console.error(`Error inserting into ${this.#tableName}:`, error);
            console.error(`Error details:`, error.message, error.details, error.hint);
            throw error;
        }

        if (data) {
            const mapped = this.toCamel(data);
            this.#value = [mapped, ...this.#value];
            return mapped;
        }
    }

    async update(id: string, updates: Partial<T>) {
        if (!auth.isAuthenticated) return;

        // Optimistic update
        const index = this.#value.findIndex(i => i.id === id);
        let previousValue: T | null = null;
        if (index !== -1) {
            previousValue = { ...this.#value[index] };
            this.#value[index] = { ...this.#value[index], ...updates };
        }

        const { error } = await supabase
            .from(this.#tableName)
            .update(this.toSnake(updates))
            .eq(this.#primaryKey, id);

        if (error) {
            console.error(`Error updating ${this.#tableName}:`, error);
            console.error(`Error details:`, error.message, error.details, error.hint);
            // Rollback on error
            if (index !== -1 && previousValue) {
                this.#value[index] = previousValue;
            }
            throw error;
        }
    }

    async delete(id: string) {
        if (!auth.isAuthenticated) return;

        // Optimistic update
        const previousValue = [...this.#value];
        this.#value = this.#value.filter(i => i.id !== id);

        const { error } = await supabase
            .from(this.#tableName)
            .delete()
            .eq(this.#primaryKey, id);

        if (error) {
            console.error(`Error deleting from ${this.#tableName}:`, error);
            // Rollback on error
            this.#value = previousValue;
            throw error;
        }
    }

    async upsertSingle(updates: Partial<T>) {
        if (!auth.isAuthenticated) return;

        const { data, error } = await supabase
            .from(this.#tableName)
            .upsert(this.toSnake({ ...updates, user_id: auth.user?.id }))
            .select()
            .single();

        if (error) {
            console.error(`Error upserting into ${this.#tableName}:`, error);
            console.error(`Error details:`, error.message, error.details, error.hint);
            throw error;
        }

        if (data) {
            const mapped = this.toCamel(data);
            this.#value = [mapped];
            return mapped;
        }
    }
}
