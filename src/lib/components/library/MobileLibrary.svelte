<script>
    import { Book, Plus, Star } from "lucide-svelte";
    import { libraryStore } from "$lib/stores/library.svelte";
</script>

<div class="space-y-6 pb-20">
    <div class="flex items-center justify-between">
        <h1 class="text-3xl font-light text-white">Library</h1>
        <button
            class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={24} />
        </button>
    </div>

    <!-- Currently Reading -->
    <div>
        <h3 class="text-sm text-gray-500 uppercase tracking-widest mb-3">
            Reading
        </h3>
        <div class="space-y-4">
            {#each libraryStore.reading as book}
                <div
                    class="p-4 rounded-2xl bg-[#0A0A0A] border border-neutral-900 flex gap-4"
                >
                    <div
                        class="w-20 aspect-[2/3] bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-500 border border-blue-900/30"
                    >
                        <Book size={24} />
                    </div>
                    <div class="flex-1 flex flex-col justify-center">
                        <h4 class="font-bold text-white">{book.title}</h4>
                        <p class="text-xs text-gray-500 mb-3">{book.author}</p>
                        <div
                            class="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden"
                        >
                            <div
                                class="h-full bg-white w-[{book.progress}%]"
                                style="width: {book.progress}%"
                            ></div>
                        </div>
                        <span class="text-xs text-gray-400 mt-1"
                            >{book.progress}% Complete</span
                        >
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- List -->
    <div>
        <h3 class="text-sm text-gray-500 uppercase tracking-widest mb-3">
            All Books
        </h3>
        <div class="grid grid-cols-2 gap-4">
            {#each libraryStore.books as book}
                <div
                    class="p-3 rounded-xl bg-[#0A0A0A] border border-neutral-900"
                >
                    <div
                        class="aspect-[2/3] rounded-lg bg-neutral-800/50 mb-3 flex items-center justify-center text-gray-600"
                    >
                        <Book size={20} />
                    </div>
                    <h4 class="font-medium text-white text-sm line-clamp-1">
                        {book.title}
                    </h4>
                    <p class="text-xs text-gray-500">{book.author}</p>
                </div>
            {/each}
            <button
                class="aspect-[2/3] rounded-xl border border-dashed border-neutral-800 flex items-center justify-center text-gray-600"
            >
                <Plus size={24} />
            </button>
        </div>
    </div>
</div>
