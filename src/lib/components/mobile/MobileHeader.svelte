<script lang="ts">
    import { Search, Bell, HelpCircle, X } from "lucide-svelte";
    import { searchStore } from "$lib/stores/search.svelte";
    import { tutorialStore } from "$lib/stores/tutorial.svelte";
    import { fade, slide, scale } from "svelte/transition";

    import { base } from "$app/paths";
    let { title = "SelfOS", action = null, showMenu = true } = $props();

    let showNotifications = $state(false);

    function triggerTutorial() {
        showNotifications = false;
        tutorialStore.showHub = true;
    }
</script>

<header
    class="h-14 flex items-center justify-between px-6 sticky top-0 z-40 bg-background/40 backdrop-blur-3xl"
>
    <div class="flex flex-col">
        {#if title === "SelfOS"}
            <a
                href={`${base}/`}
                class="flex items-center gap-2.5 active:opacity-70 transition-opacity"
                in:fade
            >
                <div
                    class="w-1 h-4 bg-primary rounded-full shadow-[0_0_12px_var(--color-primary)]"
                ></div>
                <span class="text-base font-bold tracking-tight text-white/90"
                    >SelfOS</span
                >
            </a>
        {:else}
            <h1
                class="text-base font-bold text-white/90 tracking-tight"
                in:fade
            >
                {title}
            </h1>
        {/if}
    </div>

    <div class="flex items-center gap-1">
        {#if action}
            {@render action()}
        {/if}

        <button
            onclick={() => searchStore.open()}
            class="p-2 rounded-full text-white/40 hover:text-white active:scale-95 transition-all"
            aria-label="Open Search"
        >
            <Search size={18} />
        </button>

        <button
            onclick={() => (showNotifications = !showNotifications)}
            class="p-2 rounded-full text-white/40 hover:text-white active:scale-95 transition-all relative"
            aria-label="Notifications"
        >
            <Bell size={18} />
            {#if !tutorialStore.state.hasEverOpenedHub}
                <span
                    class="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--color-primary)]"
                ></span>
            {/if}
        </button>
    </div>
</header>

{#if showNotifications}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        onclick={() => (showNotifications = false)}
        role="button"
        tabindex="-1"
    >
        <div
            class="w-full max-w-sm bg-surface border border-line rounded-[32px] overflow-hidden shadow-2xl"
            transition:slide={{ axis: "y" }}
            onclick={(e) => e.stopPropagation()}
        >
            <div
                class="px-6 py-4 border-b border-line flex items-center justify-between bg-white/[0.02]"
            >
                <h3 class="font-bold text-white">Notifications</h3>
                <button
                    onclick={() => (showNotifications = false)}
                    class="p-2 text-muted hover:text-white"
                >
                    <X size={20} />
                </button>
            </div>

            <div class="p-6">
                {#if !tutorialStore.state.hasEverOpenedHub}
                    <div class="flex flex-col gap-4 text-center">
                        <div
                            class="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto"
                        >
                            <HelpCircle size={32} />
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-white mb-2">
                                Welcome Guide
                            </h4>
                            <p class="text-sm text-muted leading-relaxed">
                                Let's get you up to speed. Start the interactive
                                tour to master SelfOS.
                            </p>
                        </div>
                        <button
                            onclick={triggerTutorial}
                            class="w-full py-4 bg-primary text-black rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                            Start the Tour
                        </button>
                    </div>
                {:else}
                    <div
                        class="py-12 flex flex-col items-center justify-center text-center opacity-50"
                    >
                        <Bell size={48} class="mb-4 text-muted" />
                        <p class="font-bold text-white">All caught up</p>
                        <p class="text-xs mt-1 text-muted">
                            No new notifications
                        </p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
