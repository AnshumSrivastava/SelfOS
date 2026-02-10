<script lang="ts">
    import StatCard from "$lib/components/ui/StatCard.svelte";
    import { financeStore } from "$lib/stores/finance.svelte";
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
    } from "lucide-svelte";

    function formatCurrency(amount: number) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount);
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    let showAddModal = $state(false);
    let newTransaction = $state({
        title: "",
        amount: "",
        type: "expense" as "income" | "expense",
        category: "General",
        tags: "",
    });

    function handleAddTransaction() {
        if (!newTransaction.title || !newTransaction.amount) return;

        financeStore.addTransaction({
            title: newTransaction.title,
            amount: parseFloat(newTransaction.amount),
            type: newTransaction.type,
            category: newTransaction.category,
            tags: newTransaction.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            date: new Date().toISOString(),
        });

        // Reset
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

<div class="space-y-8 pb-12 relative">
    {#if showAddModal}
        <div
            class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
            <div
                class="card w-full max-w-md bg-[#1E1E1E] border border-white/10 p-6 shadow-2xl rounded-2xl"
            >
                <h3 class="text-xl font-bold mb-6 text-white">
                    Add Transaction
                </h3>
                <div class="space-y-4">
                    <div>
                        <label
                            class="text-xs text-gray-400 block mb-2 uppercase tracking-wider"
                            >Type</label
                        >
                        <div class="flex gap-2 p-1 bg-black/40 rounded-lg">
                            <button
                                class="flex-1 py-2 rounded-md font-medium text-sm transition-all {newTransaction.type ===
                                'income'
                                    ? 'bg-[#4CAF50] text-black shadow-lg'
                                    : 'text-gray-400 hover:text-white'}"
                                onclick={() => (newTransaction.type = "income")}
                                >Income</button
                            >
                            <button
                                class="flex-1 py-2 rounded-md font-medium text-sm transition-all {newTransaction.type ===
                                'expense'
                                    ? 'bg-[#FF5252] text-black shadow-lg'
                                    : 'text-gray-400 hover:text-white'}"
                                onclick={() =>
                                    (newTransaction.type = "expense")}
                                >Expense</button
                            >
                        </div>
                    </div>
                    <div>
                        <label
                            class="text-xs text-gray-400 block mb-2 uppercase tracking-wider"
                            >Details</label
                        >
                        <input
                            type="text"
                            bind:value={newTransaction.title}
                            placeholder="Title (e.g. Groceries)"
                            class="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-[#00BCD4]/50 outline-none mb-3 transition-colors"
                        />
                        <input
                            type="number"
                            bind:value={newTransaction.amount}
                            placeholder="Amount (e.g. 500)"
                            class="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-[#00BCD4]/50 outline-none transition-colors"
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                class="text-xs text-gray-400 block mb-2 uppercase tracking-wider"
                                >Category</label
                            >
                            <input
                                type="text"
                                bind:value={newTransaction.category}
                                placeholder="General"
                                class="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-[#00BCD4]/50 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label
                                class="text-xs text-gray-400 block mb-2 uppercase tracking-wider"
                                >Tags</label
                            >
                            <input
                                type="text"
                                bind:value={newTransaction.tags}
                                placeholder="comma, separated"
                                class="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-[#00BCD4]/50 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div class="flex gap-3 pt-6">
                        <button
                            class="flex-1 py-3 rounded-xl font-medium border border-white/10 hover:bg-white/5 transition-colors text-white"
                            onclick={() => (showAddModal = false)}
                            >Cancel</button
                        >
                        <button
                            class="flex-1 py-3 rounded-xl font-bold bg-[#00BCD4] text-black hover:bg-[#00BCD4]/90 transition-colors shadow-[0_0_20px_rgba(0,188,212,0.3)]"
                            onclick={handleAddTransaction}
                            >Save Transaction</button
                        >
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-4xl font-bold text-white mb-2 tracking-tight">
                Finance
            </h1>
            <p class="text-gray-400">Master your wealth and cashflow.</p>
        </div>

        <div class="flex gap-3">
            <button
                class="btn border border-white/10 text-white hover:bg-white/5 flex items-center gap-2 rounded-xl px-4 py-2"
            >
                <PieChart size={18} />
                <span class="hidden sm:inline">Reports</span>
            </button>
            <button
                onclick={() => (showAddModal = true)}
                class="btn bg-[#00BCD4] text-black hover:bg-[#00BCD4]/90 flex items-center gap-2 rounded-xl px-4 py-2 font-bold shadow-[0_0_20px_rgba(0,188,212,0.2)]"
            >
                <Plus size={18} /> Add Transaction
            </button>
        </div>
    </div>

    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <!-- Incoming Payments (Receiving) -->
        <div
            class="card p-6 rounded-2xl border border-white/5 bg-[#1E1E1E] relative overflow-hidden group"
        >
            <div
                class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
            >
                <ArrowUpRight size={64} />
            </div>
            <div class="relative z-10">
                <p
                    class="text-sm text-gray-400 font-medium uppercase tracking-wider mb-2 flex items-center gap-2"
                >
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Receiving
                    (Pending)
                </p>
                <div class="text-3xl font-bold text-white">
                    {formatCurrency(
                        financeStore.incomeReminders.reduce(
                            (acc, r) => acc + r.amount,
                            0,
                        ),
                    )}
                </div>
                <p class="text-xs text-gray-500 mt-2">
                    {financeStore.incomeReminders.length} payments expected
                </p>
                <!-- Quick List of expected payments -->
                {#if financeStore.incomeReminders.length > 0}
                    <div class="mt-4 space-y-2">
                        {#each financeStore.incomeReminders.slice(0, 2) as item}
                            <div class="flex justify-between text-xs">
                                <span class="text-gray-300">{item.title}</span>
                                <span class="text-emerald-500 font-bold"
                                    >{formatCurrency(item.amount)}</span
                                >
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Bills (Paying) -->
        <div
            class="card p-6 rounded-2xl border border-white/5 bg-[#1E1E1E] relative overflow-hidden group"
        >
            <div
                class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
            >
                <ArrowDownRight size={64} />
            </div>
            <div class="relative z-10">
                <p
                    class="text-sm text-gray-400 font-medium uppercase tracking-wider mb-2 flex items-center gap-2"
                >
                    <span class="w-2 h-2 rounded-full bg-red-500"></span> Bills Due
                </p>
                <div class="text-3xl font-bold text-white">
                    {formatCurrency(
                        financeStore.expenseReminders.reduce(
                            (acc, r) => acc + r.amount,
                            0,
                        ),
                    )}
                </div>
                <p class="text-xs text-gray-500 mt-2">
                    {financeStore.expenseReminders.length} bills due
                </p>
                <!-- Quick List of bills -->
                {#if financeStore.expenseReminders.length > 0}
                    <div class="mt-4 space-y-2">
                        {#each financeStore.expenseReminders.slice(0, 2) as item}
                            <div class="flex justify-between text-xs">
                                <span class="text-gray-300">{item.title}</span>
                                <span class="text-red-500 font-bold"
                                    >{formatCurrency(item.amount)}</span
                                >
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <!-- Monthly Summary (Income vs Expense Actuals) -->
        <div
            class="md:col-span-2 card p-6 rounded-2xl border border-white/5 bg-[#1E1E1E] flex flex-col justify-between"
        >
            <div>
                <p
                    class="text-sm text-gray-400 font-medium uppercase tracking-wider mb-4"
                >
                    Monthly Cash Flow
                </p>
                <div class="flex items-center gap-8">
                    <div>
                        <p class="text-xs text-gray-500 mb-1">Total Income</p>
                        <p class="text-2xl font-bold text-emerald-500">
                            {formatCurrency(financeStore.income)}
                        </p>
                    </div>
                    <div class="h-10 w-px bg-white/10"></div>
                    <div>
                        <p class="text-xs text-gray-500 mb-1">Total Spent</p>
                        <p class="text-2xl font-bold text-red-500">
                            {formatCurrency(financeStore.expense)}
                        </p>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <div class="flex justify-between text-xs mb-1">
                    <span>Savings Rate</span>
                    <span
                        >{financeStore.income > 0
                            ? (
                                  ((financeStore.income -
                                      financeStore.expense) /
                                      financeStore.income) *
                                  100
                              ).toFixed(0)
                            : 0}%</span
                    >
                </div>
                <div
                    class="h-1.5 w-full bg-black/40 rounded-full overflow-hidden"
                >
                    <div
                        class="h-full bg-emerald-500"
                        style="width: {financeStore.income > 0
                            ? Math.max(
                                  0,
                                  Math.min(
                                      ((financeStore.income -
                                          financeStore.expense) /
                                          financeStore.income) *
                                          100,
                                      100,
                                  ),
                              )
                            : 0}%"
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
                    class="card p-6 rounded-2xl border border-white/5 bg-[#1E1E1E]"
                >
                    <div class="flex items-center justify-between mb-6">
                        <h3
                            class="font-bold text-white flex items-center gap-2 text-lg"
                        >
                            <Briefcase size={20} class="text-[#00BCD4]" /> Portfolio
                        </h3>
                        <span class="text-[#00BCD4] font-bold text-lg"
                            >{formatCurrency(
                                financeStore.totalInvestmentValue,
                            )}</span
                        >
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {#each financeStore.investments as inv}
                            <div
                                class="p-4 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between hover:border-[#00BCD4]/30 transition-colors"
                            >
                                <div>
                                    <p class="font-bold text-white">
                                        {inv.name}
                                    </p>
                                    <p
                                        class="text-xs text-gray-500 capitalize mt-1"
                                    >
                                        {inv.type}
                                    </p>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-white">
                                        {formatCurrency(inv.currentValue)}
                                    </p>
                                    <p
                                        class="text-xs {inv.currentValue >=
                                        inv.amountInvested
                                            ? 'text-[#4CAF50]'
                                            : 'text-[#FF5252]'} font-mono mt-1"
                                    >
                                        {inv.currentValue >= inv.amountInvested
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
                class="card p-6 rounded-2xl border border-white/5 bg-[#1E1E1E]"
            >
                <h3 class="font-bold text-white mb-6 text-lg">
                    Recent Activity
                </h3>
                <div class="space-y-2">
                    {#each financeStore.transactions as t}
                        <div
                            class="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                        >
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-12 h-12 rounded-2xl flex items-center justify-center {t.type ===
                                    'income'
                                        ? 'bg-[#4CAF50]/10 text-[#4CAF50]'
                                        : 'bg-[#FF5252]/10 text-[#FF5252]'}"
                                >
                                    {#if t.type === "income"}
                                        <ArrowUpRight
                                            size={20}
                                            strokeWidth={2.5}
                                        />
                                    {:else}
                                        <ArrowDownRight
                                            size={20}
                                            strokeWidth={2.5}
                                        />
                                    {/if}
                                </div>
                                <div>
                                    <p
                                        class="font-bold text-white text-base group-hover:text-[#00BCD4] transition-colors"
                                    >
                                        {t.title}
                                    </p>
                                    <div
                                        class="flex items-center gap-3 text-xs text-gray-500 mt-1"
                                    >
                                        <span>{formatDate(t.date)}</span>
                                        <span
                                            class="w-1 h-1 rounded-full bg-gray-600"
                                        ></span>
                                        <span
                                            class="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 flex items-center gap-1"
                                        >
                                            {t.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-6">
                                <span
                                    class="font-bold text-lg {t.type ===
                                    'income'
                                        ? 'text-[#4CAF50]'
                                        : 'text-white'}"
                                >
                                    {t.type === "income"
                                        ? "+"
                                        : "-"}{formatCurrency(t.amount)}
                                </span>
                                <button
                                    class="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-[#FF5252] transition-colors p-2 hover:bg-[#FF5252]/10 rounded-lg"
                                    onclick={() =>
                                        financeStore.removeTransaction(t.id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    {/each}
                    {#if financeStore.transactions.length === 0}
                        <div class="text-center py-12 text-gray-500">
                            No transactions yet. <button
                                class="text-[#00BCD4] hover:underline"
                                onclick={() => (showAddModal = true)}
                                >Add one</button
                            >
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <!-- Sidebar: Budgets, Goals, Reminders -->
        <div class="space-y-6">
            <!-- Budgets -->
            <div
                class="card p-6 rounded-2xl border border-white/5 bg-[#1E1E1E]"
            >
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-bold text-white text-lg">Budgets</h3>
                    <button
                        class="text-xs text-[#00BCD4] font-medium hover:text-[#00BCD4]/80 transition-colors uppercase tracking-wider"
                        >Manage</button
                    >
                </div>

                <div class="space-y-6">
                    {#each financeStore.budgets as budget}
                        <div>
                            <div
                                class="flex justify-between text-sm mb-2 font-medium"
                            >
                                <span class="text-gray-300"
                                    >{budget.category}</span
                                >
                                <span class="text-gray-500"
                                    >{formatCurrency(budget.spent)}
                                    <span class="text-gray-600">/</span>
                                    {formatCurrency(budget.amount)}</span
                                >
                            </div>
                            <div
                                class="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5"
                            >
                                <div
                                    class="h-full rounded-full transition-all duration-1000 ease-out relative"
                                    style="width: {Math.min(
                                        (budget.spent / budget.amount) * 100,
                                        100,
                                    )}%; background-color: {budget.color}"
                                >
                                    <div
                                        class="absolute inset-0 bg-white/20"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    {/each}
                    {#if financeStore.budgets.length === 0}
                        <div class="text-center py-4 text-sm text-gray-500">
                            No budgets set.
                        </div>
                    {/if}
                </div>
            </div>

            <!-- Savings Goals -->
            {#each financeStore.goals as goal}
                <div
                    class="card p-6 rounded-2xl border border-white/5 bg-[#1E1E1E] relative overflow-hidden group"
                >
                    <div
                        class="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity"
                    >
                        <Target size={100} />
                    </div>

                    <div class="flex items-start justify-between relative z-10">
                        <div>
                            <h3 class="text-[#00BCD4] font-bold text-lg">
                                {goal.name}
                            </h3>
                            <p class="text-sm text-gray-400">
                                Target: {formatCurrency(goal.targetAmount)}
                            </p>
                        </div>
                        <div
                            class="bg-[#00BCD4]/10 p-2 rounded-xl text-[#00BCD4]"
                        >
                            <Target size={24} />
                        </div>
                    </div>
                    <div class="mt-8 relative z-10">
                        <div class="flex items-end gap-1 mb-2">
                            <span class="text-3xl font-bold text-white"
                                >{formatCurrency(goal.currentAmount)}</span
                            >
                            <span
                                class="text-sm text-gray-500 mb-1.5 font-medium"
                                >/ 100%</span
                            >
                        </div>
                        <div
                            class="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5"
                        >
                            <div
                                class="h-full bg-[#00BCD4] w-[60%] rounded-full shadow-[0_0_15px_rgba(0,188,212,0.4)] transition-all duration-1000 ease-out"
                                style="width: {Math.min(
                                    (goal.currentAmount / goal.targetAmount) *
                                        100,
                                    100,
                                )}%"
                            ></div>
                        </div>
                        <div class="flex justify-between mt-6 gap-2">
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
                    {#if financeStore.reminders && financeStore.reminders.length > 0}
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
                                        {new Date(
                                            reminder.dueDate,
                                        ).toLocaleDateString()}
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
</div>
