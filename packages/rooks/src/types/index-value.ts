export type OptionalIndexValue<T> = { index?: number; value?: T };
export type OptionalIndicesValues<T> = {
  indices?: number[];
  values?: T[];
};
