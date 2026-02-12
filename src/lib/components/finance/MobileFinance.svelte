<script lang="ts">
    import {
        ArrowUpRight,
        ArrowDownRight,
        Plus,
        Target,
        PiggyBank,
        Briefcase,
    } from "lucide-svelte";
    import { financeStore } from "$lib/stores/finance.svelte";

    function formatCurrency(amount: number) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }

    let showAddModal = $state(false);
    let newTransaction = $state({
        title: "",
        amount: "",
        type: "expense" as "income" | "expense",
        category: "General",
    });

    function handleAddTransaction() {
        if (!newTransaction.title || !newTransaction.amount) return;

        financeStore.addTransaction({
            title: newTransaction.title,
            amount: parseFloat(newTransaction.amount),
            type: newTransaction.type,
            category: newTransaction.category,
            tags: [], // Optional for mobile quick add
            date: new Date().toISOString(),
        });

        // Reset
        newTransaction = {
            title: "",
            amount: "",
            type: "expense",
            category: "General",
        };
        showAddModal = false;
    }
</script>

<div class="page-container relative">
    {#if showAddModal}
        <div
            class="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm"
        >
            <div
                class="card-subtle w-full rounded-t-3xl sm:rounded-2xl border-t border-line animate-in slide-in-from-bottom duration-200"
            >
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-white">
                        Add Transaction
                    </h3>
                    <button
                        class="text-gray-400"
                        onclick={() => (showAddModal = false)}>✕</button
                    >
                </div>

                <div class="space-y-4">
                    <div
                        class="flex gap-3 bg-background/40 p-1.5 rounded-xl border border-line"
                    >
                        <button
                            class="flex-1 py-3 rounded-lg font-bold text-sm transition-all {newTransaction.type ===
                            'income'
                                ? 'bg-emerald-500 text-black shadow-lg'
                                : 'text-muted hover:text-white'}"
                            onclick={() => (newTransaction.type = "income")}
                            >Income</button
                        >
                        <button
                            class="flex-1 py-3 rounded-lg font-bold text-sm transition-all {newTransaction.type ===
                            'expense'
                                ? 'bg-red-500 text-black shadow-lg'
                                : 'text-muted hover:text-white'}"
                            onclick={() => (newTransaction.type = "expense")}
                            >Expense</button
                        >
                    </div>

                    <input
                        type="number"
                        bind:value={newTransaction.amount}
                        placeholder="₹0"
                        class="w-full bg-transparent border-b border-line p-4 text-4xl font-bold text-white text-center focus:border-primary outline-none"
                    />

                    <input
                        type="text"
                        bind:value={newTransaction.title}
                        placeholder="What was this for?"
                        class="input w-full p-4"
                    />

                    <button
                        class="btn btn-primary w-full py-4 text-lg"
                        onclick={handleAddTransaction}
                    >
                        Save Transaction
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <div class="module-header">
        <h1 class="text-3xl font-light text-white tracking-wide">Finance</h1>
        <button
            onclick={() => (showAddModal = true)}
            class="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Balance Card -->
    <div
        class="card-subtle relative overflow-hidden bg-gradient-to-br from-surface to-background"
    >
        <div
            class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        ></div>

        <span
            class="text-xs text-gray-500 uppercase tracking-widest font-medium"
            >Total Balance</span
        >
        <div class="text-4xl font-bold text-white mt-1 tracking-tight">
            {formatCurrency(financeStore.balance)}
        </div>

        <div class="mt-8 flex gap-4">
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <div
                        class="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"
                    >
                        <ArrowUpRight size={10} />
                    </div>
                    <span class="text-xs text-muted">Income</span>
                </div>
                <div class="text-lg font-bold text-white">
                    {formatCurrency(financeStore.income)}
                </div>
            </div>
            <div class="w-px bg-line"></div>
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <div
                        class="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-500"
                    >
                        <ArrowDownRight size={10} />
                    </div>
                    <span class="text-xs text-muted">Spent</span>
                </div>
                <div class="text-lg font-bold text-white">
                    {formatCurrency(financeStore.expense)}
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Actions / Mini Dashboard -->
    <div class="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <!-- Budgets -->
        {#if financeStore.budgets.length > 0}
            <div
                class="min-w-[140px] flex flex-col justify-between h-32 card-subtle"
            >
                <div
                    class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-2"
                >
                    <PiggyBank size={16} />
                </div>
                <div>
                    <p class="text-xs text-muted">Budgets</p>
                    <p class="text-sm font-bold text-white truncate">
                        {financeStore.budgets[0].category}
                    </p>
                    <div
                        class="h-1 w-full bg-line rounded-full mt-2 overflow-hidden"
                    >
                        <div
                            class="h-full bg-orange-500"
                            style="width: {Math.min(
                                (financeStore.budgets[0].spent /
                                    financeStore.budgets[0].amount) *
                                    100,
                                100,
                            )}%"
                        ></div>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Goals -->
        {#if financeStore.goals.length > 0}
            <div
                class="min-w-[140px] flex flex-col justify-between h-32 card-subtle"
            >
                <div
                    class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2"
                >
                    <Target size={16} />
                </div>
                <div>
                    <p class="text-xs text-muted">Goal</p>
                    <p class="text-sm font-bold text-white truncate">
                        {financeStore.goals[0].name}
                    </p>
                    <p class="text-[10px] text-muted mt-1">
                        {formatCurrency(financeStore.goals[0].currentAmount)}
                    </p>
                </div>
            </div>
        {/if}

        <!-- Investments -->
        <div
            class="min-w-[140px] flex flex-col justify-between h-32 card-subtle"
        >
            <div
                class="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-2"
            >
                <Briefcase size={16} />
            </div>
            <div>
                <p class="text-xs text-muted">Investments</p>
                <p class="text-sm font-bold text-white">
                    {formatCurrency(financeStore.totalInvestmentValue)}
                </p>
                <p class="text-[10px] text-emerald-500 mt-1">+12%</p>
            </div>
        </div>
    </div>

    <!-- Transactions -->
    <div class="space-y-4">
        <h3 class="text-lg font-bold text-white">Recent Activity</h3>
        <div class="space-y-3">
            {#each financeStore.transactions as t}
                <div class="card-subtle flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-10 h-10 rounded-full bg-background flex items-center justify-center {t.type ===
                            'income'
                                ? 'text-emerald-500'
                                : 'text-white'}"
                        >
                            {#if t.type === "income"}
                                <ArrowUpRight size={18} />
                            {:else}
                                <ArrowDownRight size={18} />
                            {/if}
                        </div>
                        <div>
                            <p class="font-bold text-white text-sm">
                                {t.title}
                            </p>
                            <p class="text-xs text-muted">
                                {formatDate(t.date)}
                            </p>
                        </div>
                    </div>
                    <span
                        class="font-bold {t.type === 'income'
                            ? 'text-emerald-500'
                            : 'text-white'}"
                    >
                        {t.type === "income" ? "+" : "-"}{formatCurrency(
                            t.amount,
                        )}
                    </span>
                </div>
            {/each}
        </div>
    </div>
</div>
