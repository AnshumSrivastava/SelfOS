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
        HelpCircle,
    } from "lucide-svelte";
    import { fade, fly, slide } from "svelte/transition";
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
                    color: "text-primary",
                    bg: "bg-primary/10",
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
            name: "PARA / Knowledge",
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
                    color: "text-muted",
                    bg: "bg-line/50",
                    key: "settings",
                },
            ],
        },
    ];

    let isEditing = $state(false);

    const pinnedLinks = $derived.by(() => {
        const pinned: any[] = [];
        categories.forEach((cat) => {
            cat.links.forEach((link) => {
                if (settings.mobileNavItems.includes(link.key)) {
                    pinned.push(link);
                }
            });
        });
        return pinned;
    });

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
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        transition:fade={{ duration: 200 }}
        onclick={() => (isOpen = false)}
    >
        <div
            class="absolute bottom-0 left-0 right-0 bg-background border-t border-line rounded-t-[2.5rem] flex flex-col max-h-[90dvh] shadow-2xl overflow-hidden"
            transition:fly={{ y: "100%", duration: 400, opacity: 1 }}
            onclick={(e) => e.stopPropagation()}
        >
            <!-- Drag Handle / Header -->
            <div class="pt-3 pb-6 flex flex-col items-center gap-3">
                <div class="w-12 h-1.5 bg-line/50 rounded-full"></div>
                <div class="w-full px-8 flex items-center justify-between">
                    <span class="text-xl font-bold tracking-tight text-white"
                        >System Menu</span
                    >
                    <button
                        onclick={() => (isEditing = !isEditing)}
                        class="text-[10px] px-4 py-2 rounded-full font-bold uppercase tracking-widest transition-all {isEditing
                            ? 'bg-primary text-black'
                            : 'bg-surface text-muted'}"
                    >
                        {isEditing ? "Done" : "Customize"}
                    </button>
                </div>
            </div>

            <div
                class="flex-1 overflow-y-auto px-8 pb-12 space-y-10 scrollbar-hide"
            >
                {#if pinnedLinks.length > 0 && !isEditing}
                    <div in:slide class="space-y-4">
                        <h3
                            class="text-[10px] font-bold uppercase tracking-[0.2em] text-muted"
                        >
                            Pinned Rituals
                        </h3>
                        <div class="grid grid-cols-4 gap-4">
                            {#each pinnedLinks as link}
                                <button
                                    onclick={() => {
                                        isOpen = false;
                                        goto(link.href);
                                    }}
                                    class="flex flex-col items-center gap-2 group"
                                >
                                    <div
                                        class="w-14 h-14 rounded-2xl {link.bg} {link.color} flex items-center justify-center group-active:scale-90 transition-all shadow-lg active:shadow-none"
                                    >
                                        <link.icon size={24} />
                                    </div>
                                    <span
                                        class="text-[9px] font-bold text-muted truncate w-full text-center uppercase tracking-wide"
                                        >{link.name}</span
                                    >
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}

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
                                        : $page.url.pathname.startsWith(
                                              link.href,
                                          )}
                                {@const isPinned =
                                    settings.mobileNavItems.includes(link.key)}

                                <button
                                    onclick={() => {
                                        if (isEditing) {
                                            togglePin(link.key);
                                        } else {
                                            isOpen = false;
                                            goto(link.href);
                                        }
                                    }}
                                    class="relative flex items-center gap-4 p-4 rounded-2xl border border-line bg-surface/30 active:scale-[0.96] transition-all group overflow-hidden
                                    {isActive
                                        ? 'ring-1 ring-primary/50 bg-primary/5'
                                        : ''}
                                    {isEditing && isPinned
                                        ? 'ring-2 ring-primary bg-primary/10'
                                        : ''}"
                                >
                                    <div
                                        class="w-10 h-10 rounded-xl {link.bg} {link.color} flex items-center justify-center transition-all group-active:scale-90"
                                    >
                                        <link.icon size={20} />
                                    </div>
                                    <span
                                        class="text-xs font-bold text-white line-clamp-1"
                                        >{link.name}</span
                                    >

                                    {#if isEditing}
                                        <div class="ml-auto">
                                            <div
                                                class="w-5 h-5 rounded-full border-2 {isPinned
                                                    ? 'bg-primary border-primary'
                                                    : 'border-line'} flex items-center justify-center transition-all"
                                            >
                                                {#if isPinned}
                                                    <div
                                                        class="w-2 h-2 bg-black rounded-full"
                                                    ></div>
                                                {/if}
                                            </div>
                                        </div>
                                    {/if}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}

<style>
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
