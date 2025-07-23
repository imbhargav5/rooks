/**
 * useUndoRedoState
 * @description Setstate but can also undo and redo
 * @see {@link https://rooks.vercel.app/docs/hooks/useUndoRedoState}
 */
import {
  useState,
  useCallback,
  SetStateAction,
  Dispatch,
  useMemo,
} from "react";

function isFunctionInitializer<T>(
  functionToCheck: SetStateAction<T>
): functionToCheck is (prevState: T) => T {
  return typeof functionToCheck === "function";
}

type UndoRedoControls = {
  undo: () => void;
  redo: () => void;
  /**
   * @deprecated
   * Use `isUndoPossible` instead
   */
  canUndo: () => boolean;
  /**
   * @deprecated
   * Use `isRedoPossible` instead
   * */
  canRedo: () => boolean;
  clearUndoStack: () => void;
  clearRedoStack: () => void;
  clearAll: () => void;
  isUndoPossible: boolean;
  isRedoPossible: boolean;
};

/**
 * useUndoRedoState hook
 *
 * This hook manages the state with undo and redo capabilities.
 *
 * @param initialState - The initial state value
 * @param options - An optional object with a `maxDepth` property to limit the history and future arrays
 * @returns A tuple with the current state, a function to update the state, and an object with undo and redo controls
 *
 * @example
 * const [state, setState, controls] = useUndoRedoState(0, { maxDepth: 3 });
 * // state is 0
 * setState(1); // state is 1
 * controls.undo(); // state is 0
 * controls.redo(); // state is 1
 */
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
  const isUndoPossible = useMemo(() => past.length > 0, [past]);
  const isRedoPossible = useMemo(() => future.length > 0, [future]);

  const setState = useCallback(
    (value: SetStateAction<T>) => {
      _setState((prevState) => {
        const nextState = isFunctionInitializer(value)
          ? value(prevState)
          : value;
        setPast((pastStates) => {
          const newPast = [...pastStates, prevState];
          if (newPast.length > maxDepth) {
            newPast.shift();
          }
          return newPast;
        });
        setFuture([]);
        return nextState;
      });
    },
    [maxDepth]
  );

  const clearUndoStack = useCallback(() => {
    setPast([]);
  }, []);

  const clearRedoStack = useCallback(() => {
    setFuture([]);
  }, []);

  const clearAll = useCallback(() => {
    setPast([]);
    setFuture([]);
  }, []);

  const controls: UndoRedoControls = useMemo(() => {
    return {
      undo,
      redo,
      canUndo,
      canRedo,
      clearUndoStack,
      clearRedoStack,
      clearAll,
      isUndoPossible,
      isRedoPossible,
    };
  }, [
    undo,
    redo,
    canUndo,
    canRedo,
    clearUndoStack,
    clearRedoStack,
    clearAll,
    isUndoPossible,
    isRedoPossible,
  ]);

  return [state, setState, controls];
}

export { useUndoRedoState };
