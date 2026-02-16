<script lang="ts">
    import { Search } from "lucide-svelte";

    let {
        title,
        subtitle = "",
        icon: Icon = null,
        iconColor = "text-primary",
        children,
    } = $props<{
        title: string;
        subtitle?: string;
        icon?: any;
        iconColor?: string;
        children?: import("svelte").Snippet;
    }>();
</script>

<header
    class="h-20 flex-shrink-0 border-b border-line flex items-center justify-between px-6 md:px-8 bg-background/50 backdrop-blur-xl z-20"
>
    <!-- Left: Title & Icon -->
    <div class="flex items-center gap-4">
        {#if Icon}
            <div
                class="p-2 rounded-xl bg-white/5 border border-white/5 {iconColor}"
            >
                <Icon size={20} />
            </div>
        {/if}
        <div>
            <h1 class="text-xl font-medium tracking-tight text-white">
                {title}
            </h1>
            {#if subtitle}
                <p class="text-xs text-muted mt-0.5">{subtitle}</p>
            {/if}
        </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-4">
        {@render children?.()}
    </div>
</header>
