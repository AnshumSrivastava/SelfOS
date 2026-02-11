<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { Search, Bell, Settings, User, LogOut } from "lucide-svelte";
    import { userStore } from "$lib/stores/user.svelte";

    let showUserMenu = $state(false);

    function handleLogout() {
        userStore.logout();
        goto(`${base}/login`);
    }

    // Get user initials for avatar
    let userInitials = $derived.by(() => {
        if (!userStore.currentUser) return "ME";
        const names = userStore.currentUser.displayName.split(" ");
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return userStore.currentUser.displayName.substring(0, 2).toUpperCase();
    });

    // Get greeting based on time of day
    let greeting = $derived.by(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    });
</script>

<header
    class="h-16 border-b border-line bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-4 md:px-8"
>
    <div class="flex items-center gap-4 text-muted">
        <!-- Greeting with user name -->
        {#if userStore.currentUser}
            <span class="text-sm hidden md:inline"
                >{greeting}, {userStore.currentUser.displayName}.</span
            >
        {:else}
            <span class="text-sm hidden md:inline">Welcome back.</span>
        {/if}
        <span class="text-sm md:hidden">SelfOS</span>
    </div>

    <div class="flex items-center gap-4">
        <button
            class="p-2 hover:bg-surface rounded-full transition-colors text-muted hover:text-white"
        >
            <Search size={20} />
        </button>
        <button
            class="p-2 hover:bg-surface rounded-full transition-colors text-muted hover:text-white relative"
        >
            <Bell size={20} />
            <span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"
            ></span>
        </button>
        <div class="h-6 w-px bg-line"></div>

        <!-- User Menu -->
        <div class="relative">
            <button
                onclick={() => (showUserMenu = !showUserMenu)}
                class="flex items-center gap-3 pl-2 hover:bg-surface py-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-line"
            >
                <div
                    class="w-8 h-8 rounded-full bg-surface border border-line flex items-center justify-center text-white font-bold text-xs"
                >
                    {userInitials}
                </div>
            </button>

            <!-- Dropdown Menu -->
            {#if showUserMenu}
                <div
                    class="absolute right-0 mt-2 w-56 bg-surface border border-line rounded-xl shadow-xl overflow-hidden"
                >
                    <!-- User Info -->
                    {#if userStore.currentUser}
                        <div class="px-4 py-3 border-b border-line">
                            <p class="text-sm font-medium text-white">
                                {userStore.currentUser.displayName}
                            </p>
                            <p class="text-xs text-muted">
                                @{userStore.currentUser.username}
                            </p>
                        </div>
                    {/if}

                    <!-- Menu Items -->
                    <div class="py-1">
                        <a
                            href={`${base}/settings`}
                            class="flex items-center gap-3 px-4 py-2 text-sm text-muted hover:text-white hover:bg-background transition-colors"
                        >
                            <Settings size={16} />
                            <span>Settings</span>
                        </a>
                        <button
                            onclick={handleLogout}
                            class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-background transition-colors"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</header>

<!-- Click outside to close menu -->
{#if showUserMenu}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-30"
        onclick={() => (showUserMenu = false)}
    ></div>
{/if}
