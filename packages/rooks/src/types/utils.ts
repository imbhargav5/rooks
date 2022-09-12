export type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};

export type ListenerOptions =
  | boolean
  | {
      capture?: boolean;
      once?: boolean;
      passive?: boolean;
      signal?: AbortSignal;
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownFunction = (...args: any[]) => unknown;
export type ExcludeFunction<T> = Exclude<T, UnknownFunction>;
