<script>
  import "../app.css";
  import MobileLayout from "$lib/layouts/MobileLayout.svelte";
  import DesktopLayout from "$lib/layouts/DesktopLayout.svelte";
  import { focusStore } from "$lib/stores/focus.svelte";

  let { children } = $props();

  let lastTap = 0;
  function handleDoubleTap() {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
      focusStore.zenMode = false;
    }
    lastTap = currentTime;
  }
</script>

<div class="md:hidden">
  <MobileLayout>
    {@render children()}
  </MobileLayout>
</div>

<div class="hidden md:block">
  <DesktopLayout>
    {@render children()}
  </DesktopLayout>
</div>

{#if focusStore.zenMode}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 bg-black z-[9999] flex items-center justify-center cursor-none select-none touch-none"
    ondblclick={() => (focusStore.zenMode = false)}
    ontouchend={handleDoubleTap}
    role="button"
    tabindex="0"
  >
    <span
      class="text-[20vw] font-bold text-gray-200/90 tabular-nums leading-none tracking-tighter animate-pulse"
      style="animation-duration: 4s;"
    >
      {focusStore.formattedTime}
    </span>
  </div>
{/if}
