<script>
    import {
        Search,
        X,
        Command,
        ArrowRight,
        Wallet,
        CheckSquare,
        Activity,
        Book,
        Layers,
        Calendar,
        Apple,
        Dumbbell,
        FileText,
        Target,
        BookOpen,
        Heart,
    } from "lucide-svelte";
    import { searchStore } from "$lib/stores/search.svelte";
    import { fade, fly } from "svelte/transition";
    import { page } from "$app/stores";
    import { base } from "$app/paths";

    function getIcon(type) {
        switch (type) {
            case "Task":
                return CheckSquare;
            case "Habit":
                return Activity;
            case "Finance":
                return Wallet;
            case "Book":
                return Book;
            case "Project":
                return Layers;
            case "Calendar":
                return Calendar;
            case "Navigation":
                return ArrowRight;
            case "Nutrition":
                return Apple;
            case "Fitness":
                return Dumbbell;
            case "Note":
                return FileText;
            case "Goal":
                return Target;
            case "Journal":
                return BookOpen;
            case "Balance":
                return Heart;
            default:
                return Command;
        }
    }

    function getColor(type) {
        switch (type) {
            case "Task":
                return "text-blue-400 bg-blue-400/10";
            case "Habit":
                return "text-orange-400 bg-orange-400/10";
            case "Finance":
                return "text-green-400 bg-green-400/10";
            case "Book":
                return "text-purple-400 bg-purple-400/10";
            case "Project":
                return "text-emerald-400 bg-emerald-400/10";
            case "Calendar":
                return "text-sky-400 bg-sky-400/10";
            case "Navigation":
                return "text-white bg-neutral-800";
            case "Nutrition":
                return "text-red-400 bg-red-400/10";
            case "Fitness":
                return "text-emerald-500 bg-emerald-500/10";
            case "Note":
                return "text-yellow-400 bg-yellow-400/10";
            case "Goal":
                return "text-pink-400 bg-pink-400/10";
            case "Journal":
                return "text-indigo-400 bg-indigo-400/10";
            case "Balance":
                return "text-rose-400 bg-rose-400/10";
            default:
                return "text-gray-400 bg-gray-400/10";
        }
    }
    let selectedIndex = $state(0);

    // Reset selection when query changes
    $effect(() => {
        if (searchStore.query) selectedIndex = 0;
    });

    function handleKeydown(e) {
        if (!searchStore.results.length) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % searchStore.results.length;
            scrollToSelected();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedIndex =
                (selectedIndex - 1 + searchStore.results.length) %
                searchStore.results.length;
            scrollToSelected();
        } else if (e.key === "Enter") {
            e.preventDefault();
            const result = searchStore.results[selectedIndex];
            if (result) {
                searchStore.close();
                window.location.href = result.href;
            }
        }
    }

    function scrollToSelected() {
        // Simple scroll logic, can be enhanced
        const selectedEl = document.getElementById(`result-${selectedIndex}`);
        selectedEl?.scrollIntoView({ block: "nearest" });
    }

    function focus(node) {
        node.focus();
    }
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key === "Escape" && searchStore.isOpen) {
            searchStore.close();
        }
    }}
/>

{#if searchStore.isOpen}
    <!-- Backdrop -->
    <div
        class="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
        transition:fade={{ duration: 150 }}
        onclick={() => searchStore.close()}
        role="button"
        tabindex="0"
        aria-label="Close search"
    ></div>

    <!-- Search Box -->
    <div
        class="fixed inset-x-0 top-0 md:top-24 md:max-w-2xl md:mx-auto bg-[#111] md:rounded-2xl border-b md:border border-neutral-800 z-[101] overflow-hidden flex flex-col max-h-[100vh] md:max-h-[60vh]"
        transition:fly={{ y: -20, duration: 200 }}
    >
        <!-- Input -->
        <div
            class="flex items-center gap-3 px-4 py-4 border-b border-neutral-800"
        >
            <Search class="text-neutral-500" size={20} />
            <input
                type="text"
                bind:value={searchStore.query}
                placeholder="Search everything..."
                class="flex-1 bg-transparent text-lg text-white placeholder:text-neutral-600 focus:outline-none"
                use:focus
                onkeydown={handleKeydown}
            />
            <button
                onclick={() => searchStore.close()}
                class="px-2 py-1 text-xs font-medium text-neutral-500 bg-neutral-900 rounded border border-neutral-800"
            >
                ESC
            </button>
        </div>

        <!-- Results -->
        <div class="flex-1 overflow-y-auto p-2 scrollbar-hide">
            {#if searchStore.query.trim() === ""}
                <div class="p-8 text-center text-neutral-500">
                    <Command class="mx-auto mb-3 opacity-20" size={48} />
                    <p class="text-sm">
                        Type to search tasks, projects, transactions, and
                        more...
                    </p>
                </div>
            {:else if searchStore.results.length === 0}
                <div class="p-8 text-center text-neutral-500">
                    <p class="text-sm">
                        No results found for "{searchStore.query}"
                    </p>
                </div>
            {:else}
                <div class="space-y-1">
                    {#each searchStore.results as result, i}
                        <a
                            id="result-{i}"
                            href={result.href}
                            onclick={() => searchStore.close()}
                            class="flex items-center gap-4 p-3 rounded-xl transition-colors group {i ===
                            selectedIndex
                                ? 'bg-neutral-800'
                                : 'hover:bg-neutral-900'}"
                        >
                            <div
                                class="w-10 h-10 rounded-lg {getColor(
                                    result.type,
                                )} flex items-center justify-center shrink-0"
                            >
                                <svelte:component
                                    this={getIcon(result.type)}
                                    size={18}
                                />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center justify-between">
                                    <h4 class="text-white font-medium truncate">
                                        {result.title}
                                    </h4>
                                    {#if result.date}
                                        <span
                                            class="text-[10px] text-neutral-600 shrink-0"
                                        >
                                            {new Date(
                                                result.date,
                                            ).toLocaleDateString()}
                                        </span>
                                    {/if}
                                </div>
                                <p class="text-xs text-neutral-500 truncate">
                                    {result.type} • {result.subtitle}
                                </p>
                            </div>
                            <ArrowRight
                                size={16}
                                class="text-neutral-700 transition-opacity {i ===
                                selectedIndex
                                    ? 'opacity-100'
                                    : 'opacity-0 group-hover:opacity-100'}"
                            />
                        </a>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Footer -->
        <div
            class="px-4 py-2 bg-neutral-900/50 border-t border-neutral-800 text-[10px] text-neutral-500 flex justify-between"
        >
            <span>{searchStore.results.length} results</span>
            <span>SelfOS Search</span>
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
