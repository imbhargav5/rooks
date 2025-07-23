import { useCallback, useState } from "react";
import type {
  OptionalIndexValue,
  OptionalIndicesValues,
} from "../types/index-value";

function warnIfBothValueAndIndexAreProvided<T>(
  functionName: string,
  object: OptionalIndexValue<T> | OptionalIndicesValues<T>
) {
  if (Object.values(object).every((value) => typeof value !== "undefined")) {
    console.warn(
      `${functionName}. Expected either ${Object.keys(object).join(
        " or "
      )} to be provided. However all were provided`
    );
  } else if (
    Object.values(object).every((value) => typeof value === "undefined")
  ) {
    console.warn(
      `${functionName}. ${Object.keys(object).join(" , ")} are all undefined.`
    );
  }
}

type UseMultiSelectableListReturnType<T> = [
  Array<number[] | T[]>,
  {
    matchSelection: (parameters: OptionalIndexValue<T>) => boolean;
    toggleSelection: (parameters: OptionalIndexValue<T>) => () => void;
    updateSelections: ({
      indices,
      values,
    }: OptionalIndicesValues<T>) => () => void;
  }
];

/**
 * useMultiSelectableList
 * A custom hook to easily select multiple values from a list
 *
 * @param list - The list of values to select from
 * @param initialSelectIndices - The indices of the initial selections
 * @param allowUnselected - Whether or not to allow unselected values
 * @see https://rooks.vercel.app/docs/hooks/useMultiSelectableList
 */
function useMultiSelectableList<T>(
  list: T[] = [],
  initialSelectIndices: number[] = [0],
  allowUnselected = false
): UseMultiSelectableListReturnType<T> {
  const [currentIndices, setCurrentIndices] = useState(initialSelectIndices);

  const currentValues = currentIndices.map((index) => list[index]).filter((value): value is T => value !== undefined);
  const selection: [number[], T[]] = [currentIndices, currentValues];

  const updateSelections = ({ indices, values }: OptionalIndicesValues<T>) => {
    return () => {
      warnIfBothValueAndIndexAreProvided("updateSelections", {
        indices,
        values,
      });
      if (typeof indices !== "undefined") {
        if (!allowUnselected && indices.length === 0) {
          console.warn(`updateSelections failed. indices is an empty list.`);

          return;
        }

        setCurrentIndices(indices);
      } else if (typeof values !== "undefined") {
        const valueIndices = list.reduce<number[]>((accumulator, current, index) => {
          if (values.includes(current)) {
            const array = [...accumulator, index];

            return array;
          }

          return accumulator;
        }, []);
        if (valueIndices.length > 0) {
          setCurrentIndices(valueIndices);
        } else if (allowUnselected) {
          setCurrentIndices(valueIndices);
        } else {
          console.warn(
            `updateSelections failed. Do the values exist in the list?`
          );
        }
      }
    };
  };

  const toggleSelectionByIndex = useCallback(
    (index: number) => {
      let newIndices;
      if (!currentIndices.includes(index)) {
        newIndices = [...currentIndices, index];
      } else {
        newIndices = [...currentIndices];
        const indexOfIndex = currentIndices.indexOf(index);
        if (indexOfIndex !== -1) {
          newIndices.splice(indexOfIndex, 1);
        }
      }

      if (newIndices.length > 0) {
        setCurrentIndices(newIndices);
      } else if (allowUnselected) {
        setCurrentIndices(newIndices);
      } else {
        console.warn(
          `toggleSelection failed. Do the values exist in the list?`
        );
      }
    },
    [allowUnselected, currentIndices]
  );

  const toggleSelection = useCallback(
    ({ index, value }: OptionalIndexValue<T>) => {
      return () => {
        warnIfBothValueAndIndexAreProvided("toggleSelection", {
          index,
          value,
        });
        if (typeof index !== "undefined") {
          toggleSelectionByIndex(index);
        } else if (typeof value !== "undefined") {
          const valueIndex = list.indexOf(value);
          if (valueIndex > -1) {
            toggleSelectionByIndex(valueIndex);
          }
        }
      };
    },
    [list, toggleSelectionByIndex]
  );

  const matchSelection = useCallback(
    ({ index, value }: OptionalIndexValue<T>) => {
      warnIfBothValueAndIndexAreProvided("matchSelection", { index, value });
      if (typeof index !== "undefined") {
        return currentIndices.includes(index);
      } else if (typeof value !== "undefined") {
        return currentValues.includes(value);
      }

      return false;
    },
    [currentIndices, currentValues]
  );

  const controls = {
    matchSelection,
    toggleSelection,
    updateSelections,
  };

  return [selection, controls];
}

export { useMultiSelectableList };
