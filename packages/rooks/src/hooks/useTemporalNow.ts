import { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo, useSyncExternalStore } from "react";

type TemporalNowPrecision = "day" | "minute" | "second";

type TemporalNowKind = "instant" | "zoned" | "plainDateTime" | "plainDate";

type ResultMap = {
  instant: Temporal.Instant;
  zoned: Temporal.ZonedDateTime;
  plainDateTime: Temporal.PlainDateTime;
  plainDate: Temporal.PlainDate;
};

type BaseTemporalNowOptions = {
  precision?: TemporalNowPrecision;
  timeZone?: string;
};

type InstantOptions = BaseTemporalNowOptions & {
  kind?: "instant";
};

type ZonedOptions = BaseTemporalNowOptions & {
  kind: "zoned";
};

type PlainDateTimeOptions = BaseTemporalNowOptions & {
  kind: "plainDateTime";
};

type PlainDateOptions = BaseTemporalNowOptions & {
  kind: "plainDate";
};

type TemporalNowOptions =
  | InstantOptions
  | ZonedOptions
  | PlainDateTimeOptions
  | PlainDateOptions;

type Snapshot = {
  instant: Temporal.Instant;
};

type TemporalGlobal = typeof globalThis & {
  Temporal?: typeof Temporal;
};

class ClockStore {
  private snapshot: Snapshot | null;
  private listeners = new Set<() => void>();
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly precision: TemporalNowPrecision,
    private readonly timeZone?: string
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

    const instant = this.snapshot?.instant ?? getCurrentInstant();
    const delay = computeDelayFromInstant(
      instant,
      this.precision,
      this.timeZone
    );
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

    const delay = computeDelayFromInstant(now, this.precision, this.timeZone);
    this.timer = setTimeout(this.tick, delay);
  };
}

function getTemporalApi(): typeof Temporal {
  const temporalGlobal = globalThis as TemporalGlobal;

  return temporalGlobal.Temporal ?? Temporal;
}

function getCurrentInstant(): Temporal.Instant {
  const temporal = getTemporalApi();

  return temporal.Instant.fromEpochMilliseconds(Date.now());
}

function getCurrentTimeZoneId(): string {
  return getTemporalApi().Now.timeZoneId();
}

function computeDelayFromInstant(
  instant: Temporal.Instant,
  precision: TemporalNowPrecision,
  timeZone?: string
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

    case "day": {
      const zone = timeZone ?? getCurrentTimeZoneId();
      const nextDayStart = instant
        .toZonedDateTimeISO(zone)
        .add({ days: 1 })
        .startOfDay()
        .toInstant();

      return Number(nextDayStart.epochMilliseconds - instant.epochMilliseconds);
    }
  }
}

function deriveValue<K extends TemporalNowKind>(
  snapshot: Snapshot | null,
  kind: K,
  timeZone?: string
): ResultMap[K] | null {
  if (snapshot === null) {
    return null;
  }

  if (kind === "instant") {
    return snapshot.instant as ResultMap[K];
  }

  const zone = timeZone ?? getCurrentTimeZoneId();
  const zonedDateTime = snapshot.instant.toZonedDateTimeISO(zone);

  switch (kind) {
    case "zoned":
      return zonedDateTime as ResultMap[K];
    case "plainDateTime":
      return zonedDateTime.toPlainDateTime() as ResultMap[K];
    case "plainDate":
      return zonedDateTime.toPlainDate() as ResultMap[K];
    case "instant":
      return snapshot.instant as ResultMap[K];
  }
}

function getServerSnapshot(): null {
  return null;
}

/**
 * useTemporalNow
 * Returns the current time as Temporal values and keeps it aligned to
 * the requested precision boundary.
 *
 * On the server this hook returns null so hydration remains deterministic.
 *
 * @param options Configuration options for the current Temporal value
 * @see https://rooks.vercel.app/docs/hooks/useTemporalNow
 */
function useTemporalNow(options?: InstantOptions): Temporal.Instant | null;
function useTemporalNow(options: ZonedOptions): Temporal.ZonedDateTime | null;
function useTemporalNow(
  options: PlainDateTimeOptions
): Temporal.PlainDateTime | null;
function useTemporalNow(options: PlainDateOptions): Temporal.PlainDate | null;
function useTemporalNow(
  options: TemporalNowOptions = {}
):
  | Temporal.Instant
  | Temporal.ZonedDateTime
  | Temporal.PlainDateTime
  | Temporal.PlainDate
  | null {
  const { kind = "instant", precision = "second", timeZone } = options;

  const store = useMemo(() => {
    return new ClockStore(precision, timeZone);
  }, [precision, timeZone]);

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
    return deriveValue(snapshot, kind, timeZone);
  }, [snapshot, kind, timeZone]);
}

export { useTemporalNow };
export type { TemporalNowOptions, TemporalNowKind, TemporalNowPrecision };
