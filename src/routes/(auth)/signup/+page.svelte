<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { userStore } from "$lib/stores/user.svelte";
    import {
        UserPlus,
        User,
        Lock,
        AlertCircle,
        CheckCircle,
    } from "lucide-svelte";

    let username = $state("");
    let displayName = $state("");
    let password = $state("");
    let confirmPassword = $state("");
    let error = $state("");
    let loading = $state(false);

    // Password strength indicator
    let passwordStrength = $derived.by(() => {
        if (password.length === 0) return { level: 0, text: "", color: "" };
        if (password.length < 6)
            return { level: 1, text: "Too short", color: "text-red-400" };
        if (password.length < 8)
            return { level: 2, text: "Weak", color: "text-orange-400" };
        if (password.length < 12)
            return { level: 3, text: "Good", color: "text-yellow-400" };
        return { level: 4, text: "Strong", color: "text-green-400" };
    });

    async function handleSignup(e: Event) {
        e.preventDefault();
        error = "";

        // Validation
        if (password !== confirmPassword) {
            error = "Passwords do not match";
            return;
        }

        loading = true;

        const result = await userStore.register(
            username,
            displayName,
            password,
        );

        if (result.success) {
            goto(`${base}/`);
        } else {
            error = result.error || "Signup failed";
        }

        loading = false;
    }
</script>

<div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
        <!-- Logo and Title -->
        <div class="text-center">
            <div
                class="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4"
            >
                <div
                    class="w-8 h-8 bg-primary rounded-full animate-pulse"
                ></div>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p class="text-muted">Set up your SelfOS workspace</p>
        </div>

        <!-- Signup Form -->
        <div class="bg-surface border border-line rounded-2xl p-8">
            <form onsubmit={handleSignup} class="space-y-5">
                <!-- Username Field -->
                <div>
                    <label
                        for="username"
                        class="block text-sm font-medium text-white mb-2"
                    >
                        Username
                    </label>
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <User size={18} class="text-muted" />
                        </div>
                        <input
                            id="username"
                            type="text"
                            bind:value={username}
                            placeholder="Choose a username"
                            class="w-full pl-10 pr-4 py-3 bg-background border border-line rounded-xl text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            required
                            minlength="3"
                        />
                    </div>
                    <p class="mt-1 text-xs text-muted">At least 3 characters</p>
                </div>

                <!-- Display Name Field -->
                <div>
                    <label
                        for="displayName"
                        class="block text-sm font-medium text-white mb-2"
                    >
                        Display Name
                    </label>
                    <input
                        id="displayName"
                        type="text"
                        bind:value={displayName}
                        placeholder="Your name"
                        class="w-full px-4 py-3 bg-background border border-line rounded-xl text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        required
                    />
                </div>

                <!-- Password Field -->
                <div>
                    <label
                        for="password"
                        class="block text-sm font-medium text-white mb-2"
                    >
                        Password
                    </label>
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <Lock size={18} class="text-muted" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            bind:value={password}
                            placeholder="Create a password"
                            class="w-full pl-10 pr-4 py-3 bg-background border border-line rounded-xl text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            required
                            minlength="6"
                        />
                    </div>
                    {#if password.length > 0}
                        <div class="mt-2 flex items-center gap-2">
                            <div
                                class="flex-1 h-1.5 bg-background rounded-full overflow-hidden"
                            >
                                <div
                                    class="h-full transition-all duration-300 {passwordStrength.level >=
                                    1
                                        ? 'bg-red-400'
                                        : ''}"
                                    style="width: {(passwordStrength.level /
                                        4) *
                                        100}%"
                                ></div>
                            </div>
                            <span class="text-xs {passwordStrength.color}">
                                {passwordStrength.text}
                            </span>
                        </div>
                    {/if}
                </div>

                <!-- Confirm Password Field -->
                <div>
                    <label
                        for="confirmPassword"
                        class="block text-sm font-medium text-white mb-2"
                    >
                        Confirm Password
                    </label>
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <Lock size={18} class="text-muted" />
                        </div>
                        <input
                            id="confirmPassword"
                            type="password"
                            bind:value={confirmPassword}
                            placeholder="Confirm your password"
                            class="w-full pl-10 pr-4 py-3 bg-background border border-line rounded-xl text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            required
                        />
                    </div>
                    {#if confirmPassword.length > 0 && password === confirmPassword}
                        <div
                            class="mt-1 flex items-center gap-1 text-xs text-green-400"
                        >
                            <CheckCircle size={14} />
                            <span>Passwords match</span>
                        </div>
                    {/if}
                </div>

                <!-- Error Message -->
                {#if error}
                    <div
                        class="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                    >
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                {/if}

                <!-- Submit Button -->
                <button
                    type="submit"
                    disabled={loading}
                    class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {#if loading}
                        <div
                            class="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"
                        ></div>
                        <span>Creating account...</span>
                    {:else}
                        <UserPlus size={18} />
                        <span>Create Account</span>
                    {/if}
                </button>
            </form>

            <!-- Login Link -->
            <div class="mt-6 text-center">
                <p class="text-sm text-muted">
                    Already have an account?
                    <a
                        href={`${base}/login`}
                        class="text-primary hover:underline font-medium"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>

        <!-- Info -->
        <div class="text-center text-xs text-muted">
            <p>Your data is stored locally on your device</p>
        </div>
    </div>
</div>
