import { browser } from '$app/environment';
import { supabase } from '$lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

class AuthStore {
    #session = $state<Session | null>(null);
    #user = $state<User | null>(null);
    #loading = $state(true);

    constructor() {
        this.init();
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

    async signInWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error) throw error;
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
}

export const auth = new AuthStore();
