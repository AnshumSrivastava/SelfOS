<script lang="ts">
    type Particle = {
        id: number;
        x: number;
        y: number;
        color: string;
        size: number;
        angle: number;
        speed: number;
        tx?: number;
        ty?: number;
    };

    let particles = $state<Particle[]>([]);
    let nextId = 0;

    const colors = ["#f97316", "#ef4444", "#fbbf24", "#f59e0b", "#ffffff"];

    export function ignite(x: number, y: number) {
        const count = 30;
        const newParticles: Particle[] = [];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;
            newParticles.push({
                id: nextId++,
                x,
                y,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 6 + Math.random() * 6, // Slightly larger than original (4-10) -> (6-12)
                angle: 0, // Unused
                speed: 0, // Unused
                // Pre-calculate target offsets
                tx: Math.cos(angle) * speed,
                ty: Math.sin(angle) * speed - 50,
            });
        }

        // Add new particles to state
        particles = [...particles, ...newParticles];

        // Cleanup this specific batch after animation ends (1s)
        setTimeout(() => {
            // Remove the exact number of particles we added from the start of the array
            // detailed cleanup strategy: filter out particles that are older than 1s
            // OR just rely on a simple slice if we assume FIFO. Slice is safer for bulk.
            // Actually, better to just let them render and filter by ID or timestamp if we want precision,
            // but for visual effects, slicing the old ones is usually fine as long as we don't clear new ones.
            // Let's use a safer filter approach:
            const oldestIdToKeep = newParticles[0].id;
            // This logic is tricky if multiple ignites happen.
            // Simplest safe way: remove THESE specific particles after 1s.
            const idsToRemove = new Set(newParticles.map((p) => p.id));
            particles = particles.filter((p) => !idsToRemove.has(p.id));
        }, 1000);
    }
</script>

<div class="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
    {#each particles as p (p.id)}
        <div
            class="absolute rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)] fire-particle"
            style="
                left: {p.x}px;
                top: {p.y}px;
                width: {p.size}px;
                height: {p.size}px;
                background-color: {p.color};
                --tx: {p.tx}px;
                --ty: {p.ty}px;
            "
        ></div>
    {/each}
</div>

<style>
    @keyframes explode {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty)))
                scale(0);
            opacity: 0;
        }
    }

    .fire-particle {
        animation: explode 0.8s cubic-bezier(0, 0.9, 0.57, 1) forwards;
    }
</style>
