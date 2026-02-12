<script lang="ts">
    import { AlertCircle, TrendingUp, Target, Zap } from "lucide-svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { habitsStore } from "$lib/stores/habits.svelte";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";

    // Calculate next actions and insights
    let nextActions = $derived.by(() => {
        const actions = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check for overdue tasks
        const overdueTasks = tasksStore.tasks.filter((t) => {
            if (t.status === "completed" || !t.deadline) return false;
            const deadline = new Date(t.deadline);
            deadline.setHours(0, 0, 0, 0);
            return deadline < today;
        });

        if (overdueTasks.length > 0) {
            actions.push({
                type: "urgent",
                icon: AlertCircle,
                title: `${overdueTasks.length} Overdue Task${overdueTasks.length > 1 ? "s" : ""}`,
                description: `${overdueTasks[0].title}${overdueTasks.length > 1 ? ` +${overdueTasks.length - 1} more` : ""}`,
                action: "Review Now",
                link: `${base}/tasks`,
                color: "red",
            });
        }

        // Check for today's high priority tasks
        const todayHighPriority = tasksStore.tasks.filter((t) => {
            if (t.status === "completed") return false;
            if (t.priority !== "high") return false;
            if (!t.deadline) return false;
            const deadline = new Date(t.deadline);
            deadline.setHours(0, 0, 0, 0);
            return deadline.getTime() === today.getTime();
        });

        if (todayHighPriority.length > 0) {
            actions.push({
                type: "priority",
                icon: Target,
                title: `${todayHighPriority.length} High Priority Task${todayHighPriority.length > 1 ? "s" : ""} Today`,
                description: todayHighPriority[0].title,
                action: "Start Now",
                link: `${base}/tasks`,
                color: "yellow",
            });
        }

        // Check for incomplete habits
        const incompleteHabits = habitsStore.habits.filter(
            (h) => !habitsStore.isCompleted(h.id),
        );

        if (incompleteHabits.length > 0 && incompleteHabits.length <= 3) {
            actions.push({
                type: "habit",
                icon: Zap,
                title: `${incompleteHabits.length} Habit${incompleteHabits.length > 1 ? "s" : ""} Remaining`,
                description: `Complete ${incompleteHabits[0].name}${incompleteHabits.length > 1 ? ` +${incompleteHabits.length - 1} more` : ""}`,
                action: "Quick Check-in",
                link: `${base}/habits`,
                color: "green",
            });
        }

        // Check for momentum (streak at risk)
        const habitsAtRisk = habitsStore.habits.filter((h) => {
            return h.streak >= 3 && !habitsStore.isCompleted(h.id);
        });

        if (habitsAtRisk.length > 0) {
            actions.push({
                type: "streak",
                icon: TrendingUp,
                title: `${habitsAtRisk.length} Streak${habitsAtRisk.length > 1 ? "s" : ""} at Risk`,
                description: `Don't break your ${habitsAtRisk[0].streak}-day ${habitsAtRisk[0].name} streak!`,
                action: "Protect Streak",
                link: `${base}/habits`,
                color: "orange",
            });
        }

        return actions.slice(0, 3); // Show max 3 actions
    });

    function getColorClasses(color: string) {
        switch (color) {
            case "red":
                return "bg-red-500/10 border-red-500/30 text-red-400";
            case "yellow":
                return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
            case "green":
                return "bg-green-500/10 border-green-500/30 text-green-400";
            case "orange":
                return "bg-orange-500/10 border-orange-500/30 text-orange-400";
            default:
                return "bg-primary/10 border-primary/30 text-primary";
        }
    }
</script>

{#if nextActions.length > 0}
    <div class="card-subtle border-primary/20">
        <div class="flex items-center gap-3 mb-4">
            <div
                class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
            >
                <Target size={20} />
            </div>
            <div>
                <h2 class="text-lg font-semibold text-white">Next Actions</h2>
                <p class="text-xs text-muted">What needs your attention now</p>
            </div>
        </div>

        <div class="space-y-3">
            {#each nextActions as action}
                {@const Icon = action.icon}
                <button
                    onclick={() => goto(action.link)}
                    class="w-full p-4 rounded-xl border transition-all hover:scale-[1.02] {getColorClasses(
                        action.color,
                    )} group text-left"
                >
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0 mt-0.5">
                            <Icon size={20} />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div
                                class="flex items-start justify-between gap-2 mb-1"
                            >
                                <h3 class="text-sm font-semibold text-white">
                                    {action.title}
                                </h3>
                                <span
                                    class="text-xs px-2 py-0.5 rounded-full bg-white/10 whitespace-nowrap"
                                >
                                    {action.action}
                                </span>
                            </div>
                            <p class="text-xs opacity-80 truncate">
                                {action.description}
                            </p>
                        </div>
                    </div>
                </button>
            {/each}
        </div>
    </div>
{:else}
    <div class="card border-green-500/20 bg-green-500/5">
        <div class="flex items-center gap-3 mb-2">
            <div
                class="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400"
            >
                <Target size={20} />
            </div>
            <div>
                <h2 class="text-lg font-semibold text-white">All Clear!</h2>
                <p class="text-sm text-muted">
                    No urgent actions. Great job staying on top of things!
                </p>
            </div>
        </div>
    </div>
{/if}
