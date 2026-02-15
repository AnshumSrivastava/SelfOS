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
        Settings,
        Calendar,
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import { page } from "$app/stores";
    import { base } from "$app/paths";
    import { settings } from "$lib/stores/settings.svelte";
    import { goto } from "$app/navigation";

    let { isOpen = $bindable(false) } = $props();

    const categories = [
        {
            name: "Core Hub",
            links: [
                {
                    name: "Dashboard",
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
                    color: "text-[var(--color-primary)]",
                    bg: "bg-[var(--color-primary)]/10",
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
            ],
        },
        {
            name: "Growth & Knowledge",
            links: [
                {
                    name: "Projects",
                    icon: Layers,
                    href: `${base}/para`,
                    color: "text-cyan-400",
                    bg: "bg-cyan-400/10",
                    key: "projects",
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
                    name: "Journal",
                    icon: BookOpen,
                    href: `${base}/journal`,
                    color: "text-indigo-400",
                    bg: "bg-indigo-400/10",
                    key: "journal",
                },
            ],
        },
        {
            name: "Vitals & Config",
            links: [
                {
                    name: "Finance",
                    icon: DollarSign,
                    href: `${base}/finance`,
                    color: "text-emerald-400",
                    bg: "bg-emerald-400/10",
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
                    name: "Settings",
                    icon: Settings,
                    href: `${base}/settings`,
                    color: "text-[var(--color-muted)]",
                    bg: "bg-[var(--color-line)]/50",
                    key: "settings",
                },
            ],
        },
    ];

    let isEditing = $state(false);

    function togglePin(key: string) {
        if (settings.mobileNavItems.includes(key)) {
            settings.setMobileNavItems(
                settings.mobileNavItems.filter((k) => k !== key),
            );
        } else {
            if (settings.mobileNavItems.length < 4) {
                settings.setMobileNavItems([...settings.mobileNavItems, key]);
            }
        }
    }

    function isFeatureEnabled(key: string) {
        return settings.features[key as keyof typeof settings.features] ?? true;
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[60] flex flex-col bg-[var(--color-background)]"
        transition:fade={{ duration: 200 }}
    >
        <!-- Header -->
        <div
            class="flex items-center justify-between px-6 py-6 border-b border-[var(--color-line)]/50"
        >
            <div class="flex items-center gap-4">
                <span
                    class="text-xl font-bold tracking-tight text-[var(--color-text)]"
                    >Menu</span
                >
                <button
                    onclick={() => (isEditing = !isEditing)}
                    class="text-[10px] px-3 py-1 rounded-full bg-[var(--color-line)] text-[var(--color-muted)] font-bold uppercase tracking-widest transition-all {isEditing
                        ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 ring-1 ring-[var(--color-primary)]/20 shadow-[0_0_12px_var(--color-primary)]/10'
                        : ''}"
                >
                    {isEditing ? "Done" : "Customize Nav"}
                </button>
            </div>
            <button
                onclick={() => (isOpen = false)}
                class="w-10 h-10 rounded-full bg-[var(--color-line)]/30 text-[var(--color-text)] flex items-center justify-center hover:bg-[var(--color-line)]/50 active:scale-90 transition-all font-bold"
            >
                <X size={20} />
            </button>
        </div>

        {#if isEditing}
            <div
                class="px-6 py-3 bg-[var(--color-primary)]/5 border-b border-[var(--color-primary)]/10"
            >
                <p
                    class="text-[10px] text-[var(--color-primary)]/70 text-center font-bold uppercase tracking-widest"
                >
                    Select up to 4 items to pin to the bottom bar ({settings
                        .mobileNavItems.length}/4)
                </p>
            </div>
        {/if}

        <!-- Menu Container -->
        <div class="flex-1 overflow-y-auto px-6 py-8 pb-32 space-y-10">
            {#each categories as category}
                <div class="space-y-4">
                    <h3
                        class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted flex items-center gap-3"
                    >
                        {category.name}
                        <div class="flex-1 h-px bg-line/30"></div>
                    </h3>

                    <div class="grid grid-cols-2 gap-3">
                        {#each category.links.filter( (l) => isFeatureEnabled(l.key), ) as link}
                            {@const isActive =
                                link.href === `${base}/`
                                    ? $page.url.pathname === link.href
                                    : $page.url.pathname.startsWith(link.href)}
                            {@const isPinned = settings.mobileNavItems.includes(
                                link.key,
                            )}

                            <button
                                onclick={() => {
                                    if (isEditing) {
                                        togglePin(link.key);
                                    } else {
                                        isOpen = false;
                                        goto(link.href);
                                    }
                                }}
                                class="relative flex items-center gap-4 p-4 rounded-2xl border border-[var(--color-line)]/50 bg-[var(--theme-surface)]/50 active:scale-[0.96] transition-all cursor-pointer backdrop-blur-sm group
                                {isActive
                                    ? 'ring-1 ring-[var(--color-primary)]/50 bg-[var(--color-primary)]/5 border-transparent'
                                    : ''}
                                {isEditing && isPinned
                                    ? 'ring-2 ring-[var(--color-primary)] bg-[var(--color-primary)]/5 border-transparent'
                                    : ''}
                                {isEditing && !isPinned
                                    ? 'opacity-40 grayscale-[0.5]'
                                    : ''}"
                            >
                                {#if isEditing && isPinned}
                                    <div
                                        class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--color-primary)] border-2 border-[var(--color-background)] shadow-[0_0_8px_var(--color-primary)]"
                                    ></div>
                                {/if}

                                <div
                                    class="w-10 h-10 rounded-xl {link.bg} {link.color} flex items-center justify-center transition-all group-active:scale-90"
                                >
                                    <link.icon
                                        size={20}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                </div>
                                <span
                                    class="text-xs font-bold tracking-tight text-[var(--color-text)]"
                                >
                                    {link.name}
                                </span>
                            </button>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}
