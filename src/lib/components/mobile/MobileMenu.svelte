<script lang="ts">
    import {
        X,
        House,
        RotateCw,
        DollarSign,
        Heart,
        Salad,
        CheckSquare,
        Edit3,
        Library,
        Target,
        Layers,
        BookOpen,
        Zap,
        Settings, // Import Settings
        Calendar,
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { settings } from "$lib/stores/settings.svelte";

    let { isOpen = $bindable(false) } = $props();

    const links = [
        {
            name: "Hub",
            icon: House,
            href: `${base}/`,
            color: "text-white",
            bg: "bg-white/10",
            key: "dashboard",
        },
        {
            name: "Tasks",
            icon: CheckSquare,
            href: `${base}/tasks`,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            key: "tasks",
        },
        {
            name: "Habits",
            icon: RotateCw,
            href: `${base}/habits`,
            color: "text-orange-400",
            bg: "bg-orange-400/10",
            key: "habits",
        },
        {
            name: "Finance",
            icon: DollarSign,
            href: `${base}/finance`,
            color: "text-green-400",
            bg: "bg-green-400/10",
            key: "finance",
        },
        {
            name: "Fitness",
            icon: Heart,
            href: `${base}/fitness`,
            color: "text-red-400",
            bg: "bg-red-400/10",
            key: "fitness",
        },
        {
            name: "Nutrition",
            icon: Salad,
            href: `${base}/nutrition`,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            key: "nutrition",
        },
        {
            name: "Notes",
            icon: Edit3,
            href: `${base}/notes`,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            key: "notes",
        },
        {
            name: "Library",
            icon: Library,
            href: `${base}/library`,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            key: "library",
        },
        {
            name: "Goals",
            icon: Target,
            href: `${base}/goals`,
            color: "text-pink-400",
            bg: "bg-pink-400/10",
            key: "goals",
        },
        {
            name: "Projects",
            icon: Layers,
            href: `${base}/para`,
            color: "text-cyan-400",
            bg: "bg-cyan-400/10",
            key: "projects",
        },
        {
            name: "Journal",
            icon: BookOpen,
            href: `${base}/journal`,
            color: "text-indigo-400",
            bg: "bg-indigo-400/10",
            key: "journal",
        },
        {
            name: "Focus",
            icon: Zap,
            href: `${base}/focus`,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            key: "focus",
        },
        {
            name: "Calendar",
            icon: Calendar,
            href: `${base}/calendar`,
            color: "text-sky-400",
            bg: "bg-sky-400/10",
            key: "calendar",
        },
        {
            name: "Balance",
            icon: Heart,
            href: `${base}/life-balance`,
            color: "text-rose-400",
            bg: "bg-rose-400/10",
            key: "lifeBalance",
        },
        {
            name: "Settings",
            icon: Settings,
            href: `${base}/settings`,
            color: "text-gray-400",
            bg: "bg-gray-400/10",
            key: "settings",
        },
    ];

    let filteredLinks = $derived(
        links.filter(
            (link) =>
                settings.features[link.key as keyof typeof settings.features],
        ),
    );
    let isEditing = $state(false);

    function togglePin(key: string) {
        if (settings.mobileNavItems.includes(key)) {
            // Remove
            settings.mobileNavItems = settings.mobileNavItems.filter(
                (k) => k !== key,
            );
        } else {
            // Add if less than 4
            if (settings.mobileNavItems.length < 4) {
                settings.mobileNavItems = [...settings.mobileNavItems, key];
            }
        }
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[60] flex flex-col bg-[var(--color-background)]/95 backdrop-blur-xl transition-colors duration-300"
        transition:fade={{ duration: 200 }}
    >
        <!-- Header -->
        <div
            class="flex items-center justify-between px-6 py-4 border-b border-[var(--color-line)]"
        >
            <div class="flex items-center gap-3">
                <span class="text-lg font-medium text-[var(--color-text)]"
                    >Menu</span
                >
                <button
                    onclick={() => (isEditing = !isEditing)}
                    class="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-400 font-medium uppercase tracking-wider {isEditing
                        ? 'text-primary bg-primary/10'
                        : ''}"
                >
                    {isEditing ? "Done" : "Customize"}
                </button>
            </div>
            <button
                onclick={() => (isOpen = false)}
                class="p-2 rounded-full bg-[var(--color-text)]/10 text-[var(--color-text)]"
            >
                <X size={20} />
            </button>
        </div>

        {#if isEditing}
            <div class="px-6 py-2 bg-neutral-900 border-b border-neutral-800">
                <p class="text-xs text-neutral-400 text-center">
                    Select up to 4 items to pin to the bottom bar ({settings
                        .mobileNavItems.length}/4)
                </p>
            </div>
        {/if}

        <!-- Grid -->
        <div
            class="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-4 content-start"
        >
            {#each filteredLinks as link}
                {@const isActive =
                    link.href === `${base}/`
                        ? $page.url.pathname === link.href
                        : $page.url.pathname.startsWith(link.href)}
                {@const isPinned = settings.mobileNavItems.includes(link.key)}

                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    onclick={() => {
                        if (isEditing) {
                            togglePin(link.key);
                        } else {
                            isOpen = false;
                            window.location.href = link.href;
                        }
                    }}
                    class="relative flex flex-col items-center gap-3 p-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] active:scale-95 transition-all cursor-pointer
                    {isActive ? 'ring-1 ring-primary/50 bg-primary/5' : ''}
                    {isEditing && isPinned
                        ? 'ring-2 ring-primary border-primary'
                        : ''}
                    {isEditing && !isPinned ? 'opacity-50' : ''}
                    "
                >
                    {#if isEditing && isPinned}
                        <div
                            class="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
                        ></div>
                    {/if}

                    <div
                        class="w-12 h-12 rounded-full {link.bg} {link.color} flex items-center justify-center"
                    >
                        <link.icon size={24} />
                    </div>
                    <span class="text-xs font-medium text-muted text-center"
                        >{link.name}</span
                    >
                </div>
            {/each}
        </div>
    </div>
{/if}
