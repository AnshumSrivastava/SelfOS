import { supabase } from '$lib/supabaseClient';
import { auth } from './auth.svelte';
import { generateUUID } from '$lib/utils/uuid';
import { toasts } from './toasts.svelte';
import { logger } from '$lib/services/logger';
import { syncStore } from './sync.svelte';

export type StoreStatus = 'idle' | 'loading' | 'saving' | 'error' | 'success';

export class SupabaseStore<T extends { id: string }> {
    // Caching & Deduplication
    #initialized = false;
    #lastFetchedAt = 0;
    #staleMs = 60_000; // 1 minute TTL
    #inFlightFetch: Promise<void> | null = null;
    #value = $state<T[]>([]);
    #tableName: string;
    #status = $state<StoreStatus>('idle');
    #error = $state<string | null>(null);
    #orderBy?: string;
    #primaryKey: string;

    constructor(tableName: string, options: { initialValue?: T[], primaryKey?: string, orderBy?: string } = {}) {
        this.#tableName = tableName;
        this.#value = options.initialValue || [];
        this.#primaryKey = options.primaryKey || 'id';
        this.#orderBy = options.orderBy || 'created_at';

        // Register with Global Sync Store
        syncStore.register(this.#tableName, this.#tableName);
        // Note: No eager fetch here anymore. 
        // Stores must call await store.init() or simply use accessible methods.
    }

    // Public method to manually trigger init if needed (lazy load)
    async init() {
        if (this.#initialized) return;
        if (typeof window === 'undefined') return;

        if (auth.loading) {
            // If auth is still loading, we can't fetch yet.
            // We set up an effect to fetch once auth is ready.
            $effect.root(() => {
                $effect(() => {
                    if (!auth.loading && !this.#initialized) {
                        this.fetch();
                    }
                });
            });
        } else {
            await this.fetch();
        }
    }

    // Helper to ensure data is loaded before write operations
    async ensureInitialized() {
        if (!this.#initialized && !this.#inFlightFetch) {
            await this.init();
        } else if (this.#inFlightFetch) {
            await this.#inFlightFetch;
        }
    }

    // Centralized logging helper - now using global logger
    #log(message: string, data?: any, level: 'info' | 'error' | 'warn' = 'info') {
        const lvl = level.toUpperCase() as any;
        logger[level]('DATA', message, data, this.#tableName);
    }

    #setStatus(status: StoreStatus, error: string | null = null) {
        this.#status = status;
        this.#error = error;
        syncStore.updateStatus(this.#tableName, status, error);
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

    // Concurrency Control
    private static requestQueue: Array<() => Promise<void>> = [];
    private static activeRequests = 0;
    private static MAX_CONCURRENCY = 4;

    private static async processQueue() {
        if (this.activeRequests >= this.MAX_CONCURRENCY || this.requestQueue.length === 0) return;

        this.activeRequests++;
        const task = this.requestQueue.shift();

        if (task) {
            try {
                await task();
            } finally {
                this.activeRequests--;
                this.processQueue();
            }
        }
    }

    private static enqueue(task: () => Promise<void>) {
        this.requestQueue.push(task);
        this.processQueue();
    }

    async fetch(force: boolean = false) {
        if (!auth.isAuthenticated) {
            this.#log('Fetch skipped: User not authenticated');
            this.#status = 'idle';
            return;
        }

        // 1. Deduplication: Return existing promise if already fetching
        if (this.#inFlightFetch) {
            this.#log('Fetch deduplicated (already in flight)');
            return this.#inFlightFetch;
        }

        // 2. Cache/TTL Check
        const isStale = Date.now() - this.#lastFetchedAt > this.#staleMs;
        const hasData = this.#value.length > 0;

        if (!force && hasData && !isStale) {
            this.#log('Fetch skipped: Data is fresh (TTL valid)');
            return;
        }

        // Only show loading state if we have no data yet OR it's a forced refresh
        if (force || !hasData) {
            this.#setStatus('loading');
        }

        // Start request
        this.#inFlightFetch = new Promise<void>((resolve, reject) => {
            SupabaseStore.enqueue(async () => {
                try {
                    await this.executeFetchWithRetry();
                    resolve();
                } catch (e) {
                    reject(e);
                } finally {
                    this.#inFlightFetch = null;
                }
            });
        });

        return this.#inFlightFetch;
    }

    private async executeFetchWithRetry(retries = 3) {
        try {
            this.#log('Fetching data...');
            let query = supabase.from(this.#tableName).select('*');

            if (this.#orderBy) {
                query = query.order(this.#orderBy, { ascending: false });
            }

            const { data, error } = await query;

            if (error) {
                if (retries > 0) {
                    this.#log(`Fetch failed, retrying (${retries} left)...`, error, 'warn');
                    await new Promise(r => setTimeout(r, 1000)); // Backoff
                    await this.executeFetchWithRetry(retries - 1);
                    return;
                }
                this.#handleError('fetch', error);
                return;
            }

            this.#value = (data || []).map((item: any) => this.toCamel(item));
            this.#lastFetchedAt = Date.now();
            this.#initialized = true;
            this.#log(`Fetched ${this.#value.length} items`);
            this.#setStatus('idle');
        } catch (e) {
            this.#log('Unexpected error during fetch', e, 'error');
            this.#setStatus('error', (e as Error).message);
        }
    }

    get value() { return this.#value; }
    set value(v) { this.#value = v; }
    get loading() { return this.#status === 'loading'; }
    get status() { return this.#status; }
    get errorMsg() { return this.#error; }

    async insert(item: Omit<T, 'id'>) {
        await this.ensureInitialized();
        if (!auth.isAuthenticated) {
            this.#log('Insert skipped: User not authenticated', null, 'warn');
            return;
        }

        const tempId = `temp-${generateUUID()}`;
        const previousValue = [...this.#value];

        // Optimistic update
        const optimisticItem = this.toCamel({ ...item, id: tempId });
        this.#value = [optimisticItem, ...this.#value];
        this.#setStatus('saving');

        try {
            const dbItem = this.toSnake({ ...item, user_id: auth.user?.id });
            this.#log('Inserting dbItem:', dbItem);

            const { data, error } = await supabase
                .from(this.#tableName)
                .insert([dbItem])
                .select()
                .single();

            if (error) {
                this.#log('Insert query error:', error, 'error');
                this.#handleError('insert', error);
                this.#value = previousValue; // Rollback
                throw error;
            }

            if (data) {
                const mapped = this.toCamel(data);
                // Replace optimistic item with actual data
                this.#value = this.#value.map(i => i.id === tempId ? mapped : i);
                this.#log('Insert successful, replaced temp ID with:', mapped.id);
                this.#setStatus('success');
                setTimeout(() => { if (this.#status === 'success') this.#setStatus('idle'); }, 2000);
                return mapped;
            } else {
                this.#log('Insert returned no data (unexpected)', null, 'warn');
                this.#value = previousValue; // Rollback just in case
                this.#setStatus('idle');
            }
        } catch (e) {
            this.#log('Unexpected error during insert', e, 'error');
            this.#value = previousValue; // Rollback
            this.#setStatus('error', (e as Error).message);
            throw e;
        }
    }

    async update(id: string, updates: Partial<T>) {
        await this.ensureInitialized();
        if (!auth.isAuthenticated) {
            this.#log('Update skipped: User not authenticated', null, 'warn');
            return;
        }

        if (!id) {
            this.#log('Update skipped: Missing ID', null, 'error');
            return;
        }
        // ...
    }

    async delete(id: string) {
        await this.ensureInitialized();
        if (!auth.isAuthenticated) {
            this.#log('Delete skipped: User not authenticated', null, 'warn');
            return;
        }

        if (!id) {
            this.#log('Delete skipped: Missing ID', null, 'error');
            return;
        }
        // ...
    }

    async upsertSingle(updates: Partial<T>) {
        await this.ensureInitialized();
        if (!auth.isAuthenticated) {
            this.#log('Upsert skipped: User not authenticated', null, 'warn');
            return;
        }

        try {
            this.#setStatus('saving');
            // ...
        } catch (e) {
            this.#log('Unexpected error during upsert', e, 'error');
            this.#setStatus('error', (e as Error).message);
            throw e;
        }
    }

    #handleError(operation: string, error: any) {
        const message = error.message || "Unknown database error";
        this.#log(`Error during ${operation} on ${this.#tableName}`, error, 'error');
        this.#setStatus('error', message);

        // Show user-facing toast for critical failures
        if (operation !== 'fetch') {
            toasts.error(`${this.#tableName.replace('_', ' ')} ${operation} failed: ${message}`);
        }

        if (error.code === '42P01') {
            this.#log(`HINT: Table "${this.#tableName}" does not exist. Did you run the latest supabase_schema.sql?`, null, 'error');
        } else if (error.code === '23503') {
            this.#log(`HINT: Foreign key violation. Check if referenced records (like goals or projects) exist.`, null, 'error');
        } else if (error.code === 'PGRST116') {
            this.#log(`No records found or too many records for .single()`, null, 'warn');
        }
    }
}
