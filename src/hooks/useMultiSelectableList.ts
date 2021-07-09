/* eslint-disable no-negated-condition */
import type {
  OptionalIndexValue,
  OptionalIndicesValues,
} from "@/types/index-value";
import { useCallback, useState } from "react";

function warnIfBothValueAndIndexAreProvided(functionName, object) {
  if (Object.values(object).every((v) => typeof v !== "undefined")) {
    console.warn(
      `${functionName}. Expected either ${Object.keys(object).join(
        " or "
      )} to be provided. However all were provided`
    );
  } else if (Object.values(object).every((v) => typeof v === "undefined")) {
    console.warn(
      `${functionName}. ${Object.keys(object).join(" , ")} are all undefined.`
    );
  }
}
/**
 * useMultiSelectableList
 * A custom hook to easily select multiple values from a list
 *
 * @param list
 * @param initialSelectIndices
 * @param allowUnselected
 */
function useMultiSelectableList<T>(
  list: T[] = [],
  initialSelectIndices: number[] = [0],
  allowUnselected: boolean = false
): [
  Array<number[] | T[]>,
  {
    toggleSelection: (parameters: OptionalIndexValue<T>) => () => void;
    matchSelection: (parameters: OptionalIndexValue<T>) => void;
    updateSelections: ({
      indices,
      values,
    }: OptionalIndicesValues<T>) => () => void;
  }
] {
  const [currentIndices, setCurrentIndices] = useState(initialSelectIndices);

  const currentValues = currentIndices.map((index) => list[index]);
  const selection = [currentIndices, currentValues];

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
        const valueIndices = list.reduce((accumulator, current, index) => {
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
    (index) => {
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
