import { usePrevious } from "../usePrevious";
import type { MapControls } from "./useMapState";
import { useMapState } from "./useMapState";
import type { UseObjectStateResult } from "./useObjectState";
import { useObjectState } from "./useObjectState";

export function useMapOrObjectState<K, V>(
  initialValue: Map<K, V>
): MapControls<K, V>;
export function useMapOrObjectState(initialValue: object): UseObjectStateResult;
export function useMapOrObjectState(
  initialValue: Map<any, any> | object
): MapControls<any, any> | UseObjectStateResult {
  const isMap = initialValue instanceof Map;
  const wasMap = usePrevious(isMap);
  if (wasMap !== null && isMap !== wasMap)
    throw new Error("Cannot switch from using map to object or vice versa");
  /* eslint-disable react-hooks/rules-of-hooks */
  if (isMap) return useMapState(initialValue as Map<any, any>);
  else return useObjectState(initialValue);
  /* eslint-enable react-hooks/rules-of-hooks */
}
