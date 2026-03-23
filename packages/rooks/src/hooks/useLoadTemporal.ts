import { useEffect, useState } from "react";
import type { Temporal } from "@js-temporal/polyfill";

type TemporalApi = typeof Temporal;

let cached: TemporalApi | null = null;
let loading: Promise<void> | null = null;

/**
 * Returns the Temporal API if already available (native or cached polyfill).
 * Safe to call with non-null assertion (!) in code paths guarded by
 * useLoadTemporal().
 */
export function getTemporalApi(): TemporalApi | null {
  const native = (globalThis as Record<string, unknown>).Temporal;

  if (native) {
    return native as TemporalApi;
  }

  return cached;
}

/**
 * React hook that lazily loads the Temporal API.
 * Prefers native globalThis.Temporal over the polyfill.
 * Returns the API once available, or null while loading.
 */
export function useLoadTemporal(): TemporalApi | null {
  const [api, setApi] = useState<TemporalApi | null>(getTemporalApi);

  useEffect(() => {
    if (api) return;

    if (!loading) {
      loading = import("@js-temporal/polyfill").then((mod) => {
        cached = mod.Temporal;
      });
    }

    loading.then(() => {
      setApi(getTemporalApi());
    });
  }, [api]);

  return api;
}
