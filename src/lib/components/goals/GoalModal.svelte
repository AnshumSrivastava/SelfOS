<script lang="ts">
    import {
        X,
        ChevronLeft,
        ChevronRight,
        Check,
        Plus,
        Type,
        Clock,
        LayoutGrid,
        Sparkles,
        Target,
        Flag,
        Calendar,
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import {
        goalsStore,
        type Goal,
        type Priority,
        type GoalHorizon,
        type GoalArea,
        type GoalStatus,
    } from "$lib/stores/goals.svelte";

    interface Props {
        isOpen: boolean;
        onClose: () => void;
        goal?: Goal | null;
        initialParentId?: string;
    }

    let {
        isOpen = $bindable(false),
        onClose,
        goal = null,
        initialParentId,
    }: Props = $props();

    // Wizard state
    let currentStep = $state(1);
    const totalSteps = 5;

    // Form state
    let title = $state("");
    let vision = $state("");
    let description = $state("");
    let targetDate = $state("");
    let priority: Priority = $state("normal");
    let horizon: GoalHorizon = $state("short");
    let area: GoalArea = $state("Personal");
    let status: GoalStatus = $state("active");
    let parentId = $state<string | undefined>(undefined);
    let structurePlan = $state("");

    const availableParents = $derived(
        goalsStore.goals.filter((g) => {
            if (goal && g.id === goal.id) return false;
            // Hierarchy rules:
            if (horizon === "short") return g.horizon !== "short";
            if (horizon === "mid")
                return g.horizon === "long" || g.horizon === "life";
            if (horizon === "long") return g.horizon === "life";
            return false;
        }),
    );

    const areas: GoalArea[] = [
        "Professional",
        "Personal",
        "Health",
        "Family",
        "Fun",
        "Spiritual",
        "Other",
    ];

    const horizons: { value: GoalHorizon; label: string; desc: string }[] = [
        {
            value: "life",
            label: "Life Vision",
            desc: "Permanent directions & core values",
        },
        {
            value: "long",
            label: "Long Term",
            desc: "1-5 Years large breakthroughs",
        },
        {
            value: "mid",
            label: "Mid Term",
            desc: "1-6 Months tangible projects",
        },
        {
            value: "short",
            label: "Short Term",
            desc: "1-4 Weeks atomic sprints",
        },
    ];

    // Auto-inherit properties from parent
    $effect(() => {
        if (parentId && !goal) {
            const parent = goalsStore.goals.find((g) => g.id === parentId);
            if (parent) {
                area = parent.area;
                priority = parent.priority;
            }
        }
    });

    // Initialize form when goal or initialParentId changes
    $effect(() => {
        if (isOpen) {
            if (goal) {
                title = goal.title;
                vision = goal.vision || "";
                description = goal.description || "";
                targetDate = goal.targetDate?.split("T")[0] || "";
                priority = goal.priority;
                horizon = goal.horizon || "short";
                area = goal.area || "Personal";
                status = goal.status || "active";
                parentId = goal.parentId;
            } else {
                resetForm();
                if (initialParentId) {
                    parentId = initialParentId;
                    const parent = goalsStore.goals.find(
                        (g) => g.id === initialParentId,
                    );
                    if (parent) {
                        if (parent.horizon === "life") horizon = "long";
                        else if (parent.horizon === "long") horizon = "mid";
                        else horizon = "short";

                        area = parent.area;
                        priority = parent.priority;
                    }
                }
            }
        }
    });

    function resetForm() {
        title = "";
        vision = "";
        description = "";
        targetDate = "";
        priority = "normal";
        horizon = "short";
        area = "Personal";
        status = "active";
        parentId = undefined;
        structurePlan = "";
        currentStep = 1;
    }

    function nextStep() {
        if (currentStep < totalSteps) currentStep++;
        else handleSubmit();
    }

    function prevStep() {
        if (currentStep > 1) currentStep--;
    }

    async function handleSubmit() {
        if (!title.trim()) return;

        const goalData = {
            title: title.trim(),
            vision: vision.trim() || undefined,
            description: description.trim() || undefined,
            targetDate: targetDate
                ? new Date(targetDate).toISOString()
                : undefined,
            priority,
            horizon,
            area,
            status,
            parentId: parentId || undefined,
        };

        let createdGoal: Goal;
        if (goal) {
            goalsStore.updateGoal(goal.id, goalData as Partial<Goal>);
            createdGoal = { ...goal, ...goalData } as Goal;
        } else {
            createdGoal = goalsStore.addGoal(goalData);
        }

        // Process structure plan if present
        if (structurePlan.trim()) {
            await processStructurePlan(createdGoal.id, structurePlan);
        }

        resetForm();
        onClose();
    }

    async function processStructurePlan(parentId: string, plan: string) {
        const lines = plan
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0);
        let currentSubGoalId = parentId;

        const parentGoal = goalsStore.goals.find((g) => g.id === parentId);
        if (!parentGoal) return;

        for (const line of lines) {
            if (line.startsWith(">")) {
                let subHorizon: GoalHorizon = "short";
                if (parentGoal.horizon === "life") subHorizon = "long";
                else if (parentGoal.horizon === "long") subHorizon = "mid";

                const subTitle = line.substring(1).trim();
                const newSub = goalsStore.addGoal({
                    title: subTitle,
                    horizon: subHorizon,
                    area: parentGoal.area,
                    priority: parentGoal.priority,
                    parentId: parentId,
                });
                currentSubGoalId = newSub.id;
            } else {
                const taskTitle = line.startsWith("-")
                    ? line.substring(1).trim()
                    : line;
                // Add to tasksStore if we want to integrate with global tasks
                import("$lib/stores/tasks.svelte").then(({ tasksStore }) => {
                    tasksStore.add({
                        title: taskTitle,
                        goalId: currentSubGoalId,
                        project: parentGoal.area,
                        priority:
                            parentGoal.priority === "high" ? "high" : "medium",
                    });
                });
            }
        }
    }

    const stepTitles = [
        "The Vision",
        "Trajectory",
        "Hierarchy",
        "Precision",
        "Execution Plan",
    ];

    const stepSubs = [
        "What are we building and why?",
        "How far into the future is this?",
        "Where does it fit in your strategy?",
        "Timeline and specific context.",
        "Break it down into sub-goals or tasks.",
    ];
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        transition:fade={{ duration: 200 }}
        onclick={onClose}
        onkeydown={(e) => (e.key === "Escape" || e.key === " ") && onClose()}
        role="button"
        tabindex="-1"
    >
        <div
            class="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[600px]"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
        >
            <!-- Header & Progress -->
            <div class="p-8 pb-4 relative border-b border-slate-800/50">
                <button
                    onclick={onClose}
                    class="absolute top-8 right-8 p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div class="flex items-center gap-2 mb-6">
                    {#each Array(totalSteps) as _, i}
                        <div
                            class="h-1 flex-1 rounded-full transition-all duration-500 {i +
                                1 <=
                            currentStep
                                ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                : 'bg-slate-800'}"
                        ></div>
                    {/each}
                </div>

                <span
                    class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-1 block"
                >
                    Step {currentStep} of {totalSteps}
                </span>
                <h2 class="text-2xl font-bold text-white leading-tight">
                    {stepTitles[currentStep - 1]}
                </h2>
                <p class="text-xs text-slate-400 mt-1">
                    {stepSubs[currentStep - 1]}
                </p>
            </div>

            <!-- Content Area -->
            <div class="flex-1 p-8 pt-6 overflow-y-auto custom-scrollbar">
                {#if currentStep === 1}
                    <div class="space-y-6" in:fly={{ x: 20, duration: 400 }}>
                        <div>
                            <label class="block">
                                <span
                                    class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5"
                                    >Goal Title</span
                                >
                                <input
                                    bind:value={title}
                                    placeholder="e.g., Become a Senior Architect"
                                    class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-700"
                                />
                            </label>
                        </div>
                        <div>
                            <label class="block">
                                <span
                                    class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5"
                                    >The Vision (Why?)</span
                                >
                                <textarea
                                    bind:value={vision}
                                    placeholder="The core purpose... 'So I can design systems that help millions.'"
                                    rows="3"
                                    class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-700 resize-none italic font-serif"
                                ></textarea>
                            </label>
                        </div>
                    </div>
                {:else if currentStep === 2}
                    <div class="space-y-6" in:fly={{ x: 20, duration: 400 }}>
                        <div class="grid grid-cols-1 gap-2.5">
                            {#each horizons as h}
                                <button
                                    type="button"
                                    class="p-4 rounded-2xl border transition-all text-left flex items-center justify-between {horizon ===
                                    h.value
                                        ? 'border-blue-500/50 bg-blue-500/5'
                                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'}"
                                    onclick={() => (horizon = h.value)}
                                >
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="p-2 rounded-xl bg-slate-900 border border-slate-800 {horizon ===
                                            h.value
                                                ? 'text-blue-400'
                                                : 'text-slate-500'}"
                                        >
                                            {#if h.value === "life"}<Sparkles
                                                    size={18}
                                                />
                                            {:else if h.value === "long"}<Target
                                                    size={18}
                                                />
                                            {:else if h.value === "mid"}<Calendar
                                                    size={18}
                                                />
                                            {:else}<Clock size={18} />{/if}
                                        </div>
                                        <div>
                                            <div
                                                class="text-sm font-bold text-white mb-0.5"
                                            >
                                                {h.label}
                                            </div>
                                            <div
                                                class="text-[10px] text-slate-500"
                                            >
                                                {h.desc}
                                            </div>
                                        </div>
                                    </div>
                                    {#if horizon === h.value}
                                        <div
                                            class="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white"
                                        >
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                    {/if}
                                </button>
                            {/each}
                        </div>
                    </div>
                {:else if currentStep === 3}
                    <div class="space-y-8" in:fly={{ x: 20, duration: 400 }}>
                        <div>
                            <span
                                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3"
                                >Life Area</span
                            >
                            <div class="flex flex-wrap gap-2">
                                {#each areas as a}
                                    <button
                                        type="button"
                                        class="px-4 py-2 rounded-xl border text-xs font-bold transition-all {area ===
                                        a
                                            ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                            : 'border-slate-800 text-slate-500 hover:border-slate-700'}"
                                        onclick={() => (area = a)}
                                    >
                                        {a}
                                    </button>
                                {/each}
                            </div>
                        </div>

                        {#if horizon !== "life"}
                            <div>
                                <label class="block">
                                    <span
                                        class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3"
                                        >Parent Objective (Optional)</span
                                    >
                                    <select
                                        bind:value={parentId}
                                        class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 outline-none transition-all appearance-none"
                                    >
                                        <option value={undefined}
                                            >No Parent (Standalone)</option
                                        >
                                        {#each availableParents as p}
                                            <option value={p.id}
                                                >[{p.horizon.toUpperCase()}] {p.title}</option
                                            >
                                        {/each}
                                    </select>
                                </label>
                            </div>
                        {/if}
                    </div>
                {:else if currentStep === 4}
                    <div class="space-y-6" in:fly={{ x: 20, duration: 400 }}>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span
                                    class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3"
                                    >Priority</span
                                >
                                <div class="flex flex-col gap-2">
                                    {#each ["low", "normal", "high"] as p}
                                        <button
                                            type="button"
                                            class="p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all capitalize {priority ===
                                            p
                                                ? 'border-amber-500/50 bg-amber-500/5 text-amber-500'
                                                : 'border-slate-800 text-slate-500 hover:border-slate-700'}"
                                            onclick={() =>
                                                (priority = p as Priority)}
                                        >
                                            <Flag
                                                size={14}
                                                class={p === "high"
                                                    ? "text-rose-500"
                                                    : ""}
                                            />
                                            {p}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                            <div>
                                <label class="block">
                                    <span
                                        class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3"
                                        >Target Date</span
                                    >
                                    <input
                                        type="date"
                                        bind:value={targetDate}
                                        class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-3 text-white focus:border-blue-500 outline-none color-scheme-dark"
                                    />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block">
                                <span
                                    class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5"
                                    >Strategic Notes</span
                                >
                                <textarea
                                    bind:value={description}
                                    placeholder="Resources, obstacles, or starting context..."
                                    rows="3"
                                    class="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-700 resize-none"
                                ></textarea>
                            </label>
                        </div>
                    </div>
                {:else if currentStep === 5}
                    <div class="space-y-6" in:fly={{ x: 20, duration: 400 }}>
                        <div
                            class="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-4"
                        >
                            <Sparkles
                                class="text-blue-400 shrink-0"
                                size={20}
                            />
                            <div>
                                <p class="text-xs font-bold text-blue-400 mb-1">
                                    Atomic Breakdown
                                </p>
                                <p
                                    class="text-[10px] text-slate-400 leading-relaxed"
                                >
                                    Quickly architect your plan. Lines starting
                                    with <span class="text-white font-black"
                                        >&gt;</span
                                    > create sub-goals. Other lines become tasks.
                                </p>
                            </div>
                        </div>

                        <div
                            class="bg-slate-950 border border-slate-800 rounded-2xl p-4 min-h-[250px] relative"
                        >
                            <textarea
                                bind:value={structurePlan}
                                placeholder="> Milestone: First Prototype&#10;- Design schema&#10;- Implement store&#10;&#10;> Milestone: UI Polish"
                                rows="10"
                                class="w-full bg-transparent border-none text-sm text-white focus:ring-0 outline-none placeholder:text-slate-800 leading-relaxed resize-none font-mono"
                            ></textarea>
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Footer -->
            <div
                class="p-8 pb-10 pt-4 flex gap-3 bg-slate-900 border-t border-slate-800/50"
            >
                {#if currentStep > 1}
                    <button
                        onclick={prevStep}
                        class="px-6 py-4 rounded-2xl border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                        <ChevronLeft size={18} />
                        Back
                    </button>
                {/if}
                <button
                    onclick={nextStep}
                    disabled={currentStep === 1 && !title.trim()}
                    class="flex-1 px-6 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                >
                    {#if currentStep === totalSteps}
                        <span>Finish & {goal ? "Save" : "Create"}</span>
                    {:else}
                        <span>Continue</span>
                        <ChevronRight size={18} />
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    :global(.color-scheme-dark) {
        color-scheme: dark;
    }
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
    }
</style>
