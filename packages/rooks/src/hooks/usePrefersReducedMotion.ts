import { useMediaMatch } from "./useMediaMatch";

/**
 * usePrefersReducedMotion
 *
 * A React hook that returns true if the user has enabled the "prefers-reduced-motion" setting in their system.
 *
 * @returns {boolean} True if the user prefers reduced motion, false otherwise.
 * @see https://rooks.vercel.app/docs/hooks/usePrefersReducedMotion
 */
function usePrefersReducedMotion(): boolean {
    return useMediaMatch("(prefers-reduced-motion: reduce)");
}

export { usePrefersReducedMotion };
