import {
  useLocationStore,
  type LocationSnapshot,
} from "@/utils/locationStore";

/**
 * useLocationSnapshot
 * @description Read-only snapshot of the browser location.
 * @see {@link https://rooks.vercel.app/docs/hooks/useLocationSnapshot}
 */
function useLocationSnapshot(): LocationSnapshot | null {
  return useLocationStore();
}

export { useLocationSnapshot };
export type { LocationSnapshot };
