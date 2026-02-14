import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;

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
