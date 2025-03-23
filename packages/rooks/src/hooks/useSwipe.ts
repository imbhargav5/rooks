import { useRef, useState, useCallback, useEffect } from "react";

export type SwipeDirection = "left" | "right" | "up" | "down" | null;

export type SwipeState = {
    swiping: boolean;
    direction: SwipeDirection;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    distanceX: number;
    distanceY: number;
};

export type SwipeHandlerOptions = {
    threshold?: number;
    onSwipeStart?: (state: SwipeState) => void;
    onSwipe?: (state: SwipeState) => void;
    onSwipeEnd?: (state: SwipeState) => void;
};

export type SwipeHandler = {
    ref: React.RefObject<HTMLElement | null>;
    state: SwipeState;
};

const initialState: SwipeState = {
    swiping: false,
    direction: null,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    distanceX: 0,
    distanceY: 0,
};

/**
 * useSwipe
 * @description A hook for tracking swipe gestures on touch devices
 * @param {SwipeHandlerOptions} options Configuration options for the swipe handler
 * @returns {SwipeHandler} An object containing ref to attach to the element and the current swipe state
 * @see {@link https://rooks.vercel.app/docs/useSwipe}
 *
 * @example
 *
 * const { ref, state } = useSwipe({
 *   threshold: 50,
 *   onSwipeEnd: (state) => {
 *     if (state.direction === 'left') {
 *       console.log('Swiped left!');
 *     }
 *   }
 * });
 * 
 * return (
 *   <div ref={ref} style={{ width: 300, height: 200, background: 'lightblue' }}>
 *     {state.swiping ? `Swiping ${state.direction}` : 'Swipe me'}
 *   </div>
 * );
 */
function useSwipe(options: SwipeHandlerOptions = {}): SwipeHandler {
    const {
        threshold = 50,
        onSwipeStart,
        onSwipe,
        onSwipeEnd
    } = options;

    const ref = useRef<HTMLElement | null>(null);
    const [state, setState] = useState<SwipeState>(initialState);

    // Determine the swipe direction based on distances
    const getDirection = (distanceX: number, distanceY: number): SwipeDirection => {
        if (Math.abs(distanceX) > Math.abs(distanceY)) {
            return distanceX > 0 ? "right" : "left";
        } else {
            return distanceY > 0 ? "down" : "up";
        }
    };

    // Handle touch start event
    const handleTouchStart = useCallback((event: TouchEvent) => {
        if (!event.touches || event.touches.length === 0) return;

        const touchEvent = event.touches[0];
        if (!touchEvent) return;

        const newState = {
            ...initialState,
            startX: touchEvent.clientX,
            startY: touchEvent.clientY,
            endX: touchEvent.clientX,
            endY: touchEvent.clientY,
            swiping: true,
        };

        setState(newState);

        if (onSwipeStart) {
            onSwipeStart(newState);
        }
    }, [onSwipeStart]);

    // Handle touch move event
    const handleTouchMove = useCallback((event: TouchEvent) => {
        if (!state.swiping) return;
        if (!event.touches || event.touches.length === 0) return;

        const touchEvent = event.touches[0];
        if (!touchEvent) return;

        const distanceX = touchEvent.clientX - state.startX;
        const distanceY = touchEvent.clientY - state.startY;
        const direction = getDirection(distanceX, distanceY);

        const newState = {
            ...state,
            endX: touchEvent.clientX,
            endY: touchEvent.clientY,
            distanceX,
            distanceY,
            direction,
        };

        setState(newState);

        if (onSwipe) {
            onSwipe(newState);
        }
    }, [state, onSwipe]);

    // Handle touch end event
    const handleTouchEnd = useCallback(() => {
        if (!state.swiping) return;

        const { distanceX, distanceY } = state;
        const absX = Math.abs(distanceX);
        const absY = Math.abs(distanceY);

        // Only register as a swipe if it exceeds the threshold
        const meetsThreshold = absX > threshold || absY > threshold;

        const finalState = {
            ...state,
            swiping: false,
            direction: meetsThreshold ? state.direction : null,
        };

        setState(finalState);

        if (onSwipeEnd) {
            onSwipeEnd(finalState);
        }
    }, [state, threshold, onSwipeEnd]);

    // Handle touch cancel event (same as touch end)
    const handleTouchCancel = handleTouchEnd;

    // Set up the event listeners
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener("touchstart", handleTouchStart);
        element.addEventListener("touchmove", handleTouchMove);
        element.addEventListener("touchend", handleTouchEnd);
        element.addEventListener("touchcancel", handleTouchCancel);

        return () => {
            element.removeEventListener("touchstart", handleTouchStart);
            element.removeEventListener("touchmove", handleTouchMove);
            element.removeEventListener("touchend", handleTouchEnd);
            element.removeEventListener("touchcancel", handleTouchCancel);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel]);

    return { ref, state };
}

export { useSwipe }; 