import { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo, useSyncExternalStore } from "react";

type TemporalElapsedPrecision = "second" | "minute";

type TemporalElapsedOptions = {
  /**
   * The instant from which elapsed time is measured.
   * Accepts a Temporal.Instant, an ISO 8601 string, or epoch milliseconds.
   * Defaults to the instant the hook first renders on the client.
   */
  since?: Temporal.Instant | string | number;

  /**
   * How often the elapsed duration updates.
   * @default "second"
   */
  precision?: TemporalElapsedPrecision;
};

type Snapshot = {
  instant: Temporal.Instant;
};

type TemporalGlobal = typeof globalThis & {
  Temporal?: typeof Temporal;
};

function getTemporalApi(): typeof Temporal {
  const temporalGlobal = globalThis as TemporalGlobal;

  return temporalGlobal.Temporal ?? Temporal;
}

function getCurrentInstant(): Temporal.Instant {
  const temporal = getTemporalApi();

  return temporal.Instant.fromEpochMilliseconds(Date.now());
}

function resolveSince(
  since: Temporal.Instant | string | number | undefined
): Temporal.Instant {
  if (since === undefined) {
    return getCurrentInstant();
  }

  if (since instanceof Temporal.Instant) {
    return since;
  }

  if (typeof since === "number") {
    return Temporal.Instant.fromEpochMilliseconds(since);
  }

  return Temporal.Instant.from(since);
}

function computeDelay(
  instant: Temporal.Instant,
  precision: TemporalElapsedPrecision
): number {
  switch (precision) {
    case "second": {
      const remainder = instant.epochMilliseconds % 1_000;
      return remainder === 0 ? 1_000 : 1_000 - remainder;
    }

    case "minute": {
      const remainder = instant.epochMilliseconds % 60_000;
      return remainder === 0 ? 60_000 : 60_000 - remainder;
    }
  }
}

class ElapsedStore {
  private snapshot: Snapshot | null;
  private listeners = new Set<() => void>();
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly precision: TemporalElapsedPrecision) {
    this.snapshot = { instant: getCurrentInstant() };
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);

    if (this.listeners.size === 1) {
      this.start();
    }

    return () => {
      this.listeners.delete(listener);

      if (this.listeners.size === 0) {
        this.stop();
      }
    };
  };

  getSnapshot = () => {
    return this.snapshot;
  };

  dispose = () => {
    this.stop();
    this.listeners.clear();
  };

  private emit() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  private start() {
    if (this.timer !== null) {
      return;
    }

    const now = this.snapshot?.instant ?? getCurrentInstant();
    const delay = computeDelay(now, this.precision);
    this.timer = setTimeout(this.tick, delay);
  }

  private stop() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private tick = () => {
    const now = getCurrentInstant();
    this.snapshot = { instant: now };
    this.emit();

    const delay = computeDelay(now, this.precision);
    this.timer = setTimeout(this.tick, delay);
  };
}

function deriveElapsed(
  snapshot: Snapshot | null,
  sinceInstant: Temporal.Instant
): Temporal.Duration | null {
  if (snapshot === null) {
    return null;
  }

  const comparison = Temporal.Instant.compare(snapshot.instant, sinceInstant);

  if (comparison <= 0) {
    return new Temporal.Duration();
  }

  return sinceInstant.until(snapshot.instant);
}

function getServerSnapshot(): null {
  return null;
}

/**
 * useTemporalElapsed
 * Returns the elapsed duration since a given start instant, ticking at
 * the requested precision boundary.
 *
 * On the server this hook returns null so hydration remains deterministic.
 *
 * @param options Configuration with an optional start instant and precision
 * @see https://rooks.vercel.app/docs/hooks/useTemporalElapsed
 */
function useTemporalElapsed(
  options: TemporalElapsedOptions = {}
): Temporal.Duration | null {
  const { since, precision = "second" } = options;

  const sinceInstant = useMemo(() => resolveSince(since), [since]);

  const store = useMemo(() => {
    return new ElapsedStore(precision);
  }, [precision]);

  useEffect(() => {
    return () => {
      store.dispose();
    };
  }, [store]);

  const snapshot = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    getServerSnapshot
  );

  return useMemo(() => {
    return deriveElapsed(snapshot, sinceInstant);
  }, [snapshot, sinceInstant]);
}

export { useTemporalElapsed };
export type { TemporalElapsedOptions, TemporalElapsedPrecision };
