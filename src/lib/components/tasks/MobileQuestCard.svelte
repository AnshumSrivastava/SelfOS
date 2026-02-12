<script lang="ts">
    import {
        CheckCircle2,
        Circle,
        Calendar,
        Flame,
        ExternalLink,
    } from "lucide-svelte";
    import { scale } from "svelte/transition";
    import type { Task } from "$lib/stores/tasks.svelte";
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

    // Swipe state
    let swipeOffset = $state(0);
    let isSwipingRight = $state(false);
    let isSwipingLeft = $state(false);

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
    class="relative card-subtle mb-3 active:scale-[0.98] transition-transform"
    transition:scale={{ duration: 200 }}
    use:swipe={{
        onSwipeRight: handleSwipeRight,
        onSwipeLeft: handleSwipeLeft,
        threshold: 80,
    }}
>
    <!-- Content -->
    <div class="flex items-start gap-4">
        <!-- Checkbox -->
        <button
            onclick={onToggle}
            class="flex-shrink-0 mt-1 active:scale-90 transition-transform"
        >
            {#if task.status === "completed"}
                <CheckCircle2 size={24} class="text-emerald-500" />
            {:else}
                <Circle size={24} class="text-muted" />
            {/if}
        </button>

        <!-- Task Info -->
        <div class="flex-1 min-w-0">
            <!-- Title -->
            <h3
                class="text-base font-bold text-white mb-2 {task.status ===
                'completed'
                    ? 'line-through text-muted'
                    : ''}"
            >
                {task.title}
            </h3>

            <!-- Project & Priority -->
            <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span
                    class="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-background border border-line rounded text-muted"
                >
                    {task.project}
                </span>
                <span
                    class="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded {task.priority ===
                    'high'
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                        : task.priority === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                          : 'bg-muted/10 text-muted border border-line'}"
                >
                    {task.priority}
                </span>
                {#if task.link}
                    <a
                        href={task.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 active:bg-primary/30 transition-colors flex items-center gap-1"
                        onclick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink size={10} />
                        Link
                    </a>
                {/if}
            </div>

            <!-- Deadline -->
            {#if urgencyInfo}
                <div
                    class="flex items-center gap-1.5 pt-2 border-t border-line"
                >
                    <urgencyInfo.icon size={12} class={urgencyInfo.color} />
                    <span class="text-xs {urgencyInfo.color}"
                        >{urgencyInfo.label}</span
                    >
                </div>
            {/if}
        </div>
    </div>
</div>
