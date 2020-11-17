import { MutableRefObject } from "react";
/**
 * useBoundingclientRect hook
 * @param ref The React ref whose ClientRect is needed
 * @return ClientRect
 */
declare function useBoundingclientrect(ref: MutableRefObject<HTMLElement | null>): ClientRect | DOMRect | null;
export { useBoundingclientrect };
