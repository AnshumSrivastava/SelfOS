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
            hour: "2-digit",
            minute: "2-digit",
        });
    }
</script>

<div class="space-y-8 pb-12">
    <div class="flex items-end justify-between">
        <div>
            <h1 class="text-3xl font-bold text-white mb-2">Finance OS</h1>
            <p class="text-muted">Track your wealth and manage expenses.</p>
        </div>

        <div class="flex gap-3">
            <button
                class="btn border border-line text-white hover:bg-surface flex items-center gap-2"
            >
                <PieChart size={18} /> Reports
            </button>
            <button
                onclick={() => financeStore.add("New Expense", 150, "expense")}
                class="btn btn-primary flex items-center gap-2"
            >
                <Plus size={18} /> Add Transaction
            </button>
        </div>
    </div>

    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
            title="Total Balance"
            value={formatCurrency(financeStore.balance)}
            icon={Wallet}
            trend={12.5}
            subtext="Across all accounts"
        />
        <StatCard
            title="Income (Oct)"
            value={formatCurrency(financeStore.income)}
            icon={TrendingUp}
            trend={5.2}
            color="primary"
        />
        <StatCard
            title="Expenses (Oct)"
            value={formatCurrency(financeStore.expense)}
            icon={TrendingDown}
            trend={-2.4}
            color="secondary"
        />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Transactions List -->
        <div class="lg:col-span-2 card">
            <h3 class="font-bold text-white mb-6">Recent Transactions</h3>
            <div class="space-y-4">
                {#each financeStore.transactions as t}
                    <div
                        class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                        <div class="flex items-center gap-4">
                            <div
                                class="w-10 h-10 rounded-full flex items-center justify-center {t.type ===
                                'income'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-secondary/10 text-secondary'}"
                            >
                                {#if t.type === "income"}
                                    <ArrowUpRight size={20} />
                                {:else}
                                    <ArrowDownRight size={20} />
                                {/if}
                            </div>
                            <div>
                                <p
                                    class="font-medium text-white group-hover:text-primary transition-colors"
                                >
                                    {t.title}
                                </p>
                                <div
                                    class="flex items-center gap-2 text-xs text-muted"
                                >
                                    <span>{formatDate(t.date)}</span>
                                    <span class="w-1 h-1 rounded-full bg-line"
                                    ></span>
                                    <span>General</span>
                                </div>
                            </div>
                        </div>
                        <span
                            class="font-bold {t.type === 'income'
                                ? 'text-primary'
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

        <!-- Budgets / subscriptions -->
        <div class="space-y-6">
            <div class="card">
                <h3 class="font-bold text-white mb-4">Monthly Budgets</h3>
                <div class="space-y-6">
                    <div>
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-white">Food & Dining</span>
                            <span class="text-muted">₹450 / ₹600</span>
                        </div>
                        <div
                            class="h-1.5 w-full bg-surface rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-yellow-500 w-[75%] rounded-full"
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-white">Entertainment</span>
                            <span class="text-muted">₹80 / ₹100</span>
                        </div>
                        <div
                            class="h-1.5 w-full bg-surface rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-primary w-[80%] rounded-full"
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm mb-2">
                            <span class="text-white">Transport</span>
                            <span class="text-muted">₹120 / ₹200</span>
                        </div>
                        <div
                            class="h-1.5 w-full bg-surface rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-secondary w-[60%] rounded-full"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card bg-surface border-secondary/20">
                <div class="flex items-start justify-between">
                    <div>
                        <h3 class="text-secondary font-bold text-lg">
                            Savings Goal
                        </h3>
                        <p class="text-sm text-muted">New Laptop</p>
                    </div>
                    <div class="bg-secondary/10 p-2 rounded-lg text-secondary">
                        <IndianRupee size={20} />
                    </div>
                </div>
                <div class="mt-6">
                    <div class="flex items-end gap-1 mb-2">
                        <span class="text-2xl font-bold text-white">₹1,500</span
                        >
                        <span class="text-sm text-muted mb-1">/ ₹2,500</span>
                    </div>
                    <div
                        class="h-2 w-full bg-background rounded-full overflow-hidden"
                    >
                        <div
                            class="h-full bg-secondary w-[60%] rounded-full shadow-[0_0_10px_rgba(0,188,212,0.5)]"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
