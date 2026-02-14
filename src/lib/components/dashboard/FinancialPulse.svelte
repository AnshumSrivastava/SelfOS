<script lang="ts">
    import {
        Wallet,
        AlertCircle,
        TrendingDown,
        TrendingUp,
        CreditCard,
    } from "lucide-svelte";
    import { financeStore } from "$lib/stores/finance.svelte";
    import { dashboardStore } from "$lib/stores/dashboard.svelte";
    import { fade } from "svelte/transition";

    const alerts = $derived(dashboardStore.financeAlerts);
    const balance = $derived(financeStore.balance);
    const monthlySpend = $derived(
        financeStore.transactions
            .filter(
                (t) =>
                    t.type === "expense" &&
                    t.date.startsWith(new Date().toISOString().slice(0, 7)),
            )
            .reduce((sum, t) => sum + t.amount, 0),
    );
</script>

<div class="card-subtle p-6 flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-blue-400/10 text-blue-400">
                <Wallet size={20} />
            </div>
            <h2 class="text-xl font-semibold text-white">Financial Pulse</h2>
        </div>
    </div>

    <div class="flex-1 space-y-6">
        <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
                <span
                    class="text-[10px] font-bold text-muted uppercase tracking-widest"
                    >Net Worth</span
                >
                <p class="text-lg font-bold text-white tracking-tight">
                    ${balance.toLocaleString()}
                </p>
            </div>
            <div class="space-y-1">
                <span
                    class="text-[10px] font-bold text-muted uppercase tracking-widest"
                    >MTD Spend</span
                >
                <p class="text-lg font-bold text-rose-400 tracking-tight">
                    ${monthlySpend.toLocaleString()}
                </p>
            </div>
        </div>

        {#if alerts.length > 0}
            <div class="space-y-3">
                <span
                    class="text-[10px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5"
                >
                    <AlertCircle size={12} />
                    Upcoming Dues
                </span>
                <div class="space-y-2">
                    {#each alerts as alert}
                        <div
                            class="flex items-center justify-between p-3 rounded-xl bg-rose-400/5 border border-rose-400/20"
                        >
                            <div class="flex items-center gap-3 min-w-0">
                                <CreditCard
                                    size={14}
                                    class="text-rose-400 shrink-0"
                                />
                                <span
                                    class="text-xs font-semibold text-white truncate"
                                    >{alert.title}</span
                                >
                            </div>
                            <span
                                class="text-xs font-bold text-rose-400 shrink-0"
                                >${alert.amount}</span
                            >
                        </div>
                    {/each}
                </div>
            </div>
        {:else}
            <div
                class="p-4 rounded-2xl bg-surface border border-dashed border-line text-center"
            >
                <p
                    class="text-[10px] font-bold text-muted uppercase tracking-widest"
                >
                    No immediate dues
                </p>
            </div>
        {/if}
    </div>

    <div
        class="mt-6 pt-4 border-t border-line flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-widest"
    >
        <span>Burn Rate</span>
        <span class="text-emerald-400">Optimal</span>
    </div>
</div>
