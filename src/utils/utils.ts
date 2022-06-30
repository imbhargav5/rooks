import type { MutableRefObject } from 'react';

export type HTMLElementOrNull = HTMLElement | null;
export type RefElementOrNull<T> = T | null;
export type CallbackRef<T extends HTMLElement | null = HTMLElementOrNull> = (
  node: T
) => any;
export type AnyRef<T extends HTMLElement | null = HTMLElementOrNull> =
  | CallbackRef<T>
  | MutableRefObject<T>;
