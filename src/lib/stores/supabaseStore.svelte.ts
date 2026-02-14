import { supabase } from '$lib/supabaseClient';
import { auth } from './auth.svelte';

export class SupabaseStore<T extends { id: string }> {
    #value = $state<T[]>([]);
    #tableName: string;
    #loading = $state(true);
    #migrationKey?: string;

    constructor(tableName: string, options: { initialValue?: T[], migrationKey?: string } = {}) {
        this.#tableName = tableName;
        this.#value = options.initialValue || [];
        this.#migrationKey = options.migrationKey;
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

    // Helper to map camelCase from JS to snake_case for DB
    private toSnake(obj: any): any {
        const result: any = {};
        for (const key in obj) {
            const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
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
                        this.#fetchAndMigrate();
                    }
                });
            });
        } else {
            await this.#fetchAndMigrate();
        }
    }

    async #fetchAndMigrate() {
        await this.fetch();

        // If DB is empty and migration key is provided, try to migrate from localStorage
        if (this.#value.length === 0 && this.#migrationKey && auth.isAuthenticated) {
            const stored = localStorage.getItem(this.#migrationKey);
            if (stored) {
                try {
                    const localData = JSON.parse(stored);
                    if (Array.isArray(localData) && localData.length > 0) {
                        console.log(`Migrating ${this.#tableName} from localStorage...`);
                        // Push all local items to Supabase
                        const itemsToInsert = localData.map(item => {
                            const { id, ...rest } = item;
                            return this.toSnake({ ...rest, user_id: auth.user?.id });
                        });

                        const { data, error } = await supabase
                            .from(this.#tableName)
                            .insert(itemsToInsert)
                            .select();

                        if (error) {
                            console.error(`Error during migration of ${this.#tableName}:`, error);
                            console.error(`Error details:`, error.message, error.details, error.hint);
                        } else if (data) {
                            this.#value = data.map((item: any) => this.toCamel(item));
                            console.log(`Successfully migrated ${data.length} items to ${this.#tableName}.`);
                        }
                    } else if (localData && typeof localData === 'object' && !Array.isArray(localData)) {
                        // For single object stores
                        await this.upsertSingle(localData);
                    }
                } catch (e) {
                    console.error(`Migration error for ${this.#tableName}:`, e);
                }
            }
        }
    }

    async fetch() {
        if (!auth.isAuthenticated) {
            this.#loading = false;
            return;
        }

        this.#loading = true;
        const { data, error } = await supabase
            .from(this.#tableName)
            .select('*')
            .order('created_at', { ascending: false });

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
            .eq('id', id);

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
            .eq('id', id);

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
