import { isFunction, isNumber } from "@/utils/utils";
import { useCallback, useMemo, useRef, useState } from "react";

type DataWithHistory<T> = {
  present: T;
  past: T[];
  future: T[];
};

type UpdateValueOptions = {
  overwriteLastEntry?: boolean;
};

const getSplitIndex = <T>(step: number, arr: T[]) => {
  let index =
    step > 0
      ? step - 1 // move forward
      : arr.length + step; // move backward
  if (index >= arr.length - 1) {
    index = arr.length - 1;
  }
  if (index < 0) {
    index = 0;
  }
  return index;
};

/**
 * Splits the target array at a history point into before, current and after sections.
 * Useful to navigate history.
 */
const split = <T>(step: number, targetArr: T[]) => {
  const index = getSplitIndex(step, targetArr);
  return {
    _current: targetArr[index],
    _before: targetArr.slice(0, index),
    _after: targetArr.slice(index + 1),
  };
};

type UseTimeTravelStateControls<T> = {
  backLength: number;
  forwardLength: number;
  go: (step: number) => void;
  back: (step?: number) => void;
  forward: (step?: number) => void;
  reset: (newInitialValue?: T) => void;
  undo: (step?: number) => void;
  redo: (step?: number) => void;
  canUndo: boolean;
  canRedo: boolean;
};

type UpdateValue<T> = (
  val: T | ((prevValue: T) => T),
  options?: UpdateValueOptions
) => void;

type UseTimeTravelStateReturnValue<T> = [
  value: T,
  setValue: UpdateValue<T>,
  controls: UseTimeTravelStateControls<T>
];

/**
 * useTimeTravelState
 * @description A hook that manages state which can undo and redo. A more powerful version of useUndoState hook.
 * @see {@link https://rooks.vercel.app/docs/hooks/useTimeTravelState}
 * @param initialValue The initial value of the state.
 * @returns {UseTimeTravelStateReturnValue}
 * @example
 * const [value, setValue, controls] = useTimeTravelState(0);
 * setValue(1);
 * setValue(2);
 * setValue(3);
 * controls.back(); // value === 2
 * controls.back(); // value === 1
 * controls.forward(); // value === 2
 * controls.forward(); // value === 3
 * controls.reset(); // value === 0
 * controls.reset(5); // value === 5
 * controls.back(2); // value === 3
 *
 * setValue(1);
 * setValue(2);
 * setValue(6, { overwriteLastEntry: true });
 * setValue(7, { overwriteLastEntry: true });
 *
 * controls.back(2); // value === 1
 *
 */
function useTimeTravelState<T>(
  initialValue: T
): UseTimeTravelStateReturnValue<T> {
  const [history, setHistory] = useState<DataWithHistory<T>>({
    present: initialValue,
    past: [],
    future: [],
  });

  const { present, past, future } = history;

  const initialValueRef = useRef<T>(initialValue);

  /**
   * @description Updates the state with a new value.
   */
  const reset = useCallback(
    (resetInitialValue?: T) => {
      const newInitialValue = resetInitialValue ?? initialValueRef.current;
      initialValueRef.current = newInitialValue;

      setHistory({
        present: newInitialValue,
        future: [],
        past: [],
      });
    },
    [initialValueRef, setHistory]
  );

  const updateValue = useCallback<UpdateValue<T>>((val, options) => {
    setHistory((currentHistory) => {
      const { past, present } = currentHistory;
      const { overwriteLastEntry = false } = options || {};
      let newValue = undefined as T;
      if (isFunction(val)) {
        newValue = val(present);
      } else {
        newValue = val;
      }
      if (overwriteLastEntry) {
        return {
          present: newValue,
          past,
          future: [],
        };
      } else {
        return {
          present: newValue,
          future: [],
          past: [...past, present],
        };
      }
    });
  }, []);

  const goForwardInternal = useCallback((step = 1) => {
    setHistory((currentHistory) => {
      const { future, past, present } = currentHistory;
      if (future.length === 0) {
        return currentHistory;
      }
      const { _before, _current, _after } = split(step, future);

      return {
        past: [...past, present, ..._before],
        present: _current as T,
        future: _after,
      };
    });
  }, []);

  const goBackwardInternal = useCallback((step = -1) => {
    setHistory((currentHistory) => {
      const { future, past, present } = currentHistory;
      if (past.length === 0) {
        return currentHistory;
      }
      const { _before, _current, _after } = split(step, past);
      return {
        past: _before,
        present: _current as T,
        future: [..._after, present, ...future],
      };
    });
  }, []);

  const go = useCallback(
    (step: number) => {
      const stepNum = isNumber(step) ? step : Number(step);
      if (stepNum === 0) {
        return;
      }
      if (stepNum > 0) {
        return goForwardInternal(stepNum);
      }
      goBackwardInternal(stepNum);
    },
    [goBackwardInternal, goForwardInternal]
  );

  const back = useCallback(() => {
    go(-1);
  }, [go]);

  const forward = useCallback(() => {
    go(1);
  }, [go]);

  const canUndo = useMemo(() => {
    return past.length > 0;
  }, [past.length]);

  const canRedo = useMemo(() => {
    return future.length > 0;
  }, [future.length]);

  const controls = useMemo<UseTimeTravelStateControls<T>>(() => {
    return {
      backLength: past.length,
      forwardLength: future.length,
      go,
      back,
      forward,
      reset,
      undo: back,
      redo: forward,
      canUndo,
      canRedo,
    };
  }, [back, canRedo, canUndo, forward, future.length, go, past.length, reset]);

  const returnValue = useMemo<UseTimeTravelStateReturnValue<T>>(() => {
    return [present, updateValue, controls];
  }, [controls, present, updateValue]);

  return returnValue;
}
export { useTimeTravelState };
