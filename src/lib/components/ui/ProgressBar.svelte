<script>
    import { settings } from "$lib/stores/settings.svelte";

    let {
        value = 0,
        max = 100,
        color = "primary",
        label,
        showValue = true,
    } = $props();

    let percentage = $derived((value / max) * 100);
    const isMinimal = $derived(settings.theme === "minimal");
</script>

<div class="w-full">
    {#if label || showValue}
        <div class="flex justify-between items-center mb-2 text-sm">
            {#if label}<span class="font-medium text-muted">{label}</span>{/if}
            {#if showValue}<span class="font-bold text-[var(--color-text)]"
                    >{value}/{max}</span
                >{/if}
        </div>
    {/if}

    <div
        class="h-2 w-full bg-surface border border-line rounded-full overflow-hidden"
    >
        <div
            class="{isMinimal
                ? 'h-full bg-white rounded-full'
                : `h-full bg-${color} rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]`} transition-all duration-1000 ease-out"
            style="width: {percentage}%"
        ></div>
    </div>
</div>
