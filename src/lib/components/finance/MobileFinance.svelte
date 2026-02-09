<script lang="ts">
    import { ArrowUpRight, ArrowDownRight, Plus } from "lucide-svelte";
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
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
    }
</script>

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Finance</h1>
        <button
            onclick={() => financeStore.add("New Expense", 100, "expense")}
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Balance Card -->
    <div class="p-6 rounded-3xl bg-neutral-900 border border-neutral-800">
        <span class="text-sm text-gray-500 uppercase tracking-wider"
            >Total Balance</span
        >
        <div class="text-4xl font-bold text-white mt-2">
            {formatCurrency(financeStore.balance)}
        </div>
        <div class="mt-6 flex gap-4">
            <div
                class="flex-1 p-3 rounded-xl bg-black border border-neutral-800 flex items-center gap-3"
            >
                <div
                    class="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-emerald-500"
                >
                    <ArrowUpRight size={16} />
                </div>
                <div>
                    <div class="text-xs text-gray-500">Income</div>
                    <div class="text-sm font-bold text-white">
                        {formatCurrency(financeStore.income)}
                    </div>
                </div>
            </div>
            <div
                class="flex-1 p-3 rounded-xl bg-black border border-neutral-800 flex items-center gap-3"
            >
                <div
                    class="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-red-500"
                >
                    <ArrowDownRight size={16} />
                </div>
                <div>
                    <div class="text-xs text-gray-500">Spent</div>
                    <div class="text-sm font-bold text-white">
                        {formatCurrency(financeStore.expense)}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Transactions -->
    <div class="space-y-4">
        <h3 class="text-lg font-medium text-white">Recent Activity</h3>
        <div class="space-y-2">
            {#each financeStore.transactions as t}
                <div
                    class="p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex items-center justify-between"
                >
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center {t.type ===
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
                            <p class="font-medium text-white">{t.title}</p>
                            <p class="text-xs text-gray-500">
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
