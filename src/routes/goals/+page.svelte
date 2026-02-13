<script lang="ts">
    import DesktopGoals from "$lib/components/goals/DesktopGoals.svelte";
    import MobileGoals from "$lib/components/goals/MobileGoals.svelte";
    import { onMount } from "svelte";

    let isMobile = $state(false);

    onMount(() => {
        const checkMobile = () => {
            isMobile = window.innerWidth < 768;
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    });
</script>

<svelte:head>
    <title>Goals & Balance | SelfOS</title>
</svelte:head>

<div class="h-full">
    <div class="md:hidden">
        <MobileGoals />
    </div>
    <div class="hidden md:block">
        <DesktopGoals />
    </div>
</div>
