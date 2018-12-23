export default function useToggle(
  initialValue: any,
  toggleFunction: (a: any) => any
): { value: any; toggle: () => void };
