/// <reference types="react" />
declare module "index" {
    import { MutableRefObject } from "react";
    /**
     *  useOutsideClick hook
     *
     * Checks if a click happened outside a Ref. Handy for dropdowns, modals and popups etc.
     *
     * @param ref Ref whose outside click needs to be listened to
     * @param handler Callback to fire on outside click
     * @param when A boolean which which activates the hook only when it is true. Useful for conditionally enable the outside click
     */
    function useOutsideClick(ref: MutableRefObject<HTMLElement>, handler: (e: MouseEvent) => any, when?: boolean): void;
    export default useOutsideClick;
}
