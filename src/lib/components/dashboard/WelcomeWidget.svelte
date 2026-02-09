<script>
    import { Sun, Moon, Coffee, ArrowRight } from "lucide-svelte";

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
                {greeting}, User
            </h1>
            <p class="text-muted">
                Ready to conquer your day? You have 4 tasks pending.
            </p>
        </div>
    </div>

    <button
        class="btn btn-primary flex items-center gap-2 relative z-10 font-bold group"
    >
        Start Session
        <ArrowRight
            size={18}
            class="group-hover:translate-x-1 transition-transform"
        />
    </button>

    <!-- Background decorations -->
    <!-- <div class="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent skew-x-12"></div> -->
</div>
