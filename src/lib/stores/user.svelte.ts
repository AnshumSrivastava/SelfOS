import { browser } from "$app/environment";
import { auth } from "./auth.svelte";
import { settings } from "./settings.svelte";

// Types
export type User = {
    id: string;
    email?: string;
    username: string;
    displayName: string;
    avatar?: string;
    createdAt?: string;
};

class UserStore {
    currentUser = $derived.by(() => {
        const sbUser = auth.user;
        if (!sbUser) return null;

        return {
            id: sbUser.id,
            email: sbUser.email,
            username: sbUser.user_metadata?.username || sbUser.email?.split("@")[0] || "user",
            displayName: sbUser.user_metadata?.full_name || sbUser.email?.split("@")[0] || "User",
            avatar: sbUser.user_metadata?.avatar_url,
        } as User;
    });

    isAuthenticated = $derived(this.currentUser !== null);

    constructor() {
        if (browser) {
            // Initialization if needed
        }
    }

    // Auth actions
    async register(username: string, displayName: string, password: string) {
        try {
            await auth.signUp(username, password, displayName);
            return { success: true };
        } catch (e: any) {
            console.error("Signup error:", e);
            return { success: false, error: e.message };
        }
    }

    async login(username: string, password: string) {
        try {
            await auth.signIn(username, password);
            return { success: true };
        } catch (e: any) {
            console.error("Login error:", e);
            return { success: false, error: e.message };
        }
    }

    // Logout user
    logout() {
        auth.signOut();
    }

    // Update user preferences - proxy to settings store
    updatePreferences(preferences: any) {
        settings.update(preferences);
    }

    /**
     * Update user profile metadata
     */
    async updateProfile(updates: { displayName?: string; username?: string; avatar?: string }) {
        const metadata: any = {};
        if (updates.displayName) metadata.full_name = updates.displayName;
        if (updates.username) metadata.username = updates.username;
        if (updates.avatar) metadata.avatar_url = updates.avatar;

        try {
            await auth.updateUserMetadata(metadata);
            return { success: true };
        } catch (e: any) {
            console.error("Profile update error:", e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Get a unique storage key for a given key, scoped to the current user.
     * This is useful for storing user-specific data in localStorage.
     */
    getUserStorageKey(key: string): string {
        const userId = this.currentUser?.id || "local";
        return `selfos:${userId}:${key}`;
    }
}

export const userStore = new UserStore();
