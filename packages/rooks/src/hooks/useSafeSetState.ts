/**
 * useSafeSetState
 * @description set state but ignores if component has already unmounted
 * @see {@link https://rooks.vercel.app/docs/hooks/useSafeSetState}
 */
import { useState, useCallback, SetStateAction, Dispatch } from "react";
import { useGetIsMounted } from "./useGetIsMounted";

function useSafeSetState<T>(initialState: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialState);
  const getIsMounted = useGetIsMounted();

  const safeSetState = useCallback(
    (newState: SetStateAction<T>) => {
      if (getIsMounted()) {
        setState(newState);
      }
    },
    [getIsMounted]
  );

  return [state, safeSetState];
}

export { useSafeSetState };
