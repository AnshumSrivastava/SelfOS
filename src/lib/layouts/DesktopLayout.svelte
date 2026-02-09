<script>
    import Sidebar from "$lib/components/layout/Sidebar.svelte";
    import Header from "$lib/components/layout/Header.svelte";
    let { children } = $props();
</script>

<div
    class="flex min-h-screen bg-background text-text font-sans selection:bg-primary selection:text-black overflow-hidden"
>
    <Sidebar />
    <div
        class="flex-1 flex flex-col ml-64 relative transition-all duration-300"
    >
        <Header />
        <main class="flex-1 overflow-y-auto p-8 relative scroll-smooth">
            <div
                class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden"
            >
                <div
                    class="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]"
                ></div>
                <div
                    class="absolute top-[40%] left-[10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px]"
                ></div>
            </div>
            <div class="relative z-10 max-w-7xl mx-auto w-full animate-fade-in">
                {@render children()}
            </div>
        </main>
    </div>
</div>
