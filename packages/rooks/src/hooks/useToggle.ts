import type { Dispatch, ReducerWithoutAction } from "react";
import { useReducer } from "react";

const defaultToggleFunction = <S>(value: S): S => !value as unknown as S;

/**
 * Use toggle hook helps you easily toggle a value
 *
 * @example
 * const [value, toggle] = useToggle(); // initialValue defaults to false
 * // value === false
 * toggle();
 * // value === true
 */
export function useToggle(): [boolean, () => void];

/**
 * Use toggle hook helps you easily toggle a value
 *
 * @param initialValue the initial value of the boolean
 * @example
 * const [value, toggle] = useToggle(true);
 * // value === true
 * toggle();
 * // value === false
 */
export function useToggle<S>(initialValue: S): [S, () => void];

/**
 * Use toggle hook helps you easily toggle a value
 *
 * @param initialValue the initial value
 * @param toggleFunction A toggle function. This allows for non boolean toggles and custom actions
 * @example
 * const [value, dispatch] = useToggle(1, (state, action) => {
 *   switch (action.type) {
 *     case "increment": return state + 1;
 *     case "decrement": return state - 1;
 *     default: return state;
 *   }
 * });
 * dispatch({ type: "increment" });
 */
export function useToggle<S, A>(
  initialValue: S,
  toggleFunction: (currentValue: S, action: A) => S
): [S, Dispatch<A>];

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
export function useToggle<S = boolean, A = never>(
  initialValue: S = false as S,
  toggleFunction?: ReducerWithoutAction<S> | ((currentValue: S, action: A) => S)
): [S, () => void] | [S, Dispatch<A>] {
  if (toggleFunction) {
    return useReducer(
      toggleFunction as (currentValue: S, action: A) => S,
      initialValue
    ) as [S, Dispatch<A>];
  }
  return useReducer(
    defaultToggleFunction as ReducerWithoutAction<S>,
    initialValue
  ) as [S, () => void];
}
