import { useState, useEffect } from "react";

/**
 * useReducedMotion
 * @description A hook to detect if the user prefers reduced motion
 * @returns {boolean} Whether the user prefers reduced motion
 * @see {@link https://rooks.vercel.app/docs/useReducedMotion}
 *
 * @example
 *
 * const prefersReducedMotion = useReducedMotion();
 * 
 * return (
 *   <div>
 *     {prefersReducedMotion ? (
 *       <StaticComponent />
 *     ) : (
 *       <AnimatedComponent />
 *     )}
 *   </div>
 * );
 */
function useReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Skip if not in browser environment or matchMedia not supported
        if (typeof window === "undefined" || !window.matchMedia) {
            return;
        }

        // Function to check for reduced motion preference
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        // Update state based on current preference
        const updatePreference = () => {
            setPrefersReducedMotion(mediaQuery.matches);
        };

        // Initial check
        updatePreference();

        // Set up listener for changes
        if (mediaQuery.addEventListener) {
            // Modern browsers
            mediaQuery.addEventListener("change", updatePreference);
            return () => {
                mediaQuery.removeEventListener("change", updatePreference);
            };
        } else if (mediaQuery.addListener) {
            // Older browsers
            mediaQuery.addListener(updatePreference);
            return () => {
                mediaQuery.removeListener(updatePreference);
            };
        }
    }, []);

    return prefersReducedMotion;
}

export { useReducedMotion }; 