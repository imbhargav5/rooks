/**
 * useWhyDidYouUpdate
 * @description A hook that can track which value change caused a rerender
 * @see {@link https://rooks.vercel.app/docs/hooks/useWhyDidYouUpdate}
 */
import { useEffect, useRef } from "react";
import { useDidUpdate } from "./useDidUpdate";

export type PropsRecord = Record<string, unknown>;

export function useWhyDidYouUpdate(
  componentName: string,
  currentProps: PropsRecord,
  enableLogging = true
) {
  const previousProps = useRef<PropsRecord>({});
  useDidUpdate(() => {
    if (previousProps.current && enableLogging) {
      const combinedKeys = Object.keys({
        ...previousProps.current,
        ...currentProps,
      });
      const changedProps: PropsRecord = {};
      combinedKeys.forEach((key) => {
        if (!Object.is(previousProps.current[key], currentProps[key])) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: currentProps[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log("[why-did-you-update]", componentName, changedProps);
      }
    }
  }, [currentProps, componentName, enableLogging]);

  useEffect(() => {
    previousProps.current = currentProps;
  });
}
