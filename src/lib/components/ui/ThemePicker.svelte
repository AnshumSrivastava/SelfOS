<script lang="ts">
    import { settings, type ThemeType } from "$lib/stores/settings.svelte";
    import { Check } from "lucide-svelte";

    const themes: { id: ThemeType; name: string; description: string }[] = [
        {
            id: "dark",
            name: "Dark",
            description: "Modern dark theme with subtle colors",
        },
        {
            id: "light",
            name: "Light",
            description: "Clean light theme for daytime use",
        },
        {
            id: "amoled",
            name: "AMOLED",
            description: "Pure black for OLED screens",
        },
        {
            id: "minimal",
            name: "Minimal",
            description: "Pure black & white, no colors",
        },
    ];

    function selectTheme(themeId: ThemeType) {
        settings.setTheme(themeId);
    }
</script>

<div class="space-y-4">
    <div>
        <h3 class="text-lg font-semibold text-white mb-1">Theme</h3>
        <p class="text-sm text-muted">Choose your preferred color scheme</p>
    </div>

    <div class="grid grid-cols-2 gap-3">
        {#each themes as theme}
            <button
                onclick={() => selectTheme(theme.id)}
                class="relative p-4 rounded-xl border transition-all text-left {settings.theme ===
                theme.id
                    ? 'border-primary bg-primary/5'
                    : 'border-line bg-surface hover:border-line/50'}"
            >
                {#if settings.theme === theme.id}
                    <div
                        class="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                    >
                        <Check size={14} class="text-black" />
                    </div>
                {/if}

                <div class="space-y-1">
                    <div class="font-semibold text-white">{theme.name}</div>
                    <div class="text-xs text-muted">{theme.description}</div>
                </div>

                <!-- Theme Preview -->
                <div class="mt-3 flex gap-2">
                    {#if theme.id === "dark"}
                        <div
                            class="w-6 h-6 rounded bg-[#0a0a0c] border border-line"
                        ></div>
                        <div
                            class="w-6 h-6 rounded bg-[#121214] border border-line"
                        ></div>
                        <div class="w-6 h-6 rounded bg-[#00ff9d]"></div>
                    {:else if theme.id === "light"}
                        <div
                            class="w-6 h-6 rounded bg-white border border-gray-300"
                        ></div>
                        <div
                            class="w-6 h-6 rounded bg-gray-100 border border-gray-300"
                        ></div>
                        <div class="w-6 h-6 rounded bg-[#00ff9d]"></div>
                    {:else if theme.id === "amoled"}
                        <div
                            class="w-6 h-6 rounded bg-black border border-line"
                        ></div>
                        <div
                            class="w-6 h-6 rounded bg-[#050505] border border-line"
                        ></div>
                        <div class="w-6 h-6 rounded bg-[#00ff9d]"></div>
                    {:else if theme.id === "minimal"}
                        <div
                            class="w-6 h-6 rounded bg-black border border-white/20"
                        ></div>
                        <div
                            class="w-6 h-6 rounded bg-[#1a1a1a] border border-white/20"
                        ></div>
                        <div class="w-6 h-6 rounded bg-white"></div>
                    {/if}
                </div>
            </button>
        {/each}
    </div>
</div>
