<script lang="ts">
    import { syncStore } from "$lib/stores/sync.svelte";
    import { fade, scale } from "svelte/transition";
    import { Loader2, Check, AlertCircle, RefreshCw } from "lucide-svelte";

    let status = $derived(syncStore.globalStatus);
</script>

<div
    class="sync-indicator flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all duration-500 overflow-hidden
    {status === 'stable'
        ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500/70'
        : ''}
    {status === 'syncing' ? 'bg-primary/5 border-primary/20 text-primary' : ''}
    {status === 'warning'
        ? 'bg-amber-500/5 border-amber-500/20 text-amber-500'
        : ''}
    {status === 'error' ? 'bg-red-500/5 border-red-500/20 text-red-500' : ''}
"
>
    <div class="relative w-2 h-2">
        {#if status === "syncing"}
            <div
                in:scale={{ duration: 300 }}
                class="absolute inset-0 rounded-full bg-primary animate-ping"
            ></div>
            <div class="absolute inset-0 rounded-full bg-primary"></div>
        {:else if status === "stable"}
            <div
                in:scale={{ duration: 300 }}
                class="absolute inset-0 rounded-full bg-emerald-500"
            ></div>
        {:else if status === "warning"}
            <div
                in:scale={{ duration: 300 }}
                class="absolute inset-0 rounded-full bg-amber-500"
            ></div>
        {:else}
            <div
                in:scale={{ duration: 300 }}
                class="absolute inset-0 rounded-full bg-red-500"
            ></div>
        {/if}
    </div>

    <span
        class="text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap"
    >
        {#if status === "syncing"}
            Synchronizing
        {:else if status === "stable"}
            Stable
        {:else if status === "warning"}
            Check Required
        {:else}
            System Fault
        {/if}
    </span>
</div>

<style>
    .sync-indicator {
        min-width: 100px;
        justify-content: center;
    }
</style>
