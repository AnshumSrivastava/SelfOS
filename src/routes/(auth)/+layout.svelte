<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import { userStore } from "$lib/stores/user.svelte";

    let { children } = $props();

    // Redirect to dashboard if already authenticated
    onMount(() => {
        if (userStore.isAuthenticated) {
            goto(`${base}/`);
        }
    });
</script>

<!-- Auth Layout: No sidebar, no header, just centered content -->
<div class="min-h-screen bg-background">
    {@render children()}
</div>
