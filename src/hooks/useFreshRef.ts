import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { useIsomorphicEffect } from './useIsomorphicEffect';

/**
 * useFreshRef
 *
 * @param value The value which needs to be fresh at all times. Probably
 * best used with functions
 * @param preferLayoutEffect Should the value be updated using a layout effect
 * or a passive effect. Defaults to false.
 * @returns A ref containing the fresh value
 */
function useFreshRef<T>(
  value: T,
  preferLayoutEffect: boolean = false
): RefObject<T> {
  const useEffectToUse = preferLayoutEffect ? useIsomorphicEffect : useEffect;
  const ref = useRef(value);
  useEffectToUse(() => {
    ref.current = value;
  });

  return ref;
}

export { useFreshRef };
