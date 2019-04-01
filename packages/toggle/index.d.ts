export default function useToggle<TToggleValues = boolean>(
  initialValue?: TToggleValues,
  toggleFunction?: (a: TToggleValues) => TToggleValues,
): [TToggleValues, () => void];
