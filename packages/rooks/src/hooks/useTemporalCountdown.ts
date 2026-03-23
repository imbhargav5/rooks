import type { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { getTemporalApi, useLoadTemporal } from "./useLoadTemporal";

type TemporalCountdownPrecision = "second" | "minute";

type TemporalCountdownOptions = {
  /**
   * The target instant to count down to.
   * Accepts a Temporal.Instant, an ISO 8601 string, or epoch milliseconds.
   */
  target: Temporal.Instant | string | number;

  /**
   * How often the remaining duration updates.
   * @default "second"
   */
  precision?: TemporalCountdownPrecision;
};

type TemporalCountdownResult = {
  /** Remaining duration until the target. Zero when the target has passed. */
  remaining: Temporal.Duration;
  /** Whether the target instant has been reached or passed. */
  done: boolean;
};

type Snapshot = {
  instant: Temporal.Instant;
};

function getCurrentInstant(): Temporal.Instant {
  return getTemporalApi()!.Instant.fromEpochMilliseconds(Date.now());
}

function resolveTarget(
  target: Temporal.Instant | string | number
): Temporal.Instant {
  const T = getTemporalApi()!;

  if (target instanceof T.Instant) {
    return target;
  }

  if (typeof target === "number") {
    return T.Instant.fromEpochMilliseconds(target);
  }

  return T.Instant.from(target);
}

function computeDelay(
  instant: Temporal.Instant,
  precision: TemporalCountdownPrecision
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

class CountdownStore {
  private snapshot: Snapshot | null;
  private listeners = new Set<() => void>();
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly targetInstant: Temporal.Instant,
    private readonly precision: TemporalCountdownPrecision
  ) {
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

    const T = getTemporalApi()!;
    const now = this.snapshot?.instant ?? getCurrentInstant();

    if (T.Instant.compare(now, this.targetInstant) >= 0) {
      return;
    }

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
    const T = getTemporalApi()!;
    const now = getCurrentInstant();
    this.snapshot = { instant: now };
    this.emit();

    if (T.Instant.compare(now, this.targetInstant) >= 0) {
      this.stop();
      return;
    }

    const delay = computeDelay(now, this.precision);
    this.timer = setTimeout(this.tick, delay);
  };
}

function deriveResult(
  snapshot: Snapshot | null,
  targetInstant: Temporal.Instant
): TemporalCountdownResult | null {
  if (snapshot === null) {
    return null;
  }

  const T = getTemporalApi()!;
  const comparison = T.Instant.compare(snapshot.instant, targetInstant);

  if (comparison >= 0) {
    return {
      remaining: new T.Duration(),
      done: true,
    };
  }

  const remaining = snapshot.instant.until(targetInstant);

  return {
    remaining,
    done: false,
  };
}

function getServerSnapshot(): null {
  return null;
}

const noopSubscribe = () => () => {};
const noopGetSnapshot = () => null;

/**
 * useTemporalCountdown
 * Returns the remaining duration until a target instant, ticking at
 * the requested precision boundary. Stops automatically once the
 * target is reached.
 *
 * On the server this hook returns null so hydration remains deterministic.
 * Returns null while the Temporal polyfill is loading.
 *
 * @param options Configuration with a target instant and optional precision
 * @see https://rooks.vercel.app/docs/hooks/useTemporalCountdown
 */
function useTemporalCountdown(
  options: TemporalCountdownOptions
): TemporalCountdownResult | null {
  const temporalApi = useLoadTemporal();
  const { target, precision = "second" } = options;

  const targetInstant = useMemo(
    () => (temporalApi ? resolveTarget(target) : null),
    [target, temporalApi]
  );

  const store = useMemo(() => {
    if (!temporalApi || !targetInstant) return null;
    return new CountdownStore(targetInstant, precision);
  }, [targetInstant, precision, temporalApi]);

  useEffect(() => {
    return () => {
      store?.dispose();
    };
  }, [store]);

  const snapshot = useSyncExternalStore(
    store?.subscribe ?? noopSubscribe,
    store?.getSnapshot ?? noopGetSnapshot,
    getServerSnapshot
  );

  return useMemo(() => {
    if (!targetInstant) return null;
    return deriveResult(snapshot, targetInstant);
  }, [snapshot, targetInstant]);
}

export { useTemporalCountdown };
export type {
  TemporalCountdownOptions,
  TemporalCountdownPrecision,
  TemporalCountdownResult,
};
