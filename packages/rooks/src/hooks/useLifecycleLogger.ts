import { useDidMount } from "./useDidMount";
import { useDidUpdate } from "./useDidUpdate";
import { useWillUnmount } from "./useWillUnmount";

/**
 * useLifecycleLogger hook
 * logs parameters as component transitions through lifecycles
 *
 * @param componentName Name of the component
 * @param {...*} otherArgs Other arguments to log
 * @see https://rooks.vercel.app/docs/hooks/useLifecycleLogger
 */
const useLifecycleLogger = (
  componentName = "Component",
  ...otherArgs: unknown[]
) => {
  useDidMount(() => {
    console.log(`${componentName} mounted`, ...otherArgs);

    return () => console.log(`${componentName} unmounted`);
  });

  useDidUpdate(() => {
    console.log(`${componentName} updated`, ...otherArgs);
  });

  useWillUnmount(() => {
    console.log(`${componentName} unmounted`);
  });
};

export { useLifecycleLogger };
