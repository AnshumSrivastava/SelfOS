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
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";
    import {
        goalsStore,
        type Goal,
        type Priority,
        type GoalType,
        type GoalArea,
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
    let description = $state("");
    let reason = $state("");
    let deadline = $state("");
    let priority: Priority = $state("normal");
    let type: GoalType = $state("short");
    let area: GoalArea = $state("Personal");
    let parentId = $state<string | undefined>(undefined);
    let structurePlan = $state("");

    const availableParents = $derived(
        goalsStore.goals.filter((g) => {
            if (goal && g.id === goal.id) return false;
            // Hierarchy rules:
            if (type === "short") return g.type === "mid" || g.type === "long";
            if (type === "mid") return g.type === "long";
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

    const types: { value: GoalType; label: string; desc: string }[] = [
        { value: "long", label: "Long Term", desc: "Years (Top Level)" },
        { value: "mid", label: "Mid Term", desc: "Months (Sub-Goal)" },
        { value: "short", label: "Short Term", desc: "Days/Weeks (Sub-Sub)" },
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
                description = goal.description || "";
                reason = goal.reason || "";
                deadline = goal.deadline?.split("T")[0] || "";
                priority = goal.priority;
                type = goal.type || "short";
                area = goal.area || "Personal";
                parentId = goal.parentId;
            } else {
                resetForm();
                if (initialParentId) {
                    parentId = initialParentId;
                    const parent = goalsStore.goals.find(
                        (g) => g.id === initialParentId,
                    );
                    if (parent) {
                        type = parent.type === "long" ? "mid" : "short";
                        area = parent.area;
                        priority = parent.priority;
                    }
                }
            }
        }
    });

    function resetForm() {
        title = "";
        description = "";
        reason = "";
        deadline = "";
        priority = "normal";
        type = "short";
        area = "Personal";
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
            description: description.trim() || undefined,
            reason: reason.trim() || undefined,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
            priority,
            type,
            area,
            parentId: parentId || undefined,
        };

        let createdGoal: Goal;
        if (goal) {
            goalsStore.updateGoal(goal.id, goalData);
            createdGoal = { ...goal, ...goalData };
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

        // Simple parsing:
        // "> Title" = Sub Goal
        // "- Title" = Task

        for (const line of lines) {
            if (line.startsWith(">")) {
                // Determine sub-goal type based on parent
                const subType: GoalType =
                    parentGoal.type === "long" ? "mid" : "short";
                const subTitle = line.substring(1).trim();
                const newSub = goalsStore.addGoal({
                    title: subTitle,
                    type: subType,
                    area: parentGoal.area,
                    priority: parentGoal.priority,
                    parentId: parentId,
                });
                currentSubGoalId = newSub.id;
            } else if (line.startsWith("-")) {
                const taskTitle = line.substring(1).trim();
                goalsStore.addTask({
                    goalId: currentSubGoalId,
                    title: taskTitle,
                });
            } else {
                // Default to task under current subgoal or main goal
                goalsStore.addTask({
                    goalId: currentSubGoalId,
                    title: line,
                });
            }
        }
    }

    const stepTitles = [
        "The Vision",
        "Classification",
        "Structure",
        "Precision",
        "Atomic Plan",
    ];

    const stepSubs = [
        "What are we building and why?",
        "How big is this and where does it fit?",
        "Set the hierarchy and importance.",
        "Final details and deadlines.",
        "Brainstorm sub-goals or tasks (Optional).",
    ];
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        transition:fade={{ duration: 200 }}
        onclick={onClose}
    >
        <div
            class="bg-surface border border-line w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[550px]"
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
        >
            <!-- Header & Progress -->
            <div class="p-8 pb-4 relative">
                <button
                    onclick={onClose}
                    class="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full transition-colors text-muted hover:text-white"
                >
                    <X size={20} />
                </button>

                <div class="flex items-center gap-2 mb-6">
                    {#each Array(totalSteps) as _, i}
                        <div
                            class="h-1 flex-1 rounded-full transition-all duration-500 {i +
                                1 <=
                            currentStep
                                ? 'bg-primary'
                                : 'bg-line'}"
                        ></div>
                    {/each}
                </div>

                <span
                    class="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1 block"
                >
                    Step {currentStep} of {totalSteps}
                </span>
                <h2 class="text-2xl font-black text-white leading-tight">
                    {stepTitles[currentStep - 1]}
                </h2>
                <p class="text-sm text-muted mt-1">
                    {stepSubs[currentStep - 1]}
                </p>
            </div>

            <!-- Content Area -->
            <div class="flex-1 p-8 pt-4 overflow-y-auto custom-scrollbar">
                {#if currentStep === 1}
                    <div class="space-y-6" in:fly={{ x: 20, duration: 400 }}>
                        <div>
                            <label
                                for="title"
                                class="text-[10px] font-bold text-muted uppercase tracking-widest block mb-3"
                                >Goal Name</label
                            >
                            <input
                                id="title"
                                bind:value={title}
                                placeholder="e.g., Master SvelteKit"
                                class="w-full bg-background border border-line rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/30"
                                autofocus
                            />
                        </div>
                        <div>
                            <label
                                for="reason"
                                class="text-[10px] font-bold text-muted uppercase tracking-widest block mb-3"
                                >Why start this?</label
                            >
                            <textarea
                                id="reason"
                                bind:value={reason}
                                placeholder="Your motivation. This will be always visible."
                                rows="3"
                                class="w-full bg-background border border-line rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/30 resize-none"
                            ></textarea>
                        </div>
                    </div>
                {:else if currentStep === 2}
                    <div class="space-y-8" in:fly={{ x: 20, duration: 400 }}>
                        <div>
                            <label
                                class="text-[10px] font-bold text-muted uppercase tracking-widest block mb-3"
                                >Duration</label
                            >
                            <div class="grid grid-cols-1 gap-3">
                                {#each types as t}
                                    <button
                                        type="button"
                                        class="p-4 rounded-2xl border transition-all text-left flex items-center justify-between {type ===
                                        t.value
                                            ? 'border-primary bg-primary/5'
                                            : 'border-line bg-background/40 hover:border-line-heavy'}"
                                        onclick={() => (type = t.value)}
                                    >
                                        <div>
                                            <div
                                                class="text-sm font-bold text-white mb-0.5"
                                            >
                                                {t.label}
                                            </div>
                                            <div class="text-[10px] text-muted">
                                                {t.desc}
                                            </div>
                                        </div>
                                        {#if type === t.value}
                                            <div
                                                class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-black"
                                            >
                                                <Check
                                                    size={14}
                                                    strokeWidth={3}
                                                />
                                            </div>
                                        {/if}
                                    </button>
                                {/each}
                            </div>
                        </div>
                        <div>
                            <label
                                class="text-[10px] font-bold text-muted uppercase tracking-widest block mb-3"
                                >Life Area</label
                            >
                            <div class="flex flex-wrap gap-2">
                                {#each areas as a}
                                    <button
                                        type="button"
                                        class="px-4 py-2 rounded-xl border text-xs font-bold transition-all {area ===
                                        a
                                            ? 'border-primary bg-primary text-black'
                                            : 'border-line text-muted hover:border-white/20'}"
                                        onclick={() => (area = a)}
                                    >
                                        {a}
                                    </button>
                                {/each}
                            </div>
                        </div>
                    </div>
                {:else if currentStep === 3}
                    <div class="space-y-8" in:fly={{ x: 20, duration: 400 }}>
                        {#if type !== "long"}
                            <div>
                                <label
                                    class="text-[10px] font-bold text-muted uppercase tracking-widest block mb-3"
                                    >Parent Goal (Optional)</label
                                >
                                <select
                                    bind:value={parentId}
                                    class="w-full bg-background border border-line rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all appearance-none"
                                >
                                    <option value={undefined}
                                        >Standalone Goal</option
                                    >
                                    {#each availableParents as p}
                                        <option value={p.id}
                                            >[{p.type.toUpperCase()}] {p.title}</option
                                        >
                                    {/each}
                                </select>
                                <p
                                    class="mt-2 text-[10px] text-muted-foreground italic"
                                >
                                    {#if type === "mid"}
                                        Mid-term goals can be children of
                                        Long-term goals.
                                    {:else if type === "short"}
                                        Short-term goals can be children of Mid
                                        or Long-term goals.
                                    {/if}
                                </p>
                            </div>
                        {/if}
                        <div>
                            <label
                                class="text-[10px] font-bold text-muted uppercase tracking-widest block mb-3"
                                >Priority</label
                            >
                            <div class="flex gap-3">
                                {#each ["low", "normal", "high"] as p}
                                    <button
                                        type="button"
                                        class="flex-1 p-4 rounded-2xl border text-xs font-bold transition-all capitalize {priority ===
                                        p
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-line text-muted hover:border-white/20'}"
                                        onclick={() =>
                                            (priority = p as Priority)}
                                    >
                                        {p}
                                    </button>
                                {/each}
                            </div>
                        </div>
                    </div>
                {:else if currentStep === 4}
                    <div class="space-y-6" in:fly={{ x: 20, duration: 400 }}>
                        <div>
                            <label
                                for="deadline"
                                class="text-[10px] font-bold text-muted uppercase tracking-widest block mb-3"
                                >Target Date (Optional)</label
                            >
                            <input
                                id="deadline"
                                type="date"
                                bind:value={deadline}
                                class="w-full bg-background border border-line rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all color-scheme-dark"
                            />
                        </div>
                        <div>
                            <label
                                for="description"
                                class="text-[10px] font-bold text-muted uppercase tracking-widest block mb-3"
                                >Specific Notes</label
                            >
                            <textarea
                                id="description"
                                bind:value={description}
                                placeholder="Any additional context..."
                                rows="4"
                                class="w-full bg-background border border-line rounded-2xl px-5 py-4 text-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/30 resize-none"
                            ></textarea>
                        </div>
                    </div>
                {:else if currentStep === 5}
                    <div class="space-y-6" in:fly={{ x: 20, duration: 400 }}>
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <label
                                    class="text-[10px] font-bold text-muted uppercase tracking-widest"
                                    >Structure Your Goal</label
                                >
                                <span class="text-[10px] text-primary font-bold"
                                    >Quick Mode</span
                                >
                            </div>

                            <div
                                class="p-4 bg-background border border-line rounded-2xl mb-4"
                            >
                                <div
                                    class="grid grid-cols-2 gap-4 text-[10px] font-medium text-muted mb-4 opacity-70"
                                >
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="w-4 h-4 rounded-md bg-white/5 flex items-center justify-center text-white font-black"
                                        >
                                            {">"}
                                        </div>
                                        <span>Sub-Goal Name</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="w-4 h-4 rounded-md bg-white/5 flex items-center justify-center text-white font-black"
                                        >
                                            {"-"}
                                        </div>
                                        <span>Task Name</span>
                                    </div>
                                </div>
                                <textarea
                                    bind:value={structurePlan}
                                    placeholder="> Learn the basics&#10;- Setup project&#10;- Create first route&#10;&#10;> Advanced concepts&#10;- Store management&#10;- Server actions"
                                    rows="10"
                                    class="w-full bg-transparent border-none text-sm text-white focus:ring-0 outline-none placeholder:text-muted/20 leading-relaxed resize-none"
                                ></textarea>
                            </div>

                            <div
                                class="bg-primary/5 border border-primary/20 rounded-xl p-3 flex gap-3 text-xs text-primary/80"
                            >
                                <Plus size={16} class="flex-shrink-0" />
                                <p>
                                    This will automatically create {type ===
                                    "long"
                                        ? "Mid"
                                        : "Short"} term sub-goals and tasks under
                                    this goal.
                                </p>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Footer Footer -->
            <div
                class="p-8 pt-4 flex gap-3 bg-surface/80 border-t border-line/10 backdrop-blur-sm"
            >
                {#if currentStep > 1}
                    <button
                        onclick={prevStep}
                        class="px-6 py-4 rounded-2xl border border-line text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        <ChevronLeft size={18} />
                        Back
                    </button>
                {/if}
                <button
                    onclick={nextStep}
                    disabled={currentStep === 1 && !title.trim()}
                    class="flex-1 px-6 py-4 rounded-2xl bg-primary text-black font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
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
