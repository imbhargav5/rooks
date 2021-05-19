import { useDidMount } from './useDidMount';
import { useUpdateEffect } from './useUpdateEffect';
import { useWillUnmount } from './useWillUnmount';

/**
 * useLifecycleLogger hook
 *
 * @param componentName Name of the component
 * @param rest
 */
const useLifecycleLogger = (componentName: string = 'Component', ...rest) => {
  useDidMount(() => {
    console.log(`${componentName} mounted`, ...rest);

    return () => console.log(`${componentName} unmounted`);
  });

  useUpdateEffect(() => {
    console.log(`${componentName} updated`, ...rest);
  });

  useWillUnmount(() => {
    console.log(`${componentName} unmounted`);
  });
};

export { useLifecycleLogger };
