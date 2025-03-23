import { useState, useEffect, useRef } from "react";

export type Breakpoints = {
    [key: string]: number;
};

export type BreakpointState = {
    [key: string]: boolean;
};

/**
 * useBreakpoint
 * @description A hook to detect window size breakpoints
 * @param {Breakpoints} breakpoints An object with breakpoint names as keys and sizes in pixels as values
 * @returns {BreakpointState} Object with breakpoint names as keys and boolean values indicating if the current window width is greater than or equal to the breakpoint
 * @see {@link https://rooks.vercel.app/docs/useBreakpoint}
 *
 * @example
 *
 * const breakpoints = {
 *   sm: 640,
 *   md: 768,
 *   lg: 1024,
 *   xl: 1280
 * };
 * 
 * const { sm, md, lg, xl } = useBreakpoint(breakpoints);
 * 
 * return (
 *   <div>
 *     <p>sm: {sm ? 'true' : 'false'}</p>
 *     <p>md: {md ? 'true' : 'false'}</p>
 *     <p>lg: {lg ? 'true' : 'false'}</p>
 *     <p>xl: {xl ? 'true' : 'false'}</p>
 *   </div>
 * );
 */
function useBreakpoint(breakpoints: Breakpoints): BreakpointState {
    // Initialize with empty state
    const [breakpointState, setBreakpointState] = useState<BreakpointState>({});

    // Use ref to track breakpoints to avoid unnecessary effect triggers
    const breakpointsRef = useRef<Breakpoints>(breakpoints);

    // Update ref if breakpoints object changes
    if (JSON.stringify(breakpointsRef.current) !== JSON.stringify(breakpoints)) {
        breakpointsRef.current = breakpoints;
    }

    useEffect(() => {
        // Skip if not in browser environment
        if (typeof window === "undefined") {
            return;
        }

        // Calculate breakpoints based on window width
        const calculateBreakpoints = () => {
            const width = window.innerWidth;
            const newState: BreakpointState = {};

            // Calculate each breakpoint state
            Object.entries(breakpointsRef.current).forEach(([key, value]) => {
                newState[key] = width >= value;
            });

            setBreakpointState(newState);
        };

        // Calculate initial breakpoints
        calculateBreakpoints();

        // Add event listener for window resize
        window.addEventListener("resize", calculateBreakpoints);

        // Clean up
        return () => {
            window.removeEventListener("resize", calculateBreakpoints);
        };
        // Empty dependency array - only run on mount and unmount
    }, []);

    return breakpointState;
}

export { useBreakpoint }; 