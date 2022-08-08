import type { ExcludeFunction } from "./utils";

export type UseUndoStateOptions = {
  maxSize: number;
};
type UseUndoStatePushFunctionArgumentsCallback<T> = (currentValue: T) => T;
export type UseUndoStatePushFunction<T> = (
  argument: T | UseUndoStatePushFunctionArgumentsCallback<T>
) => void;
type UndoFunction = () => void;
export type UseUndoStateReturnValue<T> = [
  ExcludeFunction<T>,
  UseUndoStatePushFunction<ExcludeFunction<T>>,
  UndoFunction
];

export type CallbackWithNoArguments = () => void;

export type UseGeolocationReturnType = {
  isError: boolean;
  lat?: number;
  lng?: number;
  message: string;
};

type UseArrayStateControls<T> = {
  push: (...args: Parameters<Array<T>["push"]>) => void;
  pop: () => void;
  clear: () => void;
  unshift: (...args: Parameters<Array<T>["unshift"]>) => void;
  shift: () => void;
  reverse: () => void;
  concat: (...args: Parameters<Array<T>["concat"]>) => void;
  fill: (...args: Parameters<Array<T>["fill"]>) => void;
};

export type UseArrayStateReturnValue<T> = [T[], UseArrayStateControls<T>];
