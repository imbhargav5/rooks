import type { EffectCallback } from 'react';
import { useRef, useEffect } from 'react';

const useEffectOnce = (effect: EffectCallback) => {
  useEffect(effect, []);
};

export function useFirstMountState(): boolean {
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
}

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState();

  useEffect(() => {
    if (!isFirstMount) {
      return effect();
    }
  }, deps);
};

const useLifecycleLogger = (componentName: string = 'Component', ...rest) => {
  useEffectOnce(() => {
    console.log(`${componentName} mounted`, ...rest);

    return () => console.log(`${componentName} unmounted`);
  });

  useUpdateEffect(() => {
    console.log(`${componentName} updated`, ...rest);
  });
};

export { useLifecycleLogger };
