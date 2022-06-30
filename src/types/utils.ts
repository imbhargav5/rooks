export type DeepNullable<T> = {
  [K in keyof T]: DeepNullable<T[K]> | null;
};
