<script>
    let {
        title,
        value,
        subtext = "",
        icon: Icon,
        trend,
        color = "primary",
    } = $props();
</script>

<div class="card relative overflow-hidden group">
    <div class="flex justify-between items-start mb-4">
        <div class="p-3 rounded-lg bg-{color}/10 text-{color}">
            <Icon size={24} />
        </div>
        {#if trend}
            <div
                class="flex items-center gap-1 text-xs font-medium {trend > 0
                    ? 'text-primary'
                    : 'text-red-500'}"
            >
                <span>{trend > 0 ? "+" : ""}{trend}%</span>
            </div>
        {/if}
    </div>

    <div>
        <h3
            class="text-3xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform"
        >
            {value}
        </h3>
        <p class="text-sm text-muted font-medium">{title}</p>
        {#if subtext}
            <p class="text-xs text-muted/60 mt-1">{subtext}</p>
        {/if}
    </div>

    <div
        class="absolute -right-4 -bottom-4 w-24 h-24 bg-{color}/5 rounded-full blur-2xl group-hover:bg-{color}/10 transition-colors"
    ></div>
</div>
