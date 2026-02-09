<script>
    import {
        Layers,
        Folder,
        BookOpen,
        Archive,
        ChevronRight,
    } from "lucide-svelte";

    const sections = [
        {
            id: "projects",
            name: "Projects",
            icon: Layers,
            count: 3,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            id: "areas",
            name: "Areas",
            icon: Folder,
            count: 4,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            id: "resources",
            name: "Resources",
            icon: BookOpen,
            count: 4,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
        },
        {
            id: "archives",
            name: "Archives",
            icon: Archive,
            count: 2,
            color: "text-gray-400",
            bg: "bg-gray-800",
        },
    ];
</script>

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">PARA</h1>
        <div
            class="text-xs font-bold px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-gray-500"
        >
            SYSTEM
        </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
        {#each sections as section}
            <div
                class="p-5 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex items-center justify-between group active:scale-[0.98] transition-all"
            >
                <div class="flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-xl {section.bg} {section.color} flex items-center justify-center"
                    >
                        <svelte:component this={section.icon} size={24} />
                    </div>
                    <div>
                        <h3 class="font-bold text-white text-lg">
                            {section.name}
                        </h3>
                        <p class="text-xs text-gray-500">
                            {section.count} Items
                        </p>
                    </div>
                </div>
                <ChevronRight size={20} class="text-neutral-800" />
            </div>
        {/each}
    </div>

    <!-- Active Projects Preview -->
    <div>
        <h3 class="text-sm text-gray-500 uppercase tracking-widest mb-3">
            Active Projects
        </h3>
        <div class="space-y-3">
            <div
                class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-900"
            >
                <div class="flex justify-between text-sm text-white mb-2">
                    <span>SelfOS Remake</span>
                    <span>75%</span>
                </div>
                <div
                    class="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden"
                >
                    <div class="h-full bg-emerald-500 w-[75%]"></div>
                </div>
            </div>
            <div
                class="p-4 rounded-xl bg-neutral-900/50 border border-neutral-900"
            >
                <div class="flex justify-between text-sm text-white mb-2">
                    <span>Q4 Fitness</span>
                    <span>30%</span>
                </div>
                <div
                    class="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden"
                >
                    <div class="h-full bg-emerald-500 w-[30%]"></div>
                </div>
            </div>
        </div>
    </div>
</div>
