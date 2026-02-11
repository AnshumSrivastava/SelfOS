import { browser } from "$app/environment";

// Types
export type User = {
    id: string;
    username: string;
    displayName: string;
    passwordHash: string;
    createdAt: string;
    avatar?: string;
    preferences: UserPreferences;
};

export type UserPreferences = {
    theme: "dark" | "light" | "amoled" | "minimal";
    accentColor: string;
    layoutStyle: "card" | "list" | "compact";
    fontSize: "compact" | "normal" | "large";
    animations: boolean;
};

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: "dark",
    accentColor: "#00ff9d",
    layoutStyle: "card",
    fontSize: "normal",
    animations: true,
};

class UserStore {
    currentUser = $state<User | null>(null);
    isAuthenticated = $derived(this.currentUser !== null);
    users = $state<User[]>([]);

    constructor() {
        if (browser) {
            this.loadUsers();
            this.loadSession();
        }
    }

    // Load all users from localStorage
    private loadUsers() {
        const stored = localStorage.getItem("selfos-users");
        if (stored) {
            try {
                this.users = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to load users:", e);
                this.users = [];
            }
        }
    }

    // Save users to localStorage
    private saveUsers() {
        localStorage.setItem("selfos-users", JSON.stringify(this.users));
    }

    // Load current session
    private loadSession() {
        const sessionUserId = sessionStorage.getItem("selfos-current-user");
        if (sessionUserId) {
            const user = this.users.find((u) => u.id === sessionUserId);
            if (user) {
                this.currentUser = user;
            }
        }
    }

    // Save current session
    private saveSession() {
        if (this.currentUser) {
            sessionStorage.setItem("selfos-current-user", this.currentUser.id);
        } else {
            sessionStorage.removeItem("selfos-current-user");
        }
    }

    // Hash password using Web Crypto API
    private async hashPassword(password: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    // Register new user
    async register(
        username: string,
        displayName: string,
        password: string,
    ): Promise<{ success: boolean; error?: string }> {
        // Validate inputs
        if (!username || !displayName || !password) {
            return { success: false, error: "All fields are required" };
        }

        if (username.length < 3) {
            return {
                success: false,
                error: "Username must be at least 3 characters",
            };
        }

        if (password.length < 6) {
            return {
                success: false,
                error: "Password must be at least 6 characters",
            };
        }

        // Check if username already exists
        if (this.users.some((u) => u.username === username)) {
            return { success: false, error: "Username already exists" };
        }

        // Create new user
        const passwordHash = await this.hashPassword(password);
        const newUser: User = {
            id: crypto.randomUUID(),
            username,
            displayName,
            passwordHash,
            createdAt: new Date().toISOString(),
            preferences: { ...DEFAULT_PREFERENCES },
        };

        this.users.push(newUser);
        this.saveUsers();

        // Auto-login after registration
        this.currentUser = newUser;
        this.saveSession();

        return { success: true };
    }

    // Login user
    async login(
        username: string,
        password: string,
    ): Promise<{ success: boolean; error?: string }> {
        const user = this.users.find((u) => u.username === username);
        if (!user) {
            return { success: false, error: "Invalid username or password" };
        }

        const passwordHash = await this.hashPassword(password);
        if (passwordHash !== user.passwordHash) {
            return { success: false, error: "Invalid username or password" };
        }

        this.currentUser = user;
        this.saveSession();

        return { success: true };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        sessionStorage.removeItem("selfos-current-user");
    }

    // Update user preferences
    updatePreferences(preferences: Partial<UserPreferences>) {
        if (!this.currentUser) return;

        this.currentUser.preferences = {
            ...this.currentUser.preferences,
            ...preferences,
        };

        // Update in users array
        const index = this.users.findIndex(
            (u) => u.id === this.currentUser!.id,
        );
        if (index !== -1) {
            this.users[index] = this.currentUser;
            this.saveUsers();
        }
    }

    // Update user profile
    updateProfile(updates: { displayName?: string; avatar?: string }) {
        if (!this.currentUser) return;

        if (updates.displayName) {
            this.currentUser.displayName = updates.displayName;
        }
        if (updates.avatar !== undefined) {
            this.currentUser.avatar = updates.avatar;
        }

        // Update in users array
        const index = this.users.findIndex(
            (u) => u.id === this.currentUser!.id,
        );
        if (index !== -1) {
            this.users[index] = this.currentUser;
            this.saveUsers();
        }
    }

    // Get storage key for user-specific data
    getUserStorageKey(key: string): string {
        if (!this.currentUser) return key;
        return `${this.currentUser.id}-${key}`;
    }

    // Delete user account
    deleteAccount(password: string): Promise<{ success: boolean; error?: string }> {
        return new Promise(async (resolve) => {
            if (!this.currentUser) {
                resolve({ success: false, error: "No user logged in" });
                return;
            }

            const passwordHash = await this.hashPassword(password);
            if (passwordHash !== this.currentUser.passwordHash) {
                resolve({ success: false, error: "Incorrect password" });
                return;
            }

            // Remove user from users array
            this.users = this.users.filter(
                (u) => u.id !== this.currentUser!.id,
            );
            this.saveUsers();

            // Clear all user data from localStorage
            const userId = this.currentUser.id;
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(userId)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach((key) => localStorage.removeItem(key));

            // Logout
            this.logout();

            resolve({ success: true });
        });
    }
}

export const userStore = new UserStore();
