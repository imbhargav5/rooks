import type { MutableRefObject, Ref } from "react";

export type HTMLElementOrNull = HTMLElement | null;
export type RefElementOrNull<T> = T | null;

export type CallbackRef<T extends HTMLElement | null = HTMLElementOrNull> = (
  node: T
) => void;

export type AnyRef<T extends HTMLElement | null = HTMLElementOrNull> =
  | CallbackRef<T>
  | MutableRefObject<T>;

export type PossibleRef<T> = Ref<T> | undefined;

type Key = string | number | symbol;
export const isObject = (value: unknown): value is Record<Key, unknown> =>
  value !== null && typeof value === "object";
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: unknown): value is Function =>
  typeof value === "function";

export const isString = (value: unknown): value is string =>
  typeof value === "string";
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";
export const isUndef = (value: unknown): value is undefined =>
  typeof value === "undefined";
