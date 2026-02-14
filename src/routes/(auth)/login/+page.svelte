<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { userStore } from "$lib/stores/user.svelte";
    import { LogIn, User, Lock, AlertCircle } from "lucide-svelte";
    import Logo from "$lib/components/ui/Logo.svelte";
    import GoogleLoginButton from "$lib/components/auth/GoogleLoginButton.svelte";

    let username = $state("");
    let password = $state("");
    let error = $state("");
    let loading = $state(false);

    async function handleLogin(e: Event) {
        e.preventDefault();
        error = "";
        loading = true;

        const result = await userStore.login(username, password);

        if (result.success) {
            goto(`${base}/`);
        } else {
            error = result.error || "Login failed";
        }

        loading = false;
    }
</script>

<div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
        <!-- Logo and Title -->
        <div class="text-center">
            <div class="flex justify-center mb-6">
                <Logo size={64} className="text-primary" />
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">
                Welcome to SelfOS
            </h1>
            <p class="text-muted">Sign in to continue to your workspace</p>
        </div>

        <!-- Login Form -->
        <div class="bg-surface border border-line rounded-2xl p-8">
            <div class="space-y-6">
                <!-- Google Login Button -->
                <GoogleLoginButton />

                <div class="relative py-2">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-line"></div>
                    </div>
                    <div class="relative flex justify-center text-xs uppercase">
                        <span class="bg-surface px-2 text-muted"
                            >Or continue with</span
                        >
                    </div>
                </div>

                <form onsubmit={handleLogin} class="space-y-6">
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
                                placeholder="Enter your username"
                                class="w-full pl-10 pr-4 py-3 bg-background border border-line rounded-xl text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                required
                            />
                        </div>
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
                                placeholder="Enter your password"
                                class="w-full pl-10 pr-4 py-3 bg-background border border-line rounded-xl text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                required
                            />
                        </div>
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
                            <span>Signing in...</span>
                        {:else}
                            <LogIn size={18} />
                            <span>Sign In</span>
                        {/if}
                    </button>
                </form>
            </div>

            <!-- Signup Link -->
            <div class="mt-6 text-center">
                <p class="text-sm text-muted">
                    Don't have an account?
                    <a
                        href={`${base}/signup`}
                        class="text-primary hover:underline font-medium"
                    >
                        Sign up
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
