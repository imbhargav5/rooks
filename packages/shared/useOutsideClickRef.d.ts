import { CallbackRef } from "./utils/utils";
/**
 *  useOutsideClickRef hook
 *
 * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
 *
 * @param handler Callback to fire on outside click
 * @param when A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click
 * @returns ref
 */
declare function useOutsideClickRef(handler: (e: MouseEvent) => any, when?: boolean): [CallbackRef];
export { useOutsideClickRef };
