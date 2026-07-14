import { useEffect, useState } from "react";

/**
 * useIsClient
 * @description Returns true after the component mounts in the browser.
 * @see {@link https://rooks.vercel.app/docs/hooks/useIsClient}
 */
function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

export { useIsClient };
