/**
 * useDeepCompareEffect
 * @description Deep compare dependencies instead of shallow for useEffect
 * @see {@link https://rooks.vercel.app/docs/hooks/useDeepCompareEffect}
 */
import { useEffect, useRef, DependencyList, EffectCallback } from "react";
import isEqual from "fast-deep-equal";
import { warning } from "./warning";

function isPrimitive(value: unknown) {
  const valueType = typeof value;
  return (
    valueType === "string" ||
    valueType === "number" ||
    valueType === "bigint" ||
    valueType === "boolean" ||
    valueType === "undefined" ||
    valueType === "symbol"
  );
}

function useDeepCompareEffect(
  callback: EffectCallback,
  dependencies: DependencyList
): void {
  const previousDeps = useRef<DependencyList | undefined>(dependencies);

  if (!Array.isArray(dependencies)) {
    throw new Error(
      "useDeepCompareEffect should be used with an array of dependencies"
    );
  }

  const hasPrimitives = dependencies.every(isPrimitive);

  warning(
    !hasPrimitives,
    "useDeepCompareEffect should not be used with primitive values as dependencies"
  );

  if (!isEqual(previousDeps.current, dependencies)) {
    previousDeps.current = dependencies;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(callback, previousDeps.current);
}

export { useDeepCompareEffect };
