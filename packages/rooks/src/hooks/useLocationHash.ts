import { useLocationStore } from "@/utils/locationStore";

/**
 * useLocationHash
 * @description Read-only browser hash value, including the leading "#".
 * @see {@link https://rooks.vercel.app/docs/hooks/useLocationHash}
 */
function useLocationHash(): string | null {
  return useLocationStore()?.hash ?? null;
}

export { useLocationHash };
