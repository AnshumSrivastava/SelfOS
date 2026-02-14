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

    <div class="flex-1 space-y-8">
        <div class="grid grid-cols-2 gap-4">
            <div
                class="p-4 rounded-2xl bg-surface/50 border border-line/50 space-y-2"
            >
                <span
                    class="text-[10px] font-bold text-muted uppercase tracking-[0.1em]"
                    >Available Capital</span
                >
                <div class="flex items-baseline gap-1">
                    <p class="text-xl font-bold text-white tracking-tight">
                        ${balance.toLocaleString()}
                    </p>
                    <TrendingUp size={12} class="text-emerald-400 opacity-50" />
                </div>
            </div>
            <div
                class="p-4 rounded-2xl bg-surface/50 border border-line/50 space-y-2"
            >
                <span
                    class="text-[10px] font-bold text-muted uppercase tracking-[0.1em]"
                    >Monthly Spend</span
                >
                <div class="flex items-baseline gap-1">
                    <p class="text-xl font-bold text-rose-400 tracking-tight">
                        ${monthlySpend.toLocaleString()}
                    </p>
                    <TrendingDown size={12} class="text-rose-400 opacity-50" />
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <span
                    class="text-[10px] font-bold text-muted uppercase tracking-[0.2em]"
                >
                    Repayment Schedule
                </span>
                {#if alerts.length > 0}
                    <span
                        class="text-[9px] font-bold text-rose-400 animate-pulse uppercase tracking-widest"
                        >Action Required</span
                    >
                {/if}
            </div>

            {#if alerts.length > 0}
                <div class="space-y-3">
                    {#each alerts as alert}
                        <div
                            class="group p-4 rounded-2xl bg-rose-400/5 border border-rose-400/10 hover:border-rose-400/30 transition-all flex flex-col gap-2"
                        >
                            <div
                                class="flex items-center justify-between min-w-0"
                            >
                                <div class="flex items-center gap-3">
                                    <CreditCard
                                        size={14}
                                        class="text-rose-400/60"
                                    />
                                    <span
                                        class="text-sm font-bold text-white truncate group-hover:text-rose-400 transition-colors"
                                        >{alert.title}</span
                                    >
                                </div>
                                <span class="text-sm font-bold text-rose-400"
                                    >${alert.amount}</span
                                >
                            </div>
                            <div
                                class="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted"
                            >
                                <span>Due: {alert.due_date || "ASAP"}</span>
                                <span
                                    class="bg-rose-400/10 text-rose-400 px-1.5 py-0.5 rounded border border-rose-400/10"
                                    >Priority</span
                                >
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div
                    class="p-6 rounded-2xl bg-surface/30 border border-dashed border-line text-center"
                >
                    <p
                        class="text-[10px] font-bold text-muted uppercase tracking-widest"
                    >
                        Timeline Clear
                    </p>
                    <p
                        class="text-[9px] text-muted/50 mt-1 uppercase tracking-tighter"
                    >
                        No upcoming dues detected
                    </p>
                </div>
            {/if}
        </div>
    </div>

    <div
        class="mt-8 pt-6 border-t border-line/50 flex items-center justify-between"
    >
        <div class="flex flex-col gap-1">
            <span
                class="text-[9px] font-bold text-muted uppercase tracking-[0.2em]"
                >Efficiency Rating</span
            >
            <span
                class="text-xs font-bold text-emerald-400 uppercase tracking-widest"
                >Optimal Range</span
            >
        </div>
        <button
            class="text-[10px] font-bold text-primary hover:text-white uppercase tracking-widest transition-colors py-1.5 px-3 border border-primary/20 rounded-lg bg-primary/5"
        >
            Full Audit
        </button>
    </div>
</div>
