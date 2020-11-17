import { MutableRefObject } from "react";
export declare type HTMLElementOrNull = HTMLElement | null;
export declare type CallbackRef = (node: HTMLElementOrNull) => any;
export declare type AnyRef = CallbackRef | MutableRefObject<HTMLElementOrNull>;
