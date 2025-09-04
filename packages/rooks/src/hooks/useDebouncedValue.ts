import type { SetStateAction, Dispatch } from "react";
import { useState } from "react";
import { useDebounce } from "./useDebounce";
import { useDidMount } from "./useDidMount";
import { useDidUpdate } from "./useDidUpdate";

type UseDebouncedValueOptions<TInitializeWithNull extends boolean = false> =
  Partial<{
    initializeWithNull: TInitializeWithNull;
  }>;

const defaultUseDebounceValueOptions = {
  initializeWithNull: false,
};

type UseDebouncedValueReturnType<
  TValue = unknown,
  TInitializeWithNull extends boolean = false
> = [
  debouncedValue: TInitializeWithNull extends true ? TValue | null : TValue,
  immediatelyUpdateDebouncedValue: Dispatch<
    SetStateAction<TInitializeWithNull extends true ? TValue | null : TValue>
  >
];

/**
 * useDebouncedValue
 * @param value The value to debounce
 * @param timeout The duration to debounce
 * @param options The options object.
 * @see https://rooks.vercel.app/docs/hooks/useDebouncedValue
 */
export const useDebouncedValue = <
  TValue = unknown,
  TInitializeWithNull extends boolean = false
>(
  value: TValue,
  timeout: number,
  options: UseDebouncedValueOptions<TInitializeWithNull> = {}
): UseDebouncedValueReturnType<TValue, TInitializeWithNull> => {
   
  const { initializeWithNull } = Object.assign(
    {},
    defaultUseDebounceValueOptions,
    options
  );
  const [updatedValue, setUpdatedValue] = useState<TValue | null>(
    initializeWithNull ? null : value
  );
  const debouncedSetUpdatedValue = useDebounce(setUpdatedValue, timeout);
  useDidMount(() => {
    if (initializeWithNull) {
      debouncedSetUpdatedValue(value);
    }
  });
  useDidUpdate(() => {
    debouncedSetUpdatedValue(value);
  }, [value]);

  // No need to add `debouncedSetUpdatedValue ` to dependencies as it is a ref.current.
  // returning both updatedValue and setUpdatedValue (not the debounced version) to instantly update this if  needed.
  return [updatedValue, setUpdatedValue] as UseDebouncedValueReturnType<
    TValue,
    TInitializeWithNull
  >;
};
