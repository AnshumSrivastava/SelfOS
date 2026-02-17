<script>
    import NumberTicker from "$lib/components/ui/NumberTicker.svelte";
    import { settings } from "$lib/stores/settings.svelte";

    let {
        title,
        value = undefined,
        animatedValue = undefined,
        prefix = "",
        suffix = "",
        subtext = "",
        icon: Icon,
        trend,
        color = "primary",
    } = $props();

    // Use grey in minimal mode
    const isMinimal = $derived(settings.theme === "minimal");
    const displayColor = $derived(isMinimal ? "muted" : color);
</script>

<div class="card-subtle relative overflow-hidden group">
    <div class="flex justify-between items-start mb-4">
        <div
            class="p-3 rounded-lg bg-theme-surface-subtle border border-theme-line {isMinimal
                ? 'text-theme-text-strong'
                : `text-theme-${color}`}"
        >
            <Icon size={24} />
        </div>
        {#if trend}
            <div
                class="flex items-center gap-1 text-xs font-medium {isMinimal
                    ? 'text-theme-text-muted'
                    : trend > 0
                      ? 'text-theme-success'
                      : 'text-theme-danger'}"
            >
                <span>{trend > 0 ? "+" : ""}{trend}%</span>
            </div>
        {/if}
    </div>

    <div>
        <h3
            class="text-3xl font-bold text-theme-text-strong mb-1 group-hover:translate-x-1 transition-transform"
        >
            {#if animatedValue !== undefined}
                {prefix}<NumberTicker value={animatedValue} />{suffix}
            {:else}
                {value}
            {/if}
        </h3>
        <p class="text-sm text-theme-text-secondary font-medium">{title}</p>
        {#if subtext}
            <p class="text-xs text-theme-text-muted mt-1">{subtext}</p>
        {/if}
    </div>

    {#if !isMinimal}
        <div
            class="absolute -right-4 -bottom-4 w-24 h-24 bg-theme-{color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"
        ></div>
    {/if}
</div>
