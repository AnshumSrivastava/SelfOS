/**
 * Simple swipe detection action for Svelte
 */
export function swipe(node: HTMLElement, options: { onSwipeLeft?: () => void, onSwipeRight?: () => void, threshold?: number } = {}) {
    let startX: number;
    let startY: number;
    const threshold = options.threshold || 50;
    const verticalThreshold = 100; // Prevent swipe if vertical move is too large

    function handleTouchStart(e: TouchEvent) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }

    function handleTouchEnd(e: TouchEvent) {
        if (!startX || !startY) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = endX - startX;
        const diffY = endY - startY;

        // Ensure horizontal move is bigger than vertical move and exceeds threshold
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffY) < verticalThreshold) {
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0 && options.onSwipeRight) {
                    options.onSwipeRight();
                } else if (diffX < 0 && options.onSwipeLeft) {
                    options.onSwipeLeft();
                }
            }
        }

        startX = 0;
        startY = 0;
    }

    node.addEventListener('touchstart', handleTouchStart, { passive: true });
    node.addEventListener('touchend', handleTouchEnd, { passive: true });

    return {
        destroy() {
            node.removeEventListener('touchstart', handleTouchStart);
            node.removeEventListener('touchend', handleTouchEnd);
        }
    };
}
