<script lang="ts">
    import { spring } from "svelte/motion";

    let { value = 0, initial = 0 } = $props();

    const displayed = spring(initial, {
        stiffness: 0.1,
        damping: 0.8,
        precision: 1,
    });

    $effect(() => {
        displayed.set(value);
    });
</script>

<span>{Math.round($displayed)}</span>
