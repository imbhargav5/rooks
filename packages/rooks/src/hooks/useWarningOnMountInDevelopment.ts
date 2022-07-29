import { useDidMount } from "./useDidMount";
import { warning } from "./warning";

function useWarningOnMountInDevelopment(message: string) {
  useDidMount(() => {
    warning(false, message);
  });
}

export { useWarningOnMountInDevelopment };
