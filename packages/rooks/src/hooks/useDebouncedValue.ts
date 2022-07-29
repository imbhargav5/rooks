import type { SetStateAction, Dispatch } from "react";
import { useState } from "react";
import { useDebounce } from "./useDebounce";
import { useDidMount } from "./useDidMount";
import { useDidUpdate } from "./useDidUpdate";

type UseDebouncedValueOptions = Partial<{
  initializeWithNull: boolean;
}>;

const defaultUseDebounceValueOptions = {
  initializeWithNull: false,
};

type UseDebouncedValueReturnType<T> = [
  debouncedValue: T | null,
  immediatelyUpdateDebouncedValue: Dispatch<SetStateAction<T | null>>
];

export const useDebouncedValue = <T = unknown>(
  value: T,
  timeout: number,
  options: UseDebouncedValueOptions = {}
): UseDebouncedValueReturnType<T> => {
  // eslint-disable-next-line prefer-object-spread
  const { initializeWithNull } = Object.assign(
    {},
    defaultUseDebounceValueOptions,
    options
  );
  const [updatedValue, setUpdatedValue] = useState<T | null>(
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
  return [updatedValue, setUpdatedValue];
};
