import type { MutableRefObject } from "react";
import { useRef } from "react";

/**
 * useLatest
 *
 * Returns a ref that always holds the latest value of the argument.
 * Useful for reading the most recent value of a prop or state inside an
 * async callback or event handler without causing the callback to re-run.
 *
 * @param value The value to keep up-to-date in the ref
 * @returns A mutable ref whose `.current` always equals the latest `value`
 * @see https://rooks.vercel.app/docs/hooks/useLatest
 */
function useLatest<T>(value: T): MutableRefObject<T> {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export { useLatest };
