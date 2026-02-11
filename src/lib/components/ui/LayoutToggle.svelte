<script lang="ts">
    import { settings, type LayoutStyle } from "$lib/stores/settings.svelte";
    import { LayoutGrid, List, Rows } from "lucide-svelte";

    const layouts: {
        id: LayoutStyle;
        name: string;
        icon: any;
        description: string;
    }[] = [
        {
            id: "card",
            name: "Card",
            icon: LayoutGrid,
            description: "Spacious cards with full details",
        },
        {
            id: "list",
            name: "List",
            icon: List,
            description: "Compact list view",
        },
        {
            id: "compact",
            name: "Compact",
            icon: Rows,
            description: "Dense layout for more items",
        },
    ];

    function selectLayout(layoutId: LayoutStyle) {
        settings.setLayoutStyle(layoutId);
    }
</script>

<div class="inline-flex gap-1 p-1 rounded-lg bg-surface border border-line">
    {#each layouts as layout}
        <button
            onclick={() => selectLayout(layout.id)}
            class="flex items-center gap-2 px-3 py-2 rounded-md transition-all {settings.layoutStyle ===
            layout.id
                ? 'bg-primary text-black'
                : 'text-muted hover:text-white hover:bg-white/5'}"
            title={layout.description}
        >
            <svelte:component this={layout.icon} size={18} />
            <span class="text-sm font-medium">{layout.name}</span>
        </button>
    {/each}
</div>
