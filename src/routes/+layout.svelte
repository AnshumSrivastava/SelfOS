<script lang="ts">
  import "../app.css";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import MobileLayout from "$lib/layouts/MobileLayout.svelte";
  import DesktopLayout from "$lib/layouts/DesktopLayout.svelte";
  import { focusStore } from "$lib/stores/focus.svelte";
  import { settings } from "$lib/stores/settings.svelte";
  import { searchStore } from "$lib/stores/search.svelte";
  import { uiState } from "$lib/stores/ui.svelte";
  import { auth } from "$lib/stores/auth.svelte";
  import SearchModal from "$lib/components/ui/SearchModal.svelte";
  import ConfirmModal from "$lib/components/ui/ConfirmModal.svelte";
  import LoadingScreen from "$lib/components/ui/LoadingScreen.svelte";
  import { tutorialStore } from "$lib/stores/tutorial.svelte";
  import { tutorialEngine } from "$lib/tutorial/engine";
  import TutorialPromptModal from "$lib/components/tutorial/TutorialPromptModal.svelte";
  import TutorialHubModal from "$lib/components/tutorial/TutorialHubModal.svelte";
  import TutorialBackdrop from "$lib/components/tutorial/TutorialBackdrop.svelte";
  import TutorialCoachmark from "$lib/components/tutorial/TutorialCoachmark.svelte";
  import TutorialProgressPill from "$lib/components/tutorial/TutorialProgressPill.svelte";

  let { children } = $props();

  let showTutorialPrompt = $state(false);

  // Check if current route is a public auth route
  let isAuthRoute = $derived(
    $page.url.pathname.startsWith(`${base}/login`) ||
      $page.url.pathname.startsWith(`${base}/signup`) ||
      $page.url.pathname.startsWith(`${base}/auth/callback`),
  );

  // Dev bypass for easier QA
  const isDev = import.meta.env.DEV;
  const devBypass =
    isDev &&
    (import.meta.env.VITE_DEV_BYPASS === "true" ||
      !!localStorage.getItem("dev-bypass"));

  // Use auth store state
  let isAuthenticated = $derived(auth.isAuthenticated || devBypass);

  // Combine auth loading with local minimum-duration loading
  let localLoading = $state(true);
  let isLoading = $derived(auth.loading || localLoading);

  // Tutorial auto-prompt logic
  $effect(() => {
    if (!auth.loading && isAuthenticated) {
      const status = tutorialStore.currentPlatformStatus;
      if (!status.firstPromptSeen && !tutorialEngine.isRunning) {
        // Small delay to ensure everything else is loaded
        setTimeout(() => {
          showTutorialPrompt = true;
        }, 2000);
      }
    }
  });

  // Redirect logic
  $effect(() => {
    if (!auth.loading && !isAuthenticated && !isAuthRoute) {
      goto(`${base}/login`);
    }
    if (!auth.loading && isAuthenticated && isAuthRoute) {
      // Don't redirect if we're on the callback page, it handles itself
      if (!$page.url.pathname.includes("/auth/callback")) {
        goto(`${base}/`);
      }
    }
  });

  $effect(() => {
    if (typeof document !== "undefined") {
      const isMinimal = settings.theme === "minimal";
      document.documentElement.classList.toggle("theme-minimal", isMinimal);

      localStorage.setItem(
        "selfos-settings",
        JSON.stringify({
          features: settings.features,
          theme: settings.theme,
          accentColor: settings.accentColor,
        }),
      );
      settings.applyTheme();
    }
  });

  // Dynamic favicon color syncing
  $effect(() => {
    if (typeof document === "undefined") return;

    const color = settings.accentColor;
    const svg = `<svg width="32" height="32" viewBox="0 0 59.52298 59.594643" version="1.1" xmlns="http://www.w3.org/2000/svg"><g transform="translate(189.77842,-81.662422)"><path style="fill:${color}" d="m -160.01694,97.315205 -22.38416,34.213415 c 5.2901,4.88467 10.6208,7.93591 17.10696,9.15396 l 0.19844,-3.61114 c -2.35978,-0.28051 -5.9781,-1.2295 -12.91291,-6.32623 l 17.92656,-27.34769 0.0651,0.0987 0.0651,-0.0987 17.92656,27.34769 c -6.93481,5.09673 -10.55313,6.04572 -12.91291,6.32623 l 0.19844,3.61114 c 6.48616,-1.21805 11.81686,-4.26929 17.10696,-9.15396 z" /><path style="fill:${color}" d="m -161.65596,141.25706 3.57188,-0.15647 0.0134,-24.80418 -1.94629,-5.21661 -1.66242,5.21662 z" /><path style="fill:${color}" d="m -160.01694,81.662414 a 29.761417,29.761417 0 0 0 -29.76149,29.761496 29.761417,29.761417 0 0 0 4.74803,16.12614 l 2.10788,-3.22202 a 26.290359,26.290359 0 0 1 -3.3848,-12.90412 26.290359,26.290359 0 0 1 26.29038,-26.29039 26.290359,26.290359 0 0 1 26.29039,26.29039 26.290359,26.290359 0 0 1 -3.38481,12.90412 l 2.10788,3.22202 a 29.761417,29.761417 0 0 0 4.74803,-16.12614 29.761417,29.761417 0 0 0 -29.76149,-29.761496 z" /></g></svg>`;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
    if (link) {
      link.href = url;
    }

    return () => URL.revokeObjectURL(url);
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
  function handleKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    // Check if user is typing in an input
    const isInput =
      target &&
      (["INPUT", "TEXTAREA"].includes(target.tagName) ||
        target.isContentEditable);

    if (e.key === " " && !isInput) {
      e.preventDefault();
      searchStore.open();
    }

    if (e.key === "s" && !isInput) {
      e.preventDefault();
      goto(`${base}/settings`);
    }

    if (e.key === "Tab" && !isInput) {
      e.preventDefault();
      uiState.toggleChrome();
    }

    // Tutorial Shortcuts
    if (e.key === "/" && e.shiftKey && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      tutorialStore.showHub = true;
    }

    if (tutorialEngine.isRunning && !isInput) {
      if (e.key === "." && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        tutorialEngine.nextStep();
      }
      if (e.key === "," && e.shiftKey && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        tutorialEngine.prevStep();
      }
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isLoading}
  <LoadingScreen
    bind:isLoading={localLoading}
    dependenciesLoaded={!auth.loading}
  />
{:else if isAuthRoute}
  <!-- Auth pages (login/signup) - no layout, no guards -->
  {@render children()}
{:else if isAuthenticated}
  <!-- Main app with smooth tab transition -->
  <div>
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
  </div>
{:else}
  <!-- Redirecting to login -->
  <LoadingScreen isLoading={true} />
{/if}

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
        onsubmit={(e: SubmitEvent) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const input = form.elements.namedItem("subject") as HTMLInputElement;
          if (input?.value.trim()) {
            focusStore.logSession(input.value);
          }
        }}
      >
        <input
          type="text"
          name="subject"
          placeholder="e.g., Project Planning, Deep Work..."
          class="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg text-center"
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
<ConfirmModal />

<!-- Tutorial System -->
<TutorialPromptModal bind:show={showTutorialPrompt} />
<TutorialHubModal bind:show={tutorialStore.showHub} />

{#if tutorialEngine.isRunning}
  <TutorialBackdrop
    targetSelector={tutorialEngine.currentStep?.targetSelector}
  />
  <TutorialCoachmark />
{/if}

<TutorialProgressPill />
