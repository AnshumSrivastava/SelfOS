<script lang="ts">
    import {
        CheckCircle2,
        Circle,
        Calendar,
        Flame,
        ExternalLink,
    } from "lucide-svelte";
    import { scale } from "svelte/transition";
    import { projectsStore } from "$lib/stores/projects.svelte";
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

    // Resolve project name
    let projectName = $derived.by(() => {
        if (!task.projectId) return "Inbox";
        const project = projectsStore.getProject(task.projectId);
        return project ? project.name : "Unknown";
    });

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
                class="text-base font-bold text-white/90 mb-2 {task.status ===
                'completed'
                    ? 'line-through text-muted/40'
                    : ''}"
            >
                {task.title}
            </h3>

            <!-- Project & Priority -->
            <div class="flex items-center gap-3 mb-1">
                <span
                    class="text-[9px] uppercase tracking-widest font-black text-muted/40"
                >
                    {projectName}
                </span>
                <span
                    class="text-[9px] uppercase tracking-widest font-black {task.priority ===
                    'high'
                        ? 'text-red-500/60'
                        : task.priority === 'medium'
                          ? 'text-yellow-500/60'
                          : 'text-muted/20'}"
                >
                    {task.priority}
                </span>
            </div>

            <!-- Deadline -->
            {#if urgencyInfo}
                <div class="flex items-center gap-1.5 pt-1">
                    <span
                        class="text-[10px] uppercase font-black tracking-widest {urgencyInfo.color} opacity-60"
                        >{urgencyInfo.label}</span
                    >
                </div>
            {/if}
        </div>
    </div>
</div>
