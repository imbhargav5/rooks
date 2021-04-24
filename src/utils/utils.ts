import type { MutableRefObject } from 'react';

export type HTMLElementOrNull = HTMLElement | null;
export type RefElementOrNull<T> = T | null;
export type CallbackRef = (node: HTMLElementOrNull) => any;
export type AnyRef = CallbackRef | MutableRefObject<HTMLElementOrNull>;
