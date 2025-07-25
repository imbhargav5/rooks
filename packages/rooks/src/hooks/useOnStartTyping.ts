import { useCallback } from "react";
import { useIsomorphicEffect } from "./useIsomorphicEffect";
import { useFreshTick } from "./useFreshTick";

export interface UseOnStartTypingOptions {
    /**
     * Whether to trigger for a-z/A-Z keys.
     * @default true
     */
    includeAZ?: boolean;
    /**
     * Whether to trigger for 0-9 keys.
     * @default false
     */
    includeNumbers?: boolean;
}

/**
 * Checks if the currently focused element is editable (input, textarea, or contenteditable)
 */
function isFocusedElementEditable(): boolean {
    const { activeElement, body } = document;
    if (!activeElement) return false;
    if (activeElement === body) return false;
    const tag = activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return true;
    return (activeElement as HTMLElement).hasAttribute("contenteditable");
}

/**
 * Checks if the KeyboardEvent matches the allowed set based on options
 */
function isAllowedKey(event: KeyboardEvent, options: Required<UseOnStartTypingOptions>): boolean {
    if (event.metaKey || event.ctrlKey || event.altKey) return false;
    const { key } = event;
    if (options.includeAZ && /^[a-zA-Z]$/.test(key)) return true;
    if (options.includeNumbers && /^[0-9]$/.test(key)) return true;
    return false;
}

/**
 * Calls the callback when the user starts typing (keydown) outside editable fields.
 * @param callback Function to call on valid keydown
 * @param {UseOnStartTypingOptions} options Options to control which keys trigger the callback
 * @returns void
 * @see https://github.com/imbhargav5/rooks
 * @example
 * useOnStartTyping((event) => {
 *   console.log('Started typing:', event.key);
 * });
 * 
 * @example
 * useOnStartTyping((event) => {
 *   console.log('Number typed:', event.key);
 * }, { includeAZ: false, includeNumbers: true });
 */
export function useOnStartTyping(
    callback: (event: KeyboardEvent) => void,
    options?: UseOnStartTypingOptions
): void {
    const opts = {
        includeAZ: true,
        includeNumbers: false,
        ...options,
    };

    const freshCallback = useFreshTick(callback);

    const handler = useCallback((event: KeyboardEvent) => {
        if (!isFocusedElementEditable() && isAllowedKey(event, opts)) {
            freshCallback(event);
        }
    }, [freshCallback, opts.includeAZ, opts.includeNumbers]);

    useIsomorphicEffect(() => {
        document.addEventListener("keydown", handler);
        return () => {
            document.removeEventListener("keydown", handler);
        };
    }, [handler]);
} 