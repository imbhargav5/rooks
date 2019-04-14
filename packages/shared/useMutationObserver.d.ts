import { MutableRefObject } from "react";
/**
 *
 * useMutationObserver hook
 *
 * Returns a mutation observer for a React Ref and fires a callback
 *
 * @param {MutableRefObject<HTMLElement>} ref React ref on which mutations are to be observed
 * @param {MutationCallback} callback Function that needs to be fired on mutation
 * @param {MutationObserverInit} options
 */
declare function useMutationObserver(ref: MutableRefObject<HTMLElement>, callback: MutationCallback, options?: MutationObserverInit): void;
export { useMutationObserver };
