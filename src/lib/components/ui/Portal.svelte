<script lang="ts">
    import { mount, unmount } from "svelte";

    let { children } = $props();

    function portal(node: HTMLElement) {
        document.body.appendChild(node);
        return {
            destroy() {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            },
        };
    }
</script>

<div use:portal style="display: contents">
    {@render children()}
</div>
