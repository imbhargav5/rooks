/**
 * useUndoRedoState
 * @description Setstate but can also undo and redo
 * @see {@link https://rooks.vercel.app/docs/useUndoRedoState}
 */
import { useState, useCallback, SetStateAction, Dispatch } from "react";

function isFunctionInitializer<T>(
  functionToCheck: SetStateAction<T>
): functionToCheck is (prevState: T) => T {
  return typeof functionToCheck === "function";
}

type UndoRedoControls = {
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

function useUndoRedoState<T>(
  initialState: T,
  options?: { maxDepth?: number }
): [T, Dispatch<SetStateAction<T>>, UndoRedoControls] {
  const [state, _setState] = useState<T>(initialState);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);
  const maxDepth = options?.maxDepth ?? 100;

  const undo = useCallback(() => {
    setPast((pastStates) => {
      const newPast = [...pastStates];
      const previousState = newPast.pop();

      if (typeof previousState !== "undefined") {
        setFuture((futureStates) => [state, ...futureStates]);
        _setState(previousState);
      }

      return newPast;
    });
  }, [state]);

  const redo = useCallback(() => {
    setFuture((futureStates) => {
      const newFuture = [...futureStates];
      const nextState = newFuture.shift();

      if (typeof nextState !== "undefined") {
        setPast((pastStates) => [...pastStates, state]);
        _setState(nextState);
      }

      return newFuture;
    });
  }, [state]);

  const canUndo = useCallback(() => past.length > 0, [past]);
  const canRedo = useCallback(() => future.length > 0, [future]);

  const setState = useCallback(
    (value: SetStateAction<T>) => {
      const nextState = isFunctionInitializer(value) ? value(state) : value;
      setPast((pastStates) => {
        const newPast = [...pastStates, state];
        if (newPast.length > maxDepth) {
          newPast.shift();
        }
        return newPast;
      });
      setFuture([]);
      _setState(nextState);
    },
    [state, maxDepth]
  );

  const controls: UndoRedoControls = {
    undo,
    redo,
    canUndo,
    canRedo,
  };

  return [state, setState, controls];
}

export { useUndoRedoState };
