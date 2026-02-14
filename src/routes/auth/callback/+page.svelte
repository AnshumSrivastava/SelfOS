<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { supabase } from "$lib/supabaseClient";

    onMount(async () => {
        const {
            data: { session },
            error,
        } = await supabase.auth.getSession();

        if (session) {
            goto(`${base}/`, { replaceState: true });
        } else if (error) {
            console.error("Auth callback error:", error);
            goto(`${base}/login?error=auth_callback_failed`, {
                replaceState: true,
            });
        } else {
            // No session, maybe check for hash/code or just wait for onAuthStateChange
            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((event, session) => {
                if (session) {
                    subscription.unsubscribe();
                    goto(`${base}/`, { replaceState: true });
                }
            });
        }
    });
</script>

<div
    class="min-h-screen bg-background flex flex-col items-center justify-center p-4"
>
    <div
        class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"
    ></div>
    <p class="text-white font-medium">Finalizing authentication...</p>
</div>
