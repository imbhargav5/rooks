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
