<script lang="ts">
    import {
        CheckCircle2,
        Circle,
        Coins,
        Zap,
        Star,
        Calendar,
        Flame,
    } from "lucide-svelte";
    import { scale } from "svelte/transition";
    import type { Task } from "$lib/stores/tasks.svelte";
    import {
        calculateQuestRarity,
        calculateQuestXP,
        calculateQuestGold,
        calculateQuestDifficulty,
    } from "$lib/stores/tasks.svelte";
    import type { QuestRarity } from "$lib/types/gamification";

    let {
        task,
        onToggle,
        onDelete,
    }: {
        task: Task;
        onToggle: () => void;
        onDelete: () => void;
    } = $props();

    let rarity = $derived(calculateQuestRarity(task));
    let xpReward = $derived(calculateQuestXP(task));
    let goldReward = $derived(calculateQuestGold(task));
    let difficulty = $derived(calculateQuestDifficulty(task));

    function getRarityColors(rarity: QuestRarity) {
        switch (rarity) {
            case "common":
                return {
                    border: "border-gray-500/30",
                    bg: "bg-gray-500/5",
                    glow: "shadow-gray-500/10",
                    text: "text-gray-400",
                    gradient: "from-gray-500 to-gray-600",
                };
            case "rare":
                return {
                    border: "border-blue-500/30",
                    bg: "bg-blue-500/5",
                    glow: "shadow-blue-500/20",
                    text: "text-blue-400",
                    gradient: "from-blue-500 to-blue-600",
                };
            case "epic":
                return {
                    border: "border-purple-500/30",
                    bg: "bg-purple-500/5",
                    glow: "shadow-purple-500/20",
                    text: "text-purple-400",
                    gradient: "from-purple-500 to-purple-600",
                };
            case "legendary":
                return {
                    border: "border-yellow-500/40",
                    bg: "bg-yellow-500/5",
                    glow: "shadow-yellow-500/30 shadow-lg",
                    text: "text-yellow-400",
                    gradient: "from-yellow-500 to-orange-600",
                };
        }
    }

    let colors = $derived(getRarityColors(rarity));

    // Calculate urgency
    let urgencyInfo = $derived.by(() => {
        if (!task.deadline) return null;

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const deadline = new Date(task.deadline);
        deadline.setHours(0, 0, 0, 0);
        const daysUntil = Math.floor(
            (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysUntil < 0) {
            return {
                label: `${Math.abs(daysUntil)}d overdue`,
                color: "text-red-400",
                icon: Flame,
            };
        } else if (daysUntil === 0) {
            return {
                label: "Due today",
                color: "text-orange-400",
                icon: Flame,
            };
        } else if (daysUntil === 1) {
            return {
                label: "Due tomorrow",
                color: "text-yellow-400",
                icon: Calendar,
            };
        } else if (daysUntil <= 3) {
            return {
                label: `${daysUntil}d left`,
                color: "text-yellow-400",
                icon: Calendar,
            };
        }

        return {
            label: `${daysUntil}d left`,
            color: "text-gray-400",
            icon: Calendar,
        };
    });
</script>

<div
    class="relative group {colors.bg} {colors.border} border-2 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] {colors.glow}"
    transition:scale={{ duration: 200 }}
>
    <!-- Rarity Badge -->
    <div
        class="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r {colors.gradient} rounded-full text-xs font-bold text-white uppercase shadow-lg"
    >
        {rarity}
    </div>

    <!-- Content -->
    <div class="flex items-start gap-4">
        <!-- Checkbox -->
        <button
            onclick={onToggle}
            class="flex-shrink-0 mt-1 transition-transform hover:scale-110"
        >
            {#if task.status === "completed"}
                <CheckCircle2 size={24} class="text-green-500" />
            {:else}
                <Circle size={24} class="text-gray-600 hover:text-gray-400" />
            {/if}
        </button>

        <!-- Task Info -->
        <div class="flex-1 min-w-0">
            <!-- Title & Project -->
            <div class="mb-2">
                <h3
                    class="text-lg font-bold text-white mb-1 {task.status ===
                    'completed'
                        ? 'line-through opacity-50'
                        : ''}"
                >
                    {task.title}
                </h3>
                <div class="flex items-center gap-2 flex-wrap">
                    <span
                        class="text-xs px-2 py-0.5 bg-white/5 rounded text-gray-400"
                    >
                        {task.project}
                    </span>
                    <span
                        class="text-xs px-2 py-0.5 rounded {task.priority ===
                        'high'
                            ? 'bg-red-500/20 text-red-400'
                            : task.priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-gray-500/20 text-gray-400'}"
                    >
                        {task.priority}
                    </span>
                </div>
            </div>

            <!-- Deadline -->
            {#if urgencyInfo}
                <div class="flex items-center gap-2 mb-3">
                    {#if urgencyInfo.icon === Flame}
                        <Flame size={14} class={urgencyInfo.color} />
                    {:else}
                        <Calendar size={14} class={urgencyInfo.color} />
                    {/if}
                    <span class="text-sm {urgencyInfo.color}"
                        >{urgencyInfo.label}</span
                    >
                </div>
            {/if}

            <!-- Rewards & Difficulty -->
            <div class="flex items-center gap-4 flex-wrap">
                <!-- XP Reward -->
                <div
                    class="flex items-center gap-1.5 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
                >
                    <Zap size={14} class="text-cyan-400" />
                    <span class="text-sm font-bold text-cyan-400"
                        >+{xpReward} XP</span
                    >
                </div>

                <!-- Gold Reward -->
                <div
                    class="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                >
                    <Coins size={14} class="text-yellow-500" />
                    <span class="text-sm font-bold text-yellow-500"
                        >+{goldReward}</span
                    >
                </div>

                <!-- Difficulty Stars -->
                <div class="flex items-center gap-1">
                    {#each Array(5) as _, i}
                        <Star
                            size={12}
                            class={i < difficulty
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-700"}
                        />
                    {/each}
                </div>
            </div>
        </div>

        <!-- Delete Button (on hover) -->
        <button
            onclick={onDelete}
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400"
            aria-label="Delete quest"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M6 6L14 14M6 14L14 6" />
            </svg>
        </button>
    </div>
</div>
