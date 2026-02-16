<script lang="ts">
    import {
        CheckCircle2,
        Circle,
        Calendar,
        Flame,
        ExternalLink,
        Trash2,
    } from "lucide-svelte";
    import { scale } from "svelte/transition";
    import { projectsStore } from "$lib/stores/projects.svelte";
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

    // Resolve project name
    let projectName = $derived.by(() => {
        if (!task.projectId) return "Inbox";
        const project = projectsStore.getProject(task.projectId);
        return project ? project.name : "Unknown";
    });

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
    class="relative group card-subtle transition-all duration-300 !p-4 !border-line hover:!bg-white/2"
    style="border-radius: var(--radius-subtle)"
    transition:scale={{ duration: 200 }}
>
    <!-- Content -->
    <div class="flex items-start gap-3">
        <!-- Checkbox -->
        <button
            onclick={onToggle}
            class="flex-shrink-0 mt-0.5 transition-all active:scale-95 group/check"
        >
            {#if task.status === "completed"}
                <CheckCircle2 size={20} class="text-primary opacity-80" />
            {:else}
                <div
                    class="w-5 h-5 rounded-full border border-muted opacity-40 group-hover/check:opacity-100 group-hover/check:border-primary transition-all"
                ></div>
            {/if}
        </button>

        <!-- Task Info -->
        <div class="flex-1 min-w-0">
            <!-- Title & Project -->
            <div class="mb-2">
                <h3
                    class="text-base font-medium text-text mb-1 {task.status ===
                    'completed'
                        ? 'line-through opacity-30 italic'
                        : ''}"
                >
                    {task.title}
                </h3>
                <div class="flex items-center gap-2 flex-wrap">
                    <span
                        class="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-line border border-white/5 rounded-full text-muted"
                    >
                        {projectName}
                    </span>
                    <span
                        class="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full {task.priority ===
                        'high'
                            ? 'bg-red-400/10 text-red-400 border border-red-400/10'
                            : task.priority === 'medium'
                              ? 'bg-orange-400/10 text-orange-400 border border-orange-400/10'
                              : 'bg-blue-400/10 text-blue-400 border border-blue-400/10'}"
                    >
                        {task.priority}
                    </span>
                    {#if task.link}
                        <a
                            href={task.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-1"
                            onclick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink size={8} />
                            Link
                        </a>
                    {/if}
                </div>
            </div>

            <!-- Deadline -->
            {#if urgencyInfo}
                <div class="flex items-center gap-1.5">
                    <urgencyInfo.icon
                        size={12}
                        class="{urgencyInfo.color} opacity-70"
                    />
                    <span
                        class="text-[10px] font-bold uppercase tracking-widest {urgencyInfo.color} opacity-70"
                        >{urgencyInfo.label}</span
                    >
                </div>
            {/if}
        </div>

        <!-- Delete Button (on hover) -->
        <button
            onclick={onDelete}
            class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-red-400 p-1"
            aria-label="Delete task"
        >
            <Trash2 size={14} />
        </button>
    </div>
</div>
