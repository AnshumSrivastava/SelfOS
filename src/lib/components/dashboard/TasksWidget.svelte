<script lang="ts">
    import {
        CheckSquare,
        Check,
        Clock,
        AlertCircle,
        Flame,
    } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";

    // Get upcoming tasks with enhanced sorting and context
    let upcomingTasks = $derived.by(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return tasksStore.tasks
            .filter((t) => t.status !== "completed")
            .map((task) => {
                let urgency = 0;
                let urgencyLabel = "";
                let urgencyColor = "text-muted";

                if (task.deadline) {
                    const deadline = new Date(task.deadline);
                    deadline.setHours(0, 0, 0, 0);
                    const daysUntil = Math.floor(
                        (deadline.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24),
                    );

                    if (daysUntil < 0) {
                        urgency = 100; // Overdue
                        urgencyLabel = `${Math.abs(daysUntil)}d overdue`;
                        urgencyColor = "text-red-400";
                    } else if (daysUntil === 0) {
                        urgency = 90; // Due today
                        urgencyLabel = "Due today";
                        urgencyColor = "text-orange-400";
                    } else if (daysUntil === 1) {
                        urgency = 80; // Due tomorrow
                        urgencyLabel = "Due tomorrow";
                        urgencyColor = "text-yellow-400";
                    } else if (daysUntil <= 3) {
                        urgency = 70;
                        urgencyLabel = `${daysUntil}d left`;
                        urgencyColor = "text-yellow-400";
                    } else if (daysUntil <= 7) {
                        urgency = 50;
                        urgencyLabel = `${daysUntil}d left`;
                        urgencyColor = "text-blue-400";
                    }
                }

                // Adjust urgency by priority
                if (task.priority === "high") urgency += 20;
                else if (task.priority === "medium") urgency += 10;

                return {
                    ...task,
                    urgency,
                    urgencyLabel,
                    urgencyColor,
                };
            })
            .sort((a, b) => b.urgency - a.urgency)
            .slice(0, 6);
    });

    function getPriorityColor(priority: string) {
        switch (priority) {
            case "high":
                return "text-red-400";
            case "medium":
                return "text-yellow-400";
            case "low":
                return "text-blue-400";
            default:
                return "text-muted";
        }
    }

    function getPriorityDot(priority: string) {
        switch (priority) {
            case "high":
                return "bg-red-400";
            case "medium":
                return "bg-yellow-400";
            case "low":
                return "bg-blue-400";
            default:
                return "bg-gray-400";
        }
    }
</script>

<div class="card">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
            <div
                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
            >
                <CheckSquare size={20} />
            </div>
            <div>
                <h2 class="text-lg font-semibold text-white">Priority Tasks</h2>
                <p class="text-xs text-muted">
                    {tasksStore.activeCount} active · {tasksStore.completedCount}
                    completed
                </p>
            </div>
        </div>
        <button
            onclick={() => goto(`${base}/tasks`)}
            class="text-sm text-primary hover:underline font-medium"
        >
            View All
        </button>
    </div>

    <div class="space-y-2">
        {#each upcomingTasks as task}
            <button
                onclick={() => tasksStore.toggle(task.id)}
                class="w-full flex items-start gap-3 p-3 rounded-xl bg-surface hover:bg-surface/80 transition-all group text-left border border-transparent {task.urgency >=
                90
                    ? 'border-red-500/20'
                    : task.urgency >= 80
                      ? 'border-orange-500/20'
                      : ''}"
            >
                <div
                    class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 {task.status ===
                    'completed'
                        ? 'bg-primary border-primary'
                        : 'border-line group-hover:border-primary/50'}"
                >
                    {#if task.status === "completed"}
                        <Check size={14} class="text-black" />
                    {/if}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-start gap-2 mb-1">
                        <p
                            class="text-sm font-medium text-white flex-1 {task.status ===
                            'completed'
                                ? 'line-through text-muted'
                                : ''}"
                        >
                            {task.title}
                        </p>
                        {#if task.urgencyLabel}
                            <span
                                class="text-xs font-medium flex items-center gap-1 {task.urgencyColor} whitespace-nowrap"
                            >
                                {#if task.urgency >= 90}
                                    <AlertCircle size={12} />
                                {:else if task.urgency >= 80}
                                    <Flame size={12} />
                                {:else}
                                    <Clock size={12} />
                                {/if}
                                {task.urgencyLabel}
                            </span>
                        {/if}
                    </div>
                    <div class="flex items-center gap-2">
                        <div
                            class="w-1.5 h-1.5 rounded-full {getPriorityDot(
                                task.priority,
                            )}"
                        ></div>
                        <span class="text-xs {getPriorityColor(task.priority)}">
                            {task.priority}
                        </span>
                        {#if task.project}
                            <span class="text-xs text-muted"
                                >· {task.project}</span
                            >
                        {/if}
                    </div>
                </div>
            </button>
        {/each}

        {#if upcomingTasks.length === 0}
            <div class="text-center py-8 text-muted">
                <CheckSquare size={32} class="mx-auto mb-2 opacity-50" />
                <p class="text-sm">No tasks pending</p>
                <p class="text-xs mt-1">You're all caught up!</p>
            </div>
        {/if}
    </div>

    {#if tasksStore.activeCount > 6}
        <div class="mt-4 pt-4 border-t border-line">
            <button
                onclick={() => goto(`${base}/tasks`)}
                class="w-full text-sm text-center text-primary hover:underline"
            >
                +{tasksStore.activeCount - 6} more tasks
            </button>
        </div>
    {/if}
</div>
