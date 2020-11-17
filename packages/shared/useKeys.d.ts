import { MutableRefObject } from "react";
interface Options {
    /**
     * when boolean to enable and disable events, when passed false
     * remove the eventlistener if any
     */
    when: boolean;
    /**
     * should the event logging be continuous
     */
    continuous: boolean;
    /**
     * target ref on which the events should be listened. If no target is specified,
     * events are listened to on the document
     */
    target?: MutableRefObject<HTMLElement | null> | MutableRefObject<Document>;
}
/**
 * useKeys hook
 * @param keysList
 * @param callback
 * @param opts
 */
declare function useKeys(keysList: string[], callback: (e: KeyboardEvent) => any, opts?: Options): void;
export { useKeys };
