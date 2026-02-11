<script>
    import { Sun, Moon, Coffee, ArrowRight } from "lucide-svelte";
    import { userStore } from "$lib/stores/user.svelte";
    import { tasksStore } from "$lib/stores/tasks.svelte";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";

    let hour = new Date().getHours();
    let greeting = $state("");
    let Icon = $state(Sun);

    if (hour < 12) {
        greeting = "Good Morning";
        Icon = Coffee;
    } else if (hour < 18) {
        greeting = "Good Afternoon";
        Icon = Sun;
    } else {
        greeting = "Good Evening";
        Icon = Moon;
    }

    // Get user name and pending tasks count
    let userName = $derived(userStore.currentUser?.displayName || "User");
    let pendingTasks = $derived(
        tasksStore.tasks.filter((t) => t.status !== "completed").length,
    );
</script>

<div
    class="card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative border-primary/20"
>
    <div class="flex items-center gap-6 relative z-10">
        <div
            class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
        >
            <Icon size={32} />
        </div>
        <div>
            <h1 class="text-xl md:text-2xl font-bold text-white mb-1">
                {greeting}, {userName}
            </h1>
            <p class="text-muted">
                Ready to conquer your day? You have {pendingTasks} tasks pending.
            </p>
        </div>
    </div>

    <button
        onclick={() => goto(`${base}/focus`)}
        class="btn btn-primary flex items-center gap-2 relative z-10 font-bold group"
    >
        Start Session
        <ArrowRight
            size={18}
            class="group-hover:translate-x-1 transition-transform"
        />
    </button>
</div>
