import { useRef, useState, useCallback, useEffect } from "react";

export type PinchZoomState = {
    scale: number;
    distance: number;
    isPinching: boolean;
    startDistance: number;
};

export type PinchZoomHandlerOptions = {
    minScale?: number;
    maxScale?: number;
    onPinchStart?: (state: PinchZoomState) => void;
    onPinch?: (state: PinchZoomState) => void;
    onPinchEnd?: (state: PinchZoomState) => void;
};

export type PinchZoomHandler = {
    ref: React.RefObject<HTMLElement | null>;
    state: PinchZoomState;
    reset: () => void;
};

const initialState: PinchZoomState = {
    scale: 1,
    distance: 0,
    isPinching: false,
    startDistance: 0,
};

/**
 * usePinchZoom
 * @description A hook for handling pinch-to-zoom gestures on touch devices
 * @param {PinchZoomHandlerOptions} options Configuration options for the pinch zoom handler
 * @returns {PinchZoomHandler} An object containing ref to attach to the element, current pinch state, and reset function
 * @see {@link https://rooks.vercel.app/docs/usePinchZoom}
 *
 * @example
 *
 * const { ref, state } = usePinchZoom({
 *   minScale: 0.5,
 *   maxScale: 3,
 *   onPinch: (state) => {
 *     console.log('Current scale:', state.scale);
 *   }
 * });
 * 
 * return (
 *   <div ref={ref} style={{ width: 300, height: 300, overflow: 'hidden' }}>
 *     <img 
 *       src="/example-image.jpg" 
 *       style={{ 
 *         width: '100%', 
 *         height: '100%', 
 *         objectFit: 'contain',
 *         transform: `scale(${state.scale})` 
 *       }} 
 *     />
 *   </div>
 * );
 */
function usePinchZoom(options: PinchZoomHandlerOptions = {}): PinchZoomHandler {
    const {
        minScale = 0.5,
        maxScale = 3,
        onPinchStart,
        onPinch,
        onPinchEnd,
    } = options;

    const ref = useRef<HTMLElement | null>(null);
    const [state, setState] = useState<PinchZoomState>(initialState);

    // Calculate distance between two touch points
    const getDistance = useCallback((touches: TouchList): number => {
        if (touches.length < 2) return 0;

        const touch1 = touches[0];
        const touch2 = touches[1];

        if (!touch1 || !touch2) return 0;

        const deltaX = touch1.clientX - touch2.clientX;
        const deltaY = touch1.clientY - touch2.clientY;

        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }, []);

    // Handle touch start event
    const handleTouchStart = useCallback((event: TouchEvent) => {
        if (!event.touches || event.touches.length < 2) return;

        const distance = getDistance(event.touches);
        if (distance === 0) return;

        const newState = {
            ...initialState,
            startDistance: distance,
            distance,
            isPinching: true,
            scale: state.scale, // Keep the current scale
        };

        setState(newState);

        if (onPinchStart) {
            onPinchStart(newState);
        }
    }, [state.scale, getDistance, onPinchStart]);

    // Handle touch move event
    const handleTouchMove = useCallback((event: TouchEvent) => {
        if (!state.isPinching) return;
        if (!event.touches || event.touches.length < 2) return;

        const currentDistance = getDistance(event.touches);
        if (currentDistance === 0 || state.startDistance === 0) return;

        // Calculate new scale based on the change in distance
        const scaleFactor = currentDistance / state.startDistance;
        const newScale = Math.min(maxScale, Math.max(minScale, scaleFactor * state.scale));

        const newState = {
            ...state,
            distance: currentDistance,
            scale: newScale,
        };

        setState(newState);

        if (onPinch) {
            onPinch(newState);
        }

        // Prevent default to avoid page zooming
        event.preventDefault();
    }, [state, getDistance, maxScale, minScale, onPinch]);

    // Handle touch end event
    const handleTouchEnd = useCallback(() => {
        if (!state.isPinching) return;

        const finalState = {
            ...state,
            isPinching: false,
        };

        setState(finalState);

        if (onPinchEnd) {
            onPinchEnd(finalState);
        }
    }, [state, onPinchEnd]);

    // Reset scale back to initial
    const reset = useCallback(() => {
        setState(initialState);
    }, []);

    // Set up event listeners
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener("touchstart", handleTouchStart);
        element.addEventListener("touchmove", handleTouchMove, { passive: false });
        element.addEventListener("touchend", handleTouchEnd);
        element.addEventListener("touchcancel", handleTouchEnd);

        return () => {
            element.removeEventListener("touchstart", handleTouchStart);
            element.removeEventListener("touchmove", handleTouchMove);
            element.removeEventListener("touchend", handleTouchEnd);
            element.removeEventListener("touchcancel", handleTouchEnd);
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

    return { ref, state, reset };
}

export { usePinchZoom }; 