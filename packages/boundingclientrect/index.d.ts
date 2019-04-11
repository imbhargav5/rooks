/// <reference types="react" />
declare module "index" {
    import { MutableRefObject } from "react";
    /**
     * useBoundingclientRect hook
     *
     * @param ref The React ref whose ClientRect is needed
     * @return ClientRect
     */
    function useBoundingclientRect(ref: MutableRefObject<HTMLElement>): DOMRect | ClientRect | null;
    export default useBoundingclientRect;
}
