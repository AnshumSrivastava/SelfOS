<script lang="ts">
    import StatCard from "$lib/components/ui/StatCard.svelte";
    import { financeStore } from "$lib/stores/finance.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        financeStore.init();
    });
    import {
        Wallet,
        TrendingUp,
        TrendingDown,
        IndianRupee,
        Plus,
        PieChart,
        ArrowUpRight,
        ArrowDownRight,
        Target,
        Landmark,
        Bell,
        Calendar,
        Trash2,
        Tag,
        Briefcase,
        Loader2,
        Check,
    } from "lucide-svelte";
    import SkeletonLoader from "$lib/components/ui/SkeletonLoader.svelte";

    function formatCurrency(amount: number) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount);
    }

    function formatDate(dateString: string) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    let showGoalModal = $state(false);
    let showBudgetModal = $state(false);
    let showAddModal = $state(false);
    let newGoal = $state({
        name: "",
        targetAmount: "",
        deadline: "",
    });
    let newBudget = $state({
        category: "",
        amount: "",
    });

    let newTransaction = $state({
        title: "",
        amount: "",
        type: "expense" as "income" | "expense",
        category: "General",
        tags: "",
    });

    function handleAddGoal() {
        if (!newGoal.name || !newGoal.targetAmount) return;

        financeStore.addGoal({
            name: newGoal.name,
            targetAmount: parseFloat(newGoal.targetAmount),
            deadline: newGoal.deadline || undefined,
            color: "#00BCD4", // Default to cyan for now
        });

        newGoal = { name: "", targetAmount: "", deadline: "" };
        showGoalModal = false;
    }

    function handleAddBudget() {
        if (!newBudget.category || !newBudget.amount) return;

        financeStore.addBudget({
            category: newBudget.category,
            amount: parseFloat(newBudget.amount),
            period: "monthly",
            color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color for now
        });

        newBudget = { category: "", amount: "" };
        showBudgetModal = false;
    }

    function handleAddTransaction() {
        if (!newTransaction.title || !newTransaction.amount) return;

        financeStore.addTransaction({
            title: newTransaction.title,
            amount: parseFloat(newTransaction.amount),
            type: newTransaction.type,
            category: newTransaction.category,
            tags: newTransaction.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            date: new Date().toISOString(),
        });

        newTransaction = {
            title: "",
            amount: "",
            type: "expense",
            category: "General",
            tags: "",
        };
        showAddModal = false;
    }
</script>

<div class="page-container relative">
    {#if showBudgetModal}
        <div
            class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            role="button"
            tabindex="0"
            onclick={() => (showBudgetModal = false)}
            onkeydown={(e) => {
                if (e.key === "Escape") showBudgetModal = false;
            }}
        >
            <div
                class="card-subtle w-full max-w-md shadow-2xl"
                role="dialog"
                aria-modal="true"
                tabindex="-1"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => e.stopPropagation()}
            >
                <h3 class="text-xl font-bold mb-6 text-white">Add Budget</h3>
                <div class="space-y-4">
                    <div>
                        <label
                            for="budget-category"
                            class="text-xs text-muted block mb-2 uppercase tracking-wider"
                            >Category</label
                        >
                        <input
                            id="budget-category"
                            type="text"
                            bind:value={newBudget.category}
                            placeholder="e.g. Dining Out"
                            class="input w-full"
                        />
                    </div>
                    <div>
                        <label
                            for="budget-amount"
                            class="text-xs text-muted block mb-2 uppercase tracking-wider"
                            >Amount</label
                        >
                        <input
                            id="budget-amount"
                            type="number"
                            bind:value={newBudget.amount}
                            placeholder="e.g. 5000"
                            class="input w-full"
                        />
                    </div>

                    <div class="flex gap-3 pt-6">
                        <button
                            class="btn btn-ghost flex-1"
                            onclick={() => (showBudgetModal = false)}
                            >Cancel</button
                        >
                        <button
                            class="btn btn-primary flex-1"
                            onclick={handleAddBudget}>Save Budget</button
                        >
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if showGoalModal}
        <div
            class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            role="button"
            tabindex="0"
            onclick={() => (showGoalModal = false)}
            onkeydown={(e) => {
                if (e.key === "Escape") showGoalModal = false;
            }}
        >
            <div
                class="card-subtle w-full max-w-md shadow-2xl"
                role="dialog"
                aria-modal="true"
                tabindex="-1"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => e.stopPropagation()}
            >
                <h3 class="text-xl font-bold mb-6 text-white">
                    Add Savings Goal
                </h3>
                <div class="space-y-4">
                    <div>
                        <label
                            for="goal-name"
                            class="text-xs text-muted block mb-2 uppercase tracking-wider"
                            >Goal Name</label
                        >
                        <input
                            id="goal-name"
                            type="text"
                            bind:value={newGoal.name}
                            placeholder="e.g. New Laptop"
                            class="input w-full"
                        />
                    </div>
                    <div>
                        <label
                            for="goal-amount"
                            class="text-xs text-muted block mb-2 uppercase tracking-wider"
                            >Target Amount</label
                        >
                        <input
                            id="goal-amount"
                            type="number"
                            bind:value={newGoal.targetAmount}
                            placeholder="e.g. 50000"
                            class="input w-full"
                        />
                    </div>
                    <div>
                        <label
                            for="goal-deadline"
                            class="text-xs text-muted block mb-2 uppercase tracking-wider"
                            >Deadline (Optional)</label
                        >
                        <input
                            id="goal-deadline"
                            type="date"
                            bind:value={newGoal.deadline}
                            class="input w-full"
                        />
                    </div>

                    <div class="flex gap-3 pt-6">
                        <button
                            class="btn btn-ghost flex-1"
                            onclick={() => (showGoalModal = false)}
                            >Cancel</button
                        >
                        <button
                            class="btn btn-primary flex-1"
                            onclick={handleAddGoal}>Save Goal</button
                        >
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if showAddModal}
        <div
            class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            role="button"
            tabindex="0"
            onclick={() => (showAddModal = false)}
            onkeydown={(e) => {
                if (e.key === "Escape") showAddModal = false;
            }}
        >
            <div
                class="card-subtle w-full max-w-md shadow-2xl"
                role="dialog"
                aria-modal="true"
                tabindex="-1"
                onclick={(e) => e.stopPropagation()}
                onkeydown={(e) => e.stopPropagation()}
            >
                <h3 class="text-xl font-bold mb-6 text-white">
                    Add Transaction
                </h3>
                <div class="space-y-4">
                    <div>
                        <span
                            class="text-xs text-muted block mb-2 uppercase tracking-wider"
                        >
                            Type
                        </span>
                        <div class="flex gap-2 p-1 bg-background/40 rounded-lg">
                            <button
                                class="flex-1 py-2 rounded-md font-medium text-sm transition-all {newTransaction.type ===
                                'income'
                                    ? 'bg-emerald-500 text-black shadow-lg'
                                    : 'text-muted hover:text-white'}"
                                onclick={() => (newTransaction.type = "income")}
                                >Income</button
                            >
                            <button
                                class="flex-1 py-2 rounded-md font-medium text-sm transition-all {newTransaction.type ===
                                'expense'
                                    ? 'bg-red-500 text-black shadow-lg'
                                    : 'text-muted hover:text-white'}"
                                onclick={() =>
                                    (newTransaction.type = "expense")}
                                >Expense</button
                            >
                        </div>
                    </div>
                    <div>
                        <label
                            for="transaction-title"
                            class="text-xs text-muted block mb-2 uppercase tracking-wider"
                            >Details</label
                        >
                        <input
                            id="transaction-title"
                            type="text"
                            bind:value={newTransaction.title}
                            placeholder="Title (e.g. Groceries)"
                            class="input w-full mb-3"
                        />
                        <input
                            type="number"
                            bind:value={newTransaction.amount}
                            placeholder="Amount (e.g. 500)"
                            class="input w-full"
                            aria-label="Transaction Amount"
                        />
                    </div>
                    <div>
                        <label
                            for="transaction-category"
                            class="text-xs text-muted block mb-2 uppercase tracking-wider"
                            >Category</label
                        >
                        <input
                            id="transaction-category"
                            type="text"
                            bind:value={newTransaction.category}
                            placeholder="General"
                            class="input w-full"
                        />
                    </div>
                    <div>
                        <label
                            for="transaction-tags"
                            class="text-xs text-muted block mb-2 uppercase tracking-wider"
                            >Tags</label
                        >
                        <input
                            id="transaction-tags"
                            type="text"
                            bind:value={newTransaction.tags}
                            placeholder="comma, separated"
                            class="input w-full"
                        />
                    </div>

                    <div class="flex gap-3 pt-6">
                        <button
                            class="btn btn-ghost flex-1"
                            onclick={() => (showAddModal = false)}
                            >Cancel</button
                        >
                        <button
                            class="btn btn-primary flex-1"
                            onclick={handleAddTransaction}
                            >Save Transaction</button
                        >
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <div class="module-header" style="margin-bottom: var(--space-4)">
        <div>
            <h1>Finance</h1>
            <p class="text-sm text-muted mt-1">
                Master your wealth and cashflow.
            </p>
        </div>

        <div class="flex gap-3">
            <button class="btn btn-ghost flex items-center gap-2">
                <PieChart size={16} />
                <span class="hidden sm:inline">Reports</span>
            </button>
            <button
                onclick={() => (showAddModal = true)}
                class="btn btn-primary flex items-center gap-2"
            >
                <Plus size={16} /> Add Transaction
            </button>
        </div>
    </div>

    {#if financeStore.loading}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <SkeletonLoader lines={1} height="h-32" />
            <SkeletonLoader lines={1} height="h-32" />
            <SkeletonLoader lines={2} height="h-32" class="md:col-span-2" />
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <SkeletonLoader lines={3} height="h-48" />
                <SkeletonLoader lines={5} height="h-96" />
            </div>
            <div class="space-y-6">
                <SkeletonLoader lines={3} height="h-64" />
                <SkeletonLoader lines={3} height="h-64" />
            </div>
        </div>
    {:else}
        <!-- Header Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-[var(--space-2)]">
            <!-- Incoming Payments (Receiving) -->
            <div
                class="card-subtle relative overflow-hidden group !p-5"
                style="border-radius: var(--radius-subtle)"
            >
                <div
                    class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
                >
                    <ArrowUpRight size={56} />
                </div>
                <div class="relative z-10">
                    <p
                        class="text-[10px] text-muted font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
                    >
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"
                        ></span> Receiving
                    </p>
                    <div class="text-2xl font-light text-text">
                        {formatCurrency(financeStore.totalReceivingPending)}
                    </div>
                    <p
                        class="text-[10px] text-muted mt-2 uppercase tracking-tight"
                    >
                        {financeStore.incomeReminders.length} expected
                    </p>
                </div>
            </div>

            <!-- Bills (Paying) -->
            <div
                class="card-subtle relative overflow-hidden group !p-5"
                style="border-radius: var(--radius-subtle)"
            >
                <div
                    class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
                >
                    <ArrowDownRight size={56} />
                </div>
                <div class="relative z-10">
                    <p
                        class="text-[10px] text-muted font-bold uppercase tracking-widest mb-3 flex items-center gap-2"
                    >
                        <span class="w-1.5 h-1.5 rounded-full bg-red-400"
                        ></span> Bills Due
                    </p>
                    <div class="text-2xl font-light text-text">
                        {formatCurrency(financeStore.totalBillsDue)}
                    </div>
                    <p
                        class="text-[10px] text-muted mt-2 uppercase tracking-tight"
                    >
                        {financeStore.expenseReminders.length} due
                    </p>
                </div>
            </div>

            <!-- Monthly Summary -->
            <div
                class="md:col-span-2 card-subtle flex flex-col justify-between !p-5"
                style="border-radius: var(--radius-subtle)"
            >
                <div>
                    <p
                        class="text-[10px] text-muted font-bold uppercase tracking-widest mb-4"
                    >
                        Monthly Cash Flow
                    </p>
                    <div class="flex items-center gap-12">
                        <div>
                            <p
                                class="text-[10px] text-muted mb-1 uppercase tracking-tight"
                            >
                                Income
                            </p>
                            <p class="text-xl font-medium text-emerald-500">
                                {formatCurrency(financeStore.income)}
                            </p>
                        </div>
                        <div class="h-8 w-px bg-white/5"></div>
                        <div>
                            <p
                                class="text-[10px] text-muted mb-1 uppercase tracking-tight"
                            >
                                Spent
                            </p>
                            <p class="text-xl font-medium text-red-500/80">
                                {formatCurrency(financeStore.expense)}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="mt-4">
                    <div
                        class="flex justify-between text-[10px] uppercase tracking-widest text-muted mb-2"
                    >
                        <span>Savings Rate</span>
                        <span class="text-text"
                            >{financeStore.savingsRate}%</span
                        >
                    </div>
                    <div
                        class="h-1 w-full bg-white/5 rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-emerald-500/80 transition-all duration-1000 ease-out"
                            style="width: {financeStore.savingsRate}%"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Content Column -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Investments Section -->
                {#if financeStore.investments.length > 0}
                    <div
                        class="card-subtle !border-line hover:!bg-white/1 cursor-pointer transition-all"
                        style="border-radius: var(--card-radius)"
                    >
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="flex items-center gap-3">
                                <div
                                    class="w-1 h-5 bg-secondary rounded-full"
                                ></div>
                                Portfolio
                            </h3>
                            <span class="text-secondary font-medium text-lg">
                                {formatCurrency(
                                    financeStore.totalInvestmentValue,
                                )}
                            </span>
                        </div>
                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-2)]"
                        >
                            {#each financeStore.investments as inv}
                                <div
                                    class="p-4 bg-white/2 border border-white/5 rounded-[var(--radius-subtle)] flex items-center justify-between hover:border-secondary/30 transition-colors"
                                >
                                    <div>
                                        <p class="font-bold text-sm text-text">
                                            {inv.name}
                                        </p>
                                        <p
                                            class="text-[10px] text-muted uppercase tracking-widest mt-1"
                                        >
                                            {inv.type}
                                        </p>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-medium text-text">
                                            {formatCurrency(inv.currentValue)}
                                        </p>
                                        <p
                                            class="text-[10px] {inv.currentValue >=
                                            inv.amountInvested
                                                ? 'text-emerald-500'
                                                : 'text-red-400'} font-bold mt-1"
                                        >
                                            {inv.currentValue >=
                                            inv.amountInvested
                                                ? "+"
                                                : ""}{(
                                                ((inv.currentValue -
                                                    inv.amountInvested) /
                                                    inv.amountInvested) *
                                                100
                                            ).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Recent Transactions -->
                <div
                    class="card-subtle !p-6"
                    style="border-radius: var(--card-radius)"
                >
                    <h3 class="mb-6 flex items-center gap-3">
                        <div class="w-1 h-5 bg-primary rounded-full"></div>
                        Activity
                    </h3>
                    <div class="space-y-1">
                        {#each financeStore.transactions as t}
                            <div
                                class="flex items-center justify-between p-3 rounded-[var(--radius-subtle)] hover:bg-white/2 transition-all group border border-transparent"
                            >
                                <div class="flex items-center gap-4">
                                    <div
                                        class="w-10 h-10 rounded-xl flex items-center justify-center {t.type ===
                                        'income'
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : 'bg-white/5 text-muted'}"
                                    >
                                        {#if t.type === "income"}
                                            <ArrowUpRight size={16} />
                                        {:else}
                                            <ArrowDownRight size={16} />
                                        {/if}
                                    </div>
                                    <div>
                                        <p
                                            class="font-medium text-sm text-text transition-colors"
                                        >
                                            {t.title}
                                        </p>
                                        <div
                                            class="flex items-center gap-2 text-[10px] text-muted mt-0.5 uppercase tracking-tight"
                                        >
                                            <span>{formatDate(t.date)}</span>
                                            <span
                                                class="w-1 h-1 rounded-full bg-line"
                                            ></span>
                                            <span>{t.category}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span
                                        class="font-medium text-sm {t.type ===
                                        'income'
                                            ? 'text-emerald-500'
                                            : 'text-text'}"
                                    >
                                        {t.type === "income"
                                            ? "+"
                                            : "-"}{formatCurrency(t.amount)}
                                    </span>
                                    <button
                                        class="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-colors p-1"
                                        onclick={() =>
                                            financeStore.removeTransaction(
                                                t.id,
                                            )}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        {/each}
                        {#if financeStore.transactions.length === 0}
                            <div
                                class="text-center py-12 text-muted text-sm italic"
                            >
                                No activity recorded.
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

            <!-- Sidebar: Budgets, Goals, Reminders -->
            <div class="space-y-6">
                <!-- Budgets -->
                <div
                    class="card-subtle !p-6"
                    style="border-radius: var(--card-radius)"
                >
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="flex items-center gap-3">
                            <div class="w-1 h-5 bg-primary rounded-full"></div>
                            Budgets
                        </h3>
                        <button
                            class="text-[10px] text-primary font-bold hover:opacity-80 transition-all uppercase tracking-widest flex items-center gap-1"
                            onclick={() => (showBudgetModal = true)}
                        >
                            <Plus size={14} /> Add
                        </button>
                    </div>

                    <div class="space-y-5">
                        {#each financeStore.budgets as budget}
                            <div class="group">
                                <div
                                    class="flex justify-between text-[10px] mb-2 uppercase tracking-widest font-bold"
                                >
                                    <span class="text-muted"
                                        >{budget.category}</span
                                    >
                                    <div class="flex items-center gap-2">
                                        <span class="text-text"
                                            >{formatCurrency(
                                                budget.spent,
                                            )}</span
                                        >
                                        <span class="text-muted/50"
                                            >/ {formatCurrency(
                                                budget.amount,
                                            )}</span
                                        >
                                        <button
                                            class="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all ml-2"
                                            onclick={() =>
                                                financeStore.removeBudget(
                                                    budget.id,
                                                )}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div
                                    class="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5"
                                >
                                    <div
                                        class="h-full rounded-full transition-all duration-1000 ease-out relative"
                                        style="width: {Math.min(
                                            (budget.spent / budget.amount) *
                                                100,
                                            100,
                                        )}%; background-color: {budget.color}"
                                    >
                                        <div
                                            class="absolute inset-0 bg-white/10 opacity-30"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        {/each}
                        {#if financeStore.budgets.length === 0}
                            <div
                                class="text-center py-4 text-[10px] text-muted uppercase tracking-widest"
                            >
                                No budget profiles.
                            </div>
                        {/if}
                    </div>
                </div>

                <!-- Savings Goals -->
                <div class="flex items-center justify-between mb-2">
                    <h3
                        class="text-sm text-gray-400 font-medium uppercase tracking-wider"
                    >
                        Savings Goals
                    </h3>
                    <button
                        onclick={() => (showGoalModal = true)}
                        class="text-xs text-[#00BCD4] hover:text-[#00BCD4]/80 transition-colors flex items-center gap-1 font-bold"
                    >
                        <Plus size={14} /> Add Goal
                    </button>
                </div>

                {#each financeStore.goals as goal}
                    <div class="card-subtle relative overflow-hidden group">
                        <div
                            class="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity"
                        >
                            <Target size={100} />
                        </div>

                        <div
                            class="flex items-start justify-between relative z-10"
                        >
                            <div>
                                <h3 class="text-[#00BCD4] font-bold text-lg">
                                    {goal.name}
                                </h3>
                                <p class="text-sm text-gray-400">
                                    Target: {formatCurrency(goal.targetAmount)}
                                </p>
                            </div>
                            <div class="flex gap-2">
                                <button
                                    class="text-gray-600 hover:text-red-400 transition-colors"
                                    onclick={() =>
                                        financeStore.removeGoal(goal.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div class="mt-8 relative z-10">
                            <div class="flex items-end gap-1 mb-2">
                                <span class="text-3xl font-bold text-white"
                                    >{formatCurrency(goal.currentAmount)}</span
                                >
                                <span
                                    class="text-sm text-gray-500 mb-1.5 font-medium"
                                    >/ {(
                                        (goal.currentAmount /
                                            goal.targetAmount) *
                                        100
                                    ).toFixed(0)}%</span
                                >
                            </div>
                            {#if goal.deadline}
                                <p class="text-xs text-gray-500 mb-3">
                                    Deadline: {new Date(
                                        goal.deadline,
                                    ).toLocaleDateString()}
                                </p>
                            {/if}
                            <div
                                class="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5"
                            >
                                <div
                                    class="h-full bg-[#00BCD4] w-[60%] rounded-full shadow-[0_0_15px_rgba(0,188,212,0.4)] transition-all duration-1000 ease-out"
                                    style="width: {Math.min(
                                        (goal.currentAmount /
                                            goal.targetAmount) *
                                            100,
                                        100,
                                    )}%"
                                ></div>
                            </div>
                            <div class="flex mt-6 gap-2">
                                <button
                                    class="flex-1 py-2 text-xs font-bold rounded-lg bg-white/5 hover:bg-[#00BCD4]/10 hover:text-[#00BCD4] transition-colors"
                                    onclick={() =>
                                        financeStore.addToGoal(goal.id, 100)}
                                    >+ ₹100</button
                                >
                                <button
                                    class="flex-1 py-2 text-xs font-bold rounded-lg bg-white/5 hover:bg-[#00BCD4]/10 hover:text-[#00BCD4] transition-colors"
                                    onclick={() =>
                                        financeStore.addToGoal(goal.id, 1000)}
                                    >+ ₹1k</button
                                >
                            </div>
                        </div>
                    </div>
                {/each}

                <!-- Bill Reminders -->
                <div
                    class="card p-6 rounded-2xl border border-[#FF5252]/20 bg-[#FF5252]/5"
                >
                    <h3
                        class="font-bold text-[#FF5252] mb-4 flex items-center gap-2 text-lg"
                    >
                        <Bell size={20} /> Upcoming Bills
                    </h3>
                    <div class="space-y-3">
                        {#if (financeStore.reminders || []).length > 0}
                            {#each financeStore.reminders as reminder}
                                <div
                                    class="flex items-center gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group"
                                >
                                    <div
                                        class="w-10 h-10 rounded-lg bg-[#FF5252]/10 flex items-center justify-center text-[#FF5252]"
                                    >
                                        <Calendar size={18} />
                                    </div>
                                    <div class="flex-1">
                                        <p
                                            class="text-sm font-bold text-white group-hover:text-[#FF5252] transition-colors"
                                        >
                                            {reminder.title}
                                        </p>
                                        <p class="text-xs text-gray-400">
                                            {reminder.dueDate
                                                ? new Date(
                                                      reminder.dueDate,
                                                  ).toLocaleDateString()
                                                : ""}
                                        </p>
                                    </div>
                                    <span class="font-bold text-sm text-white"
                                        >{formatCurrency(reminder.amount)}</span
                                    >
                                </div>
                            {/each}
                        {:else}
                            <!-- Placeholder if no reminders -->
                            <div
                                class="flex items-center gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group"
                            >
                                <div
                                    class="w-10 h-10 rounded-lg bg-[#FF5252]/10 flex items-center justify-center text-[#FF5252]"
                                >
                                    <Calendar size={18} />
                                </div>
                                <div class="flex-1">
                                    <p
                                        class="text-sm font-bold text-white group-hover:text-[#FF5252] transition-colors"
                                    >
                                        Electricity
                                    </p>
                                    <p class="text-xs text-gray-400">
                                        Due in 3 days
                                    </p>
                                </div>
                                <span class="font-bold text-sm text-white"
                                    >₹1,200</span
                                >
                            </div>
                        {/if}
                        <button
                            class="w-full py-2 mt-2 text-xs font-bold rounded-lg text-[#FF5252] hover:bg-[#FF5252]/10 transition-colors"
                        >
                            + Set Reminder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>
