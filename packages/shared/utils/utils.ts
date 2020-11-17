import { MutableRefObject } from "react";

export type HTMLElementOrNull = HTMLElement | null;
export type CallbackRef = (node: HTMLElementOrNull) => any;
export type AnyRef = CallbackRef | MutableRefObject<HTMLElementOrNull>;
