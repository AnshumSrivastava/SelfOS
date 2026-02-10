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

<div class="space-y-6 pb-24 relative">
    {#if showAddModal}
        <div
            class="fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm"
        >
            <div
                class="w-full bg-[#1E1E1E] rounded-t-3xl sm:rounded-2xl p-6 border-t border-white/10 animate-in slide-in-from-bottom duration-200"
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
                    <div class="flex gap-3 bg-black/40 p-1.5 rounded-xl">
                        <button
                            class="flex-1 py-3 rounded-lg font-bold text-sm transition-all {newTransaction.type ===
                            'income'
                                ? 'bg-[#4CAF50] text-black shadow-lg'
                                : 'text-gray-400'}"
                            onclick={() => (newTransaction.type = "income")}
                            >Income</button
                        >
                        <button
                            class="flex-1 py-3 rounded-lg font-bold text-sm transition-all {newTransaction.type ===
                            'expense'
                                ? 'bg-[#FF5252] text-black shadow-lg'
                                : 'text-gray-400'}"
                            onclick={() => (newTransaction.type = "expense")}
                            >Expense</button
                        >
                    </div>

                    <input
                        type="number"
                        bind:value={newTransaction.amount}
                        placeholder="₹0"
                        class="w-full bg-transparent border-b border-white/10 p-4 text-4xl font-bold text-white text-center focus:border-[#00BCD4] outline-none"
                    />

                    <input
                        type="text"
                        bind:value={newTransaction.title}
                        placeholder="What was this for?"
                        class="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-[#00BCD4] outline-none"
                    />

                    <button
                        class="w-full py-4 rounded-xl font-bold bg-[#00BCD4] text-black shadow-lg shadow-[#00BCD4]/20 active:scale-95 transition-transform"
                        onclick={handleAddTransaction}
                    >
                        Save Transaction
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white tracking-wide">Finance</h1>
        <button
            onclick={() => (showAddModal = true)}
            class="w-10 h-10 rounded-full bg-[#00BCD4] text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,188,212,0.4)] active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Balance Card -->
    <div
        class="p-6 rounded-3xl bg-gradient-to-br from-[#1E1E1E] to-black border border-white/5 shadow-2xl relative overflow-hidden"
    >
        <div
            class="absolute top-0 right-0 w-32 h-32 bg-[#00BCD4]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
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
                        class="w-4 h-4 rounded-full bg-[#4CAF50]/20 flex items-center justify-center text-[#4CAF50]"
                    >
                        <ArrowUpRight size={10} />
                    </div>
                    <span class="text-xs text-gray-400">Income</span>
                </div>
                <div class="text-lg font-bold text-white">
                    {formatCurrency(financeStore.income)}
                </div>
            </div>
            <div class="w-px bg-white/10"></div>
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <div
                        class="w-4 h-4 rounded-full bg-[#FF5252]/20 flex items-center justify-center text-[#FF5252]"
                    >
                        <ArrowDownRight size={10} />
                    </div>
                    <span class="text-xs text-gray-400">Spent</span>
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
                class="min-w-[140px] p-4 rounded-2xl bg-[#1E1E1E] border border-white/5 flex flex-col justify-between h-32"
            >
                <div
                    class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-2"
                >
                    <PiggyBank size={16} />
                </div>
                <div>
                    <p class="text-xs text-gray-400">Budgets</p>
                    <p class="text-sm font-bold text-white truncate">
                        {financeStore.budgets[0].category}
                    </p>
                    <div
                        class="h-1 w-full bg-white/10 rounded-full mt-2 overflow-hidden"
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
                class="min-w-[140px] p-4 rounded-2xl bg-[#1E1E1E] border border-white/5 flex flex-col justify-between h-32"
            >
                <div
                    class="w-8 h-8 rounded-full bg-[#00BCD4]/10 flex items-center justify-center text-[#00BCD4] mb-2"
                >
                    <Target size={16} />
                </div>
                <div>
                    <p class="text-xs text-gray-400">Goal</p>
                    <p class="text-sm font-bold text-white truncate">
                        {financeStore.goals[0].name}
                    </p>
                    <p class="text-[10px] text-gray-500 mt-1">
                        {formatCurrency(financeStore.goals[0].currentAmount)}
                    </p>
                </div>
            </div>
        {/if}

        <!-- Investments -->
        <div
            class="min-w-[140px] p-4 rounded-2xl bg-[#1E1E1E] border border-white/5 flex flex-col justify-between h-32"
        >
            <div
                class="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-2"
            >
                <Briefcase size={16} />
            </div>
            <div>
                <p class="text-xs text-gray-400">Investments</p>
                <p class="text-sm font-bold text-white">
                    {formatCurrency(financeStore.totalInvestmentValue)}
                </p>
                <p class="text-[10px] text-green-500 mt-1">+12%</p>
            </div>
        </div>
    </div>

    <!-- Transactions -->
    <div class="space-y-4">
        <h3 class="text-lg font-bold text-white">Recent Activity</h3>
        <div class="space-y-3">
            {#each financeStore.transactions as t}
                <div
                    class="p-4 rounded-2xl bg-[#1E1E1E] border border-neutral-800 flex items-center justify-between"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="w-10 h-10 rounded-full bg-black flex items-center justify-center {t.type ===
                            'income'
                                ? 'text-[#4CAF50]'
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
                            <p class="text-xs text-gray-500">
                                {formatDate(t.date)}
                            </p>
                        </div>
                    </div>
                    <span
                        class="font-bold {t.type === 'income'
                            ? 'text-[#4CAF50]'
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
