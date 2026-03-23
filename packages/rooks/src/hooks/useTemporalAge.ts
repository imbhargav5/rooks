import type { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { getTemporalApi, useLoadTemporal } from "./useLoadTemporal";

type TemporalAgeOptions = {
  /**
   * The birth or start date from which the age is calculated.
   * Accepts a Temporal.PlainDate, an ISO 8601 date string (YYYY-MM-DD),
   * or a PlainDateLike object.
   */
  date: Temporal.PlainDate | string;

  /**
   * The calendar system to use.
   * @default "iso8601"
   */
  calendar?: string;

  /**
   * The time zone used to determine "today".
   * Defaults to the system time zone.
   */
  timeZone?: string;
};

type TemporalAgeResult = {
  /** Full calendar duration since the given date (years, months, days). */
  duration: Temporal.Duration;
  /** Convenience: the whole number of completed years. */
  years: number;
  /** Convenience: the remaining months after whole years. */
  months: number;
  /** Convenience: the remaining days after whole months. */
  days: number;
};

type Snapshot = {
  instant: Temporal.Instant;
};

function getCurrentInstant(): Temporal.Instant {
  return getTemporalApi()!.Instant.fromEpochMilliseconds(Date.now());
}

function getCurrentTimeZoneId(): string {
  return getTemporalApi()!.Now.timeZoneId();
}

function resolveDate(date: Temporal.PlainDate | string): Temporal.PlainDate {
  const T = getTemporalApi()!;

  if (date instanceof T.PlainDate) {
    return date;
  }

  return T.PlainDate.from(date);
}

function computeDayBoundaryDelay(
  instant: Temporal.Instant,
  timeZone: string
): number {
  const nextDayStart = instant
    .toZonedDateTimeISO(timeZone)
    .add({ days: 1 })
    .startOfDay()
    .toInstant();

  return Number(nextDayStart.epochMilliseconds - instant.epochMilliseconds);
}

class AgeStore {
  private snapshot: Snapshot | null;
  private listeners = new Set<() => void>();
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly timeZone: string) {
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
    const delay = computeDayBoundaryDelay(instant, this.timeZone);
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

    const delay = computeDayBoundaryDelay(now, this.timeZone);
    this.timer = setTimeout(this.tick, delay);
  };
}

function deriveAge(
  snapshot: Snapshot | null,
  birthDate: Temporal.PlainDate,
  timeZone: string
): TemporalAgeResult | null {
  if (snapshot === null) {
    return null;
  }

  const today = snapshot.instant
    .toZonedDateTimeISO(timeZone)
    .toPlainDate();

  const duration = birthDate.until(today, {
    largestUnit: "year",
  });

  return {
    duration,
    years: duration.years,
    months: duration.months,
    days: duration.days,
  };
}

function getServerSnapshot(): null {
  return null;
}

const noopSubscribe = () => () => {};
const noopGetSnapshot = () => null;

/**
 * useTemporalAge
 * Returns the calendar age (years, months, days) from a given birth or
 * start date, updating automatically at each day boundary.
 *
 * On the server this hook returns null so hydration remains deterministic.
 * Returns null while the Temporal polyfill is loading.
 *
 * @param options Configuration with a date and optional time zone
 * @see https://rooks.vercel.app/docs/hooks/useTemporalAge
 */
function useTemporalAge(
  options: TemporalAgeOptions
): TemporalAgeResult | null {
  const temporalApi = useLoadTemporal();
  const { date, timeZone } = options;

  const resolvedTimeZone = useMemo(
    () => (temporalApi ? (timeZone ?? getCurrentTimeZoneId()) : "UTC"),
    [timeZone, temporalApi]
  );

  const birthDate = useMemo(
    () => (temporalApi ? resolveDate(date) : null),
    [date, temporalApi]
  );

  const store = useMemo(() => {
    if (!temporalApi) return null;
    return new AgeStore(resolvedTimeZone);
  }, [resolvedTimeZone, temporalApi]);

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
    if (!birthDate) return null;
    return deriveAge(snapshot, birthDate, resolvedTimeZone);
  }, [snapshot, birthDate, resolvedTimeZone]);
}

export { useTemporalAge };
export type { TemporalAgeOptions, TemporalAgeResult };
