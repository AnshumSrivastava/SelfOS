import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

// Try multiple sources: dynamic for SSR/local, import.meta.env for Vite-inlined build-time vars
const supabaseUrl = env.PUBLIC_SUPABASE_URL || import.meta.env.VITE_PUBLIC_SUPABASE_URL || (typeof window !== 'undefined' ? (window as any)._SUPABASE_URL : undefined);
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== 'undefined' ? (window as any)._SUPABASE_ANON_KEY : undefined);

// Create a dummy client to avoid null pointer exceptions in static builds
const dummyClient = {
    auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signInWithOAuth: async () => ({ error: new Error("Supabase URL or Anon Key is missing. Check your environment variables.") }),
        signOut: async () => ({ error: null }),
    },
    from: () => ({
        select: () => ({ order: () => Promise.resolve({ data: [], error: null }), single: () => Promise.resolve({ data: null, error: null }) }),
        insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
        delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
        upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    })
} as any;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY is missing. Using dummy client.");
}

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : dummyClient;
