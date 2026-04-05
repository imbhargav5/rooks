/**
 * Experimental Hooks
 * 
 * ⚠️ WARNING: These hooks are experimental and may be removed or significantly 
 * changed in any release without notice. Use with caution in production applications.
 * 
 * Import experimental hooks like this:
 * import { useSuspenseNavigatorUserAgentData } from 'rooks/experimental'
 */

export { useSuspenseNavigatorUserAgentData } from "./hooks/useSuspenseNavigatorUserAgentData";
export { useSuspenseNavigatorBattery } from "./hooks/useSuspenseNavigatorBattery";
export { useSuspenseFavicon } from "./hooks/useSuspenseFavicon";
export { useSuspenseLocalStorageState } from "./hooks/useSuspenseLocalStorageState";
export { useSuspenseSessionStorageState } from "./hooks/useSuspenseSessionStorageState";
export { useSuspenseIndexedDBState } from "./hooks/useSuspenseIndexedDBState";
export { useDisposable } from "./hooks/useDisposable";
export { useAsyncDisposable } from "./hooks/useAsyncDisposable";
