<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    onMount(() => {
        goto("/goals", { replaceState: true });
    });
</script>

<div class="flex items-center justify-center h-full">
    <p class="text-muted">Redirecting to Goals & Balance...</p>
</div>
