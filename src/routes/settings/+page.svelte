<script>
    import { settings } from "$lib/stores/settings.svelte";
    import { Palette, LayoutGrid, Moon, Sun, Monitor } from "lucide-svelte";
    import { fade } from "svelte/transition";

    const themes = [
        { id: "dark", label: "Dark", icon: Moon, bg: "bg-[#121214]" },
        { id: "light", label: "Light", icon: Sun, bg: "bg-[#ffffff]" },
        { id: "amoled", label: "Amoled", icon: Monitor, bg: "bg-[#000000]" },
    ];

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
        {
            id: "finance",
            label: "Finance & Budgeting",
            description: "Track expenses, income, and financial goals",
        },
        {
            id: "habits",
            label: "Habit Tracker",
            description: "Build and maintain daily habits",
        },
        {
            id: "fitness",
            label: "Fitness & Workouts",
            description: "Log workouts and track physical progress",
        },
        {
            id: "nutrition",
            label: "Nutrition Planner",
            description: "Meal planning and macro tracking",
        },
        {
            id: "tasks",
            label: "Task Management",
            description: "To-do lists and project tasks",
        },
        {
            id: "notes",
            label: "Notes & Ideas",
            description: "Capture thoughts and quick notes",
        },
        {
            id: "library",
            label: "Library & Reading",
            description: "Track books and reading progress",
        },
        {
            id: "goals",
            label: "Goals & OKRs",
            description: "Long-term goal setting and tracking",
        },
        {
            id: "projects",
            label: "Projects (PARA)",
            description: "Project organization using PARA method",
        },
        {
            id: "journal",
            label: "Journaling",
            description: "Daily reflections and diary",
        },
        {
            id: "focus",
            label: "Focus Mode",
            description: "Pomodoro timer and focus sessions",
        },
    ];
</script>

<div class="space-y-8 pb-24 md:pb-0" in:fade>
    <!-- Header -->
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
        <p class="text-muted">Customize your experience and manage features.</p>
    </div>

    <!-- Theme Section -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold flex items-center gap-2">
            <Palette size={20} class="text-primary" />
            Appearance
        </h2>

        <div class="card space-y-6">
            <!-- Theme Mode -->
            <div class="space-y-3">
                <label class="text-sm font-medium text-muted">Theme Mode</label>
                <div class="grid grid-cols-3 gap-4">
                    {#each themes as theme}
                        <button
                            class="flex flex-col items-center gap-3 p-4 rounded-xl border transition-all {settings.theme ===
                            theme.id
                                ? 'border-primary bg-primary/10'
                                : 'border-line hover:border-white/20 hover:bg-white/5'}"
                            onclick={() => settings.setTheme(theme.id)}
                        >
                            <div
                                class="w-full aspect-video rounded-lg {theme.bg} border border-line/50 flex items-center justify-center mb-2"
                            >
                                <theme.icon
                                    size={24}
                                    class={settings.theme === theme.id
                                        ? "text-primary"
                                        : "text-muted"}
                                />
                            </div>
                            <span
                                class="font-medium {settings.theme === theme.id
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
            <div class="space-y-3">
                <label class="text-sm font-medium text-muted"
                    >Accent Color</label
                >
                <div class="flex flex-wrap gap-3">
                    {#each accentColors as color}
                        <button
                            class="w-10 h-10 rounded-full border-2 transition-all hover:scale-110 active:scale-95 {settings.accentColor ===
                            color.value
                                ? 'border-white ring-2 ring-primary ring-offset-2 ring-offset-background'
                                : 'border-transparent'}"
                            style="background-color: {color.value}"
                            onclick={() => settings.setAccentColor(color.value)}
                            title={color.label}
                            aria-label="Select {color.label} accent"
                        ></button>
                    {/each}
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="space-y-4">
        <h2 class="text-xl font-semibold flex items-center gap-2">
            <LayoutGrid size={20} class="text-primary" />
            Features
        </h2>

        <div class="card divide-y divide-line">
            {#each featuresList as feature}
                <div
                    class="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                    <div class="space-y-0.5">
                        <div class="font-medium text-white">
                            {feature.label}
                        </div>
                        <div class="text-sm text-muted">
                            {feature.description}
                        </div>
                    </div>
                    <button
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background {settings
                            .features[feature.id]
                            ? 'bg-primary'
                            : 'bg-white/10'}"
                        onclick={() => settings.toggleFeature(feature.id)}
                        role="switch"
                        aria-checked={settings.features[feature.id]}
                    >
                        <span
                            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform {settings
                                .features[feature.id]
                                ? 'translate-x-6'
                                : 'translate-x-1'}"
                        />
                    </button>
                </div>
            {/each}
        </div>
    </section>
</div>
