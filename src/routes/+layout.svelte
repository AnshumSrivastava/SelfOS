<script>
  import "../app.css";
  import MobileLayout from "$lib/layouts/MobileLayout.svelte";
  import DesktopLayout from "$lib/layouts/DesktopLayout.svelte";
  import { focusStore } from "$lib/stores/focus.svelte";
  import { settings } from "$lib/stores/settings.svelte";
  import { searchStore } from "$lib/stores/search.svelte";
  import SearchModal from "$lib/components/ui/SearchModal.svelte";

  let { children } = $props();

  $effect(() => {
    localStorage.setItem(
      "selfos-settings",
      JSON.stringify({
        features: settings.features,
        theme: settings.theme,
        accentColor: settings.accentColor,
      }),
    );
    settings.applyTheme();
  });

  let lastTap = 0;
  function handleDoubleTap() {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
      focusStore.exitZen();
    }
    lastTap = currentTime;
  }
  function handleKeydown(e) {
    if (
      e.key === "s" &&
      !["INPUT", "TEXTAREA"].includes(e.target.tagName) &&
      !e.target.isContentEditable
    ) {
      e.preventDefault(); // Prevent 's' from being typed if there's a focusable generic element? Actually safer not to prevent default unless we are sure. But user asked to trigger "if not already typing".
      searchStore.open();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

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

{#if focusStore.zenMode && !focusStore.sessionComplete}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 bg-black z-[9999] flex items-center justify-center cursor-none select-none touch-none"
    ondblclick={() => focusStore.exitZen()}
    ontouchend={handleDoubleTap}
    role="button"
    tabindex="0"
  >
    <span
      class="text-[20vw] font-bold tabular-nums leading-none tracking-tighter transition-colors duration-[2000ms] {focusStore.isRunning
        ? 'text-white/40'
        : 'text-white'}"
    >
      {focusStore.formattedTime}
    </span>
  </div>
{/if}

{#if focusStore.sessionComplete}
  <div
    class="fixed inset-0 bg-black/95 z-[10000] flex flex-col items-center justify-center p-4 backdrop-blur-sm"
  >
    <div class="max-w-md w-full text-center space-y-6">
      <h2 class="text-3xl font-bold text-white">Session Complete</h2>
      <p class="text-gray-400">Great job! What was this session about?</p>

      <form
        class="space-y-4"
        onsubmit={(e) => {
          e.preventDefault();
          const form = e.target;
          const input = form.elements.namedItem("subject");
          if (input.value.trim()) {
            focusStore.logSession(input.value);
          }
        }}
      >
        <input
          type="text"
          name="subject"
          placeholder="e.g., Project Planning, Deep Work..."
          class="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg text-center"
          autofocus
        />
        <button
          type="submit"
          class="px-8 py-3 bg-white text-black rounded-full font-medium hover:scale-105 active:scale-95 transition-all"
        >
          Save Session
        </button>
      </form>

      <button
        class="text-sm text-gray-500 hover:text-white transition-colors"
        onclick={() => {
          focusStore.sessionComplete = false;
          focusStore.reset();
        }}
      >
        Skip
      </button>
    </div>
  </div>
{/if}

<SearchModal />
