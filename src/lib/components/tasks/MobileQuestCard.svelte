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
    import { swipe, hapticFeedback } from "$lib/utils/swipeGestures";

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

    // Swipe state
    let swipeOffset = $state(0);
    let isSwipingRight = $state(false);
    let isSwipingLeft = $state(false);

    function getRarityColors(rarity: QuestRarity) {
        switch (rarity) {
            case "common":
                return {
                    border: "border-l-gray-500",
                    bg: "bg-gray-500/5",
                    text: "text-gray-400",
                };
            case "rare":
                return {
                    border: "border-l-blue-500",
                    bg: "bg-blue-500/5",
                    text: "text-blue-400",
                };
            case "epic":
                return {
                    border: "border-l-purple-500",
                    bg: "bg-purple-500/5",
                    text: "text-purple-400",
                };
            case "legendary":
                return {
                    border: "border-l-yellow-500",
                    bg: "bg-yellow-500/5",
                    text: "text-yellow-400",
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

    function handleSwipeRight() {
        if (task.status !== "completed") {
            hapticFeedback(10);
            onToggle();
        }
    }

    function handleSwipeLeft() {
        hapticFeedback([10, 50, 10]);
        onDelete();
    }
</script>

<div
    class="relative {colors.bg} {colors.border} border-l-4 rounded-lg p-4 mb-3 active:scale-[0.98] transition-transform"
    transition:scale={{ duration: 200 }}
    use:swipe={{
        onSwipeRight: handleSwipeRight,
        onSwipeLeft: handleSwipeLeft,
        threshold: 80,
    }}
>
    <!-- Rarity Badge -->
    <div
        class="absolute top-2 right-2 px-2 py-0.5 bg-black/30 rounded text-[10px] font-bold {colors.text} uppercase"
    >
        {rarity}
    </div>

    <!-- Content -->
    <div class="flex items-start gap-3">
        <!-- Checkbox -->
        <button
            onclick={onToggle}
            class="flex-shrink-0 mt-1 active:scale-90 transition-transform"
        >
            {#if task.status === "completed"}
                <CheckCircle2 size={28} class="text-green-500" />
            {:else}
                <Circle size={28} class="text-gray-600" />
            {/if}
        </button>

        <!-- Task Info -->
        <div class="flex-1 min-w-0">
            <!-- Title -->
            <h3
                class="text-base font-bold text-white mb-1 {task.status ===
                'completed'
                    ? 'line-through opacity-50'
                    : ''}"
            >
                {task.title}
            </h3>

            <!-- Project & Priority -->
            <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span
                    class="text-xs px-2 py-0.5 bg-white/5 rounded text-gray-400"
                >
                    {task.project}
                </span>
                <span
                    class="text-xs px-2 py-0.5 rounded {task.priority === 'high'
                        ? 'bg-red-500/20 text-red-400'
                        : task.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-500/20 text-gray-400'}"
                >
                    {task.priority}
                </span>
            </div>

            <!-- Deadline -->
            {#if urgencyInfo}
                <div class="flex items-center gap-1.5 mb-3">
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
            <div class="flex items-center gap-3 flex-wrap">
                <!-- XP Reward -->
                <div
                    class="flex items-center gap-1 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded"
                >
                    <Zap size={12} class="text-cyan-400" />
                    <span class="text-xs font-bold text-cyan-400"
                        >+{xpReward}</span
                    >
                </div>

                <!-- Gold Reward -->
                <div
                    class="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded"
                >
                    <Coins size={12} class="text-yellow-500" />
                    <span class="text-xs font-bold text-yellow-500"
                        >+{goldReward}</span
                    >
                </div>

                <!-- Difficulty Stars -->
                <div class="flex items-center gap-0.5">
                    {#each Array(5) as _, i}
                        <Star
                            size={10}
                            class={i < difficulty
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-700"}
                        />
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
