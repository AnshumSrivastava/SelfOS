<script lang="ts">
    import { settings, type FontSize } from "$lib/stores/settings.svelte";
    import ThemePicker from "$lib/components/ui/ThemePicker.svelte";
    import ColorPicker from "$lib/components/ui/ColorPicker.svelte";
    import LayoutToggle from "$lib/components/ui/LayoutToggle.svelte";
    import { Palette, Type, Layout, Zap, Sparkles } from "lucide-svelte";

    const fontSizes: { id: FontSize; name: string; description: string }[] = [
        {
            id: "compact",
            name: "Compact",
            description: "Smaller text, more content",
        },
        {
            id: "normal",
            name: "Normal",
            description: "Balanced and comfortable",
        },
        {
            id: "large",
            name: "Large",
            description: "Larger text, easier reading",
        },
    ];

    function selectFontSize(size: FontSize) {
        settings.setFontSize(size);
    }
</script>

<svelte:head>
    <title>Personalization - SelfOS</title>
</svelte:head>

<div class="min-h-screen bg-background text-white p-4 lg:p-6">
    <div class="max-w-6xl mx-auto space-y-6">
        <!-- Header -->
        <div class="space-y-1">
            <div class="flex items-center gap-2">
                <div class="p-1.5 rounded-lg bg-primary/10">
                    <Palette size={20} class="text-primary" />
                </div>
                <h1 class="text-2xl font-bold">Personalization</h1>
            </div>
            <p class="text-sm text-muted">Customize your SelfOS experience</p>
        </div>

        <!-- Two Column Layout for Desktop -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Left Column -->
            <div class="space-y-4">
                <!-- Theme Section -->
                <section class="p-5 rounded-xl bg-surface border border-line">
                    <ThemePicker />
                </section>

                <!-- Layout Style Section -->
                <section class="p-5 rounded-xl bg-surface border border-line">
                    <div class="space-y-4">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <Layout size={18} class="text-primary" />
                                <h3 class="text-base font-semibold text-white">
                                    Layout Style
                                </h3>
                            </div>
                            <p class="text-xs text-muted">
                                Choose how content is displayed
                            </p>
                        </div>

                        <LayoutToggle />

                        <!-- Layout Preview -->
                        <div
                            class="mt-3 p-3 rounded-lg bg-background border border-line"
                        >
                            <p class="text-xs text-muted mb-2">Preview</p>
                            <div
                                class="layout-{settings.layoutStyle} space-y-2"
                            >
                                <div class="item">
                                    <div
                                        class="w-6 h-6 rounded bg-primary/20"
                                    ></div>
                                    <div class="flex-1">
                                        <div
                                            class="h-2 w-24 bg-white/10 rounded mb-1"
                                        ></div>
                                        <div
                                            class="h-1.5 w-32 bg-white/5 rounded"
                                        ></div>
                                    </div>
                                </div>
                                <div class="item">
                                    <div
                                        class="w-6 h-6 rounded bg-primary/20"
                                    ></div>
                                    <div class="flex-1">
                                        <div
                                            class="h-2 w-24 bg-white/10 rounded mb-1"
                                        ></div>
                                        <div
                                            class="h-1.5 w-32 bg-white/5 rounded"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Font Size Section -->
                <section class="p-5 rounded-xl bg-surface border border-line">
                    <div class="space-y-4">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <Type size={18} class="text-primary" />
                                <h3 class="text-base font-semibold text-white">
                                    Font Size
                                </h3>
                            </div>
                            <p class="text-xs text-muted">
                                Adjust text size for readability
                            </p>
                        </div>

                        <div class="grid grid-cols-3 gap-2">
                            {#each fontSizes as fontSize}
                                <button
                                    onclick={() => selectFontSize(fontSize.id)}
                                    class="p-3 rounded-lg border transition-all text-left {settings.fontSize ===
                                    fontSize.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-line bg-background hover:border-line/50'}"
                                >
                                    <div
                                        class="font-semibold text-white text-sm mb-0.5"
                                    >
                                        {fontSize.name}
                                    </div>
                                    <div class="text-xs text-muted">
                                        {fontSize.description}
                                    </div>
                                </button>
                            {/each}
                        </div>
                    </div>
                </section>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
                <!-- Accent Color Section -->
                <section class="p-5 rounded-xl bg-surface border border-line">
                    <ColorPicker />
                </section>

                <!-- Animations Section -->
                <section class="p-5 rounded-xl bg-surface border border-line">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <Zap size={18} class="text-primary" />
                                <h3 class="text-base font-semibold text-white">
                                    Animations
                                </h3>
                            </div>
                            <p class="text-xs text-muted">
                                Enable or disable UI animations
                            </p>
                        </div>

                        <button
                            onclick={() => settings.toggleAnimations()}
                            aria-label="Toggle animations {settings.animations
                                ? 'off'
                                : 'on'}"
                            class="relative w-12 h-7 rounded-full transition-colors {settings.animations
                                ? 'bg-primary'
                                : 'bg-line'}"
                        >
                            <div
                                class="absolute top-0.5 w-6 h-6 rounded-full bg-white transition-transform {settings.animations
                                    ? 'translate-x-5'
                                    : 'translate-x-0.5'}"
                            ></div>
                        </button>
                    </div>
                </section>

                <!-- Dashboard Widgets Section -->
                <section class="p-5 rounded-xl bg-surface border border-line">
                    <div class="space-y-4">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <Sparkles size={18} class="text-primary" />
                                <h3 class="text-base font-semibold text-white">
                                    Dashboard Widgets
                                </h3>
                            </div>
                            <p class="text-xs text-muted">
                                Customize dashboard widgets
                            </p>
                        </div>

                        <div class="space-y-1.5">
                            {#each settings.dashboardWidgets as widget}
                                <div
                                    class="flex items-center justify-between p-2.5 rounded-lg bg-background border border-line hover:border-line/50 transition-colors"
                                >
                                    <span
                                        class="text-sm font-medium text-white capitalize"
                                        >{widget.type}</span
                                    >
                                    <button
                                        onclick={() =>
                                            settings.updateDashboardWidget(
                                                widget.id,
                                                {
                                                    enabled: !widget.enabled,
                                                },
                                            )}
                                        aria-label="Toggle {widget.type} widget {widget.enabled
                                            ? 'off'
                                            : 'on'}"
                                        class="relative w-10 h-5 rounded-full transition-colors {widget.enabled
                                            ? 'bg-primary'
                                            : 'bg-line'}"
                                    >
                                        <div
                                            class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform {widget.enabled
                                                ? 'translate-x-5'
                                                : 'translate-x-0.5'}"
                                        ></div>
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <!-- Info -->
        <div class="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p class="text-xs text-primary">
                💡 Your preferences are automatically saved and persist across
                sessions
            </p>
        </div>
    </div>
</div>
