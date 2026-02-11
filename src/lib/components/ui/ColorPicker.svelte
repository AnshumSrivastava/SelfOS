<script lang="ts">
    import { settings } from "$lib/stores/settings.svelte";

    const presetColors = [
        { name: "Green", value: "#00ff9d" },
        { name: "Blue", value: "#3b82f6" },
        { name: "Purple", value: "#a855f7" },
        { name: "Pink", value: "#ec4899" },
        { name: "Orange", value: "#f97316" },
        { name: "Yellow", value: "#eab308" },
        { name: "Red", value: "#ef4444" },
        { name: "Cyan", value: "#06b6d4" },
        { name: "Teal", value: "#14b8a6" },
        { name: "Indigo", value: "#6366f1" },
    ];

    let customColor = $state(settings.accentColor);

    function selectPreset(color: string) {
        customColor = color;
        settings.setAccentColor(color);
    }

    function updateCustomColor() {
        settings.setAccentColor(customColor);
    }
</script>

<div>
    <h3 class="text-base font-semibold text-white mb-1">Accent Color</h3>
    <p class="text-xs text-muted mb-4">Customize your interface color</p>

    <!-- Preset Colors -->
    <p class="text-xs font-medium text-white/80 mb-2">Presets</p>
    <div class="flex flex-wrap gap-2 mb-4">
        {#each presetColors as preset}
            <button
                onclick={() => selectPreset(preset.value)}
                class="w-8 h-8 rounded-full transition-all hover:scale-110 {settings.accentColor ===
                preset.value
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-background'
                    : ''}"
                style="background-color: {preset.value}"
                title={preset.name}
                aria-label="Select {preset.name} color"
            >
            </button>
        {/each}
    </div>

    <!-- Custom Color Picker -->
    <p class="text-xs font-medium text-white/80 mb-2">Custom</p>
    <div class="flex gap-2 items-center mb-4">
        <input
            type="color"
            bind:value={customColor}
            onchange={updateCustomColor}
            class="w-12 h-12 rounded-lg cursor-pointer border-2 border-line"
        />
        <input
            type="text"
            bind:value={customColor}
            onchange={updateCustomColor}
            placeholder="#00ff9d"
            class="flex-1 px-3 py-2 rounded-lg bg-background border border-line text-white font-mono text-sm focus:outline-none focus:border-primary transition-colors"
        />
    </div>

    <!-- Preview -->
    <p class="text-xs text-muted mb-2">Preview</p>
    <div class="p-3 rounded-lg bg-background border border-line">
        <div class="flex gap-2">
            <button
                class="px-3 py-1.5 rounded-lg font-medium text-sm transition-all"
                style="background-color: {settings.accentColor}; color: #000"
            >
                Primary Button
            </button>
            <div
                class="px-3 py-1.5 rounded-lg border-2 font-medium text-sm"
                style="border-color: {settings.accentColor}; color: {settings.accentColor}"
            >
                Outlined
            </div>
        </div>
    </div>
</div>
