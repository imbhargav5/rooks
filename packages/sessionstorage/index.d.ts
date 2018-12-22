type Dictionary = {
  value: string;
  set: (newValue: string) => void;
  remove: () => void;
};
export default function useSessionstorage(
  key: string,
  defaultValue?: any
): Dictionary;
