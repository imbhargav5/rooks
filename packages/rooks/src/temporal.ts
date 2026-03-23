/**
 * Temporal Hooks
 *
 * These hooks depend on the @js-temporal/polyfill package which requires
 * BigInt support. They are provided as a separate entry point to avoid
 * loading the polyfill for users who don't need temporal functionality.
 *
 * Install the polyfill first:
 *   npm install @js-temporal/polyfill
 *
 * Then import temporal hooks like this:
 *   import { useTemporalNow } from 'rooks/temporal'
 */

export { useTemporalAge } from "./hooks/useTemporalAge";
export { useTemporalCountdown } from "./hooks/useTemporalCountdown";
export { useTemporalElapsed } from "./hooks/useTemporalElapsed";
export { useTemporalNow } from "./hooks/useTemporalNow";

export type {
  TemporalAgeOptions,
  TemporalAgeResult,
} from "./hooks/useTemporalAge";
export type {
  TemporalCountdownOptions,
  TemporalCountdownPrecision,
  TemporalCountdownResult,
} from "./hooks/useTemporalCountdown";
export type {
  TemporalElapsedOptions,
  TemporalElapsedPrecision,
} from "./hooks/useTemporalElapsed";
export type {
  TemporalNowKind,
  TemporalNowOptions,
  TemporalNowPrecision,
} from "./hooks/useTemporalNow";
