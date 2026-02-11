<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import { userStore } from "$lib/stores/user.svelte";

    // Redirect to login if not authenticated
    onMount(() => {
        if (!userStore.isAuthenticated) {
            goto(`${base}/login`);
        }
    });
</script>

{#if userStore.isAuthenticated}
    <slot />
{:else}
    <div class="min-h-screen bg-background flex items-center justify-center">
        <div class="text-center">
            <div
                class="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4"
            >
                <div
                    class="w-8 h-8 bg-primary rounded-full animate-pulse"
                ></div>
            </div>
            <p class="text-muted">Redirecting to login...</p>
        </div>
    </div>
{/if}
