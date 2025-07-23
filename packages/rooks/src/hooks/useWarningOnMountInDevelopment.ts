import { useDidMount } from "./useDidMount";
import { warning } from "./warning";

/**
 * useWarningOnMountInDevelopment
 * @param message The message to be shown in the console
 * @see https://rooks.vercel.app/docs/hooks/useWarningOnMountInDevelopment
 */
function useWarningOnMountInDevelopment(message: string) {
  useDidMount(() => {
    warning(false, message);
  });
}

export { useWarningOnMountInDevelopment };
