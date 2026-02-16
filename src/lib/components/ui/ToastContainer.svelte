<script lang="ts">
    import { toasts, type Toast } from "$lib/stores/toasts.svelte";
    import { flip } from "svelte/animate";
    import { fade, fly } from "svelte/transition";
    import {
        X,
        CheckCircle2,
        AlertCircle,
        Info,
        AlertTriangle,
    } from "lucide-svelte";

    const icons = {
        success: CheckCircle2,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const colors = {
        success: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
        error: "text-rose-400 border-rose-500/20 bg-rose-500/5",
        warning: "text-amber-400 border-amber-500/20 bg-amber-500/5",
        info: "text-primary border-primary/20 bg-primary/5",
    };
</script>

<div
    class="fixed top-6 right-6 z-[10000] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
>
    {#each toasts.toasts as toast (toast.id)}
        {@const Icon = icons[toast.type]}
        <div
            animate:flip={{ duration: 300 }}
            in:fly={{ x: 200, duration: 400 }}
            out:fade={{ duration: 200 }}
            class="pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-md shadow-2xl {colors[
                toast.type
            ]}"
        >
            <div class="flex-shrink-0 mt-0.5">
                <Icon size={18} />
            </div>

            <p class="text-sm font-medium leading-relaxed flex-1">
                {toast.message}
            </p>

            <button
                onclick={() => toasts.remove(toast.id)}
                class="flex-shrink-0 p-1 rounded-lg hover:bg-white/5 text-current opacity-40 hover:opacity-100 transition-all"
            >
                <X size={16} />
            </button>
        </div>
    {/each}
</div>
