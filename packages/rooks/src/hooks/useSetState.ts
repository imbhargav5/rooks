import { useCallback, useMemo, useState } from "react";

type Add<T> = (...args: Parameters<Set<T>["add"]>) => void;
type Delete<T> = (...args: Parameters<Set<T>["delete"]>) => void;

export type UseSetStateControls<T> = {
  add: Add<T>;
  delete: Delete<T>;
  clear: () => void;
};

export type UseSetStateReturnValue<T> = [Set<T>, UseSetStateControls<T>];

/**
 * useSetState
 * @description Manage the state of a Set in React.
 * @param {Set<T>} initialSetValue The initial value of the set to manage.
 * @returns {UseSetStateReturnValue<T>} The state of the Set and the controls.
 * @see {@link https://rooks.vercel.app/docs/hooks/useSetState}
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

  const add = useCallback<Add<T>>(
    (...args): void => {
      setSetValue(new Set(setValue.add(...args)));
    },
    [setValue, setSetValue]
  );

  const deleteValue = useCallback<Delete<T>>(
    (...args): void => {
      const newSetValue = new Set(setValue);
      newSetValue.delete(...args);
      setSetValue(newSetValue);
    },
    [setValue, setSetValue]
  );

  const clear = useCallback((): void => {
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
