<script lang="ts">
    import { spring } from "svelte/motion";
    import { untrack } from "svelte";

    let { value = 0, initial = 0 } = $props();

    const displayed = spring(
        untrack(() => initial),
        {
            stiffness: 0.1,
            damping: 0.8,
            precision: 1,
        },
    );

    $effect(() => {
        displayed.set(value);
    });
</script>

<span>{Math.round($displayed)}</span>
