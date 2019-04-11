/// <reference types="react" />
declare module "index" {
    import { Ref } from "react";
    interface Options {
        /**
         * Condition which if true, will enable the event listeners
         */
        when: boolean;
        /**
         * Keyboardevent types to listen for. Valid options are keyDown, keyPress and keyUp
         */
        eventTypes: Array<string | number>;
        /**
         * target ref on which the events should be listened. If no target is specified,
         * events are listened to on the window
         */
        target?: Ref<HTMLElement>;
    }
    /**
     * useKey hook
     *
     * Fires a callback on keyboard events like keyDown, keyPress and keyUp
     *
     * @param {[string|number]} keyList
     * @param {function} callback
     * @param {Options} options
     */
    function useKey(keyList: Array<string | number>, callback: (e: KeyboardEvent) => any, opts?: Options): void;
    export default useKey;
}
