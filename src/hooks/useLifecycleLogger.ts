import { useDidMount } from "./useDidMount";
import { useUpdateEffect } from "./useUpdateEffect";
import { useWillUnmount } from "./useWillUnmount";

/**
 * useLifecycleLogger hook
 * logs parameters as component transitions through lifecycles
 *
 * @param componentName Name of the component
 * @param rest
 */
const useLifecycleLogger = (
  componentName: string = "Component",
  ...otherArgs: unknown[]
) => {
  useDidMount(() => {
    console.log(`${componentName} mounted`, ...otherArgs);

    return () => console.log(`${componentName} unmounted`);
  });

  useUpdateEffect(() => {
    console.log(`${componentName} updated`, ...otherArgs);
  });

  useWillUnmount(() => {
    console.log(`${componentName} unmounted`);
  });
};

export { useLifecycleLogger };
