import { UseSetStateControls, UseSetStateReturnValue } from "@/types/types";
import { useCallback, useMemo, useState } from "react";

/**
 * useSetState
 * @description Manage the state of a Set in React.
 * @param {Set<T>} initialSetValue The initial value of the set to manage.
 * @returns {UseSetStateReturnValue<T>} The state of the Set and the controls.
 * @see {@link https://react-hooks.org/docs/useSetState}
 * @example
 * import { useSetState } from "@/hooks/useSetState";
 * const [set, setControls] = useSetState(new Set());
 * setControls.add(1); // {1}
 * setControls.add(2); // {1, 2}
 * setControls.delete(1); // {2}
 * setControls.clear(); // {}
 *
 */
function useSetState<T>(initialSetValue: Set<T>): UseSetStateReturnValue<T> {
  const [setValue, setSetValue] = useState<Set<T>>(new Set(initialSetValue));

  const add = useCallback(
    (...args: Parameters<Set<T>["add"]>) => {
      setSetValue(new Set(setValue.add(...args)));
    },
    [setValue, setSetValue]
  );

  const deleteValue = useCallback(
    (...args: Parameters<Set<T>["delete"]>) => {
      const newSetValue = new Set(setValue);
      newSetValue.delete(...args);
      setSetValue(newSetValue);
    },
    [setValue, setSetValue]
  );

  const clear = useCallback(() => {
    setSetValue(new Set());
  }, [setSetValue]);

  const controls = useMemo<UseSetStateControls<T>>(() => {
    return { add, delete: deleteValue, clear };
  }, [add, deleteValue, clear]);

  const returnValue = useMemo<UseSetStateReturnValue<T>>(() => {
    return [setValue, controls];
  }, [setValue, controls]);

  return returnValue;
}

export { useSetState };