<script lang="ts">
    import MobileNav from "$lib/components/mobile/MobileNav.svelte";
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import MobileGamificationHUD from "$lib/components/gamification/MobileGamificationHUD.svelte";
    import MobileLevelUpSheet from "$lib/components/gamification/MobileLevelUpSheet.svelte";
    import MobileAchievementBanner from "$lib/components/gamification/MobileAchievementBanner.svelte";
    import { uiState } from "$lib/stores/ui.svelte";
    import { gamificationStore } from "$lib/stores/gamification.svelte";

    let { children } = $props();

    // Modal state (will be controlled by gamification store in future)
    let showLevelUp = $state(false);
    let levelUpData = $state({ level: 1, rewards: { gold: 0, gems: 0 } });
    let showAchievement = $state(false);
    let achievementData = $state(null);
</script>

<div
    class="flex flex-col h-[100dvh] bg-black text-white font-sans overflow-hidden"
>
    {#if uiState.showChrome}
        <!-- Mobile Gamification HUD -->
        <MobileGamificationHUD />

        <!-- Original Header (if needed) -->
        <!-- <div class="flex-none z-40 relative">
			<MobileHeader />
		</div> -->
    {/if}

    <main
        class="flex-1 px-4 overflow-y-auto scrollbar-hide relative z-0 {uiState.showChrome
            ? 'pt-16 pb-24'
            : 'py-2'}"
        style="padding-top: calc({uiState.showChrome
            ? '4rem'
            : '0.5rem'} + env(safe-area-inset-top)); padding-bottom: calc({uiState.showChrome
            ? '6rem'
            : '0.5rem'} + env(safe-area-inset-bottom));"
    >
        {@render children()}
    </main>

    {#if uiState.showChrome}
        <MobileNav />
    {/if}

    <!-- Gamification Modals -->
    <MobileLevelUpSheet bind:show={showLevelUp} {...levelUpData} />
    <MobileAchievementBanner
        bind:show={showAchievement}
        achievement={achievementData}
    />
</div>
