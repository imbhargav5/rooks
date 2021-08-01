import type { MutableRefObject, RefCallback } from "react";

export type Nullable<T> = T | null;
export type HTMLElementOrNull = HTMLElement | null;
export type RefElementOrNull<T> = T | null;
export type CallbackRef = RefCallback<HTMLElement>;
export type AnyRef = CallbackRef | MutableRefObject<Nullable<HTMLElement>>;
