import { CallbackRef } from "./utils";
/**
 *
 * useIntersectionObserverRef hook
 *
 * Returns a mutation observer for a React Ref and fires a callback
 *
 * @param {IntersectionObserverCallback} callback Function that needs to be fired on mutation
 * @param {IntersectionObserverInit} options
 */
declare function useIntersectionObserverRef(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): [CallbackRef];
export { useIntersectionObserverRef };
