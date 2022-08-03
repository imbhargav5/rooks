import type {
  Dispatch,
  DispatchWithoutAction,
  Reducer,
  ReducerWithoutAction,
} from "react";
import { useReducer } from "react";

const defaultToggleFunction = <S>(value: S) => !value as unknown as S;

/**
 * Use toggle hook helps you easily toggle a value.
 *
 * @param initialValue Initial value of the toggle, which will be false if not provided.
 * @returns [value, setValue]
 * @see https://react-hooks.org/docs/useToggle
 * @example
 * const [boolean, toggle] = useToggle();
 * // value is false
 * // toggle() will change value to true.
 */
export function useToggle<S = boolean>(
  initialValue?: boolean
): [S, Dispatch<unknown>];
/**
 * Use toggle hook helps you easily toggle a value
 *
 * @param initialValue Initial value of the toggle, which will be false if not provided.
 * @param toggleFunction A toggle function. This allows for non boolean toggles
 * @example
 * const [value, toggle] = useToggle("on", _value => _value === "on" ? "off" : "on");
 * // value is "on"
 * // toggle() will change value to "off". Calling it again will change value to "on".
 */
export function useToggle<S>(
  initialValue: S,
  toggleFunction?: Reducer<S, unknown>
): [S, Dispatch<unknown>];
/**
 * Use toggle hook helps you easily toggle a value
 *
 * @param initialValue Initial value of the toggle, which will be false if not provided.
 * @param toggleFunction A toggle function. This allows for non boolean toggles
 * @example
 * const [value, toggle] = useToggle("on", _value => _value === "on" ? "off" : "on");
 * // value is "on"
 * // toggle() will change value to "off". Calling it again will change value to "on".
 */
export function useToggle<S>(
  initialValue: S,
  toggleFunction: ReducerWithoutAction<S>
): [S, DispatchWithoutAction];

/**
 * Use toggle hook helps you easily toggle a value
 *
 * @param initialValue Initial value of the toggle, which will be false if not provided.
 * @param toggleFunction A toggle function. This allows for non boolean toggles
 * @example
 * const [value, toggle] = useToggle("on", _value => _value === "on" ? "off" : "on");
 * // value is "on"
 * // toggle() will change value to "off". Calling it again will change value to "on".
 */
export function useToggle<S>(
  initialValue: S = false as unknown as S,
  toggleFunction: (
    currentValue: S,
    action?: unknown
  ) => S = defaultToggleFunction
) {
  return useReducer<Reducer<S, unknown>>(toggleFunction, initialValue);
}
