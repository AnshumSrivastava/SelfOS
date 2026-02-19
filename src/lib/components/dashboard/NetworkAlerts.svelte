<script lang="ts">
    import { connections } from "$lib/stores/connections.svelte";
    import { Users, Bell, ArrowRight, MessageSquare } from "lucide-svelte";
    import { fade, slide } from "svelte/transition";

    const neglected = $derived(connections.neglectedConnections.slice(0, 3));
</script>

<div class="space-y-4">
    <div class="flex items-center gap-2 px-1">
        <Users size={14} class="text-primary/60" />
        <h3
            class="text-[10px] font-black text-muted uppercase tracking-[0.2em]"
        >
            Network Horizon
        </h3>
    </div>

    <div class="space-y-3">
        {#each neglected as contact}
            <div
                class="p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group"
            >
                <div class="flex items-center justify-between mb-2">
                    <span
                        class="text-sm font-bold text-white group-hover:text-primary transition-colors"
                        >{contact.name}</span
                    >
                    <span
                        class="text-[9px] font-black uppercase tracking-[0.1em] text-primary/40"
                        >Drift Detected</span
                    >
                </div>
                <div class="flex items-center justify-between">
                    <p class="text-[10px] text-muted font-medium">
                        {contact.relationshipGoals || "Maintain connection"}
                    </p>
                    <button
                        onclick={() => connections.logContact(contact.id)}
                        class="p-2 rounded-xl bg-white/5 text-muted hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                        <MessageSquare size={14} />
                    </button>
                </div>
            </div>
        {/each}

        {#if neglected.length === 0}
            <div
                class="p-6 rounded-3xl border border-dashed border-white/5 text-center"
            >
                <p
                    class="text-[9px] font-black text-muted/30 uppercase tracking-widest"
                >
                    Village Calibrated
                </p>
            </div>
        {/if}
    </div>
</div>
