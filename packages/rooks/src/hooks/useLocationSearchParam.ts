import { useMemo } from "react";
import { useLocationStore } from "@/utils/locationStore";

/**
 * useLocationSearchParam
 * @description Read-only access to the first matching search-param value.
 * @see {@link https://rooks.vercel.app/docs/hooks/useLocationSearchParam}
 */
function useLocationSearchParam(name: string): string | null {
  const snapshot = useLocationStore();

  return useMemo(() => {
    if (!snapshot) {
      return null;
    }

    return new URLSearchParams(snapshot.search).get(name);
  }, [name, snapshot]);
}

export { useLocationSearchParam };
