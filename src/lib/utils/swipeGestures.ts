/**
 * Swipe Gesture Detection Utility
 * Provides Svelte action for detecting swipe gestures on touch devices
 */

export interface SwipeOptions {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number; // Minimum distance in pixels
    velocityThreshold?: number; // Minimum velocity
    preventScroll?: boolean; // Prevent default scroll behavior
}

interface TouchPoint {
    x: number;
    y: number;
    time: number;
}

const DEFAULT_THRESHOLD = 50; // pixels
const DEFAULT_VELOCITY_THRESHOLD = 0.3; // pixels per millisecond

/**
 * Svelte action for swipe gesture detection
 * Usage: <div use:swipe={{ onSwipeRight: handleSwipe }}>
 */
export function swipe(node: HTMLElement, options: SwipeOptions = {}) {
    const {
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown,
        threshold = DEFAULT_THRESHOLD,
        velocityThreshold = DEFAULT_VELOCITY_THRESHOLD,
        preventScroll = false,
    } = options;

    let touchStart: TouchPoint | null = null;
    let touchEnd: TouchPoint | null = null;

    function handleTouchStart(e: TouchEvent) {
        const touch = e.touches[0];
        touchStart = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now(),
        };
        touchEnd = null;
    }

    function handleTouchMove(e: TouchEvent) {
        if (!touchStart) return;

        const touch = e.touches[0];
        touchEnd = {
            x: touch.clientX,
            y: touch.clientY,
            time: Date.now(),
        };

        // Prevent scroll if configured
        if (preventScroll) {
            const deltaX = Math.abs(touchEnd.x - touchStart.x);
            const deltaY = Math.abs(touchEnd.y - touchStart.y);

            // If horizontal swipe is dominant, prevent vertical scroll
            if (deltaX > deltaY && deltaX > threshold / 2) {
                e.preventDefault();
            }
        }
    }

    function handleTouchEnd() {
        if (!touchStart || !touchEnd) {
            touchStart = null;
            touchEnd = null;
            return;
        }

        const deltaX = touchEnd.x - touchStart.x;
        const deltaY = touchEnd.y - touchStart.y;
        const deltaTime = touchEnd.time - touchStart.time;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        // Calculate velocity
        const velocityX = absX / deltaTime;
        const velocityY = absY / deltaTime;

        // Determine if swipe is valid
        const isHorizontalSwipe = absX > absY && absX > threshold;
        const isVerticalSwipe = absY > absX && absY > threshold;

        // Horizontal swipes
        if (isHorizontalSwipe && velocityX > velocityThreshold) {
            if (deltaX > 0 && onSwipeRight) {
                onSwipeRight();
            } else if (deltaX < 0 && onSwipeLeft) {
                onSwipeLeft();
            }
        }

        // Vertical swipes
        if (isVerticalSwipe && velocityY > velocityThreshold) {
            if (deltaY > 0 && onSwipeDown) {
                onSwipeDown();
            } else if (deltaY < 0 && onSwipeUp) {
                onSwipeUp();
            }
        }

        // Reset
        touchStart = null;
        touchEnd = null;
    }

    // Add event listeners
    node.addEventListener("touchstart", handleTouchStart, { passive: true });
    node.addEventListener("touchmove", handleTouchMove, { passive: !preventScroll });
    node.addEventListener("touchend", handleTouchEnd, { passive: true });

    return {
        destroy() {
            node.removeEventListener("touchstart", handleTouchStart);
            node.removeEventListener("touchmove", handleTouchMove);
            node.removeEventListener("touchend", handleTouchEnd);
        },
    };
}

/**
 * Helper function to add haptic feedback (vibration)
 */
export function hapticFeedback(pattern: number | number[] = 10) {
    if ("vibrate" in navigator) {
        navigator.vibrate(pattern);
    }
}
