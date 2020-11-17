import { HTMLElementOrNull } from "./utils/utils";
/**
 *
 * useMutationObserverRef hook
 *
 * Returns a mutation observer for a React Ref and fires a callback
 *
 * @param {MutationCallback} callback Function that needs to be fired on mutation
 * @param {MutationObserverInit} options
 */
declare function useMutationObserverRef(callback: MutationCallback, options?: MutationObserverInit): ((node: HTMLElementOrNull) => void)[];
export { useMutationObserverRef };
