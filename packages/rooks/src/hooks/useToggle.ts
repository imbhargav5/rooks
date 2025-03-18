import type {
  Dispatch,
  DispatchWithoutAction,
  Reducer,
  ReducerWithoutAction,
} from "react";
import { useReducer } from "react";

const defaultToggleFunction = <S>(value: S) => !value as unknown as S;

/**
 * Use toggle hook helps you easily toggle a value
 * 
 * @example
 * const [value, toggle] = useToggle(false); // initialValue defaults to false
 * // value === false
 * toggle();
 * // value === true
 */
export function useToggle<S = boolean>(): [S, () => void];

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
export function useToggle<S>(initialValue: S): [S, Dispatch<unknown>];

/**
 * Use toggle hook helps you easily toggle a value
 * 
 * @param initialValue the initial value of the boolean
 * @param toggleFunction A toggle function. This allows for non boolean toggles
 * @example
 * const [value, dispatch] = useToggle(1, myReducer);
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
  initialValue: S = false as unknown as S,
  toggleFunction: (
    currentValue: S,
    action?: unknown
  ) => S = defaultToggleFunction
) {
  // @ts-ignore - Using a cast to work around the typing issue
  return useReducer(toggleFunction, initialValue);
}
