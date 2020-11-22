import { useState } from "react";

function warnIfBothValueAndIndexAreProvided(functionName, { index, value }) {
  if (typeof index !== "undefined" && typeof value !== "undefined") {
    console.warn(
      `${functionName} .Expected either index or value to be provided. However both index and value were provided`
    );
  }
}


function useSelectableList<T>(list:T[]=[], initialIndex:number=0):[(number|T)[],({index:number, value: T})=>()=>void,({index:number, value: T})=>void] {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentValue = list[currentIndex];
  const selection = [currentIndex, currentValue];

  function updateSelection({ index, value }) {
    warnIfBothValueAndIndexAreProvided("updateSelection", { index, value });
    return () => setCurrentIndex(index);
  }
  function matchSelection({ index, value }) {
    warnIfBothValueAndIndexAreProvided("matchSelection", { index, value });
    if (typeof index !== "undefined") {
      return index === currentIndex;
    } else {
      return value === currentValue;
    }
  }
  return [selection, updateSelection, matchSelection];
}

export {useSelectableList};
