import { browser } from '$app/environment';
import { base } from '$app/paths';
import { supabase } from '$lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

class AuthStore {
    #session = $state<Session | null>(null);
    #user = $state<User | null>(null);
    #loading = $state(true);

    constructor() {
        this.init();
    }

    #log(message: string, data?: any, level: 'info' | 'error' | 'warn' = 'info') {
        const timestamp = new Date().toISOString();
        const status = level.toUpperCase();
        const category = 'AUTH';
        const prefix = `[${timestamp}] [${category}] [${status}]`;

        const logMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;

        if (data) {
            logMethod(`${prefix} ${message} |`, data);
        } else {
            logMethod(`${prefix} ${message}`);
        }
    }

    async init() {
        if (!browser || !supabase || !supabase.auth) {
            this.#loading = false;
            return;
        }
        const { data: { session } } = await supabase.auth.getSession();
        this.#session = session;
        this.#user = session?.user ?? null;
        this.#loading = false;

        supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
            this.#session = session;
            this.#user = session?.user ?? null;
            this.#loading = false;
        });
    }

    get session() { return this.#session; }
    get user() { return this.#user; }
    get loading() { return this.#loading; }
    get isAuthenticated() { return !!this.#user; }

    private getEmail(username: string): string {
        if (username.includes("@")) return username;
        return `${username}@selfos.v2`;
    }

    async signUp(username: string, password: string, displayName: string) {
        if (!supabase || !supabase.auth) throw new Error("Supabase not initialized");

        // Use a dummy email based on username for simplicity in this system, but allow full emails
        const email = this.getEmail(username);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: displayName,
                    username: username
                }
            }
        });

        if (error) throw error;
        return data;
    }

    async signIn(username: string, password: string) {
        if (!supabase || !supabase.auth) throw new Error("Supabase not initialized");

        const email = this.getEmail(username);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    }

    async signInWithGoogle() {
        if (!supabase || !supabase.auth) {
            console.error("Supabase client is not initialized. Please check your PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.");
            throw new Error("Authentication currently unavailable. Please check configuration.");
        }

        // Ensure we handle subpaths (like GitHub Pages /SelfOS)
        const redirectUrl = base
            ? `${window.location.origin}${base}/auth/callback`
            : `${window.location.origin}/auth/callback`;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl
            }
        });
        if (error) {
            this.#log("Google login error", error, "error");
            throw error;
        }
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    async updateUserMetadata(metadata: Record<string, any>) {
        if (!supabase || !supabase.auth) throw new Error("Supabase not initialized");
        const { data, error } = await supabase.auth.updateUser({
            data: metadata
        });
        if (error) {
            this.#log("Update user metadata error", error, "error");
            throw error;
        }
        this.#user = data.user;
        return data.user;
    }
}

export const auth = new AuthStore();
