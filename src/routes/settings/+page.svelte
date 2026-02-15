<script lang="ts">
    import type { ThemeType } from "$lib/stores/settings.svelte";
    import { settings } from "$lib/stores/settings.svelte";
    import {
        Palette,
        LayoutGrid,
        Moon,
        Sun,
        Monitor,
        Plus,
        Minus,
        User,
        Save,
        Shield,
        Sparkles,
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { userStore } from "$lib/stores/user.svelte";
    import { tutorialEngine } from "$lib/tutorial/engine";
    import { HelpCircle, Info } from "lucide-svelte";

    const themes: { id: ThemeType; label: string; icon: any; bg: string }[] = [
        { id: "dark", label: "Dark", icon: Moon, bg: "bg-[#121214]" },
        { id: "light", label: "Light", icon: Sun, bg: "bg-[#ffffff]" },
        { id: "amoled", label: "Amoled", icon: Monitor, bg: "bg-[#000000]" },
        { id: "minimal", label: "Minimal", icon: Minus, bg: "bg-[#1a1a1a]" },
    ];

    let activeTab = $state("account"); // 'account' | 'appearance' | 'features'

    let editDisplayName = $state(userStore.currentUser?.displayName || "");
    let editUsername = $state(userStore.currentUser?.username || "");
    let isSavingProfile = $state(false);
    let profileMessage = $state({ text: "", type: "success" });

    async function handleSaveProfile() {
        isSavingProfile = true;
        profileMessage = { text: "", type: "success" };

        const result = await userStore.updateProfile({
            displayName: editDisplayName,
            username: editUsername,
        });

        if (result.success) {
            profileMessage = {
                text: "Profile updated successfully!",
                type: "success",
            };
        } else {
            profileMessage = {
                text: result.error || "Failed to update profile",
                type: "error",
            };
        }

        isSavingProfile = false;
        setTimeout(() => {
            profileMessage = { text: "", type: "success" };
        }, 3000);
    }

    const accentColors = [
        { id: "green", value: "#00ff9d", label: "Neon Green" },
        { id: "blue", value: "#3b82f6", label: "Blue" },
        { id: "purple", value: "#a855f7", label: "Purple" },
        { id: "orange", value: "#f97316", label: "Orange" },
        { id: "red", value: "#ef4444", label: "Red" },
        { id: "pink", value: "#ec4899", label: "Pink" },
        { id: "cyan", value: "#06b6d4", label: "Cyan" },
        { id: "yellow", value: "#eab308", label: "Yellow" },
    ];

    const featuresList = [
        { id: "finance", label: "Finance", description: "Expense tracking" },
        { id: "habits", label: "Habits", description: "Daily tracker" },
        { id: "fitness", label: "Fitness", description: "Workout logs" },
        { id: "nutrition", label: "Nutrition", description: "Meal planner" },
        { id: "tasks", label: "Tasks", description: "To-do lists" },
        { id: "notes", label: "Notes", description: "Quick capture" },
        { id: "library", label: "Library", description: "Book tracking" },
        { id: "goals", label: "Goals", description: "Goal management" },
        { id: "projects", label: "Projects", description: "PARA method" },
        { id: "journal", label: "Journal", description: "Reflections" },
        { id: "focus", label: "Focus", description: "Timer & flow" },
        { id: "calendar", label: "Calendar", description: "Scheduling" },
    ];

    const tabs = [
        { id: "account", label: "Account", icon: User },
        { id: "appearance", label: "Appearance", icon: Palette },
        { id: "features", label: "Features", icon: LayoutGrid },
        { id: "onboarding", label: "Help", icon: HelpCircle },
    ];
</script>

<div class="page-container relative pb-32" in:fade>
    <!-- Header -->
    <div class="module-header mb-8">
        <div>
            <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
            <p class="text-muted text-sm mt-1">
                Configure your SelfOS interface.
            </p>
        </div>
    </div>

    <!-- Mobile Tab Navigation -->
    <div
        class="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-line -mx-4 px-4 mb-8"
    >
        <div class="flex justify-around items-center h-14">
            {#each tabs as tab}
                <button
                    onclick={() => (activeTab = tab.id)}
                    class="relative flex flex-col items-center justify-center p-2 transition-all {activeTab ===
                    tab.id
                        ? 'text-primary'
                        : 'text-muted hover:text-white'}"
                    aria-label="{tab.label} settings tab"
                >
                    <tab.icon
                        size={18}
                        strokeWidth={activeTab === tab.id ? 2.5 : 2}
                    />
                    <span
                        class="text-[9px] font-bold uppercase tracking-wider mt-1"
                        >{tab.label}</span
                    >
                    {#if activeTab === tab.id}
                        <div
                            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all"
                        ></div>
                    {/if}
                </button>
            {/each}
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-10">
        <!-- Desktop Sidebar Navigation -->
        <aside class="hidden md:block md:col-span-3 space-y-2">
            {#each tabs as tab}
                <button
                    onclick={() => (activeTab = tab.id)}
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all {activeTab ===
                    tab.id
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted hover:bg-surface border border-transparent'}"
                >
                    <tab.icon size={18} />
                    <span class="font-medium text-sm">{tab.label}</span>
                </button>
            {/each}
        </aside>

        <!-- Main Content Area -->
        <div class="md:col-span-9 space-y-12">
            {#if activeTab === "account"}
                <div in:fly={{ y: 20, duration: 400 }}>
                    <section class="space-y-6">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
                            >
                                <User size={20} />
                            </div>
                            <h2 class="text-xl font-bold text-white">
                                Account Profile
                            </h2>
                        </div>

                        <div
                            class="card-subtle p-6 space-y-8 bg-surface/30 backdrop-blur-sm"
                        >
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label
                                        for="displayName"
                                        class="text-xs font-bold uppercase tracking-widest text-muted"
                                        >Display Name</label
                                    >
                                    <input
                                        id="displayName"
                                        type="text"
                                        bind:value={editDisplayName}
                                        class="input w-full bg-background/50"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label
                                        for="username"
                                        class="text-xs font-bold uppercase tracking-widest text-muted"
                                        >Username</label
                                    >
                                    <input
                                        id="username"
                                        type="text"
                                        bind:value={editUsername}
                                        class="input w-full bg-background/50"
                                        placeholder="@handle"
                                    />
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-between pt-4 border-t border-line/30"
                            >
                                <div class="flex items-center gap-2">
                                    {#if profileMessage.text}
                                        <p
                                            class="text-sm font-medium {profileMessage.type ===
                                            'success'
                                                ? 'text-primary'
                                                : 'text-red-400'}"
                                            transition:fade
                                        >
                                            {profileMessage.text}
                                        </p>
                                    {/if}
                                </div>

                                <button
                                    onclick={handleSaveProfile}
                                    disabled={isSavingProfile}
                                    class="btn btn-primary flex items-center gap-2 px-8 min-w-[140px] justify-center"
                                >
                                    {#if isSavingProfile}
                                        <div
                                            class="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"
                                        ></div>
                                        <span>Saving</span>
                                    {:else}
                                        <Save size={16} />
                                        <span>Save</span>
                                    {/if}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            {/if}

            {#if activeTab === "appearance"}
                <div in:fly={{ y: 20, duration: 400 }}>
                    <section class="space-y-12">
                        <!-- Theme Selection -->
                        <div class="space-y-6">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 rounded-xl bg-orange-400/10 flex items-center justify-center text-orange-400"
                                >
                                    <Palette size={20} />
                                </div>
                                <h2 class="text-xl font-bold text-white">
                                    Visual Theme
                                </h2>
                            </div>

                            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {#each themes as theme}
                                    <button
                                        class="flex flex-col p-4 rounded-2xl border transition-all active:scale-95 {settings.theme ===
                                        theme.id
                                            ? 'border-primary bg-primary/10 ring-1 ring-primary/20'
                                            : 'border-line bg-surface/50'}"
                                        onclick={() =>
                                            settings.setTheme(theme.id)}
                                    >
                                        <div
                                            class="w-full aspect-video rounded-xl {theme.bg} border border-line/30 flex items-center justify-center mb-4 overflow-hidden relative group"
                                        >
                                            <theme.icon
                                                size={28}
                                                class={settings.theme ===
                                                theme.id
                                                    ? "text-primary scale-110"
                                                    : "text-muted group-hover:scale-110"}
                                            />
                                            {#if settings.theme === theme.id}
                                                <div
                                                    class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-tl-xl flex items-center justify-center"
                                                >
                                                    <Sparkles
                                                        size={12}
                                                        class="text-black"
                                                    />
                                                </div>
                                            {/if}
                                        </div>
                                        <span
                                            class="font-bold text-xs uppercase tracking-widest {settings.theme ===
                                            theme.id
                                                ? 'text-primary'
                                                : 'text-muted'}"
                                        >
                                            {theme.label}
                                        </span>
                                    </button>
                                {/each}
                            </div>
                        </div>

                        <!-- Accent Color -->
                        <div
                            class="space-y-6 {settings.theme === 'minimal'
                                ? 'opacity-30 pointer-events-none'
                                : ''}"
                        >
                            <div class="flex items-center justify-between">
                                <h3
                                    class="text-sm font-bold uppercase tracking-widest text-muted"
                                >
                                    Accent Color
                                </h3>
                                {#if settings.theme === "minimal"}
                                    <span
                                        class="text-[10px] text-orange-400 font-bold px-2 py-0.5 rounded bg-orange-400/10 border border-orange-400/20"
                                        >DISABLED IN MINIMAL</span
                                    >
                                {/if}
                            </div>

                            <div
                                class="flex flex-wrap gap-4 p-6 card-subtle bg-surface/30"
                            >
                                {#each accentColors as color}
                                    <button
                                        class="w-12 h-12 rounded-2xl border-4 transition-all hover:scale-110 active:scale-90 {settings.accentColor ===
                                        color.value
                                            ? 'border-white shadow-[0_0_20px_var(--color-primary)]/50 scale-110'
                                            : 'border-transparent'}"
                                        style="background-color: {color.value}"
                                        onclick={() =>
                                            settings.setAccentColor(
                                                color.value,
                                            )}
                                        aria-label="Select {color.label} accent color"
                                    ></button>
                                {/each}

                                <div class="relative group">
                                    <input
                                        type="color"
                                        value={settings.accentColor}
                                        oninput={(e) =>
                                            settings.setAccentColor(
                                                e.currentTarget.value,
                                            )}
                                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        aria-label="Custom accent color picker"
                                    />
                                    <div
                                        class="w-12 h-12 rounded-2xl border-4 transition-all group-hover:scale-110 flex items-center justify-center {accentColors.every(
                                            (c) =>
                                                c.value !==
                                                settings.accentColor,
                                        )
                                            ? 'border-white scale-110'
                                            : 'border-transparent'}"
                                        style="background: conic-gradient(from 180deg, #ec4899, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7, #ec4899)"
                                    >
                                        <Plus
                                            size={20}
                                            class="text-white drop-shadow-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Spacing Controls -->
                        <div class="space-y-6">
                            <h3
                                class="text-sm font-bold uppercase tracking-widest text-muted"
                            >
                                Layout Precision
                            </h3>
                            <div
                                class="card-subtle p-8 space-y-10 bg-surface/30"
                            >
                                <div class="space-y-5">
                                    <div class="flex justify-between items-end">
                                        <span
                                            class="text-sm font-bold text-white"
                                            >Corner Radius</span
                                        >
                                        <span
                                            class="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-md"
                                            >{settings.borderRadius}px</span
                                        >
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="32"
                                        step="1"
                                        value={settings.borderRadius}
                                        oninput={(e) =>
                                            settings.setDesignVariable(
                                                "borderRadius",
                                                parseInt(e.currentTarget.value),
                                            )}
                                        class="w-full accent-primary h-1.5 bg-background rounded-full appearance-none cursor-pointer"
                                        aria-label="Adjust Corner Radius"
                                    />
                                </div>

                                <div class="space-y-5">
                                    <div class="flex justify-between items-end">
                                        <span
                                            class="text-sm font-bold text-white"
                                            >Interface Spacing</span
                                        >
                                        <span
                                            class="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-md"
                                            >{settings.modulePadding}px</span
                                        >
                                    </div>
                                    <input
                                        type="range"
                                        min="12"
                                        max="48"
                                        step="4"
                                        value={settings.modulePadding}
                                        oninput={(e) =>
                                            settings.setDesignVariable(
                                                "modulePadding",
                                                parseInt(e.currentTarget.value),
                                            )}
                                        class="w-full accent-primary h-1.5 bg-background rounded-full appearance-none cursor-pointer"
                                        aria-label="Adjust Interface Spacing"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            {/if}

            {#if activeTab === "features"}
                <div in:fly={{ y: 20, duration: 400 }}>
                    <section class="space-y-8">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
                            >
                                <LayoutGrid size={20} />
                            </div>
                            <h2 class="text-xl font-bold text-white">
                                Module Control
                            </h2>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {#each featuresList as feature}
                                <div
                                    class="flex items-center justify-between p-5 rounded-2xl bg-surface/30 border border-line/50 transition-all hover:bg-surface/50 group"
                                >
                                    <div class="space-y-1">
                                        <div
                                            class="font-bold text-sm text-white"
                                        >
                                            {feature.label}
                                        </div>
                                        <div
                                            class="text-[10px] uppercase tracking-widest text-muted group-hover:text-muted/80"
                                        >
                                            {feature.description}
                                        </div>
                                    </div>
                                    <button
                                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none {settings
                                            .features[feature.id]
                                            ? 'bg-primary'
                                            : 'bg-surface border border-line'}"
                                        onclick={() =>
                                            settings.toggleFeature(feature.id)}
                                        role="switch"
                                        aria-checked={settings.features[
                                            feature.id
                                        ]}
                                        aria-label="Toggle {feature.label}"
                                    >
                                        <span
                                            class="inline-block h-4 w-4 transform rounded-full transition-transform transition-all {settings
                                                .features[feature.id]
                                                ? 'translate-x-[1.4rem] bg-black shadow-lg'
                                                : 'translate-x-1 bg-muted'}"
                                        ></span>
                                    </button>
                                </div>
                            {/each}
                        </div>
                    </section>
                </div>
            {/if}

            {#if activeTab === "onboarding"}
                <div in:fly={{ y: 20, duration: 400 }}>
                    <section class="space-y-8">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
                            >
                                <HelpCircle size={20} />
                            </div>
                            <h2 class="text-xl font-bold text-white">
                                Help & Onboarding
                            </h2>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                                class="card-subtle p-6 space-y-4 bg-surface/30"
                            >
                                <div class="flex items-center gap-3">
                                    <Sparkles size={18} class="text-primary" />
                                    <h3 class="font-bold text-white">
                                        Guided Tutorial
                                    </h3>
                                </div>
                                <p class="text-sm text-muted leading-relaxed">
                                    New to SelfOS? Take a quick guided tour of
                                    all the major features and modules.
                                </p>
                                <button
                                    onclick={() =>
                                        tutorialEngine.startFlow("setup")}
                                    class="btn btn-primary w-full py-3"
                                >
                                    Start Full Tutorial
                                </button>
                            </div>

                            <div
                                class="card-subtle p-6 space-y-4 bg-surface/30"
                            >
                                <div class="flex items-center gap-3">
                                    <Info size={18} class="text-primary" />
                                    <h3 class="font-bold text-white">
                                        Advanced Shortcuts
                                    </h3>
                                </div>
                                <div class="space-y-2 text-sm">
                                    <div
                                        class="flex justify-between text-muted"
                                    >
                                        <span>Command Palette</span>
                                        <span
                                            class="font-mono bg-white/5 px-1.5 py-0.5 rounded text-[10px] text-white"
                                            >Space</span
                                        >
                                    </div>
                                    <div
                                        class="flex justify-between text-muted"
                                    >
                                        <span>Tutorial Hub</span>
                                        <span
                                            class="font-mono bg-white/5 px-1.5 py-0.5 rounded text-[10px] text-white"
                                            >Ctrl+Shift+/</span
                                        >
                                    </div>
                                    <div
                                        class="flex justify-between text-muted"
                                    >
                                        <span>Next Step</span>
                                        <span
                                            class="font-mono bg-white/5 px-1.5 py-0.5 rounded text-[10px] text-white"
                                            >Ctrl+Shift+.</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 18px;
        height: 18px;
        background: var(--color-primary);
        border: 3px solid var(--color-background);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
</style>
