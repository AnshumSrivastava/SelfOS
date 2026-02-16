<script lang="ts">
    import { Plus } from "lucide-svelte";

    let { onclick, ariaLabel = "Add" } = $props<{
        onclick: () => void;
        ariaLabel?: string;
    }>();
</script>

<button
    {onclick}
    class="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.4)] active:scale-90 transition-all z-30 hover:scale-105 hover:shadow-[0_0_25px_rgba(0,255,157,0.6)]"
    aria-label={ariaLabel}
>
    <Plus size={28} strokeWidth={3} />
</button>
