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

    let {
        task,
        onToggle,
        onDelete,
    }: {
        task: Task;
        onToggle: () => void;
        onDelete: () => void;
    } = $props();

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
    class="relative group card-subtle transition-all duration-300"
    transition:scale={{ duration: 200 }}
>
    <!-- Content -->
    <div class="flex items-start gap-4">
        <!-- Checkbox -->
        <button
            onclick={onToggle}
            class="flex-shrink-0 mt-1 transition-transform hover:scale-110"
        >
            {#if task.status === "completed"}
                <CheckCircle2 size={24} class="text-emerald-500" />
            {:else}
                <Circle size={24} class="text-muted hover:text-white" />
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
                        class="text-xs px-2 py-0.5 bg-background border border-line rounded text-muted"
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
                    {#if task.link}
                        <a
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-1"
                            onclick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink size={10} />
                            Link
                        </a>
                    {/if}
                </div>
            </div>

            <!-- Deadline -->
            {#if urgencyInfo}
                <div class="flex items-center gap-2">
                    <urgencyInfo.icon size={14} class={urgencyInfo.color} />
                    <span class="text-sm {urgencyInfo.color}"
                        >{urgencyInfo.label}</span
                    >
                </div>
            {/if}
        </div>

        <!-- Delete Button (on hover) -->
        <button
            onclick={onDelete}
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400"
            aria-label="Delete task"
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
