import { useState } from 'react';

function warnIfBothValueAndIndexAreProvided(functionName, object) {
  if (Object.values(object).every((v) => typeof v !== 'undefined')) {
    console.warn(
      `${functionName} .Expected either ${Object.keys(object).join(
        ' or '
      )} to be provided. However all were provided`
    );
  } else if (Object.values(object).every((v) => typeof v === 'undefined')) {
    console.warn(
      `${functionName} . ${Object.keys(object).join(' , ')} are all undefined.`
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
    toggleSelection: ({ index: number, value: T }) => () => void;
    matchSelection: ({ index: number, value: T }) => void;
    updateSelections: ({
      indices,
      values,
    }: {
      indices: number[];
      values: T[];
    }) => () => void;
  }
] {
  const [currentIndices, setCurrentIndices] = useState(initialSelectIndices);

  const currentValues = currentIndices.map((index) => list[index]);
  const selection = [currentIndices, currentValues];

  function updateSelections({
    indices,
    values,
  }: {
    indices: number[];
    values: T[];
  }) {
    return () => {
      warnIfBothValueAndIndexAreProvided('updateSelection', {
        indices,
        values,
      });
      if (typeof indices !== 'undefined') {
        if (!allowUnselected && indices.length === 0) {
          console.warn(`updateSelection failed. indices is an empty list.`);

          return;
        }
        setCurrentIndices(indices);
      } else {
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
            `updateSelection failed. Do the values exist in the list?`
          );
        }
      }
    };
  }

  function toggleSelectionByIndex(index) {
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
      console.warn(`toggleSelection failed. Do the values exist in the list?`);
    }
  }

  function toggleSelection({ index, value }) {
    return () => {
      warnIfBothValueAndIndexAreProvided('toggleSelection', {
        index,
        value,
      });
      if (typeof index !== 'undefined') {
        toggleSelectionByIndex(index);
      } else {
        const valueIndex = list.indexOf(value);
        if (valueIndex > -1) {
          toggleSelectionByIndex(valueIndex);
        }
      }
    };
  }
  function matchSelection({ index, value }) {
    warnIfBothValueAndIndexAreProvided('matchSelection', { index, value });
    if (typeof index !== 'undefined') {
      return currentIndices.includes(index);
    } else {
      return currentValues.includes(value);
    }
  }
  const controls = {
    matchSelection,
    toggleSelection,
    updateSelections,
  };

  return [selection, controls];
}

export { useMultiSelectableList };
