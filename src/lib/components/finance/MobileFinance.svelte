<script lang="ts">
    import MobileHeader from "$lib/components/mobile/MobileHeader.svelte";
    import FloatingActionButton from "$lib/components/mobile/FloatingActionButton.svelte";
    import {
        ArrowUpRight,
        ArrowDownRight,
        Target,
        PiggyBank,
        Briefcase,
        X,
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

<div class="page-container relative pb-24">
    <MobileHeader title="Finance" />

    <FloatingActionButton
        onclick={() => (showAddModal = true)}
        ariaLabel="Add Transaction"
    />

    {#if showAddModal}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="fixed inset-0 bg-black/80 z-[60] flex items-end sm:items-center justify-center backdrop-blur-sm"
            onclick={() => (showAddModal = false)}
        >
            <div
                class="card-subtle w-full rounded-t-[2rem] sm:rounded-2xl border-t border-line/20 p-8 space-y-6 shadow-2xl"
                onclick={(e) => e.stopPropagation()}
            >
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold text-white">
                        New Transaction
                    </h3>
                    <button
                        class="p-2 -mr-2 text-muted/50 hover:text-white"
                        onclick={() => (showAddModal = false)}
                        ><X size={20} /></button
                    >
                </div>

                <div class="space-y-5">
                    <div
                        class="flex gap-2 bg-black/20 p-1 rounded-2xl border border-white/5"
                    >
                        <button
                            class="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all {newTransaction.type ===
                            'income'
                                ? 'bg-emerald-500/20 text-emerald-400 shadow-inner'
                                : 'text-muted/60 hover:text-white'}"
                            onclick={() => (newTransaction.type = "income")}
                            >Income</button
                        >
                        <button
                            class="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all {newTransaction.type ===
                            'expense'
                                ? 'bg-red-500/20 text-red-400 shadow-inner'
                                : 'text-muted/60 hover:text-white'}"
                            onclick={() => (newTransaction.type = "expense")}
                            >Expense</button
                        >
                    </div>

                    <div class="relative">
                        <span
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-light text-muted"
                            >₹</span
                        >
                        <input
                            type="number"
                            bind:value={newTransaction.amount}
                            placeholder="0"
                            class="w-full bg-transparent border-b border-line/20 pb-2 pl-10 text-4xl font-light text-white focus:border-primary/50 outline-none"
                        />
                    </div>

                    <input
                        type="text"
                        bind:value={newTransaction.title}
                        placeholder="Description"
                        class="w-full bg-transparent border-b border-line/20 py-3 text-lg font-light text-white focus:border-primary/50 outline-none placeholder:text-muted/30"
                    />

                    <button
                        class="w-full py-4 rounded-2xl bg-primary text-black font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                        onclick={handleAddTransaction}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    {/if}

    <div class="px-6 space-y-8">
        <!-- Balance Card (Premium) -->
        <div
            class="relative overflow-hidden rounded-[24px] p-6 bg-gradient-to-br from-[#1a1a1a] to-black border border-white/5 shadow-2xl"
        >
            <div
                class="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"
            ></div>
            <div
                class="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] translate-y-1/3 -translate-x-1/3"
            ></div>

            <div class="relative z-10 flex flex-col justify-between h-40">
                <div class="flex justify-between items-start">
                    <span
                        class="text-[10px] font-black text-muted/60 uppercase tracking-[0.2em]"
                        >Total Balance</span
                    >
                    <div
                        class="w-8 h-5 rounded border border-white/10 bg-white/5 flex items-center justify-center"
                    >
                        <div class="w-4 h-3 bg-white/10 rounded-[2px]"></div>
                    </div>
                </div>

                <div>
                    <div
                        class="text-[2.5rem] leading-none font-light text-white tracking-tight"
                    >
                        {formatCurrency(financeStore.balance).replace("₹", "")}
                        <span class="text-lg text-muted/60 font-normal"
                            >INR</span
                        >
                    </div>
                </div>

                <div class="flex items-center gap-6 pt-2">
                    <div class="flex flex-col">
                        <span
                            class="text-[9px] text-muted/40 uppercase tracking-wider mb-0.5"
                            >Income</span
                        >
                        <div class="flex items-center gap-1.5 text-emerald-400">
                            <ArrowUpRight size={14} />
                            <span class="text-sm font-bold"
                                >{formatCurrency(financeStore.income)}</span
                            >
                        </div>
                    </div>
                    <div class="w-px h-6 bg-white/10"></div>
                    <div class="flex flex-col">
                        <span
                            class="text-[9px] text-muted/40 uppercase tracking-wider mb-0.5"
                            >Expense</span
                        >
                        <div class="flex items-center gap-1.5 text-red-400">
                            <ArrowDownRight size={14} />
                            <span class="text-sm font-bold"
                                >{formatCurrency(financeStore.expense)}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 gap-3">
            <div
                class="card-subtle p-4 flex flex-col justify-between aspect-[1.4]"
            >
                <div
                    class="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2"
                >
                    <Briefcase size={16} />
                </div>
                <div>
                    <span
                        class="text-[10px] text-muted uppercase tracking-wider font-bold"
                        >Investments</span
                    >
                    <div class="text-lg font-bold text-white mt-0.5">
                        {formatCurrency(financeStore.totalInvestmentValue)}
                    </div>
                </div>
            </div>

            {#if financeStore.budgets.length > 0}
                <div
                    class="card-subtle p-4 flex flex-col justify-between aspect-[1.4]"
                >
                    <div
                        class="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 mb-2"
                    >
                        <PiggyBank size={16} />
                    </div>
                    <div>
                        <span
                            class="text-[10px] text-muted uppercase tracking-wider font-bold mb-1 block"
                            >{financeStore.budgets[0].category}</span
                        >
                        <div
                            class="h-1 w-full bg-white/5 rounded-full overflow-hidden"
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
        </div>

        <!-- Transactions -->
        <div class="space-y-4">
            <h3
                class="text-[10px] font-black text-muted uppercase tracking-[0.2em] px-1"
            >
                Recent Activity
            </h3>
            <div class="space-y-1">
                {#each financeStore.transactions as t}
                    <div
                        class="group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 active:scale-[0.99] transition-all"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="w-10 h-10 rounded-full bg-surface/50 border border-white/5 flex items-center justify-center {t.type ===
                                'income'
                                    ? 'text-emerald-500'
                                    : 'text-white/60'}"
                            >
                                {#if t.type === "income"}
                                    <ArrowUpRight size={18} />
                                {:else}
                                    <ArrowDownRight size={18} />
                                {/if}
                            </div>
                            <div>
                                <p class="font-medium text-white text-sm">
                                    {t.title}
                                </p>
                                <p
                                    class="text-[10px] text-muted/60 font-medium"
                                >
                                    {formatDate(t.date)}
                                </p>
                            </div>
                        </div>
                        <span
                            class="font-bold text-sm {t.type === 'income'
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
</div>
