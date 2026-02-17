<script lang="ts">
    import { Search } from "lucide-svelte";

    let {
        title,
        subtitle = "",
        children,
    } = $props<{
        title: string;
        subtitle?: string;
        children?: import("svelte").Snippet;
    }>();
</script>

<header
    class="h-20 shrink-0 border-b border-theme-line flex items-center justify-between px-6 md:px-8 bg-theme-background/50 backdrop-blur-xl z-20"
>
    <!-- Left: Title -->
    <div class="flex items-center gap-4">
        <div>
            <h1
                class="text-xl font-medium tracking-tight text-theme-text-strong"
            >
                {title}
            </h1>
            {#if subtitle}
                <p class="text-xs text-theme-text-muted mt-0.5">{subtitle}</p>
            {/if}
        </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-4">
        {@render children?.()}
    </div>
</header>
